import {
    EOEditorCommandKey,
    IEOEditorIconCommand
} from './classes/EOEditorCommand';
import { EOEditorLabelLanguage } from './classes/EOEditorLabels';
import { EOImageEditor } from './components/EOImageEditor';
import { EOPopup } from './components/EOPopup';

/**
 * EOEditor clicked button interface
 */
export interface IEOEditorClickedButton {
    /**
     * Name
     */
    name: EOEditorCommandKey;

    /**
     * Rect
     */
    rect: DOMRect;

    /**
     * Subs
     */
    subs?: EOEditorCommandKey[];
}

/**
 * EOEditor interface
 */
export interface IEOEditor {
    /**
     * All first-level buttons
     */
    readonly buttons: Record<EOEditorCommandKey, HTMLButtonElement | undefined>;

    /**
     * Editor container
     */
    readonly editorContainer: HTMLDivElement;

    /**
     * Editor hosted iframe
     */
    readonly editorFrame: HTMLIFrameElement;

    /**
     * Editor source code textarea
     */
    readonly editorSourceArea: HTMLTextAreaElement;

    /**
     * Editor toolbar
     */
    readonly editorToolbar: HTMLDivElement;

    /**
     * Editor hosted iframe window
     */
    readonly editorWindow: Window;

    /**
     * Editor current labels
     */
    readonly labels?: EOEditorLabelLanguage;

    /**
     * Editor last clicked button
     */
    readonly lastClickedButton?: IEOEditorClickedButton;

    /**
     * Image editor
     */
    readonly imageEditor: EOImageEditor;

    /**
     * Popup component
     */
    readonly popup: EOPopup;

    /**
     * Name for the hidden form input
     */
    name: string | null;

    /**
     * Clone styles
     */
    cloneStyles: string | boolean | null;

    /**
     * Commands, a supported collection or commands array like ['redo', 'undo']
     */
    commands: string | null;

    /**
     * Main color
     */
    color: string | null;

    /**
     * Active color
     */
    activeColor: string | null;

    /**
     * Width of the editor
     */
    width: string | null;

    /**
     * Height of the editor
     */
    height: string | null;

    /**
     * Style with CSS or tag
     */
    styleWithCSS: string | boolean | null;

    /**
     * Language of the UI, like en-US, zh-CN, zh-HK
     */
    language: string | null;

    /**
     * Backup editor content
     * @param miliseconds Miliseconds to wait
     */
    backup(miliseconds?: number): void;

    /**
     * Create element
     * @param tagName Tag name
     * @returns Element
     */
    createElement<K extends keyof HTMLElementTagNameMap>(
        tagName: K
    ): HTMLElement;

    /**
     * Delete selection
     */
    delete(): void;

    /**
     * Edit image
     * @param image Image to edit
     * @param callback Callback when doen
     */
    editImage(image: HTMLImageElement, callback?: () => void): void;

    /**
     * Get current content
     * @returns Content
     */
    getContent(): string;

    /**
     * Get deepest node
     * @param node Node
     * @returns Deepest node
     */
    getDeepestNode(node: Node): Node;

    /**
     * Get first selection element
     * @param selection Selection
     */
    getFirstElement(selection: Selection | null): HTMLElement | null;

    /**
     * Get first range element
     * @param range Range
     */
    getFirstElement(range: Range | null): HTMLElement | null;

    /**
     * Get first section outer link
     * @returns Link
     */
    getFirstLink(): HTMLAnchorElement | null;

    /**
     * Get first range
     * @returns Range
     */
    getFirstRange(): Range | null;

    /**
     * Get the only child element
     * @param container Container node
     * @returns Only element
     */
    getOnlyElement(container: Node): HTMLElement | null;

    /**
     * Get selection
     */
    getSelection(): Selection | null;

    /**
     * Insert HTML text to current selection point
     * @param html Valid HTML string
     * @param autoCollapse Auto collapse for the range
     */
    insertHTML(html: string, autoCollapse?: boolean): Range | null;

    /**
     * Insert image
     */
    insertImage(): void;

    /**
     * Insert table
     */
    insertTable(): void;

    /**
     * Execute command
     * @param name Name
     */
    executeCommand(name: EOEditorCommandKey): boolean;

    /**
     * Popup blocks
     */
    popupBlocks(): void;

    /**
     * Popup color palette
     * @param color Current color
     * @param callback Callback
     */
    popupColors(
        color: string | undefined,
        callback: (color: string) => void
    ): void;

    /**
     * Popup HTML content
     * @param content HTML content
     * @param ready Ready callback
     */
    popupContent(content: string, ready?: () => void): void;

    /**
     * Popup icons
     * @param icons Icons
     * @param ready Callback
     */
    popupIcons(icons: IEOEditorIconCommand[], ready?: () => void): void;

    /**
     * Popup styles
     */
    popupStyle(): void;

    /**
     * Popup symbols
     */
    popupSymbols(): void;

    /**
     * Popup subs
     */
    popupSubs(): void;

    /**
     * Restore focus to the editor iframe
     */
    restoreFocus(): void;

    /**
     * Let first range surround node
     * @param tagName New node tagname
     * @param excludedParents Excluded parent tagnames
     * @returns Result
     */
    surroundNode(
        tagName: string,
        ...excludedParents: string[]
    ): [boolean, HTMLElement?];

    /**
     * Table properties
     * @param table HTML table
     */
    tableProperties(table: HTMLTableElement): void;

    /**
     * Unlink
     * @returns Result
     */
    unlink(): boolean;
}
