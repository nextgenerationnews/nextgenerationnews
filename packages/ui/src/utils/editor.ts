import type EditorJSInstance from '@editorjs/editorjs';
import type { EditorConfig, LogLevels } from '@editorjs/editorjs';

import { uploadFileToImgBB } from './imgbb';
import { lazyLibService } from 'services/Ethers.service';

export async function makeEditor(extraConfig: EditorConfig = {}): Promise<EditorJSInstance> {
  const { EditorJS, Header, Image, Link, List, Paragraph, Quote, Table, Underline } =
    await lazyLibService.getEditorJS();

  return new EditorJS({
    holder: 'content-editor',
    tools: {
      Header,
      List,
      Paragraph,
      Quote,
      Link,
      image: {
        class: Image,
        config: {
          uploader: {
            uploadByFile(file: File) {
              return uploadFileToImgBB(file);
            },
            uploadByUrl(fileUrl: string) {
              return uploadFileToImgBB(fileUrl);
            },
          },
        },
      },
      Underline,
      Table,
    },
    logLevel: 'ERROR' as LogLevels,
    ...extraConfig,
  });
}
