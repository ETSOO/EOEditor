import { DataTypes, DomUtils } from '@etsoo/shared';

/**
 * EOEditor Image Editor language labels
 */
export type EOImageEditorLabelLanguage = {
    bgColor: string;
    blur: string;
    brightness: string;
    bringToBack: string;
    bringToFront: string;
    brownie: string;
    close: string;
    color: string;
    complete: string;
    contrast: string;
    crop: string;
    delete: string;
    emboss: string;
    filter: string;
    fontFamily: string;
    fontWeight: string;
    grayscale: string;
    hcenter: string;
    height: string;
    hueRotation: string;
    image: string;
    imageSize: string;
    invert: string;
    inputHere: string;
    italic: string;
    kodachrome: string;
    noise: string;
    offsetY: string;
    offsetX: string;
    ok: string;
    opacity: string;
    padding: string;
    pixelate: string;
    polaroid: string;
    preview: string;
    redo: string;
    rotateLeft: string;
    rotateRight: string;
    saturation: string;
    shadow: string;
    sharpen: string;
    strikethrough: string;
    technicolor: string;
    text: string;
    underline: string;
    undo: string;
    vcenter: string;
    vibrance: string;
    vintage: string;
    width: string;
    zoomIn: string;
    zoomOut: string;
};

const zhHans: DataTypes.CultureDefinition<EOImageEditorLabelLanguage> = {
    name: 'zh-Hans',
    label: '简体中文',
    compatibleNames: ['zh-CN', 'zh-SG'],
    resources: {
        bgColor: '背景颜色',
        blur: '模糊',
        brightness: '亮度',
        bringToBack: '下移一层',
        bringToFront: '上移一层',
        brownie: '布朗尼',
        close: '关闭',
        color: '颜色',
        complete: '完成',
        contrast: '对比度',
        crop: '裁剪',
        delete: '删除',
        emboss: '浮雕',
        filter: '滤镜',
        fontFamily: '字体',
        fontWeight: '字体粗细',
        grayscale: '灰度',
        hcenter: '水平居中',
        height: '高度',
        hueRotation: '色相旋转',
        image: '图片',
        imageSize: '图片尺寸',
        invert: '反转',
        inputHere: '在此输入文字',
        italic: '斜体',
        kodachrome: '柯达铬合金',
        noise: '噪音',
        offsetY: '垂直偏移',
        offsetX: '水平偏移',
        ok: '确定',
        opacity: '不透明度',
        padding: '内边距',
        pixelate: '像素化',
        polaroid: '宝丽来',
        preview: '预览',
        redo: '重做',
        rotateLeft: '向左旋转90度',
        rotateRight: '向右旋转90度',
        saturation: '饱和度',
        shadow: '阴影',
        sharpen: '锐化',
        strikethrough: '删除线',
        technicolor: '华丽色彩',
        text: '文字',
        underline: '下划线',
        undo: '撤销',
        vcenter: '垂直居中',
        vibrance: '活力',
        vintage: '复古',
        width: '宽度',
        zoomIn: '放大',
        zoomOut: '缩小'
    }
};

const zhHant: DataTypes.CultureDefinition<EOImageEditorLabelLanguage> = {
    name: 'zh-Hant',
    label: '繁體中文',
    compatibleNames: ['zh-HK', 'zh-TW', 'zh-MO'],
    resources: {
        bgColor: '背景顏色',
        blur: '模糊',
        brightness: '亮度',
        bringToBack: '下移一層',
        bringToFront: '上移一層',
        brownie: '布朗尼',
        close: '關閉',
        color: '顏色',
        complete: '完成',
        contrast: '對比度',
        crop: '裁剪',
        delete: '刪除',
        emboss: '浮雕',
        filter: '濾鏡',
        fontFamily: '字體',
        fontWeight: '字體粗細',
        grayscale: '灰度',
        hcenter: '水平居中',
        height: '高度',
        hueRotation: '色相旋轉',
        image: '圖片',
        imageSize: '圖片尺寸',
        invert: '反轉',
        inputHere: '在此輸入文字',
        italic: '斜體',
        kodachrome: '柯達鉻合金',
        noise: '噪音',
        offsetY: '垂直偏移',
        offsetX: '水平偏移',
        ok: '確定',
        opacity: '不透明度',
        padding: '內邊距',
        pixelate: '像素化',
        polaroid: '寶麗來',
        preview: '預覽',
        redo: '重做',
        rotateLeft: '向左旋轉90度',
        rotateRight: '向右旋轉90度',
        saturation: '飽和度',
        shadow: '陰影',
        sharpen: '銳化',
        strikethrough: '刪除線',
        technicolor: '華麗色彩',
        text: '文字',
        underline: '下劃線',
        undo: '撤銷',
        vcenter: '垂直居中',
        vibrance: '活力',
        vintage: '復古',
        width: '寬度',
        zoomIn: '放大',
        zoomOut: '縮小'
    }
};

const en: DataTypes.CultureDefinition<EOImageEditorLabelLanguage> = {
    name: 'en',
    label: 'English',
    resources: {
        bgColor: 'Background color',
        blur: 'Blur',
        brightness: 'Brightness',
        bringToBack: 'Bring to back',
        bringToFront: 'Bring to front',
        brownie: 'Brownie',
        close: 'Close',
        color: 'Color',
        complete: 'Complete',
        contrast: 'Contrast',
        crop: 'Crop',
        delete: 'Delete',
        emboss: 'Emboss',
        filter: 'Filters',
        fontFamily: 'Font',
        fontWeight: 'Font weight',
        grayscale: 'Grayscale',
        hcenter: 'Horizontal center',
        height: 'Height',
        hueRotation: 'Hue rotation',
        image: 'Image',
        imageSize: 'Image size',
        invert: 'Invert',
        inputHere: 'Input text here',
        italic: 'Italic',
        kodachrome: 'Kodachrome',
        noise: 'Noise',
        offsetY: 'Vertical offset',
        offsetX: 'Horizontal offset',
        ok: 'Ok',
        opacity: 'Opacity',
        padding: 'Padding',
        pixelate: 'Pixelate',
        polaroid: 'Polaroid',
        preview: 'Preview',
        redo: 'Redo',
        rotateLeft: 'Rotate left',
        rotateRight: 'Rotate right',
        saturation: 'Saturation',
        sharpen: 'Sharpen',
        shadow: 'Shadow',
        strikethrough: 'Strikethrough',
        technicolor: 'Technicolor',
        text: 'Text',
        underline: 'Underline',
        undo: 'Undo',
        vcenter: 'Vertical center',
        vibrance: 'Vibrance',
        vintage: 'Vintage',
        width: 'Width',
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out'
    }
};

/**
 * EOEditor Image Editor get labels
 * @param language Language
 * @returns Language labels
 */
export function EOImageEditorGetLabels(language: string) {
    return DomUtils.getCulture([en, zhHans, zhHant], language)[0]!.resources;
}
