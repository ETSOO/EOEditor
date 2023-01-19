import { DataTypes, DomUtils } from '@etsoo/shared';
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
    imageCreation: string;
    linkTargetNew: string;
    linkTitle: string;
    linkURL: string;
    next: string;
    none: string;
    margin: string;
    padding: string;
    position: string;
    previous: string;
    qty: string;
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
    tableSplitColumns: string;
    tableSplitRows: string;
    to: string;
    uploadFromComputer: string;
    width: string;
    yes: string;
};

const zhHans: DataTypes.CultureDefinition<EOEditorLabelLanguage> = {
    name: 'zh-Hans',
    label: '简体中文',
    compatibleNames: ['zh-CN', 'zh-SG'],
    resources: {
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
        imageCreation: '图片创作',
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
        qty: '数量',
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
        tableColumnAddAfter: '向右插入列',
        tableColumnAddBefore: '向左插入列',
        tableColumnRemove: '移除列',
        tableBorder: '全局边框',
        tableBorderCollapse: '边框合并',
        tableLayout: '表格布局',
        tableLayouts: '自动|固定',
        tableMergeCells: '合并单元格',
        tableProperties: '表格属性',
        tableRowAddAfter: '在下方插入行',
        tableRowAddBefore: '在上方插入行',
        tableRowRemove: '移除行',
        tableSplitCell: '拆分单元格',
        tableSplitColumns: '拆分为列',
        tableSplitRows: '拆分为行',
        textbox: '文本框',
        to: '往',
        underline: '下划线 (Ctrl+U)',
        undo: '撤销 (Ctrl+Z)',
        unlink: '删除链接',
        uploadFromComputer: '从电脑上传',
        video: '音频/视频/网页代码',
        width: '宽度',
        yes: '是'
    }
};

const zhHant: DataTypes.CultureDefinition<EOEditorLabelLanguage> = {
    name: 'zh-Hant',
    label: '繁體中文',
    compatibleNames: ['zh-HK', 'zh-TW', 'zh-MO'],
    resources: {
        about: '關於EOEditor',
        aboutContent:
            '<p>源代碼庫: <a href="https://github.com/ETSOO/EOEditor" target="_blank">GitHub</a><br/><a href="https://www.etsoo.com" target="_blank">億速思維</a>© 版權所有 (2004-2022)</p>',
        align: '對齊',
        allowfullscreen: '允許全屏',
        apply: '應用',
        backColor: '背景色',
        backgroundImage: '背景圖片',
        bgColor: '背景色',
        bold: '加粗 (Ctrl+B)',
        border: '邊框',
        borderStyle: '邊框樣式',
        borderRadius: '圓角半徑',
        byURL: '網址',
        caption: '標題',
        className: '類名',
        code: '程序代碼',
        color: '顏色',
        copy: '複製 (Ctrl+C)',
        custom1: '自定義1',
        custom2: '自定義2',
        custom3: '自定義3',
        cut: '剪切 (Ctrl+X)',
        decreaseFontSize: '減少字號',
        delete: '刪除',
        edit: '編輯',
        float: '浮動',
        foreColor: '文字顏色',
        formatBlock: '樣式',
        gradient: '漸變色',
        h1: '標題1',
        h2: '標題2',
        h3: '標題3',
        h4: '標題4',
        h5: '標題5',
        h6: '標題6',
        height: '高度',
        hp: '普通文本',
        iframe: '嵌入窗口',
        image: '圖片',
        imageCreation: '圖片創作',
        increaseFontSize: '增大字號',
        indent: '增加縮進',
        insertHorizontalRule: '插入橫線',
        insertImage: '插入圖片',
        insertOrderedList: '插入有序列表',
        insertText: '黏貼為純文本 (Ctrl+Shift+V)',
        insertUnorderedList: '插入無序列表',
        italic: '斜體 (Ctrl+I)',
        justifyCenter: '居中',
        justifyFull: '兩端對齊',
        justifyLeft: '左對齊',
        justifyRight: '右對齊',
        link: '超鏈接',
        insertTable: '插入表格',
        linkTargetNew: '新窗口',
        linkTitle: '標題',
        linkURL: '網址',
        margin: '外邊距',
        more: '更多',
        next: '下一張',
        none: '無',
        object: '對象',
        outdent: '減少縮進',
        padding: '內邊距',
        paste: '黏貼 (Ctrl+V)',
        position: '位置',
        previous: '上一張',
        qty: '數量',
        redo: '重做 (Ctrl+Y)',
        removeFormat: '清除格式',
        repeat: '重複',
        s: '分隔線',
        sameValue: '相同設置',
        sides: '上|右|下|左',
        source: 'HTML源代碼',
        specialCharacterCategories: '常用符號|標點符號|箭頭|貨幣|數學符號|數字',
        strikeThrough: '刪除線',
        style: 'CSS樣式',
        subscript: '下標',
        superscript: '上標',
        symbols: '特殊字符',
        table: '表格',
        tableColumnAddAfter: '向右插入列',
        tableColumnAddBefore: '向左插入列',
        tableColumnRemove: '移除列',
        tableBorder: '全局邊框',
        tableBorderCollapse: '邊框合併',
        tableLayout: '表格佈局',
        tableLayouts: '自動|固定',
        tableMergeCells: '合併單元格',
        tableProperties: '表格屬性',
        tableRowAddAfter: '在下方插入行',
        tableRowAddBefore: '在上方插入行',
        tableRowRemove: '移除行',
        tableSplitCell: '拆分單元格',
        tableSplitColumns: '拆分為列',
        tableSplitRows: '拆分為行',
        textbox: '文本框',
        to: '往',
        underline: '下劃線 (Ctrl+U)',
        undo: '撤銷 (Ctrl+Z)',
        unlink: '刪除鏈接',
        uploadFromComputer: '從電腦上傳',
        video: '音頻/視頻/網頁代碼',
        width: '寬度',
        yes: '是'
    }
};

const en: DataTypes.CultureDefinition<EOEditorLabelLanguage> = {
    name: 'en',
    label: 'English',
    resources: {
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
        imageCreation: 'Image creation',
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
        qty: 'Qty',
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
        tableColumnAddAfter: 'Insert column to the right',
        tableColumnAddBefore: 'Insert column to the left',
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
        tableSplitColumns: 'Split into columns',
        tableSplitRows: 'Split into rows',
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
    return DomUtils.getCulture([en, zhHans, zhHant], language)[0]!.resources;
}
