import { DomUtils } from '@etsoo/shared';
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
    lock: string;
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

const zhHans = DomUtils.zhHans<EOEditorLabelLanguage>(
    () => import('./../i18n/zh-Hans.json')
);

const zhHant = DomUtils.zhHans<EOEditorLabelLanguage>(
    () => import('./../i18n/zh-Hant.json')
);

const en = DomUtils.zhHans<EOEditorLabelLanguage>(
    () => import('./../i18n/en.json')
);

/**
 * EOEditor get labels
 * @param language Language
 * @returns Language labels
 */
export async function EOEditorGetLabels(language: string) {
    const culture =
        DomUtils.getCulture([en, zhHans, zhHant], language)[0] ?? en;
    if (typeof culture.resources === 'object') return culture.resources;
    else return await culture.resources();
}
