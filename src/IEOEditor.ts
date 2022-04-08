import {
    EOEditorCommandKey,
    IEOEditorIconCommand
} from './classes/EOEditorCommand';
import { EOEditorLabelLanguage } from './classes/EOEditorLabels';
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
     * Editor iframe
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
     * Editor iframe window
     */
    readonly editorWindow: Window;

    /**
     * Editor labels
     */
    readonly labels?: EOEditorLabelLanguage;

    /**
     * Editor last clicked button
     */
    readonly lastClickedButton?: IEOEditorClickedButton;

    /**
     * Popup
     */
    readonly popup: EOPopup;

    /**
     * Name
     */
    name: string | null;

    /**
     * Clone styles
     */
    cloneStyles: string | null;

    /**
     * Commands, a supported kind or commands array
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
     * Width
     */
    width: string | null;

    /**
     * Height
     */
    height: string | null;

    /**
     * Style with CSS
     */
    styleWithCSS: string | null;

    /**
     * Language
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
     * Get deepest node
     * @param node Node
     * @returns Deepest node
     */
    getDeepestNode(node: Node): Node;

    /**
     * Get first element
     * @param selection Selection
     */
    getFirstElement(selection: Selection | null): HTMLElement | null;

    /**
     * Get first element
     * @param range Range
     */
    getFirstElement(range: Range | null): HTMLElement | null;

    /**
     * Get first link
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
     * Insert HTML
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
     * Is top popup
     * @param popup EOPopup
     * @returns Result
     */
    isTopPopup(popup: EOPopup): boolean;

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
     * Popup colors
     * @param color Current color
     * @param callback Callback
     * @param popup EOPopup
     */
    popupColors(
        color: string | undefined,
        callback: (color: string) => void,
        popup?: EOPopup
    ): void;

    /**
     * Popup content
     * @param content HTML content
     * @param ready Ready callback
     * @param popup EOPopup
     */
    popupContent(content: string, ready?: () => void, popup?: EOPopup): void;

    /**
     * Popup icons
     * @param icons Icons
     */
    popupIcons(icons: IEOEditorIconCommand[]): void;

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
     * Restore focus to the editor
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
