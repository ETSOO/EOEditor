import { EOEditorCommandKey } from './EOEditorCommand';

/**
 * EOEditor language labels
 */
export type EOEditorLabelLanguage = {
    [Property in EOEditorCommandKey]: string;
} & {
    aboutContent: string;
    allowfullscreen: string;
    apply: string;
    backgroundImage: string;
    bgColor: string;
    border: string;
    borderRadius: string;
    borderStyle: string;
    byURL: string;
    caption: string;
    className: string;
    color: string;
    edit: string;
    float: string;
    gradient: string;
    height: string;
    image: string;
    linkTargetNew: string;
    linkTitle: string;
    linkURL: string;
    next: string;
    none: string;
    margin: string;
    padding: string;
    position: string;
    previous: string;
    repeat: string;
    sameValue: string;
    sides: string;
    specialCharacterCategories: string;
    table: string;
    tableBorder: string;
    tableBorderCollapse: string;
    tableColumnAddAfter: string;
    tableColumnAddBefore: string;
    tableColumnRemove: string;
    tableLayout: string;
    tableLayouts: string;
    tableMergeCells: string;
    tableProperties: string;
    tableRowAddAfter: string;
    tableRowAddBefore: string;
    tableRowRemove: string;
    tableSplitCell: string;
    to: string;
    uploadFromComputer: string;
    width: string;
    yes: string;
};

// EOEditor label languages
const EOEditorLabelLanguages = ['zh-CN', 'en-US'] as const;
type EOEditorLabelLanguageNames = typeof EOEditorLabelLanguages[number];

type EOEditorLabelsType = {
    [index in EOEditorLabelLanguageNames]: EOEditorLabelLanguage;
};

/**
 * EOEditor labels
 */
export const EOEditorLabels: EOEditorLabelsType = {
    'zh-CN': {
        about: '关于EOEditor',
        aboutContent:
            '<p>源代码库: <a href="https://github.com/ETSOO/EOEditor" target="_blank">GitHub</a><br/><a href="https://www.etsoo.com" target="_blank">亿速思维</a>© 版权所有 (2004-2022)</p>',
        align: '对齐',
        allowfullscreen: '允许全屏',
        apply: '应用',
        backColor: '背景色',
        backgroundImage: '背景图片',
        bgColor: '背景色',
        bold: '加粗 (Ctrl+B)',
        border: '边框',
        borderStyle: '边框样式',
        borderRadius: '圆角半径',
        byURL: '网址',
        caption: '标题',
        className: '类名',
        code: '程序代码',
        color: '颜色',
        copy: '复制 (Ctrl+C)',
        custom1: '自定义1',
        custom2: '自定义2',
        custom3: '自定义3',
        cut: '剪切 (Ctrl+X)',
        decreaseFontSize: '减少字号',
        delete: '删除',
        edit: '编辑',
        float: '浮动',
        foreColor: '文字颜色',
        formatBlock: '样式',
        gradient: '渐变色',
        h1: '标题1',
        h2: '标题2',
        h3: '标题3',
        h4: '标题4',
        h5: '标题5',
        h6: '标题6',
        height: '高度',
        hp: '普通文本',
        iframe: '嵌入窗口',
        image: '图片',
        increaseFontSize: '增大字号',
        indent: '增加缩进',
        insertHorizontalRule: '插入横线',
        insertImage: '插入图片',
        insertOrderedList: '插入有序列表',
        insertText: '黏贴为纯文本 (Ctrl+Shift+V)',
        insertUnorderedList: '插入无序列表',
        italic: '斜体 (Ctrl+I)',
        justifyCenter: '居中',
        justifyFull: '两端对齐',
        justifyLeft: '左对齐',
        justifyRight: '右对齐',
        link: '超链接',
        insertTable: '插入表格',
        linkTargetNew: '新窗口',
        linkTitle: '标题',
        linkURL: '网址',
        margin: '外边距',
        more: '更多',
        next: '下一张',
        none: '无',
        object: '对象',
        outdent: '减少缩进',
        padding: '内边距',
        paste: '黏贴 (Ctrl+V)',
        position: '位置',
        previous: '上一张',
        redo: '重做 (Ctrl+Y)',
        removeFormat: '清除格式',
        repeat: '重复',
        s: '分隔线',
        sameValue: '相同设置',
        sides: '上|右|下|左',
        source: 'HTML源代码',
        specialCharacterCategories: '常用符号|标点符号|箭头|货币|数学符号|数字',
        strikeThrough: '删除线',
        style: 'CSS样式',
        subscript: '下标',
        superscript: '上标',
        symbols: '特殊字符',
        table: '表格',
        tableColumnAddAfter: '向左插入列',
        tableColumnAddBefore: '向右插入列',
        tableColumnRemove: '移除列',
        tableBorder: '全局边框',
        tableBorderCollapse: '边框合并',
        tableLayout: '表格布局',
        tableLayouts: '自动|固定',
        tableMergeCells: '合并单元格',
        tableProperties: '表格属性',
        tableRowAddAfter: '在上方插入行',
        tableRowAddBefore: '在下方插入行',
        tableRowRemove: '移除行',
        tableSplitCell: '拆分单元格',
        textbox: '文本框',
        to: '往',
        underline: '下划线 (Ctrl+U)',
        undo: '撤销 (Ctrl+Z)',
        unlink: '删除链接',
        uploadFromComputer: '从电脑上传',
        video: '音频/视频/网页代码',
        width: '宽度',
        yes: '是'
    },
    'en-US': {
        about: 'About EOEditor',
        aboutContent:
            '<p>Source repository: <a href="https://github.com/ETSOO/EOEditor" target="_blank">GitHub</a><br/>Copyright © <a href="https://www.etsoo.com" target="_blank">ETSOO</a> (2004-2022)</p>',
        align: 'Align',
        allowfullscreen: 'Allow fulscreen',
        apply: 'Apply',
        backColor: 'Highlight color',
        backgroundImage: 'Background image',
        bgColor: 'Bg color',
        bold: 'Bold (Ctrl+B)',
        border: 'Border',
        borderStyle: 'Border style',
        borderRadius: 'Corner radius',
        byURL: 'By URL',
        caption: 'Caption',
        className: 'Class name',
        code: 'Code',
        color: 'Color',
        copy: 'Copy (Ctrl+C)',
        custom1: 'Custom 1',
        custom2: 'Custom 2',
        custom3: 'Custom 3',
        cut: 'Cut (Ctrl+X)',
        decreaseFontSize: 'Decrease font size',
        delete: 'Delete',
        edit: 'Edit',
        float: 'Float',
        foreColor: 'Text color',
        formatBlock: 'Styles',
        gradient: 'Gradient',
        h1: 'Heading 1',
        h2: 'Heading 2',
        h3: 'Heading 3',
        h4: 'Heading 4',
        h5: 'Heading 5',
        h6: 'Heading 6',
        height: 'Height',
        hp: 'Normal text',
        iframe: 'Embeded window',
        image: 'Image',
        increaseFontSize: 'Increase font size',
        indent: 'Increase indent',
        insertHorizontalRule: 'Horitontal line',
        insertTable: 'Insert table',
        insertImage: 'Insert image',
        insertOrderedList: 'Numbered list',
        insertText: 'Pasting without formatting (Ctrl+Shift+V)',
        insertUnorderedList: 'Bulleted list',
        italic: 'Italic (Ctrl+I)',
        justifyCenter: 'Center align',
        justifyFull: 'Justify',
        justifyLeft: 'Left align',
        justifyRight: 'Right align',
        link: 'Link',
        linkTargetNew: 'New window',
        linkTitle: 'Title',
        linkURL: 'URL',
        margin: 'Margin',
        more: 'More',
        next: 'Next',
        none: 'None',
        object: 'Object',
        outdent: 'Decrease indent',
        padding: 'Padding',
        paste: 'Paste (Ctrl+V)',
        position: 'Position',
        previous: 'Previous',
        redo: 'Redo (Ctrl+Y)',
        removeFormat: 'Clear format',
        repeat: 'Repeat',
        s: 'Separator',
        sameValue: 'Same value',
        sides: 'Top|Right|Bottom|Left',
        source: 'HTML source',
        specialCharacterCategories:
            'Symbols|Punctuation|Arrows|Currency|Math|Numbers',
        strikeThrough: 'Strikethrough',
        style: 'CSS styles',
        subscript: 'Subscript',
        superscript: 'Superscript',
        symbols: 'Special charaters',
        table: 'Table',
        tableColumnAddAfter: 'Insert column to the left',
        tableColumnAddBefore: 'Insert column to the right',
        tableColumnRemove: 'Remove the column',
        tableBorder: 'Global border',
        tableBorderCollapse: 'Collapse',
        tableLayout: 'Table layout',
        tableLayouts: 'Auto|Fixed',
        tableMergeCells: 'Merge cells',
        tableProperties: 'Table properties',
        tableRowAddAfter: 'Insert row below',
        tableRowAddBefore: 'Insert row above',
        tableRowRemove: 'Remove the row',
        tableSplitCell: 'Split the cell',
        textbox: 'Text box',
        to: 'To',
        underline: 'Underline (Ctrl+U)',
        undo: 'Undo (Ctrl+Z)',
        unlink: 'Remove link',
        uploadFromComputer: 'Upload from computer',
        video: 'Audio/video/HTML',
        width: 'Width',
        yes: 'Yes'
    }
};

/**
 * EOEditor get labels
 * @param language Language
 * @returns Language labels
 */
export function EOEditorGetLabels(language: string) {
    let l = EOEditorLabelLanguages.find(
        (item) => item === language || item.split('|').includes(language)
    );
    if (l == null) {
        const first = language.split('-')[0] + '-';
        l = EOEditorLabelLanguages.find((item) => item.startsWith(first));
        if (l == null) l = 'en-US';
    }
    return EOEditorLabels[l];
}
