import { BehaviorSubject } from 'rxjs';
import { uploadFileToImgBB } from '../imgbb';
import { _ } from 'svelte-i18n';
import { getNotificationsContext } from 'svelte-notifications';
import { defaultNotification } from '../default-notification';
import type { MessageFormatter } from 'svelte-i18n/types/runtime/types';
import { onDestroy } from 'svelte/internal';
import { loggingService } from 'services/Logging.service';

export function imageUploadChange(fieldSetter: (addr: string) => void) {
  const { addNotification } = getNotificationsContext();
  const loadingBehaviourSubject = new BehaviorSubject<boolean>(false);
  let messageFormatter: MessageFormatter;
  const langUnsubscriber = _.subscribe(formatter => {
    messageFormatter = formatter;
  });

  onDestroy(langUnsubscriber);

  const onChangeFn = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      loadingBehaviourSubject.next(true);
      uploadFileToImgBB(file)
        .then(r => {
          fieldSetter(r.file.url);
        })
        .catch(e => {
          loggingService.logException(e);
          addNotification(
            defaultNotification(
              messageFormatter('page.forms.failed_to_upload_image', {
                default: 'Failed to upload your image, please try again shortly...',
              }),
              {
                type: 'danger',
              },
            ),
          );
        })
        .finally(() => {
          loadingBehaviourSubject.next(false);
        });
    }
  };

  return {
    onChangeFn,
    isLoading: loadingBehaviourSubject.asObservable(),
  };
}
