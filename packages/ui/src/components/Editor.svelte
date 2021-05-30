<script lang="ts">
  import { makeEditor } from 'utils/editor';
  import type EditorJS from '@editorjs/editorjs';
  import type { EditorConfig } from '@editorjs/editorjs';
  import { onMount, onDestroy } from 'svelte';

  let editor: EditorJS;

  export let config: EditorConfig = {};
  export let setupEditor: undefined | ((editor: EditorJS) => void) = null;

  const { readOnly } = config;

  onMount(async () => {
    editor = await makeEditor(config);
    setupEditor?.(editor);
  });

  onDestroy(() => {
    if (editor?.destroy) {
      editor.destroy();
    }
  });
</script>

<style lang="scss">
  #content-editor.readonly {
    margin-top: 32px;

    :global(.ce-block) {
      background-color: unset;
    }
  }

  #content-editor {
    background-color: white;

    :global(.codex-editor__redactor) {
      padding-bottom: 0 !important;
    }

    :global(.ce-block) {
      background-color: rgba(0, 0, 0, 0.02);
      /* background-color: black; */

      :global(.ce-block__content) {
        background-color: white;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }
    }

    :global(h1) {
      font-size: 3rem;
      line-height: 1;
    }

    :global(h2) {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }

    :global(h3) {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }

    :global(h4) {
      font-size: 1.5rem;
      line-height: 2rem;
    }

    :global(h5) {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }

    :global(h6) {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
  }
</style>

<div
  id="content-editor"
  class="w-full overflow-x-hidden"
  class:readonly={readOnly}
  class:rounded-lg={!readOnly}
  class:text-input={!readOnly} />
