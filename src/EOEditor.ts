import { IEOEditor, IEOEditorClickedButton } from './IEOEditor';
import {
    EOEditorCommandKey,
    EOEditorCommands,
    EOEditorCommandsParse,
    EOEditorSeparator,
    EOEditorSVGs,
    IEOEditorCommand,
    IEOEditorIconCommand
} from './classes/EOEditorCommand';
import {
    EOEditorGetLabels,
    EOEditorLabelLanguage
} from './classes/EOEditorLabels';
import { EOPopup } from './components/EOPopup';
import { EOButton } from './components/EOButton';
import {
    EOEditorCharacters,
    EOEditorCharacterType
} from './classes/EOEditorCharacters';
import { EOImageEditor } from './components/EOImageEditor';
import { DomUtils, EColor, Utils } from '@etsoo/shared';
import { VirtualTable } from './classes/VirtualTable';
import { EOPalette } from './components/EOPalette';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            --color: RGB(0, 0, 0);
            --color-active-bg: RGBA(48, 58, 178, 0.2);
            --color-hover-bg: RGBA(48, 58, 178, 0.05);
            --color-active: RGB(48, 58, 178);
            --width: auto;
            --height: 60vh;
            --radius: 4px;
            user-select: none;
        }

        .container {
            border: 1.5px outset;
            border-radius: var(--radius);
        }

        .toolbar {
            padding: 0.5em;
            border-bottom: 1px #dfdfdf solid;
            display: flex;
            flex-wrap: wrap;
        }
            .toolbar svg.color-indicator {
                transform: translate(3px, -16px)
            }
            .toolbar div.separator, eo-popup .icons div.separator {
                border-left: 1px solid #ccc;
                height: 21px;
                margin: 4px 6px;
                display: inline-block;
            }
            .toolbar button, eo-popup .icons button {
                background-color: transparent;
                border: none;
                cursor: pointer;
                border-radius: calc(var(--radius) * 0.75);
                margin: 0px 1px;
                padding: 3px;
                width: 30px;
                height: 30px;
                text-align: left;
            }
            .toolbar button.autosize, eo-popup .icons button.autosize {
                width: auto;
                height: auto;
                padding: 3px 6px;
            }
            .toolbar button.more {
                width: 42px;
            }
            .toolbar button.text {
                width: 98px!important;
            }
            eo-popup.top-popup {
                z-index: 991
            }
            eo-popup .icons {
                display: flex;
            }
            eo-popup .icons button.line {
                width: 180px!important;
                height: 56px!important;
                display: flex;
                align-items: center;
                border-radius: 0px;
                padding: 3px 9px;
            }
            eo-popup .icons button.line:nth-child(2n+1) {
                background-color: #f6f6f6;
            }
            eo-popup .content {
                font-size: 12px;
                padding: 0px 1em;
            }
            eo-popup .content1 {
                font-size: 12px;
                padding: 1em;
            }
            eo-popup .grid {
                padding: 1em;
                font-size: 12px;
                display: grid;
                grid-template-columns: 78px 1fr 78px 1fr;
                align-items: center;
                column-gap: 9px;
                row-gap: 9px;
            }
            eo-popup .grid input[type="text"], eo-popup .grid input[type="number"] {
                width: 72px;
            }
            eo-popup .grid .grid-title {
                grid-column: 1 / -1;
                font-weight: bold;
            }
            eo-popup .grid .self {
                align-self: start;
                padding-top: 4px;
            }
            eo-popup .grid .span3 {
                grid-column: 2 / span 3;
            }
            eo-popup .grid .full-width {
                grid-column: 1 / -1;
            }
            eo-popup .flex2 {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            eo-popup .flex2 *:first-child {
                flex-grow: 1
            }
            eo-popup button.full-width {
                width: 100%;
            }
            eo-popup .icon-button {
                display: inline-flex;
                align-items: center;
                padding: 3px 9px;
            }
                eo-popup .icon-button svg {
                    margin-right: 4px;
                }
            eo-popup .tab-page {
                padding: 12px;
                width: min(75vw, 640px);
                font-size: 14px;
            }
                eo-popup .tab-page .tabs {
                    display: flex;
                    flex-wrap: no-wrap;
                    padding-bottom: 6px;
                }
                eo-popup .tab-page .tabs .tab {
                    padding-right: 6px;
                }
                eo-popup .tab-page .latest {
                    margin-bottom: 6px;
                }
                eo-popup .tab-page .tab-content {
                    height: calc(var(--height) - 120px);
                    overflow: auto;
                }
                    eo-popup .tab-page .tab-content .items {
                    }
                    eo-popup .tab-page .tab-content .items div, eo-popup .tab-page .latest div {
                        box-sizing: border-box;
                        width: 28px;
                        height: 28px;
                        text-align: center;
                        line-height: 28px;
                        vertical-align: middle;
                        border: 1px outset #ccc;
                        display: inline-block;
                        cursor: pointer;
                    }
                        eo-popup .tab-page .items div:hover, eo-popup .tab-page .latest div:hover {
                            color: var(--color-active);
                            background-color: var(--color-active-bg);
                        }
                            eo-popup .tab-page .items div:hover:after, eo-popup .tab-page .latest div:hover:after {
                                content: attr(data-preview);
                                font-size: 60px;
                                width: 60px;
                                height: 60px;
                                position: absolute;
                                padding: 12px;
                                text-align: center;
                                margin-left: 9px;
                                margin-top: -86px;
                                line-height: 60px;
                                vertical-align: middle;
                                border: 1px var(--color-active) solid;
                                background-color: #fff;
                            }
            .toolbar button.more span.text {
                font-size: 13px;
                padding: 0px 4px;
                min-width: 72px;
            }
            .toolbar button.more span.text, .toolbar button.more svg, svg.inline {
                vertical-align: middle;
                display: inline-block;
            }
            .toolbar button.more svg.more-icon {
                margin-left: -3px;
                margin-right: -3px;
                margin-bottom: 4px;
            }
            .toolbar button:enabled, eo-popup .icons button {
                color: var(--color);
            }
            .toolbar button:enabled svg, eo-popup .icons button svg {
                fill: var(--color);
            }
            .toolbar button:enabled:not(.active):hover, eo-popup .icons button:not(.active):hover {
                background-color: var(--color-hover-bg);
            }
            .toolbar button:enabled:active, .toolbar button.active, eo-popup .icons button:active, eo-popup .icons button.active {
                background-color: var(--color-active-bg)!important;
            }
            .toolbar button:enabled:hover, .toolbar button.active, eo-popup .icons button:hover, eo-popup .icons button.active {
                color: var(--color-active);
            }
            .toolbar button:enabled:hover svg, .toolbar button.active svg, eo-popup .icons button:hover svg, eo-popup .icons button.active svg {
                fill: var(--color-active);
            }
            .toolbar button:disabled, eo-popup button:disabled {
                color: RGBA(0, 0, 0, 0.33);
            }
            .toolbar button:disabled svg, eo-popup button:disabled svg {
                fill: RGBA(0, 0, 0, 0.33);
            }

        .edit-area {
            box-sizing: border-box;
            width: var(--width);
            height: var(--height);
            overflow: hidden;
        }
            .edit-area iframe {
                box-sizing: border-box;
                border: none;
                outline: none;
                width: 100%;
                height: 100%;
            }
            .edit-area textarea {
                box-sizing: border-box;
                border: none;
                outline: none;
                padding: 0.5em;
                width: 100%;
                height: 100%;
                display: none;
            }
    </style>
    <eo-tooltip></eo-tooltip>
    <eo-palette></eo-palette>
    <eo-popup></eo-popup>
    <eo-image-editor></eo-image-editor>
    <div class="container">
        <div class="toolbar"></div>
        <div class="edit-area"><iframe></iframe><textarea></textarea></div>
    </div>
`;

const textBoxNextTags = [
    'BODY',
    'P',
    'TD',
    'TH',
    'DIV',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'UL',
    'OL'
];

const borderStyles = [
    'none',
    'hidden',
    'dotted',
    'dashed',
    'solid',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset'
];

const hhClass = 'eo-highlight';

/**
 * EOEditor
 * Attributes (strings that are set declaratively on the tag itself or set imperatively using setAttribute) vs Properties
 * https://lamplightdev.com/blog/2020/04/30/whats-the-difference-between-web-component-attributes-and-properties/
 */
export class EOEditor extends HTMLElement implements IEOEditor {
    /**
     * Observed attributes
     */
    static get observedAttributes() {
        return [
            'name',
            'commands',
            'width',
            'height',
            'color',
            'activeColor',
            'content',
            'value'
        ];
    }

    /**
     * Caret keys
     */
    static caretKeys: EOEditorCommandKey[] = [
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'foreColor',
        'backColor',
        'removeFormat',
        'subscript',
        'superscript',
        'link',
        'unlink'
    ];

    /**
     * Backup key
     */
    static readonly BackupKey = 'EOEditor-Backup';

    /**
     * Lastest characters key
     */
    static readonly LatestCharactersKey = 'EOEditor-Latest-Characters';

    /**
     * Buttons
     */
    readonly buttons = {} as Record<
        EOEditorCommandKey,
        HTMLButtonElement | undefined
    >;

    /**
     * Image editor
     */
    readonly imageEditor: EOImageEditor;

    /**
     * Popup
     */
    readonly popup: EOPopup;

    /**
     * Editor container
     */
    readonly editorContainer: HTMLDivElement;

    /**
     * Editor iframe
     */
    readonly editorFrame: HTMLIFrameElement;

    private _editorWindow!: Window;
    /**
     * Editor iframe window
     */
    get editorWindow() {
        return this._editorWindow;
    }

    /**
     * Editor source code textarea
     */
    readonly editorSourceArea: HTMLTextAreaElement;

    /**
     * Editor toolbar
     */
    readonly editorToolbar: HTMLDivElement;

    private _labels?: EOEditorLabelLanguage;
    /**
     * Editor labels
     */
    get labels() {
        return this._labels;
    }

    // Color palette
    private palette: EOPalette;

    // Backup seed
    private backupSeed: number = 0;

    // Selection change seed
    private selectionChangeSeed = 0;

    // Form element
    private form?: HTMLFormElement | null;
    private formInput?: HTMLInputElement;

    private currentCell: HTMLTableCellElement | null = null;
    private lastHighlights?: HTMLTableCellElement[];

    // Categories with custom order
    // Same order with label specialCharacterCategories
    private characterCategories: [EOEditorCharacterType, string?][] = [
        ['symbols'],
        ['punctuation'],
        ['arrows'],
        ['currency'],
        ['math'],
        ['numbers']
    ];

    private _lastClickedButton?: IEOEditorClickedButton;
    /**
     * Last clicked button
     */
    get lastClickedButton() {
        return this._lastClickedButton;
    }

    /**
     * Name
     */
    get name() {
        return this.getAttribute('name');
    }
    set name(value: string | null | undefined) {
        if (value) this.setAttribute('name', value);
        else this.removeAttribute('name');
    }

    /**
     * Clone styles to editor
     */
    get cloneStyles() {
        return this.getAttribute('cloneStyles');
    }
    set cloneStyles(value: string | boolean | null | undefined) {
        if (value) this.setAttribute('cloneStyles', value.toString());
        else this.removeAttribute('cloneStyles');
    }

    /**
     * Commands, a supported kind or commands array
     */
    get commands() {
        return this.getAttribute('commands');
    }
    set commands(value: string | null | undefined) {
        if (value) this.setAttribute('commands', value);
        else this.removeAttribute('commands');
    }

    /**
     * Get or set editor's content
     */
    get content() {
        if (this.hidden) return this.getAttribute('content');
        return this.editorWindow.document.body.innerHTML;
    }
    set content(value: string | null | undefined) {
        if (this.hidden) {
            if (value) this.setAttribute('content', value);
            else this.removeAttribute('content');
        } else this.setContent(value);
    }

    /**
     * Get or set editor's value, alias of content
     */
    get value() {
        return this.content;
    }
    set value(value: string | null | undefined) {
        this.content = value;
    }

    /**
     * Main color
     */
    get color() {
        return this.getAttribute('color');
    }
    set color(value: string | null | undefined) {
        if (value) this.setAttribute('color', value);
        else this.removeAttribute('color');
    }

    /**
     * Active color
     */
    get activeColor() {
        return this.getAttribute('activeColor');
    }
    set activeColor(value: string | null | undefined) {
        if (value) this.setAttribute('activeColor', value);
        else this.removeAttribute('activeColor');
    }

    /**
     * Width
     */
    get width(): string | null {
        return this.getAttribute('width');
    }
    set width(value: string | number | null | undefined) {
        if (value)
            this.setAttribute(
                'width',
                typeof value === 'number' ? `${value}px` : value
            );
        else this.removeAttribute('width');
    }

    /**
     * Height
     */
    get height(): string | null {
        return this.getAttribute('height');
    }
    set height(value: string | number | null | undefined) {
        if (value)
            this.setAttribute(
                'height',
                typeof value === 'number' ? `${value}px` : value
            );
        else this.removeAttribute('height');
    }

    /**
     * Style with CSS
     */
    get styleWithCSS() {
        return this.getAttribute('styleWithCSS');
    }
    set styleWithCSS(value: string | boolean | null | undefined) {
        if (value) this.setAttribute('styleWithCSS', value.toString());
        else this.removeAttribute('styleWithCSS');
    }

    /**
     * Language
     */
    get language() {
        return this.getAttribute('language');
    }
    set language(value: string | null | undefined) {
        if (value) this.setAttribute('language', value);
        else this.removeAttribute('language');
    }

    /**
     * Backup distinguish key
     */
    get backupKey() {
        return this.getAttribute('backupKey');
    }
    set backupKey(value: string | null | undefined) {
        if (value) this.setAttribute('backupKey', value);
        else this.removeAttribute('backupKey');
    }

    /**
     * Constructor
     */
    constructor() {
        // always call super() first in the constructor
        super();

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));

        // Nodes
        this.palette = shadowRoot.querySelector('eo-palette')!;
        this.popup = shadowRoot.querySelector('eo-popup')!;
        this.imageEditor = shadowRoot.querySelector('eo-image-editor')!;

        this.editorContainer = shadowRoot.querySelector('.container')!;
        this.editorToolbar = this.editorContainer.querySelector('.toolbar')!;
        this.editorFrame = this.editorContainer.querySelector('iframe')!;
        this.editorSourceArea = this.editorContainer.querySelector(
            '.edit-area textarea'
        )!;
    }

    private getBackupName() {
        return `${EOEditor.BackupKey}-${this.name}-${this.backupKey}`;
    }

    /**
     * Backup editor content
     * @param miliseconds Miliseconds to wait
     */
    backup(miliseconds: number = 1000) {
        this.clearBackupSeed();
        if (miliseconds < 0) {
            this.backupAction();
        } else {
            this.backupSeed = window.setTimeout(
                () => this.backupAction(),
                miliseconds
            );
        }
    }

    private backupAction() {
        const content = this.content;
        if (content) {
            window.localStorage.setItem(this.getBackupName(), content);
            this.dispatchEvent(new CustomEvent('backup', { detail: content }));
        }
    }

    /**
     * Clear backup
     */
    clearBackup() {
        window.localStorage.removeItem(this.getBackupName());
    }

    /**
     * Get backup
     */
    getBackup() {
        return window.localStorage.getItem(this.getBackupName());
    }

    private setCommands() {
        const commands = EOEditorCommandsParse(this.commands);

        const language = this.language ?? window.navigator.language;
        const labels = EOEditorGetLabels(language);
        this._labels = labels;

        this.imageEditor.language = language;
        this.palette.applyLabel = labels.apply;

        const buttons = commands
            .map((c) => {
                const more = c.subs && c.subs.length > 0;
                if (!more) return this.createButton(c.name, c.command);

                const label = c.command.label ?? labels[c.name];
                const icon = c.command.icon;
                return `<button is="eo-button" class="${
                    icon === '' ? 'more text' : c.name === 'more' ? '' : 'more'
                }" name="${
                    c.name
                }" tooltip="${label}" data-subs="${c.subs?.join(',')}">${
                    icon === ''
                        ? `<span class="text">${label}</span>`
                        : this.createSVG(c.command.icon)
                }${
                    c.name === 'more'
                        ? ''
                        : '<svg width="16" height="16" viewBox="0 0 24 24" class="more-icon"><path d="M7,10L12,15L17,10H7Z" /></svg>'
                }</button>`;
            })
            .join('');

        this.editorToolbar.innerHTML = buttons;

        this.setupButtons(this.editorContainer);

        this.toggleButtons(true);
    }

    private setupButtons(container: HTMLElement) {
        container
            .querySelectorAll<HTMLButtonElement>('button')
            .forEach((button) => {
                // Button/command name
                const name = button.name as EOEditorCommandKey;

                // Hold button reference
                this.buttons[name] = button;

                // Click
                button.addEventListener('click', (event) => {
                    // Prevent
                    event.preventDefault();
                    event.stopPropagation();

                    // Process click
                    this.buttonClick(button, name);
                });
            });
    }

    /**
     * Delete selection
     */
    delete() {
        this.editorWindow.document.execCommand('delete');
    }

    /**
     * Edit image
     * @param image Image to edit
     * @param callback Callback when doen
     */
    editImage(image: HTMLImageElement, callback?: (data: string) => void) {
        this.imageEditor.open(image, callback);
    }

    private getAllHighlights(): HTMLTableCellElement[];
    private getAllHighlights(table: HTMLTableElement): HTMLTableCellElement[];
    private getAllHighlights(range: Range): HTMLTableCellElement[];
    private getAllHighlights(
        range: HTMLTableElement | Range
    ): HTMLTableCellElement[];
    private getAllHighlights(container?: HTMLTableElement | Range) {
        if (container == null || 'querySelectorAll' in container)
            return Array.from(
                (container ?? this.editorWindow.document).querySelectorAll(
                    `td.${hhClass}, th.${hhClass}`
                )
            );

        const items: HTMLTableCellElement[] = [];

        const startTd = (
            container.startContainer.nodeType === Node.ELEMENT_NODE
                ? (container.startContainer as HTMLElement)
                : container.startContainer.parentElement
        )?.closest<HTMLTableCellElement>('td, th');

        const endTd = (
            container.endContainer.nodeType === Node.ELEMENT_NODE
                ? (container.endContainer as HTMLElement)
                : container.endContainer.parentElement
        )?.closest<HTMLTableCellElement>('td, th');

        if (startTd && endTd) {
            if (container.commonAncestorContainer.nodeName === 'TR') {
                items.push(startTd);
                let nextTd = startTd.nextElementSibling;
                while (nextTd) {
                    if (nextTd.nodeName === 'TD' || nextTd.nodeName === 'TH') {
                        items.push(nextTd as HTMLTableCellElement);
                    }

                    if (nextTd == endTd) break;

                    nextTd = nextTd.nextElementSibling;
                }
            } else {
                items.push(startTd, endTd);
            }
        }

        return items;
    }

    /**
     * Clear highlights
     */
    private clearHighlights() {
        this.getAllHighlights().forEach((td) => td.classList.remove(hhClass));
    }

    /**
     * Restore focus to the editor iframe
     */
    restoreFocus() {
        this.editorWindow.document.body.focus();
    }

    private buttonClick(button: HTMLButtonElement, name: EOEditorCommandKey) {
        // Hold the button's states
        const subs = button.dataset['subs']
            ?.split(',')
            .map((s) => s.trim() as EOEditorCommandKey);

        this.updateClickedButton(button, subs);

        // Hide the popup
        this.popup.hide();

        // Command
        const command = EOEditorCommands[name];

        // Set focus to iframe
        this.restoreFocus();

        // Execute the command
        const result = command.action
            ? command.action(this)
            : this.executeCommand(name);

        if (result) this.onSelectionChange();

        // Later update the backup content
        this.backup();
    }

    private setWidth() {
        const width = this.width;
        if (width) this.style.setProperty('--width', width);
    }

    private setHeight() {
        const height = this.height;
        if (height) this.style.setProperty('--height', height);
    }

    private setColor() {
        const color = this.color;
        if (color) this.style.setProperty('--color', color, 'important');
    }

    private setContent(value?: string | null) {
        this.editorWindow.document.body.innerHTML = value ?? '';
    }

    private setActiveColor() {
        const activeColor = EColor.parse(this.activeColor);
        if (activeColor) {
            this.style.setProperty(
                '--color-active',
                activeColor.toRGBColor(),
                'important'
            );
            this.style.setProperty(
                '--color-hover-bg',
                activeColor.toRGBColor(0.05),
                'important'
            );
            this.imageEditor.panelColor = activeColor.toRGBColor(0.2);
            this.style.setProperty(
                '--color-active-bg',
                activeColor.toRGBColor(0.2),
                'important'
            );
        }
    }

    /**
     * Called every time the element is inserted into the DOM.
     * Useful for running setup code
     */
    connectedCallback() {
        // Flag for edit
        // this.contentEditable = 'true';

        // Hide the border when focus
        // this.style.outline = '0px solid transparent';
        this.hidden = true;

        // Update attributes
        this.setWidth();
        this.setHeight();
        this.setColor();
        this.setActiveColor();
        this.setCommands();

        // Fill the form, easier for submit
        this.form = this.closest('form');
        if (this.form) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = this.name ?? 'content';
            this.formInput = this.form.appendChild(input);

            this.form.addEventListener(
                'submit',
                this.onFormSubmit.bind(this),
                true
            );
        }

        // Check document readyState
        const init = () => {
            if (document.readyState !== 'complete') return false;
            this.initContent(this.editorFrame.contentWindow);
            return true;
        };
        if (!init()) {
            document.addEventListener('readystatechange', () => init());
        }
    }

    private closePopups() {
        this.popup.hide();
        this.palette.hide();
    }

    private initContent(win: Window | null) {
        if (win == null) return;

        this._editorWindow = win;
        const doc = win.document;

        doc.open();
        doc.write((this.getBackup() || this.content) ?? this.innerHTML);
        doc.close();

        if (doc.body.contentEditable !== 'true') {
            // Default styles
            // :is(td, th) released on 2021, replaced with a secure way
            // https://developer.mozilla.org/en-US/docs/Web/CSS/:is
            doc.head.insertAdjacentHTML(
                'beforeend',
                `<style>
                    body {
                        background-color: #fff;
                        margin: 0px;
                        padding: 0.5em;
                    }
                    pre {
                        background-color: #f3f3f3;
                        padding: 12px;
                    }
                    table:not([border]) td, table:not([border]) th, table[border="0"] td, table[border="0"] th {
                        border: 1px dotted #ccc;
                    }
                    img, iframe {
                        cursor: move;
                        border: 6px double #ccc;
                        box-sizing: border-box;
                    }
                    .eo-textbox {
                        border: 6px double #ccc;
                        box-sizing: border-box;
                    }
                    .eo-highlight {
                        background-color: Highlight;
                        color: HighlightText;
                    }
                </style>`
            );

            // Clone styles
            if (this.cloneStyles !== 'false') {
                for (let i = 0; i < document.styleSheets.length; i++) {
                    const style = document.styleSheets.item(i);
                    if (style == null || style.ownerNode == null) continue;
                    doc.head.appendChild(style.ownerNode.cloneNode(true));
                }
            }

            // Editable
            doc.body.contentEditable = 'true';

            // Keep the reference
            this.palette.refDocument = doc;

            // Press enter for <p>, otherwise is <br/>
            // this.style.display = 'inline-block';
            doc.execCommand('defaultParagraphSeparator', false, 'p');

            if (!doc.execCommand('enableObjectResizing')) {
                // Custom object resizing
            }

            if (!doc.execCommand('enableInlineTableEditing')) {
                // Custom table editing
            }

            const styleWithCSS = this.styleWithCSS;
            if (styleWithCSS) {
                doc.execCommand(
                    'styleWithCSS',
                    undefined,
                    styleWithCSS.toString()
                );
            }

            // Listen to focus event
            doc.addEventListener('mousedown', (event) => {
                this.closePopups();

                const target = event.target;
                if (target == null || !('nodeName' in target)) {
                    return;
                }

                if (event.ctrlKey) {
                    const selection = this.getSelection();
                    if (selection) {
                        const e = target as HTMLElement;
                        const td = e.closest<HTMLTableCellElement>('td, th');
                        if (td) {
                            // Table
                            const table = td.closest('table');
                            if (table) {
                                // First one
                                if (this.getAllHighlights(table).length === 0) {
                                    td.classList.add(hhClass);
                                } else {
                                    const vt = VirtualTable.tables.find(
                                        (item) => item.HTMLTable == table
                                    );
                                    if (vt) {
                                        // Next to the current items
                                        if (
                                            vt
                                                .getNearCells(td)
                                                .some((c) =>
                                                    c.classList.contains(
                                                        hhClass
                                                    )
                                                )
                                        ) {
                                            td.classList.add(hhClass);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    event.preventDefault();
                } else {
                    this.clearHighlights();
                }

                const nodeName = target['nodeName'];

                const labels = this.labels!;

                if (nodeName === 'IMG') {
                    const image = target as HTMLImageElement;

                    this.adjustPopup(event, image);
                    this.popupIcons([
                        {
                            name: 'edit',
                            label: labels.edit,
                            icon: EOEditorSVGs.edit,
                            action: () => {
                                this.editImage(
                                    image,
                                    (data) => (image.src = data)
                                );
                            }
                        },
                        {
                            name: 'link',
                            label: labels.link,
                            icon: EOEditorCommands.link.icon,
                            action: () => {
                                this.link();
                            }
                        },
                        EOEditorSeparator,
                        {
                            name: 'delete',
                            label: labels.delete,
                            icon: EOEditorCommands.delete.icon,
                            action: () => {
                                this.delete();
                            }
                        }
                    ]);
                } else if (nodeName === 'IFRAME') {
                    const iframe = target as HTMLIFrameElement;
                    this.adjustPopup(event, iframe);
                    this.popupIcons([
                        {
                            name: 'edit',
                            label: labels.edit,
                            icon: EOEditorSVGs.edit,
                            action: () => {
                                this.iframe(iframe);
                            }
                        },
                        EOEditorSeparator,
                        {
                            name: 'delete',
                            label: labels.delete,
                            icon: EOEditorCommands.delete.icon,
                            action: () => {
                                this.delete();
                            }
                        }
                    ]);
                } else {
                    const element = target as HTMLElement;

                    const div = element.closest('div');
                    if (div) {
                        if (this.adjustTargetPopup(div)) {
                            this.popupIcons([
                                {
                                    name: 'edit',
                                    label: labels.edit,
                                    icon: EOEditorSVGs.edit,
                                    action: () => {
                                        this.popupTextbox(div);
                                    }
                                },
                                EOEditorSeparator,
                                {
                                    name: 'delete',
                                    label: labels.delete,
                                    icon: EOEditorCommands.delete.icon,
                                    action: () => {
                                        div.remove();
                                    }
                                }
                            ]);
                        } else {
                            this.popup.reshow();
                        }
                    } else {
                        const cell =
                            element.closest<HTMLTableCellElement>('td, th');
                        if (cell) {
                            this.currentCell = cell;
                            const table = cell.closest('table');
                            if (table) {
                                if (this.adjustTargetPopup(table)) {
                                    // Virtual table
                                    const vt = new VirtualTable(table);

                                    this.popupIcons(
                                        [
                                            {
                                                name: 'tableProperties',
                                                label: labels.tableProperties,
                                                icon: EOEditorSVGs.tableEdit,
                                                action: () => {
                                                    this.tableProperties(table);
                                                }
                                            },
                                            {
                                                name: 'tableRemove',
                                                label: `${labels.delete}(${labels.table})`,
                                                icon: EOEditorSVGs.tableRemove,
                                                action: () => {
                                                    vt.removeTable();
                                                }
                                            },
                                            EOEditorSeparator,
                                            {
                                                name: 'tableSplitCell',
                                                label: `${labels.tableSplitCell}`,
                                                icon: EOEditorSVGs.tableSplitCell,
                                                action: () => {
                                                    this.tableSplitCell(
                                                        (isRow, qty) => {
                                                            vt.splitCell(
                                                                this
                                                                    .currentCell!,
                                                                isRow,
                                                                qty
                                                            );
                                                        }
                                                    );
                                                }
                                            },
                                            {
                                                name: 'tableMergeCells',
                                                label: `${labels.tableMergeCells}`,
                                                icon: EOEditorSVGs.tableMergeCells,
                                                action: () => {
                                                    let cells =
                                                        this.lastHighlights ??
                                                        this.getAllHighlights(
                                                            table
                                                        );
                                                    vt.mergeCells(cells);
                                                }
                                            },
                                            EOEditorSeparator,
                                            {
                                                name: 'tableColumnAddBefore',
                                                label: `${labels.tableColumnAddBefore}`,
                                                icon: EOEditorSVGs.tableColumnAddBefore,
                                                action: () => {
                                                    vt.addColumnBefore(
                                                        this.currentCell!
                                                    );
                                                }
                                            },
                                            {
                                                name: 'tableColumnAddAfter',
                                                label: `${labels.tableColumnAddAfter}`,
                                                icon: EOEditorSVGs.tableColumnAddAfter,
                                                action: () => {
                                                    vt.addColumnAfter(
                                                        this.currentCell!
                                                    );
                                                }
                                            },
                                            {
                                                name: 'tableColumnRemove',
                                                label: `${labels.tableColumnRemove}`,
                                                icon: EOEditorSVGs.tableColumnRemove,
                                                action: () => {
                                                    vt.removeColumn(
                                                        this.currentCell!
                                                    );
                                                }
                                            },
                                            EOEditorSeparator,
                                            {
                                                name: 'tableRowAddBefore',
                                                label: `${labels.tableRowAddBefore}`,
                                                icon: EOEditorSVGs.tableRowAddBefore,
                                                action: () => {
                                                    vt.addRowBefore(
                                                        this.currentCell!
                                                    );
                                                }
                                            },
                                            {
                                                name: 'tableRowAddAfter',
                                                label: `${labels.tableRowAddAfter}`,
                                                icon: EOEditorSVGs.tableRowAddAfter,
                                                action: () => {
                                                    vt.addRowAfter(
                                                        this.currentCell!
                                                    );
                                                }
                                            },
                                            {
                                                name: 'tableRowRemove',
                                                label: `${labels.tableRowRemove}`,
                                                icon: EOEditorSVGs.tableRowRemove,
                                                action: () => {
                                                    vt.removeRow(
                                                        this.currentCell!
                                                    );
                                                }
                                            }
                                        ],
                                        () => {
                                            this.testMergeButton(table);
                                        }
                                    );
                                } else {
                                    this.popup.reshow();
                                    this.testMergeButton(table);
                                }
                            }
                        }
                    }
                }
            });

            doc.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter') return;
                const range = this.getFirstRange();
                if (range == null) return;
                const element = this.getFirstElement(range);
                if (element?.tagName !== 'DIV') return;

                event.preventDefault();
                event.stopImmediatePropagation();
                event.stopPropagation();

                if (event.ctrlKey) {
                    if (element.previousSibling) {
                        this.selectElement(
                            element.previousSibling,
                            null,
                            true
                        )?.collapse();
                    } else {
                        const br = doc.createElement('br');
                        element.parentElement?.prepend(br);
                        this.selectElement(br, null, true)?.collapse();
                    }
                } else {
                    const p = doc.createElement('P');
                    p.innerHTML = '<br/>';
                    range.insertNode(p);
                    range.selectNode(p);
                    range.collapse();
                }
            });

            // Listen to selection change
            doc.addEventListener('selectionchange', () =>
                this.onSelectionChange()
            );

            // Backup content when window blurs
            win.addEventListener('blur', () => {
                this.backup(-1);
            });

            // Display
            this.hidden = false;
        }
    }

    private testMergeButton(table: HTMLTableElement | Range) {
        if (!this.popup.isVisible()) return;

        const mergeButton = this.popup.querySelector<HTMLButtonElement>(
            'button[name="tableMergeCells"]'
        );

        if (mergeButton) {
            this.lastHighlights = this.getAllHighlights(table);
            mergeButton.disabled = this.lastHighlights.length <= 1;
        }
    }

    private selectPopupElement(target: HTMLElement) {
        if (target.nodeName == 'IMG' || target.nodeName == 'IFRAME') {
            this.selectElement(target);
        }
    }

    private selectElement(
        target: Node,
        selection: Selection | null = null,
        isContent: boolean = false
    ) {
        selection ??= this.getSelection();
        if (selection) {
            selection.removeAllRanges();

            const range = this.editorWindow.document.createRange();
            if (isContent) range.selectNodeContents(target);
            else range.selectNode(target);
            selection.addRange(range);

            return range;
        }
    }

    private adjustPopup(event: MouseEvent, target: HTMLElement) {
        this.selectPopupElement(target);

        // Pos
        this._lastClickedButton = {
            name: 'object',
            rect: new DOMRect(
                event.clientX + this.editorFrame.offsetLeft,
                event.clientY + this.editorFrame.offsetTop,
                6,
                6
            )
        };
    }

    private adjustTargetPopup(target: HTMLElement) {
        this.selectPopupElement(target);

        const t = target.getBoundingClientRect();
        const rect = new DOMRect(
            this.editorFrame.offsetLeft + t.left,
            this.editorFrame.offsetTop + t.top - 40,
            6,
            6
        );

        const b = this._lastClickedButton;
        if (
            'object' === b?.name &&
            rect.x === b?.rect.x &&
            rect.y === b?.rect.y
        )
            return false;

        // Pos
        this._lastClickedButton = {
            name: 'object',
            rect
        };

        return true;
    }

    disconnectedCallback() {
        this.form?.removeEventListener('submit', this.onFormSubmit.bind(this));

        this.clearBackupSeed();
        this.clearSelectionChangeSeed();
    }

    // Only called for the disabled and open attributes due to observedAttributes
    attributeChangedCallback(
        name: string,
        oldVal: string | null,
        newVal: string | null
    ) {
        // No necessary to update before being connected
        if (!this.isConnected || newVal == null) return;

        switch (name) {
            case 'name':
                if (this.formInput) this.formInput.name = newVal;
                break;
            case 'commands':
                this.setCommands();
                break;
            case 'width':
                this.setWidth();
                break;
            case 'height':
                this.setHeight();
                break;
            case 'color':
                this.setColor();
                break;
            case 'activeColor':
                this.setActiveColor();
                break;
            case 'content':
            case 'value':
                this.setContent(newVal);
                break;
        }
    }

    private createButton(name: EOEditorCommandKey, command: IEOEditorCommand) {
        return this.createButtonSimple(
            name,
            command.label ?? this.labels![name],
            command.icon
        );
    }

    private createButtonSimple(name: string, label: string, icon: string) {
        if (name === 's') return '<div class="separator"></div>';

        return `<button is="eo-button" name="${name}" tooltip="${label}">${this.createSVG(
            icon
        )}${
            name === 'foreColor' || name === 'backColor'
                ? '<svg width="18" height="4" viewBox="0 0 18 4" class="color-indicator"><rect x="0" y="0" width="18" height="4" /></svg>'
                : ''
        }</button>`;
    }

    private createIconButton(name: EOEditorCommandKey) {
        if (name === 's') return '<div class="separator"></div>';

        const command = EOEditorCommands[name];
        const label = command.label ?? this.labels![name];
        return `<button class="icon-button" name="${name}">${this.createSVG(
            command.icon
        )}<span>${label}</span></button>`;
    }

    private createSVG(path: string) {
        return `<svg width="24" height="24" viewBox="0 0 24 24">${path}</svg>`;
    }

    /**
     * Create element
     * @param tagName Tag name
     * @returns Element
     */
    createElement<K extends keyof HTMLElementTagNameMap>(tagName: K) {
        return this.editorWindow.document.createElement(tagName);
    }

    /**
     * Get selection
     * @returns Selection
     */
    getSelection() {
        return this.editorWindow.getSelection();
    }

    /**
     * Get first range
     * @returns Range
     */
    getFirstRange() {
        const selection = this.getSelection();
        if (selection == null || selection.rangeCount === 0) return null;
        return selection.getRangeAt(0);
    }

    /**
     * Get deepest node
     * @param node Node
     * @returns Deepest node
     */
    getDeepestNode(node: Node) {
        while (node.childNodes.length === 1) {
            node = node.childNodes[0];
        }
        return node;
    }

    /**
     * Get the only child element
     * @param container Container node
     * @returns Only element
     */
    getOnlyElement(container: Node): HTMLElement | null {
        let element: HTMLElement | null = null;

        container.childNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (element == null) element = node as HTMLElement;
                else return null;
            }
        });

        return element;
    }

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
     * Get first element
     * @param input Input selection or range
     * @returns Element
     */
    getFirstElement(input: Selection | Range | null) {
        // Null case
        if (input == null) input = this.getSelection();
        if (input == null) return;

        const range =
            'rangeCount' in input
                ? input.rangeCount > 0
                    ? input.getRangeAt(0)
                    : null
                : input;

        if (range == null) return null;

        // Firefox range.commonAncestorContainer is the parent element
        //         range.startContainer is the text node or the previous text node
        // Chrome range.commonAncestorContainer is the text node
        //        range.startContainer is the same text node
        let node: Node | null = null;
        const container = range.commonAncestorContainer;
        const nodeCount = container.childNodes.length;

        const onlyElement = this.getOnlyElement(container);
        if (onlyElement) return onlyElement;

        if (nodeCount === 0) node = container;
        else if (nodeCount === 1)
            node = this.getDeepestNode(container.childNodes[0]);
        else {
            for (let c = 0; c < nodeCount; c++) {
                const childNode = container.childNodes[c];
                if (
                    childNode === range.startContainer &&
                    c + 2 < nodeCount &&
                    container.childNodes[c + 2] === range.endContainer
                ) {
                    node = this.getDeepestNode(container.childNodes[c + 1]);
                    break;
                }
            }

            // Default
            if (node == null)
                node =
                    range.endOffset === 0
                        ? range.startContainer
                        : range.endContainer;
        }

        return node.nodeType === Node.ELEMENT_NODE
            ? (node as HTMLElement)
            : node.parentElement;
    }

    /**
     * Get first link
     * @returns Link
     */
    getFirstLink(): HTMLAnchorElement | null {
        const element = this.getFirstElement(this.getSelection());
        if (element) {
            if (element instanceof HTMLAnchorElement) return element;
            return element.closest('a');
        }
        return null;
    }

    private onFormSubmit() {
        this.clearHighlights();
        if (this.formInput) this.formInput.value = this.innerHTML;

        // this.backup(0) will submit first then trigger backup event
        this.backup(-1);
    }

    private clearBackupSeed() {
        if (this.backupSeed > 0) {
            window.clearTimeout(this.backupSeed);
            this.backupSeed = 0;
        }
    }

    private clearSelectionChangeSeed() {
        if (this.selectionChangeSeed > 0) {
            window.clearTimeout(this.selectionChangeSeed);
            this.selectionChangeSeed = 0;
        }
    }

    private getClasses(element: HTMLElement) {
        const selector = new RegExp(
            `^${element.tagName}\\.([a-z0-9\\-_]+)$`,
            'i'
        );
        const sheets = this.editorWindow.document.styleSheets;
        const classes: string[] = [];
        for (let c = 0; c < sheets.length; c++) {
            const sheet = sheets.item(c);
            if (sheet == null) continue;

            try {
                // https://stackoverflow.com/questions/49993633/uncaught-domexception-failed-to-read-the-cssrules-property
                for (const rule of sheet.cssRules) {
                    const styleRule = rule as CSSStyleRule;
                    if (!('style' in styleRule)) continue;

                    const parts = styleRule.selectorText
                        .split(/\s*,\s*/)
                        .reduce((prev, curr) => {
                            curr.split(/\s+/).forEach((item) => {
                                const match = item.match(selector);
                                if (match && match.length > 1)
                                    prev.push(match[1]);
                            });
                            return prev;
                        }, [] as string[]);

                    classes.push(...parts);
                }
            } catch {}
        }

        return classes;
    }

    private onSelectionChange() {
        this.clearSelectionChangeSeed();
        this.selectionChangeSeed = window.setTimeout(() => {
            this.onSelectionChangeDirect();
        }, 50);
    }

    private setFillColor(key: EOEditorCommandKey, color: string) {
        const button =
            this.buttons[key]?.querySelector<SVGElement>('.color-indicator');
        if (button) button.style.fill = color;
    }

    private getFillColor(key: EOEditorCommandKey) {
        const button =
            this.buttons[key]?.querySelector<SVGElement>('.color-indicator');
        return button?.style.fill;
    }

    private onSelectionChangeDirect() {
        // Selection
        const selection = this.getSelection();
        if (selection == null || selection.type === 'None') {
            return;
        }

        const range = this.getFirstRange();
        if (this.isCaretSelection(selection) || range?.toString() === '') {
            this.toggleButtonsCaret();
        } else {
            this.toggleButtons(false);

            if (range) this.testMergeButton(range);
        }

        // Element
        let element = this.getFirstElement(range);

        if (element) {
            // Fore color and back color detection
            const style = this.editorWindow.getComputedStyle(element);

            this.setFillColor('foreColor', style.color);
            this.setFillColor('backColor', style.backgroundColor);
        }

        // Status indicating
        while (element) {
            // Query all
            for (const b in this.buttons) {
                const key = b as EOEditorCommandKey;
                const button = this.buttons[key];
                if (button == null || button.classList.contains('active'))
                    continue;

                const command = EOEditorCommands[key];
                if (command.detectStyle == null && command.detectTag == null) {
                    let textSubs: string | undefined;
                    if (
                        command.icon === '' &&
                        (textSubs = button.dataset['subs'])
                    ) {
                        // Dropdown text options
                        const subs = textSubs.split(',');

                        // Find the command
                        const item = subs
                            .map((s) => {
                                const key = s as EOEditorCommandKey;
                                return { key, command: EOEditorCommands[key] };
                            })
                            .find((c) => {
                                return this.detectElement(element!, c.command);
                            });

                        if (item) {
                            const span = button.querySelector('span.text');
                            if (span) {
                                span.innerHTML =
                                    item.command.label ??
                                    this.labels![item.key];
                            }
                            break;
                        }
                    }
                    continue;
                }

                if (this.detectElement(element, command)) {
                    button.classList.add('active');
                    break;
                }
            }

            // Parent
            element = element.parentElement;
            if (element?.tagName === 'BODY') break;
        }
    }

    private detectElement(element: HTMLElement, command: IEOEditorCommand) {
        const { detectTag, detectStyle } = command;

        if (detectTag) {
            if (detectTag.toUpperCase() === element.tagName) return true;
        }

        if (detectStyle) {
            const v = Reflect.get(element.style, detectStyle[0]);
            if (v === detectStyle[1]) return true;
        }

        return false;
    }

    private delectPopupSelection(subs: EOEditorCommandKey[]) {
        const selection = this.getSelection();
        const isCaret = this.isCaretSelection(selection);
        subs.forEach((sub) => {
            const button = this.popup.querySelector<HTMLButtonElement>(
                `button[name="${sub}"]`
            );
            if (button) button.disabled = isCaret && this.isCaretKey(sub);
        });

        let element = this.getFirstElement(selection);
        while (element) {
            // Find the command
            const item = subs
                .map((key) => ({ key, command: EOEditorCommands[key] }))
                .find((c) => this.detectElement(element!, c.command));

            if (item) {
                const button = this.popup.querySelector(
                    `button[name="${item.key}"]`
                );
                button?.classList.add('active');
                break;
            }

            // Parent
            element = element.parentElement;
            if (element?.tagName === 'BODY') break;
        }
    }

    /**
     * Popup blocks
     */
    popupBlocks() {
        const button = this._lastClickedButton;
        if (button == null || button.subs == null) return;

        const html = button.subs
            .map((s) => {
                const command = EOEditorCommands[s];
                const label = command.label ?? this.labels![s];
                return `<button is="eo-button" class="line" name="${s}"><${s}>${label}</${s}></button>`;
            })
            .join('');

        this.popupContent(
            `<div class="icons" style="flex-direction: column">${html}</div>`
        );
        this.setupButtons(this.popup);
        this.delectPopupSelection(button.subs);
    }

    /**
     * Popup styles
     */
    popupStyle(element: HTMLElement | null = null) {
        const selection = this.getSelection();
        if (selection == null) return;

        element ??= this.getFirstElement(selection);
        if (element == null) return;

        const range = this.selectElement(element, selection, true);

        const parents: HTMLElement[] = [element];
        let p = element.parentElement;
        while (p) {
            if (p?.nodeName === 'BODY') break;

            parents.push(p);
            if (parents.length > 5) break;

            p = p.parentElement;
        }

        const labels = this.labels!;
        const html = `<div class="grid">
        <div class="grid-title">${labels.style}</div>
        <div class="full-width parents">
            ${parents
                .map(
                    (p, k) =>
                        `<button${k === 0 ? ' disabled' : ''}>${
                            p.nodeName
                        }</button>`
                )
                .join('')}
        </div>

        <label>${labels.className}</label>
        <div class="span3">${this.createMSelect(
            'className',
            this.getClasses(element),
            element.classList
        )}</div>

        <textarea rows="8" name="code" class="full-width" style="width: 250px;"></textarea>
        <button class="full-width" name="apply">${labels.apply}</button>
        </div>`;

        this.popupContent(html);

        this.popup
            .querySelectorAll<HTMLButtonElement>('div.parents button')
            .forEach((button, key) => {
                if (button.disabled) return;
                button.addEventListener('click', () =>
                    this.popupStyle(parents[key])
                );
            });

        const classNameSelect =
            this.popup.querySelector<HTMLSelectElement>('#className')!;
        const codeArea = this.popup.querySelector<HTMLTextAreaElement>(
            'textarea[name="code"]'
        )!;
        codeArea.value = element.style.cssText;

        this.popup
            .querySelector('button[name="apply"]')
            ?.addEventListener('click', () => {
                this.popup.hide();

                for (const option of classNameSelect.options) {
                    if (option.selected) element!.classList.add(option.value);
                    else element!.classList.remove(option.value);
                }

                element!.style.cssText = codeArea.value;

                this.restoreFocus();
                range?.collapse();
            });
    }

    private createAligns(id: string, tooltip: string) {
        const sides = this.labels!.sides.split('|');
        const options = ['top', 'right', 'bottom', 'left']
            .map((o, key) => `<option value="${o}">${sides[key]}</option>`)
            .join('');

        return `<select title="${tooltip}" id="${id}">${options}</select>`;
    }

    private createInputs(name: string, div?: HTMLDivElement) {
        const labels = this.labels!;
        const sides = labels.sides.split('|');
        const getValue = (pName: string) => {
            if (div?.style == null) return '';
            return Reflect.get(div.style, pName);
        };

        const nameTop = name.replace('?', 'Top');
        const nameRight = name.replace('?', 'Right');
        const nameBottom = name.replace('?', 'Bottom');
        const nameLeft = name.replace('?', 'Left');

        return `
        <div class="span3 narrow">
            <input id="${nameTop}" placeholder="${sides[0]}" value="${getValue(
            nameTop
        )}"/>
            <button title="${labels.sameValue}">
                <svg width="16" height="16" viewBox="0 0 24 24" class="inline">${
                    EOEditorSVGs.arrayRight
                }</svg>
            </button>
            <input id="${nameRight}" placeholder="${
            sides[1]
        }" value="${getValue(nameRight)}"/>
            <input id="${nameBottom}" placeholder="${
            sides[2]
        }" value="${getValue(nameBottom)}"/>
            <input id="${nameLeft}" placeholder="${sides[3]}" value="${getValue(
            nameLeft
        )}"/>
        </div>
        `;
    }

    private createRadios(
        name: string,
        values: string[],
        labels: string | string[],
        defaultValue?: string | null
    ) {
        if (typeof labels === 'string') labels = labels.split('|');
        return values
            .map(
                (v, k) =>
                    `<label><input type="radio"${
                        k === 0 ? ` id=${name}` : ''
                    } name="${name}" value="${v}"${
                        v === defaultValue ? ' checked' : ''
                    }/>${labels[k]}</label>`
            )
            .join('');
    }

    private createSelect(id: string, options: string[], value?: string) {
        return `<select id="${id}">${options.map((o) => {
            const v = o.toLocaleLowerCase();
            return `<option value="${v}"${
                v === value ? ' selected' : ''
            }>${o}</option>`;
        })}</select>`;
    }

    private createMSelect(id: string, options: string[], value?: DOMTokenList) {
        return `<select style="width: 100%; height: 60px;" multiple id="${id}">${options.map(
            (o) => {
                const v = o.toLocaleLowerCase();
                return `<option value="${v}"${
                    value?.contains(v) ? ' selected' : ''
                }>${o}</option>`;
            }
        )}</select>`;
    }

    private setColorInput(id: string) {
        const input = this.popup.querySelector<HTMLInputElement>(
            `input#${id}`
        )!;
        this.palette.setupInput(input);
    }

    private popupTextbox(div?: HTMLDivElement) {
        const labels = this.labels!;
        const html = `<style>div.narrow input {width: 44.5px!important; }</style>
            <div class="grid">
                <div class="grid-title">${labels.textbox}</div>
                <label for="width">${labels.width}</label>
                <input type="text" id="width" value="${
                    div?.style.width ?? '100%'
                }"/>
                <label for="height">${labels.height}</label>
                <input type="text" id="height" value="${
                    div?.style.height ?? ''
                }"/>
                
                <label for="color">${labels.color}</label>
                <input type="text" id="color" value="${
                    div?.style.color ?? ''
                }"/>
                <label for="backgroundColor">${labels.bgColor}</label>
                <input type="text" id="backgroundColor" value="${
                    div?.style.backgroundColor ?? ''
                }"/>

                <label for="float">${labels.float}</label>
                <div class="span3">
                    ${this.createRadios(
                        'float',
                        ['none', 'left', 'right'],
                        [labels.none, labels.justifyLeft, labels.justifyRight],
                        div?.style.float
                    )}
                </div>

                <label for="marginTop">${labels.margin}</label>
                ${this.createInputs('margin?', div)}
                <label for="paddingTop">${labels.padding}</label>
                ${this.createInputs('padding?', div)}

                <div class="grid-title">${labels.border}</div>

                <label for="borderLeftWidth">${labels.width}</label>
                ${this.createInputs('border?Width', div)}

                <label for="borderRadius">${labels.borderStyle}</label>
                ${this.createSelect(
                    'borderStyle',
                    borderStyles,
                    Utils.replaceNullOrEmpty(div?.style.borderStyle, 'solid')
                )}
                <input type="text" id="borderColor" placeholder="${
                    labels.color
                }" value="${div?.style.borderColor ?? ''}"/>
                <input type="text" id="borderRadius" placeholder="${
                    labels.borderRadius
                }" value="${div?.style.borderRadius ?? ''}"/>

                <div class="grid-title">${labels.backgroundImage}</div>
                <label for="gradientAlign">${labels.gradient}</label>
                <div class="span3">
                    ${this.createAligns('gradientAlign', labels.to)}
                    <input type="text" id="gradientColor1" placeholder="${
                        labels.color
                    } 1"/>
                    <input type="text" id="gradientColor2" placeholder="${
                        labels.color
                    } 2"/>
                </div>
                <label for="backgroundImage">${labels.image}</label>
                <div class="span3 flex2">
                    <textarea rows="2" id="backgroundImage">${
                        div?.style.backgroundImage ?? ''
                    }</textarea>
                    <button title="${
                        labels.uploadFromComputer
                    }" style="margin-right:2px; position: relative;">
                        <input id="imageFile" type="file" accept="image/*" style="position: absolute; left: 0; top: 0; width: 32px; opacity: 0">
                        <svg width="16" height="16" viewBox="0 0 24 24" class="inline">${
                            EOEditorSVGs.upload
                        }</svg>
                    </button>
                </div>

                <label for="backgroundRepeat">${labels.repeat}</label>
                ${this.createSelect(
                    'backgroundRepeat',
                    [
                        'repeat-x',
                        'repeat-y',
                        'repeat',
                        'space',
                        'round',
                        'no-repeat'
                    ],
                    div?.style.backgroundRepeat ?? 'no-repeat'
                )}
                <label for="backgroundPosition">${labels.position}</label>
                <input type="text" id="backgroundPosition" value="${
                    div?.style.backgroundPosition ?? ''
                }"/>

                <div class="full-width"><button class="full-width" name="apply">${
                    labels.apply
                }</button></div>
            </div>`;

        this.popupContent(html);

        this.setColorInput('color');
        this.setColorInput('backgroundColor');
        this.setColorInput('borderColor');
        this.setColorInput('gradientColor1');
        this.setColorInput('gradientColor2');

        const divFloat = div?.style.float;
        if (divFloat) {
            const floatInput = this.popup.querySelector<HTMLInputElement>(
                `input[name="float"][value="${divFloat}"]`
            );
            if (floatInput) floatInput.checked = true;
        }

        this.setNarrowButtons();

        const bgImageArea =
            this.popup.querySelector<HTMLTextAreaElement>('#backgroundImage')!;
        const fileInput =
            this.popup.querySelector<HTMLInputElement>('input[type="file"]')!;

        fileInput.addEventListener('change', () => {
            const files = fileInput.files;
            if (files == null || files.length === 0) return;

            const file = files.item(0);
            if (!file?.type.startsWith('image/')) return;

            DomUtils.fileToDataURL(file).then((data) => {
                const items: string[] = [];
                if (bgImageArea.value) {
                    items.push(
                        ...bgImageArea.value.split(
                            /\s*,\s*(?=(url)|(linear-gradient))/gi
                        )
                    );
                }
                items.push(`url(${data})`);
                bgImageArea.value = items.join(', ');
            });
        });

        // Gradient
        const color1Input =
            this.popup.querySelector<HTMLInputElement>('#gradientColor1')!;
        const color2Input =
            this.popup.querySelector<HTMLInputElement>('#gradientColor2')!;
        const gAlignSelect =
            this.popup.querySelector<HTMLSelectElement>('#gradientAlign')!;

        if (bgImageArea.value) {
            const items = bgImageArea.value.split(
                /\s*,\s*(?=(url)|(linear-gradient))/gi
            );
            const item = items.find((item) =>
                item.startsWith('linear-gradient')
            );
            if (item) {
                const itemPos = item.indexOf('(');
                const itemSettings = item.substring(
                    itemPos + 1,
                    item.length - 1
                );
                const itemParts = itemSettings.split(/\s*,\s*(?=[^\d\s])/gi);
                if (itemParts.length === 2) {
                    gAlignSelect.value = 'bottom';
                } else if (itemParts.length === 3) {
                    gAlignSelect.value = itemParts.shift()!.split(/\s+/)[1];
                }
                color1Input.value = itemParts[0];
                color2Input.value = itemParts[1];
            }
        } else {
            gAlignSelect.value = 'bottom';
        }

        this.popup
            .querySelector('button[name="apply"]')
            ?.addEventListener('click', () => {
                this.popup.hide();

                let style: CSSStyleDeclaration;
                if (div == null) {
                    const newDiv = this.createElement('div');
                    newDiv.classList.add('eo-textbox');
                    newDiv.innerText = labels.textbox;

                    // Current element
                    let element: HTMLElement | null =
                        this.getFirstElement(null) ??
                        this.editorWindow.document.body;
                    while (element) {
                        const tagName = element.tagName;
                        if (textBoxNextTags.includes(tagName)) {
                            if (
                                tagName === 'BODY' ||
                                tagName === 'TD' ||
                                tagName === 'TH' ||
                                tagName === 'DIV'
                            )
                                element.appendChild(newDiv);
                            else element.after(newDiv);

                            break;
                        }

                        element = element.parentElement;
                    }

                    style = newDiv.style;
                } else {
                    style = div.style;
                }

                const color1 = color1Input.value;
                const color2 = color2Input.value;
                if (color1 && color2) {
                    const gAlign = gAlignSelect.value ?? 'bottom';
                    const gradient = `linear-gradient(to ${gAlign}, ${color1}, ${color2})`;
                    if (bgImageArea.value.trim() === '') {
                        bgImageArea.value = gradient;
                    } else {
                        const items = bgImageArea.value.split(
                            /\s*,\s*(?=(url)|(linear-gradient))/gi
                        );
                        const index = items.findIndex((item) =>
                            item.startsWith('linear-gradient')
                        );
                        if (index === -1) items.push(gradient);
                        else items.splice(index, 1, gradient);
                        bgImageArea.value = items.join(', ');
                    }
                }

                this.setPopupStyleValue(style, 'width');
                this.setPopupStyleValue(style, 'height');
                this.setPopupStyleValue(style, 'color');
                this.setPopupStyleValue(style, 'backgroundColor');
                this.setPopupStyleValue(
                    style,
                    'float',
                    'input[name="float"]:checked'
                );

                this.setPopupStyleValue(style, 'marginTop');
                this.setPopupStyleValue(style, 'marginRight');
                this.setPopupStyleValue(style, 'marginBottom');
                this.setPopupStyleValue(style, 'marginLeft');

                this.setPopupStyleValue(style, 'paddingTop');
                this.setPopupStyleValue(style, 'paddingRight');
                this.setPopupStyleValue(style, 'paddingBottom');
                this.setPopupStyleValue(style, 'paddingLeft');

                this.setPopupStyleValue(style, 'borderTopWidth');
                this.setPopupStyleValue(style, 'borderRightWidth');
                this.setPopupStyleValue(style, 'borderBottomWidth');
                this.setPopupStyleValue(style, 'borderLeftWidth');
                this.setPopupStyleValue(style, 'borderStyle');
                this.setPopupStyleValue(style, 'borderColor');
                this.setPopupStyleValue(style, 'borderRadius');

                this.setPopupStyleValue(style, 'backgroundImage');
                this.setPopupStyleValue(style, 'backgroundPosition');
                this.setPopupStyleValue(style, 'backgroundRepeat');
            });
    }

    private setNarrowButtons() {
        this.popup
            .querySelectorAll<HTMLButtonElement>('div.narrow button')
            .forEach((button) => {
                button.addEventListener('click', () => {
                    let firstInput: HTMLInputElement | null = null;
                    button.parentElement
                        ?.querySelectorAll('input')
                        .forEach((input) => {
                            if (firstInput == null) {
                                firstInput = input;
                            } else {
                                input.value = firstInput.value;
                            }
                        });
                });
            });
    }

    /**
     * Table properties
     * @param table HTML table
     */
    tableProperties(table: HTMLTableElement) {
        const labels = this.labels!;
        const html = `<style>div.narrow input {width: 44.5px!important; }</style>
            <div class="grid">
                <div class="grid-title">${labels.tableProperties}</div>
                <label for="width">${labels.width}</label>
                <input type="text" id="width" value="${
                    table?.style.width ?? '100%'
                }"/>
                <label for="height">${labels.height}</label>
                <input type="text" id="height" value="${
                    table?.style.height ?? ''
                }"/>

                <label for="caption">${labels.caption}</label>
                <textarea id="caption" class="span3" rows="2">${
                    table.caption?.innerHTML ?? ''
                }</textarea>

                <label for="tableLayout">${labels.tableLayout}</label>
                <div class="span3">
                    ${this.createRadios(
                        'tableLayout',
                        ['auto', 'fixed'],
                        labels.tableLayouts,
                        table.style.tableLayout
                    )}
                </div>
                
                <label for="color">${labels.color}</label>
                <input type="text" id="color" value="${
                    table?.style.color ?? ''
                }"/>
                <label for="backgroundColor">${labels.bgColor}</label>
                <input type="text" id="backgroundColor" value="${
                    table?.style.backgroundColor ?? ''
                }"/>

                <div class="grid-title">${labels.border}</div>

                <label for="tableBorder">${labels.tableBorder}</label>
                <input type="text" id="tableBorder" value="${table.border}"/>
                <label for="tableBorderCollapse">${
                    labels.tableBorderCollapse
                }</label>
                <label><input type="checkbox" id="tableBorderCollapse"${
                    table.style.borderCollapse === 'collapse' ? ' checked' : ''
                }/>${labels.yes}</label>

                <label for="borderLeftWidth">${labels.width}</label>
                ${this.createInputs('border?Width', table)}

                <label for="borderRadius">${labels.borderStyle}</label>
                ${this.createSelect(
                    'borderStyle',
                    borderStyles,
                    Utils.replaceNullOrEmpty(table?.style.borderStyle, 'solid')
                )}
                <input type="text" id="borderColor" placeholder="${
                    labels.color
                }" value="${table?.style.borderColor ?? ''}"/>
                <input type="text" id="borderRadius" placeholder="${
                    labels.borderRadius
                }" value="${table?.style.borderRadius ?? ''}"/>

                <div class="full-width"><button class="full-width" name="apply">${
                    labels.apply
                }</button></div>
            </div>`;

        this.popupContent(html);
        this.popup.autoClose = false;

        this.setColorInput('color');
        this.setColorInput('backgroundColor');
        this.setColorInput('borderColor');

        this.setNarrowButtons();

        this.popup
            .querySelector('button[name="apply"]')
            ?.addEventListener('click', () => {
                this.popup.hide();

                const caption =
                    this.popup.querySelector<HTMLTextAreaElement>(
                        '#caption'
                    )?.value;
                if (caption) {
                    if (table.caption) table.caption.innerHTML = caption!;
                    else {
                        const captionNode = this.createElement('caption');
                        captionNode.innerHTML = caption!;
                        table.prepend(captionNode);
                    }
                } else if (table.caption) {
                    table.caption.remove();
                }

                const style = table.style;
                this.setPopupStyleValue(style, 'width');
                this.setPopupStyleValue(style, 'height');
                this.setPopupStyleValue(style, 'color');
                this.setPopupStyleValue(style, 'backgroundColor');

                this.setPopupStyleValue(
                    style,
                    'tableLayout',
                    'input[name="tableLayout"]:checked'
                );

                this.setPopupStyleValue(style, 'borderTopWidth');
                this.setPopupStyleValue(style, 'borderRightWidth');
                this.setPopupStyleValue(style, 'borderBottomWidth');
                this.setPopupStyleValue(style, 'borderLeftWidth');

                const borderWidth =
                    this.popup.querySelector<HTMLInputElement>(
                        '#borderTopWidth'
                    )?.value;
                let tableBorder =
                    this.popup.querySelector<HTMLInputElement>(
                        '#tableBorder'
                    )?.value;
                if (tableBorder && /0[a-z]{0, 2}/i.test(tableBorder))
                    tableBorder = '';

                if (tableBorder) {
                    table.border = tableBorder;
                } else {
                    table.border = '0';
                }

                const tableBorderCollapse =
                    this.popup.querySelector<HTMLInputElement>(
                        '#tableBorderCollapse'
                    )?.checked;
                Reflect.set(
                    style,
                    'borderCollapse',
                    tableBorderCollapse ? 'collapse' : 'separate'
                );

                if (borderWidth && tableBorder)
                    this.setPopupStyleValue(style, 'borderStyle');
                else Reflect.set(style, 'borderStyle', null);

                this.setPopupStyleValue(style, 'borderColor');
                this.setPopupStyleValue(style, 'borderRadius');
            });
    }

    private addUnit(value: any) {
        if (value == null) return value;
        if (typeof value !== 'string') value = `${value}`;
        if (/^[-\d\.]+$/g.test(value)) value += 'px';
        return value;
    }

    private setPopupStyleValue(
        style: CSSStyleDeclaration,
        name: string,
        selector?: string
    ) {
        selector ??= `#${name}`;
        const element = this.popup.querySelector(selector);
        const value =
            element == null || !('value' in element)
                ? undefined
                : this.addUnit(element['value']);

        Reflect.set(style, name, value);
    }

    private popupVideo() {
        const html = `<div class="grid">
        <div class="grid-title">${this.labels?.video}</div>
        <textarea rows="8" name="code" class="full-width" style="width: 250px;"></textarea>
        <button class="full-width" name="apply">${this.labels?.apply}</button>
        </div>`;

        const getCodeInput = () =>
            this.popup.querySelector<HTMLTextAreaElement>(
                'textarea[name="code"]'
            )!;

        this.popupContent(html, () => {
            getCodeInput().focus();
        });

        this.popup
            .querySelector('button[name="apply"]')
            ?.addEventListener('click', () => {
                const codeInput = getCodeInput();
                const code = codeInput.value.trim();
                if (code === '') {
                    codeInput.focus();
                    return;
                }

                this.popup.hide();
                this.insertHTML(code);
            });
    }

    /**
     * Popup symbols
     */
    popupSymbols() {
        // Latest characters
        const textLatestCharacters = window.localStorage.getItem(
            EOEditor.LatestCharactersKey
        );
        const latestCharacters: number[] = textLatestCharacters
            ? JSON.parse(textLatestCharacters)
            : [];

        // Labels
        const labels = this.labels!.specialCharacterCategories.split('|');

        const html = `<div class="tab-page">${
            latestCharacters.length > 0
                ? `<div class="latest">${latestCharacters
                      .map((s) => {
                          const hex = s.toString(16);
                          return `<div title="U+${hex}" data-preview="&#x${hex};">&#x${hex};</div>`;
                      })
                      .join('')}</div>`
                : ''
        }<div class="tabs icons">${this.characterCategories
            .map(
                (c, index) =>
                    `<button is="eo-button" name="${c[0]}" class="tab autosize">${labels[index]}</button>`
            )
            .join(
                ''
            )}</div><div class="tab-content"><div class="items"></div></div></div>`;

        this.popupContent(html);

        // Setup button events
        let lastActiveButton: HTMLButtonElement | null;
        const items = this.popup.querySelector<HTMLDivElement>('div.items')!;

        this.popup
            .querySelectorAll<HTMLDivElement>('div.latest div')
            .forEach((div) => {
                div.addEventListener('click', () => {
                    this.insertHTML(div.innerHTML, true);
                });
            });

        this.popup
            .querySelectorAll<HTMLButtonElement>('button.tab')
            .forEach((button, key) => {
                button.addEventListener('click', () => {
                    button.classList.add('active');

                    const category = this.characterCategories[key];
                    let fragment = category[1];
                    if (fragment == null) {
                        fragment = EOEditorCharacters[category[0]]
                            .map((s) => {
                                const hex = s.toString(16);
                                return `<div title="U+${hex}" data-preview="&#x${hex};">&#x${hex};</div>`;
                            })
                            .join('');
                        category[1] = fragment;
                    }

                    items.innerHTML = fragment;

                    items
                        .querySelectorAll<HTMLDivElement>('div')
                        .forEach((div) => {
                            div.addEventListener('click', () => {
                                this.insertHTML(div.innerHTML, true);

                                const num = parseInt(
                                    div.title.substring(2),
                                    16
                                );
                                const index = latestCharacters.indexOf(num);
                                if (index !== 0) {
                                    if (index !== -1) {
                                        // Remove it
                                        latestCharacters.splice(index, 1);
                                    }

                                    // Add to the first
                                    latestCharacters.unshift(num);

                                    // Desktop max items
                                    if (latestCharacters.length > 22)
                                        latestCharacters.pop();

                                    // Persist
                                    window.localStorage.setItem(
                                        EOEditor.LatestCharactersKey,
                                        JSON.stringify(latestCharacters)
                                    );
                                }
                            });
                        });

                    if (lastActiveButton) {
                        lastActiveButton.classList.remove('active');
                    }
                    lastActiveButton = button;
                });

                if (key === 0) button.dispatchEvent(new MouseEvent('click'));
            });
    }

    /**
     * Popup colors
     * @param color Current color
     * @param callback Callback
     * @param popup EOPopup
     */
    popupColors(color: string | undefined, callback: (color: string) => void) {
        this.palette.popup(color, callback, this._lastClickedButton?.rect);
    }

    /**
     * Popup HTML content
     * @param content HTML content
     * @param ready Ready callback
     * @param insideIFrame Inside iframe or not
     */
    popupContent(
        content: string,
        ready?: () => void,
        insideIFrame: boolean = false
    ) {
        this.popup.show(
            content,
            this._lastClickedButton?.rect,
            ready,
            insideIFrame
        );
    }

    /**
     * Popup subs
     */
    popupSubs() {
        const button = this._lastClickedButton;
        if (button == null || button.subs == null) return;

        const html = button.subs
            .map((s) => {
                const command = EOEditorCommands[s];
                return this.createButton(s, command);
            })
            .join('');

        this.popupContent(`<div class="icons">${html}</div>`);
        this.setupButtons(this.popup);
        this.delectPopupSelection(button.subs);
    }

    private updateClickedButton(
        b: HTMLButtonElement,
        subs?: EOEditorCommandKey[]
    ) {
        this._lastClickedButton = {
            name: b.name as EOEditorCommandKey,
            rect: b.getBoundingClientRect(),
            subs
        };
    }

    /**
     * Popup icons
     * @param icons Icons
     * @param ready Callback
     */
    popupIcons(icons: IEOEditorIconCommand[], ready?: () => void) {
        const html = icons
            .map((s) => {
                return this.createButtonSimple(s.name, s.label, s.icon);
            })
            .join('');

        this.popupContent(`<div class="icons">${html}</div>`, ready, true);

        this.popup.querySelectorAll('button').forEach((b) => {
            const command = icons.find((icon) => icon.name === b.name);
            if (command == null) return;

            b.addEventListener('click', () => {
                this.updateClickedButton(b);

                this.popup.hide();
                if (command.action) command.action();
                this.restoreFocus();
            });
        });
    }

    private toggleButtons(disabled: boolean) {
        for (const b in this.buttons) {
            if (b === 'source') continue;

            const button = this.buttons[b as EOEditorCommandKey];
            if (button == null) continue;

            button.disabled = disabled;
            button.classList.remove('active');
        }
    }

    private isCaretSelection(selection: Selection | null) {
        return selection?.type === 'Caret';
    }

    private isCaretKey(key: EOEditorCommandKey) {
        if (key === 'link' || key === 'unlink') {
            // Caret inside a link
            const link = this.getFirstLink();
            if (link) return false;
            else if (key === 'link') {
                const element = this.getFirstElement(null);
                if (element?.tagName === 'IMG') return false;
            }
        }

        return EOEditor.caretKeys.includes(key);
    }

    private toggleButtonsCaret() {
        for (const name in this.buttons) {
            const key = name as EOEditorCommandKey;
            const button = this.buttons[key]!;
            button.classList.remove('active');
            button.disabled = this.isCaretKey(key);
        }
        return true;
    }

    private showAbout() {
        const html = `<div class="content">
            <p><strong>ETSOO EOEditor</strong></p>
            ${this.labels!['aboutContent']}
            </div>`;
        this.popupContent(html);
    }

    /**
     * Unlink
     * @returns Result
     */
    unlink() {
        const link = this.getFirstLink();
        if (link) {
            const doc = this.editorWindow.document;
            return doc.execCommand('unlink');
        }
        return false;
    }

    private iframe(element?: HTMLIFrameElement) {
        const labels = this.labels!;
        const html = `<div class="grid">
            <div class="grid-title">${labels.iframe}</div>
                <label for="src" class="self">${
                    labels.linkURL
                }: </label><textarea id="src" maxlength="255" rows="3" class="span3">${
            element?.src ?? ''
        }</textarea>
                <label for="width">${labels.width}</label>
                <input type="text" id="width" value="${
                    element?.width ?? '100%'
                }"/>
                <label for="height">${labels.height}</label>
                <input type="text" id="height" value="${
                    element?.height ?? '480'
                }"/>
                <div></div>
                <label>
                <input name="allowfullscreen" type="checkbox"${
                    element?.allowFullscreen ?? true ? ' checked' : ''
                }/>${labels.allowfullscreen}
            </label>
            <label for="border">${labels.border}</label>
            <input type="text" id="border" value="${
                element?.frameBorder ?? '0'
            }"/>
                <div class="full-width"><button class="full-width" name="apply">${
                    labels.apply
                }</button></div>
            </div>`;

        const getSrcInput = () =>
            this.popup.querySelector<HTMLTextAreaElement>('textarea#src')!;

        this.popupContent(html, () => {
            getSrcInput().focus();
        });

        this.popup
            .querySelector('button[name="apply"]')
            ?.addEventListener('click', () => {
                const srcInput = getSrcInput();

                const src = srcInput.value.trim();
                const width =
                    this.popup.querySelector<HTMLInputElement>('#width')?.value;
                const height =
                    this.popup.querySelector<HTMLInputElement>(
                        '#height'
                    )?.value;
                const allowfullscreen =
                    this.popup.querySelector<HTMLInputElement>(
                        'input[name="allowfullscreen"]'
                    )?.checked;
                const border =
                    this.popup.querySelector<HTMLInputElement>(
                        '#border'
                    )?.valueAsNumber;

                if (element) {
                    element.src = src;
                    element.width = !width ? '100%' : width;
                    element.height = !height ? '480' : height;
                    if (allowfullscreen != null)
                        element.allowFullscreen = allowfullscreen;
                    if (!border) element.removeAttribute('frameBorder');
                    else element.frameBorder = `${border}px`;
                } else {
                    if (src === '') {
                        srcInput.focus();
                        return;
                    }
                    this.insertHTML(
                        `<iframe src="${src}" width="${width}" height="${height}" frameborder="${
                            border ?? 0
                        }px"${
                            allowfullscreen ? ' allowfullscreen' : ''
                        }></iframe>`,
                        false
                    );
                }

                this.popup.hide();
            });
    }

    private link() {
        const a = this.getFirstLink();
        const labels = this.labels!;
        const html = `<div class="grid">
            <div class="grid-title">${labels.link}</div>
                <label for="url" class="self">${
                    labels.linkURL
                }: </label><textarea id="url" maxlength="255" rows="3" style="width:200px;" class="span3">${
            a?.href ?? ''
        }</textarea>
                <div></div>
                <div class="span3 flex2"><label><input name="target" type="checkbox" value="_blank"${
                    a?.target === '_blank' ? ' checked' : ''
                }/>${labels.linkTargetNew}</label>${
            a == null ? '' : this.createIconButton('unlink')
        }       </div>
                <div class="full-width"><button class="full-width" name="apply">${
                    labels.apply
                }</button></div>
            </div>`;

        const getUrlInput = () =>
            this.popup.querySelector<HTMLTextAreaElement>('textarea#url')!;

        this.popupContent(html, () => {
            getUrlInput().focus();
        });

        this.popup
            .querySelector('button[name="unlink"]')
            ?.addEventListener('click', () => {
                this.popup.hide();
                this.restoreFocus();

                const range = this.getFirstRange();
                if (range && a) {
                    range.selectNodeContents(a);
                    this.unlink();

                    const updatedRange = this.getFirstRange();
                    updatedRange?.collapse();
                }
            });

        this.popup
            .querySelector('button[name="apply"]')
            ?.addEventListener('click', () => {
                const urlInput = getUrlInput();
                const newWindow = this.popup.querySelector<HTMLInputElement>(
                    'input[name="target"]'
                )!;

                if (a) {
                    a.href = urlInput.value;
                    if (newWindow.checked) a.target = newWindow.value;
                    else a.removeAttribute('target');
                } else {
                    if (urlInput.value === '') {
                        urlInput.focus();
                        return;
                    }
                    const [_result, node] = this.surroundNode('a');
                    if (node instanceof HTMLAnchorElement) {
                        node.href = urlInput.value;
                        if (newWindow.checked) node.target = newWindow.value;
                    }
                }

                this.popup.hide();
            });
    }

    private tableSplitCell(callback: (isRow: boolean, qty: number) => void) {
        const labels = this.labels!;
        const html = `<div class="grid">
            <div class="grid-title">${labels.tableSplitCell}</div>

            <div class="full-width">
                <label><input type="radio" name="isRow" value="0" checked/>${labels.tableSplitColumns}</label>
                <label><input type="radio" name="isRow" value="1"/>${labels.tableSplitRows}</label>
            </div>

            <label for="qty">${labels.qty}</label>
            <input type="number" class="span3" id="qty" min="2" max="100" value="2"/>

            <div class="full-width"><button class="full-width" name="apply">${labels.apply}</button></div>
        </div>`;

        this.popupContent(html);

        this.popup
            .querySelector('button[name="apply"]')
            ?.addEventListener('click', () => {
                const isRow =
                    this.popup.querySelector<HTMLInputElement>(
                        'input[name="isRow"]:checked'
                    )?.value === '1';

                const qtyInput =
                    this.popup.querySelector<HTMLInputElement>('#qty')!;
                const qty = qtyInput.valueAsNumber;
                if (qty == null || qty < 2) {
                    qtyInput.focus();
                    return;
                }

                this.popup.hide();

                callback(isRow, qty);
            });
    }

    private toggleSource() {
        // Source button
        const button = this.buttons.source;
        if (button == null) return;

        // Toggle class
        const isSource = button.classList.toggle('active');

        // Style
        const styles: [string, string] = ['none', 'block'];

        if (isSource) {
            this.editorSourceArea.value =
                this.editorWindow.document.body.innerHTML;
        } else {
            this.editorWindow.document.body.innerHTML =
                this.editorSourceArea.value;
            styles.reverse();
        }

        this.editorFrame.style.display = styles[0];
        this.editorSourceArea.style.display = styles[1];

        // Toggle buttons disable property
        this.toggleButtons(isSource);

        // Backup
        this.backup();
    }

    /**
     * Insert HTML
     * More controls than 'insertHTML' command
     * @param html Valid HTML string
     * @param autoCollapse Auto collapse for the range
     */
    insertHTML(html: string | HTMLElement, autoCollapse: boolean = true) {
        this.restoreFocus();

        const range = this.getFirstRange();
        if (range == null) return null;

        range.deleteContents();

        let lastNode: Node | null = null;
        if (typeof html === 'string') {
            const template = document.createElement('template');
            template.innerHTML = html.trim();

            const nodes = template.content.childNodes;
            for (let n = nodes.length - 1; n >= 0; n--) {
                const node = nodes.item(n);

                range.insertNode(node);

                if (n === 0) {
                    lastNode = node;
                }
            }
        } else {
            lastNode = html;
            range.insertNode(lastNode);
        }

        if (lastNode && autoCollapse) {
            const iterator = template.ownerDocument.createNodeIterator(
                lastNode,
                NodeFilter.SHOW_TEXT
            );

            let textNode: Node | null;
            while ((textNode = iterator.nextNode())) {
                range.selectNodeContents(textNode);
                range.collapse();
            }
        }

        return range;
    }

    /**
     * Insert image
     */
    insertImage() {
        const labels = this.labels!;
        const html = `<style>
            .preview-container { position: relative; width: min(80vw, 480px); height: 320px; overflow: auto; margin: 6px 0px; }
            .preview-container img { position: absolute; left: 0px; top: 0px; display: none }
        </style><div class="content1">
            <div>
                <label for="imageFile">
                    <input type="radio" name="way" value="0" checked/>${
                        labels.uploadFromComputer
                    }<svg width="16" height="16" viewBox="0 0 24 24" class="inline">${
            EOEditorSVGs.upload
        }</svg>
                </label>
                <input id="imageFile" type="file" multiple accept="image/*" style="width: 200px; opacity: 0">
            </div>
            <div>
                <label><input type="radio" name="way" value="2"/>${
                    labels.imageCreation
                }</label>
            </div>
            <div>
                <label><input type="radio" name="way" value="1"/>${
                    labels.byURL
                }</label>
                <div><textarea rows="2" style="width: 100%"></textarea></div>
            </div>
            <div class="preview-container">
            </div>
            <div style="display: flex; padding-bottom: 12px; justify-content: space-between; align-items: center">
                <div>
                    <button id="previous" disabled>${labels.previous}</button>
                    <button id="next" disabled>${labels.next}</button>
                </div>    
                <div id="summary"></div>
                <div>
                    <button title="${
                        labels.delete
                    }" name="delete" disabled>${this.createSVG(
            EOEditorCommands.delete.icon
        )}</button>
                    <button title="${
                        labels.edit
                    }" name="edit" disabled>${this.createSVG(
            EOEditorSVGs.edit
        )}</button>
                </div>
            </div>
            <div class="full-width"><button class="full-width" name="apply" disabled>${
                labels.apply
            }</button></div>
        </div>`;
        this.popupContent(html);
        this.popup.autoClose = false;

        let index = -1;
        let imagesCount = 0;
        const initImage = (image: HTMLImageElement | null, add: number) => {
            if (image == null) return;

            imagesCount += add;

            if (index === -1) {
                index = 0;
            }

            doItem(index);

            setStatus();
        };

        const setStatus = () => {
            applyButton.disabled = imagesCount === 0;
            editButton.disabled = applyButton.disabled;
            deleteButton.disabled = applyButton.disabled;
        };

        const setSize = (image: HTMLImageElement | null) => {
            this.popup.querySelector('div#summary')!.innerHTML =
                image == null ? '' : `${image.width} x ${image.height}`;
        };

        const doPrevious = () => {
            doCurrentItem();
            doItem(--index);
        };

        const doNext = () => {
            doCurrentItem();
            doItem(++index);
        };

        const doCurrentItem = () => {
            previewDiv.querySelectorAll('img').item(index).style.display =
                'none';
        };

        const doItem = (index: number) => {
            const image = previewDiv.querySelectorAll('img').item(index);
            image.style.display = 'block';

            if (image.width > 0) setSize(image);
            else {
                image.addEventListener(
                    'load',
                    (event) => {
                        setSize(event.target as HTMLImageElement);
                    },
                    { once: true }
                );
            }

            pButton.disabled = index < 1;
            nButton.disabled = index + 1 >= imagesCount;
        };

        const addImage = (data: string, alt?: string, add?: number) => {
            const image = document.createElement('img');
            image.src = data;
            if (alt) image.alt = alt;
            previewDiv.appendChild(image);

            initImage(image, add ?? 1);
        };

        const radios = this.popup.querySelectorAll<HTMLInputElement>(
            'input[type="radio"]'
        )!;
        const fileInput =
            this.popup.querySelector<HTMLInputElement>('input[type="file"]')!;
        const imageCreation = this.popup.querySelector<HTMLInputElement>(
            'input[name="way"][value="2"]'
        );
        if (imageCreation) {
            imageCreation.addEventListener('click', () => {
                if (imageCreation.checked) {
                    this.imageEditor.open(null, (data) => {
                        addImage(data);
                    });
                }
            });
        }
        const urlInput =
            this.popup.querySelector<HTMLTextAreaElement>('textarea')!;
        const pButton =
            this.popup.querySelector<HTMLButtonElement>('button#previous')!;
        pButton.addEventListener('click', () => doPrevious());
        const nButton =
            this.popup.querySelector<HTMLButtonElement>('button#next')!;
        nButton.addEventListener('click', () => doNext());
        const previewDiv =
            this.popup.querySelector<HTMLDivElement>('.preview-container')!;
        const applyButton = this.popup.querySelector<HTMLButtonElement>(
            'button[name="apply"]'
        )!;
        const deleteButton = this.popup.querySelector<HTMLButtonElement>(
            'button[name="delete"]'
        )!;
        deleteButton.addEventListener('click', () => {
            const image = previewDiv.querySelectorAll('img').item(index);
            image.remove();
            imagesCount--;
            if (imagesCount === 0) {
                setStatus();
                setSize(null);
                index = -1;
            } else {
                if (index === imagesCount) index = 0;
                doItem(index);
            }
        });
        const editButton = this.popup.querySelector<HTMLButtonElement>(
            'button[name="edit"]'
        )!;
        editButton.addEventListener('click', () => {
            const image = previewDiv.querySelectorAll('img').item(index);
            this.editImage(image, (data) => (image.src = data));
        });

        applyButton?.addEventListener('click', () => {
            this.popup.hide();
            let imgs = '';
            previewDiv.querySelectorAll('img').forEach((image) => {
                image.removeAttribute('style');
                imgs += image.outerHTML;
            });
            this.insertHTML(imgs);
        });

        const loadFile = (file: File) => {
            if (!file.type.startsWith('image/')) return;
            DomUtils.fileToDataURL(file).then((data) => {
                addImage(data, file.name);
            });
        };

        fileInput.addEventListener('click', () => {
            radios.item(0).checked = true;
        });
        fileInput.addEventListener('change', () => {
            const files = fileInput.files;
            if (files == null || files.length === 0) return;

            for (const file of files) {
                loadFile(file);
            }
        });

        urlInput.addEventListener('focusin', () => {
            radios.item(1).checked = true;
        });
        urlInput.addEventListener('change', () => {
            const urls = urlInput.value.trim();
            applyButton.disabled = urls === '';
            if (applyButton.disabled) return;

            previewDiv.innerHTML = urls
                .split(/\s*;\s*/g)
                .map((url) => `<img src="${url}" />`)
                .join('');

            index = -1;
            const images = previewDiv.querySelectorAll('img');
            if (images.length > 0) {
                initImage(images.item(0), images.length);
            }

            urlInput.value = '';
        });
    }

    /**
     * Insert table
     */
    insertTable() {
        const sm = window.innerWidth < 768;
        let firstLoaded = false;

        const createTable = (rows: number, cols: number, init: boolean) => {
            let h = `<table ${
                init
                    ? 'border="0" class="table-cells"'
                    : 'style="width: 100%; table-layout: fixed;"'
            }>`;
            for (let r = 0; r < rows; r++) {
                h += '<tr>';
                for (let c = 0; c < cols; c++) {
                    h += `<td${init ? ' class="hidden"' : ''}><br/></td>`;
                }
                h += '</tr>';
            }
            h += '</table>';
            return h;
        };
        const thtml = createTable(10, 15, true);

        const getTDPos = (td: HTMLTableCellElement): [number, number] => {
            return [td.closest('tr')!.rowIndex, td.cellIndex];
        };

        const setVisible = (row: number, col: number, hover: boolean) => {
            table.querySelectorAll('td').forEach((td) => {
                const [tdRow, tdCol] = getTDPos(td);

                // Ignore hidden
                if (tdRow > row || tdCol > col) {
                    if (!sm || !firstLoaded) td.classList.add('hidden');
                    td.classList.remove('focus');
                } else {
                    if (!sm || !firstLoaded) td.classList.remove('hidden');

                    if (tdRow < row && tdCol < col) {
                        if (hover) td.classList.add('focus');
                    } else {
                        td.classList.remove('focus');
                    }
                }

                // Text
                if (hover) tip.innerText = `${row} x ${col}`;
            });
        };

        const html = `<style>
            .table-cells td { width: 16px; height: 16px; border: 1px solid #ccc; }
            .table-cells td.hidden { display: none; }
            .table-cells td.focus { background-color: var(--color-active-bg); }
        </style><div class="content1">
            ${thtml}
            <div id="tip" style="text-align: center">0 x 0</div>
        </div>`;
        this.popupContent(html);

        const table = this.popup.querySelector('table')!;
        const tip = this.popup.querySelector<HTMLDivElement>('#tip')!;

        this.popup.querySelectorAll('td').forEach((td) => {
            td.addEventListener('mouseenter', () => {
                const [row, col] = getTDPos(td);
                setVisible(row + 1, col + 1, true);
            });

            td.addEventListener('touchmove', () => {
                const [row, col] = getTDPos(td);
                setVisible(row + 1, col + 1, true);
            });

            td.addEventListener('click', () => {
                this.popup.hide();

                const [row, col] = getTDPos(td);

                const h = createTable(row + 1, col + 1, false);
                this.insertHTML(h, false)?.collapse();
            });
        });

        if (sm) setVisible(6, 10, false);
        else setVisible(1, 1, false);

        firstLoaded = true;
    }

    /**
     * Execute command
     * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
     * @param name Name
     */
    executeCommand(name: EOEditorCommandKey) {
        if (name === 'about') {
            this.showAbout();
            return true;
        }

        if (name === 'source') {
            this.toggleSource();
            return false;
        }

        if (name === 'align' || name === 'more') {
            this.popupSubs();
            return false;
        }

        if (name === 'formatBlock') {
            this.popupBlocks();
            return false;
        }

        if (name === 'code') {
            // Define style for "pre code"
            // like "background-color: #f3f3f3; padding: 1em;"
            // Import highlight.js https://highlightjs.org/usage/
            return !this.insertHTML('<pre><code>\n</code></pre>');
        }

        if (name === 'symbols') {
            this.popupSymbols();
            return true;
        }

        if (name === 'insertImage') {
            this.insertImage();
            return true;
        }

        if (name === 'insertTable') {
            this.insertTable();
            return true;
        }

        if (name === 'video') {
            this.popupVideo();
            return true;
        }

        if (name === 'textbox') {
            this.popupTextbox();
            return true;
        }

        if (name === 'style') {
            this.popupStyle();
            return true;
        }

        const doc = this.editorWindow.document;

        if (name === 'backColor' || name === 'foreColor') {
            this.popupColors(this.getFillColor(name), (color) => {
                doc.execCommand(name, false, color);

                this.restoreFocus();
                this.getFirstRange()?.collapse();
            });
            return false;
        }

        if (name.startsWith('h') && name.length === 2) {
            // Better than 'heading'
            if (name === 'hp')
                return doc.execCommand('formatBlock', false, 'p');
            return doc.execCommand('formatBlock', false, name);
        }

        if (name === 'link') {
            this.link();
            return true;
        }

        if (name === 'unlink') {
            return this.unlink();
        }

        if (name === 'iframe') {
            this.iframe();
            return true;
        }

        if (name === 'insertText') {
            navigator.clipboard.readText().then((result) => {
                doc.execCommand(name, false, result);
            });
            return true;
        }

        if (name === 'increaseFontSize') {
            if (!doc.execCommand(name)) {
                return this.surroundNode('big', 'small')[0];
            }
            return true;
        }

        if (name === 'decreaseFontSize') {
            if (!doc.execCommand(name)) {
                return this.surroundNode('small', 'large')[0];
            }
            return true;
        }

        return doc.execCommand(name);
    }

    /**
     * Let first range surround node
     * @param tagName New node tagname
     * @param excludedParents Excluded parent tagnames
     * @returns Result
     */
    surroundNode(
        tagName: string,
        ...excludedParents: string[]
    ): [boolean, HTMLElement?] {
        const range = this.getFirstRange();
        if (range == null) return [false];

        if (excludedParents.length > 0) {
            const containerTagName =
                range.commonAncestorContainer instanceof Element
                    ? range.commonAncestorContainer.tagName
                    : range.commonAncestorContainer.parentElement?.tagName;
            if (
                containerTagName != null &&
                (containerTagName === tagName.toUpperCase() ||
                    excludedParents
                        .map((item) => item.toUpperCase())
                        .includes(containerTagName))
            )
                return [false];
        }

        try {
            const node = document.createElement(tagName);
            range.surroundContents(node);
            range.selectNodeContents(node);

            return [true, node];
        } catch {
            return [false];
        }
    }
}

// Custom element - Reusable Web Component
customElements.get('eo-button') ||
    customElements.define('eo-button', EOButton, { extends: 'button' });
customElements.get('eo-image-editor') ||
    customElements.define('eo-image-editor', EOImageEditor);
customElements.define('eo-editor', EOEditor);
