import type { ChatMessage } from 'js-waku';

export interface DnChatMessage {
  profile: {
    name: string;
    imageUrl: string;
    address: string;
  };
  message: ChatMessage;
}

export const DnChatMessageutils = {
  make(chatMessage: ChatMessage): DnChatMessage {
    const { nick } = chatMessage;

    const profile: DnChatMessage['profile'] = {
      address: '',
      imageUrl: '',
      name: '',
    };

    try {
      const parsedProfile = JSON.parse(nick);
      const parsedName: string = parsedProfile?.name || '';
      const parsedAddress: string = parsedProfile?.address || '';
      const parsedImageUrl: string = parsedProfile?.imageUrl || '';
      const isImageValid =
        typeof parsedImageUrl === 'string' &&
        parsedImageUrl.startsWith('https://i.ibb.co/') &&
        /.((jpg)|(png)|(jpeg)|(bmp)|(webp)|(gif))$/gi.test(parsedImageUrl);

      profile.address = typeof parsedAddress === 'string' ? parsedAddress || '' : '';
      profile.imageUrl = isImageValid ? parsedImageUrl : '';
      profile.name = typeof parsedName === 'string' ? parsedName || '' : '';
    } catch (e) {}

    return {
      message: chatMessage,
      profile,
    };
  },
};
