import type { Waku, WakuMessage, StoreCodec, ChatMessage } from 'js-waku';
import { MessagesDirection } from 'models/MessagesDirection.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { retryPromise } from 'utils/Promise';
import { dexNewsService } from './DexNews.service';
import { DnChatMessage, DnChatMessageutils } from 'models/DnChatMessage.model';
import { web3ProviderService } from './web3-provider.service';
import { loggingService } from './Logging.service';
import debounce from 'lodash.debounce';

type PeerId = Waku['libp2p']['peerId'];

class CommunityService {
  wakuInstance: Waku | null = null;
  WakuMessage: typeof WakuMessage | null = null;
  StoreCodec: typeof StoreCodec | null = null;
  ChatMessage: typeof ChatMessage | null = null;
  initializing: boolean;

  async initialize() {
    if (!this.wakuInstance && !this.initializing) {
      this.initializing = true;
      await retryPromise(() => {
        return import('js-waku').then(async jsWaku => {
          const waku = await jsWaku.Waku.create({
            config: {
              pubsub: {
                enabled: true,
                emitSelf: true,
              },
            },
          });
          const nodes = await jsWaku.getStatusFleetNodes(jsWaku.Environment.Prod);
          await Promise.all(
            nodes.map(addr => {
              return waku.dial(addr);
            }),
          );
          this.WakuMessage = jsWaku.WakuMessage;
          this.StoreCodec = jsWaku.StoreCodec;
          this.ChatMessage = jsWaku.ChatMessage;
          this.wakuInstance = waku;
          this.initializing = false;
        });
      }, 3).catch(e => {
        this.initializing = false;
        throw e;
      });
    }
  }

  async connectToRoom(
    room: string,
    messagesDirection: MessagesDirection,
    fetchHistory = true,
  ): Promise<{ observable: Observable<DnChatMessage[]>; disconnect: () => void }> {
    const msgs: DnChatMessage[] = [];
    const subject = new BehaviorSubject<DnChatMessage[]>([]);

    return new Promise(resolve => {
      const retrieveStoreMessages = (peerId: PeerId) => {
        return new Promise<void>(resolveAfterFirstFetch => {
          let hasFetchedAtLeastOnce = false;
          const callback = (wakuMessages: WakuMessage[]): void => {
            const messages: DnChatMessage[] = wakuMessages
              .map(wakuMsg =>
                wakuMsg?.payload ? DnChatMessageutils.make(this.ChatMessage.decode(wakuMsg.payload)) : null,
              )
              .filter(
                chatMsg =>
                  Boolean(chatMsg) &&
                  msgs.findIndex(
                    r => r.message.timestamp === chatMsg.message.timestamp && r.message.nick === chatMsg.message.nick,
                  ) === -1,
              )
              .sort((a, b) => a.message.timestamp.getTime() - b.message.timestamp.getTime());

            if (messagesDirection === MessagesDirection.UPWARDS) {
              msgs.unshift(...messages.reverse());
            } else {
              msgs.push(...messages);
            }
            subject.next(msgs);

            if (!hasFetchedAtLeastOnce) {
              hasFetchedAtLeastOnce = true;
              resolveAfterFirstFetch();
            }
          };

          this.wakuInstance.store
            .queryHistory({
              peerId,
              contentTopics: [room],
              pageSize: 30,
              callback,
            })
            .then(() => {
              if (!hasFetchedAtLeastOnce) {
                resolveAfterFirstFetch();
              }
            });
        });
      };

      const handleProtocolChange = debounce(async ({ peerId, protocols }: { peerId: PeerId; protocols: string[] }) => {
        if (protocols.includes(this.StoreCodec)) {
          try {
            if (fetchHistory) {
              await retrieveStoreMessages(peerId);
            }
            resolve({
              observable: subject.asObservable(),
              disconnect: () => {
                this.wakuInstance.relay.unsubscribe(room);
                this.wakuInstance.libp2p.peerStore.removeListener(
                  'change:protocols',
                  handleProtocolChange as unknown as () => void,
                );
              },
            });
          } catch (e) {
            loggingService.logException(e);
          }
        }
      }, 1000);

      this.wakuInstance.relay.addObserver(
        msg => {
          const dnChatMsg = DnChatMessageutils.make(this.ChatMessage.decode(msg.payload));

          if (messagesDirection === MessagesDirection.UPWARDS) {
            msgs.unshift(dnChatMsg);
          } else {
            msgs.push(dnChatMsg);
          }
          subject.next(msgs);
        },
        [room],
      );

      this.wakuInstance.libp2p.peerStore.on('change:protocols', handleProtocolChange as unknown as () => void);

      this.wakuInstance.libp2p.peerStore.protoBook.data.forEach((protocols, peerIdStr) => {
        const peer = this.wakuInstance.libp2p.peerStore.peers.get(peerIdStr);
        if (peer) {
          const peerId = peer.id;
          handleProtocolChange({ peerId, protocols: [...protocols] });
        }
      });
    });
  }

  async sendMessageToRoom(message: string, room: string) {
    const accountAddress = web3ProviderService.getAccount();

    if (!accountAddress) {
      return;
    }

    const profile = await dexNewsService.getUserProfile();

    const profileSummary: DnChatMessage['profile'] = {
      address: accountAddress,
      imageUrl: profile?.imageUrl || '',
      name: profile?.name || '',
    };

    if (this.WakuMessage) {
      const msg = this.ChatMessage.fromUtf8String(new Date(), JSON.stringify(profileSummary), message);
      const wakuMsg = this.WakuMessage.fromBytes(msg.encode(), room);
      try {
        await this.wakuInstance.relay.send(wakuMsg);
      } catch (e) {
        loggingService.logException(e);
      }
    }
  }
}

export const communityService = new CommunityService();
