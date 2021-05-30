import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Link from '@editorjs/link';
import Image from '@editorjs/image';
import Underline from '@editorjs/underline';
import Table from '@editorjs/table';
import { LoadMessage } from './LoadMessages';

const EditorLibs = {
  EditorJS,
  Header,
  List,
  Paragraph,
  Quote,
  Link,
  Image,
  Underline,
  Table,
};

window.EditorJS = EditorLibs as unknown as typeof window.EditorJS;

window.postMessage(LoadMessage.EDITOR, window.location.toString());
