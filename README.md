# EOEditor
 ETSOO Free WYSIWYG HTML Editor
 亿速思维免费提供的所见即所的HTML编辑器
 億速思維免費提供的所見即所的HTML編輯器

## Support / 支持 ##
- Browsers since 2019 (ES2019+), no Internet Exployer support.
- Custom HTML element/component features needed.
- English and Chinese.

## Installing / 安装 ##
Using npm:

```bash
$ npm install @etsoo/editor
```

Using yarn:

```bash
$ yarn add @etsoo/editor
```

Using web:
Download the script from "dist/eoeditor.js" or use CDN
```html
<script src="https://cdn.jsdelivr.net/npm/@etsoo/editor@1.0.2/dist/eoeditor.js"></script>
<eo-editor name="content">
	<p>
	Content to be edited here<br>包含编辑的内容
	</p>
</eo-editor>
<script>
// Get the editor reference
const editor = document.querySelector('eo-editor');
if (editor) {
	// Call 'getContent' method to get the editor's content
	const content = editor.getContent();
}
</script>
```

## Properties / 属性 ##

|Name|Description|
|---:|---|
|activeColor|Active color|
|buttons|All first-level buttons|
|cloneStyles|Clone styles to editor|
|color|Main color|
|commands|Commands, a supported collection or commands array like ['redo', 'undo']|
|editorContainer|Editor container|
|editorFrame|Editor hosted iframe|
|editorSourceArea|Editor source code textarea|
|editorToolbar|Editor toolbar|
|editorWindow|Editor hosted iframe window|
|height|Height of the editor|
|labels|Editor current labels|
|language|Language of the UI, like en-US, zh-CN, zh-HK|
|lastClickedButton|Editor last clicked button|
|name|Name for the hidden form input|
|imageEditor|Image editor|
|popup|Popup component|
|styleWithCSS|Style with CSS or tag|
|width|Width of the editor|

## Methods / 方法 ##

|Name|Description|
|---:|---|
|backup|Backup editor content|
|createElement|Create element|
|delete|Delete selection|
|editImage|Edit image|
|executeCommand|Execute command|
|getContent|Get current content|
|getDeepestNode|Get deepest node|
|getFirstElement|Get first selection element|
|getFirstElement|Get first range element|
|getFirstLink|Get first section outer link|
|getFirstRange|Get first range|
|getOnlyElement|Get the only child element|
|getSelection|Get selection|
|insertHTML|Insert HTML text to current selection point|
|insertImage|Insert image|
|insertTable|Insert table|
|popupBlocks|Popup blocks|
|popupColors|Popup color palette|
|popupContent|Popup HTML content|
|popupIcons|Popup icons|
|popupStyle|Popup styles|
|popupSymbols|Popup symbols|
|popupSubs|Popup subs|
|restoreFocus|Restore focus to the editor iframe|
|surroundNode|Let first range surround node|
|tableProperties|Table properties|
|unlink|Unlink|