export interface ImageUploadResult {
  success: boolean;
  file: {
    url: string;
  };
}

function createFormData(source: string | File): FormData {
  const form = new FormData();
  form.set('source', source);
  form.set('type', typeof source === 'string' ? 'url' : 'file');
  form.set('action', 'upload');
  form.set('timestamp', Date.now().toString());
  return form;
}

export async function uploadFileToImgBB(file: string | File): Promise<ImageUploadResult> {
  return fetch(`https://imgbb.com/json`, {
    method: 'POST',
    body: createFormData(file),
  })
    .then(r => r.json())
    .then(result => {
      return {
        success: result.status_txt === 'OK',
        file: {
          url: result.image.display_url,
        },
      };
    });
}
