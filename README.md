# EOEditor

ETSOO Free WYSIWYG HTML Editor
亿速思维免费提供的所见即所的 HTML 编辑器

Access to https://jsfiddle.net/q2mhLufr/ for a quick look.
访问网址 https://jsfiddle.net/q2mhLufr/ 在线快速预览。

## Support / 支持

- Browsers since 2019 (ES2019+), no Internet Exployer support.
- Custom HTML element/component feature. Easilly integrate with other frameworks like Angular/React/Vue.
- Splitted fabric into separate file to reduce load size.
- English and Chinese(简体/繁体).

## / Picture editing / 图片编辑

- Browser(client) side picture editing like rotate/resize/filter, text.
- Integrated with Fabric.js (http://fabricjs.com/).

## Installing / 安装

Using npm:

```bash
$ npm install @etsoo/editor
```

Using yarn:

```bash
$ yarn add @etsoo/editor
```

Using web:
Use CDN or download the file for the latest version. Replace @latest with a specific version like @1.0.5 for it.

```html
<script src="https://cdn.jsdelivr.net/npm/@etsoo/editor@latest/dist/eoeditor.js"></script>
<eo-editor name="content">
  <p>Content to be edited here<br />包含编辑的内容</p>
</eo-editor>
<script>
  // Get the editor reference
  const editor = document.querySelector("eo-editor");
  if (editor) {
    // Call 'getContent' method to get the editor's content
    const content = editor.getContent();
  }
</script>
```

Using ReactJs:
React component wrapper EOEditorEx, or install '@etsoo/reacteditor'

```javascript
import { EOEditor, IEOEditor } from '@etsoo/editor';
import React from 'react';

/**
 * EOEditor
 */
export type EOEditorExProps = React.DetailedHTMLProps<
  React.HTMLAttributes<IEOEditor>,
  IEOEditor
> &
  Partial<IEOEditor>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'eo-editor': EOEditorExProps;
    }
  }
}

// Make sure import the script
const _editor = new EOEditor();

export const EOEditorEx = React.forwardRef<IEOEditor, EOEditorExProps>(
  (props, ref) => {
    const { cloneStyles = false, ...rest } = props;
    return <eo-editor cloneStyles={cloneStyles} ref={ref} {...rest} />;
  }
);
```

## Properties / 属性

|              Name | Description                                                              |
| ----------------: | ------------------------------------------------------------------------ |
|       activeColor | Active color                                                             |
|         backupKey | Backup distinguish key                                                   |
|           buttons | All first-level buttons                                                  |
|       cloneStyles | Clone styles to editor                                                   |
|             color | Main color                                                               |
|          commands | Commands, a supported collection or commands array like ['redo', 'undo'] |
|           content | Get or set editor's content                                              |
|   editorContainer | Editor container                                                         |
|       editorFrame | Editor hosted iframe                                                     |
|  editorSourceArea | Editor source code textarea                                              |
|     editorToolbar | Editor toolbar                                                           |
|      editorWindow | Editor hosted iframe window                                              |
|            height | Height of the editor                                                     |
|            labels | Editor current labels                                                    |
|          language | Language of the UI, like en-US, zh-CN, zh-HK                             |
| lastClickedButton | Editor last clicked button                                               |
|              name | Name for the hidden form input                                           |
|       imageEditor | Image editor                                                             |
|             popup | Popup component                                                          |
|      styleWithCSS | Style with CSS or tag                                                    |
|             value | Editor's value, alias of content                                         |
|             width | Width of the editor                                                      |

## Methods / 方法

|              Name | Description                                             |
| ----------------: | ------------------------------------------------------- |
|            backup | Backup editor content                                   |
|       clearBackup | Clear backup                                            |
|     createElement | Create element                                          |
|            delete | Delete selection                                        |
|         editImage | Edit image                                              |
|    executeCommand | Execute command                                         |
|         getBackup | Get backup                                              |
| getCurrentElement | Get current element inside which is selected or focused |
|    getDeepestNode | Get deepest node                                        |
|   getFirstElement | Get first selection element                             |
|   getFirstElement | Get first range element                                 |
|      getFirstLink | Get first section outer link                            |
|     getFirstRange | Get first range                                         |
|    getOnlyElement | Get the only child element                              |
|      getSelection | Get selection                                           |
|        insertHTML | Insert HTML text to current selection point             |
|       insertImage | Insert image                                            |
|       insertTable | Insert table                                            |
|       popupBlocks | Popup blocks                                            |
|       popupColors | Popup color palette                                     |
|      popupContent | Popup HTML content                                      |
|        popupIcons | Popup icons                                             |
|        popupStyle | Popup styles                                            |
|      popupSymbols | Popup symbols                                           |
|         popupSubs | Popup subs                                              |
|      restoreFocus | Restore focus to the editor iframe                      |
|      surroundNode | Let first range surround node                           |
|   tableProperties | Table properties                                        |
|            unlink | Unlink                                                  |
