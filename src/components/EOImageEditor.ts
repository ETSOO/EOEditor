import {
    DomUtils,
    ExtendUtils,
    Keyboard,
    NumberUtils,
    Utils
} from '@etsoo/shared';
import {
    EOEditorHistory,
    EOEditorHistoryState
} from '../classes/EOEditorHistory';
import { ImageUtils } from '../ImageUtils';
import {
    EOImageEditorGetLabels,
    EOImageEditorLabelLanguage
} from './EOImageEditorLabels';
import { EOPalette } from './EOPalette';
import { EOPopup } from './EOPopup';
import type { fabric as _f } from 'fabric';

type f = typeof _f;
let fabric: f;

/**
 * EOEditor Image Editor commands
 */
export interface EOImageEditorCommand {
    /**
     * Name
     */
    name: string;

    /**
     * Icon
     */
    icon: string;

    /**
     * Label
     */
    label: string;
}

/**
 * EOEditor Image Editor separator
 */
export const EOImageEditorSeparator: EOImageEditorCommand = {
    name: 's',
    icon: '',
    label: ''
};

const embossMatrix = [1, 1, 1, 1, 0.7, -1, -1, -1, -1];
const sharpenMatrix = [0, -1, 0, -1, 5, -1, 0, -1, 0];
const cropPath =
    '<path d="M7,17V1H5V5H1V7H5V17A2,2 0 0,0 7,19H17V23H19V19H23V17M17,15H19V7C19,5.89 18.1,5 17,5H9V7H17V15Z" />';

/**
 * EOEditor Image Editor
 * http://fabricjs.com/docs/fabric.Canvas.html
 */
export class EOImageEditor extends HTMLElement {
    /**
     * Canvas
     */
    readonly canvas: HTMLCanvasElement;

    /**
     * Fabric canvas
     */
    private fc?: fabric.Canvas;

    /**
     * Main image
     */
    private image?: fabric.Image;

    /**
     * Current active object
     */
    private activeObject: fabric.Object | null | undefined;

    /**
     * Complete callback
     */
    private callback?: (data: string) => void;

    /**
     * Popup
     */
    readonly popup: EOPopup;

    /**
     * Fonts
     */
    readonly fonts = ['Arial', 'Helvetica', 'Simsun'];

    /**
     * Modal div
     */
    readonly modalDiv: HTMLDivElement;

    // Is small screen
    private readonly xs: boolean;

    // Color palette
    private palette: EOPalette;

    // Container
    private readonly container: HTMLDivElement;

    // Toolbar
    private readonly toolbar: HTMLDivElement;

    // Icons
    private readonly icons: HTMLDivElement;

    // PNG format
    private pngFormat?: HTMLInputElement;

    // Mover div
    private readonly mover: HTMLDivElement;

    // Settings div
    private readonly settings: HTMLDivElement;

    // History
    private history?: EOEditorHistory;

    // Redo/undo button
    private redo?: HTMLButtonElement;
    private undo?: HTMLButtonElement;

    private fcSize?: [number, number];
    private containerRect?: DOMRect;
    private rect?: DOMRect;
    private originalWidth?: number;
    private originalHeight?: number;

    private _labels?: EOImageEditorLabelLanguage;
    /**
     * Labels
     */
    get labels() {
        return this._labels;
    }

    /**
     * Panel color
     */
    get panelColor() {
        return this.getAttribute('panelColor');
    }
    set panelColor(value: string | null) {
        if (value) this.setAttribute('panelColor', value);
        else this.removeAttribute('panelColor');
    }

    /**
     * Language
     */
    get language() {
        return this.getAttribute('language');
    }
    set language(value: string | null) {
        if (value) this.setAttribute('language', value);
        else this.removeAttribute('language');
    }

    constructor() {
        super();

        const xs = window.innerWidth < 480;
        this.xs = xs;

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    --close-button-right: 8px;
                    --height: ${xs ? 160 : 120}px;
                    --color-panel: RGBA(48, 58, 178, 0.2);
                }
                .wrapper {
                    position: fixed;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    background-color: gray;
                    opacity: 1;
                    transform: scale(1.1);
                    transition: visibility 0s linear .25s,opacity .25s 0s,transform .25s;
                    z-index: 9000;
                }
                .modal {
                    position: fixed;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 9010;
                }
                .close-button {
                    position: fixed;
                    top: 8px;
                    right: var(--close-button-right);
                    cursor: pointer;
                    z-index: 9020;
                }
                .container {
                    width: 100%;
                    height: calc(100% - var(--height));
                    box-sizing: border-box;
                    padding: 8px;
                    overflow: auto;
                    visibility: hidden;
                }
                .container canvas {
                    box-sizing: border-box;
                    border: 1px dotted #fff;
                }
                .toolbar {
                    border-top: 2px outset;
                    box-sizing: border-box;
                    bottom: 0px;
                    background-color: #fff;
                    height: var(--height);
                    padding: 8px;
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                .settings {
                    position: fixed;
                    box-sizing: border-box;
                    visibility: hidden;
                    left: 0px;
                    bottom: var(--height);
                    right: 0px;
                    padding: 8px;
                    background-color: #fff;
                    opacity: 0.9;
                    font-size: 11px;
                }
                .form {
                    display: grid;
                    grid-gap: 8px;
                    grid-template-columns: repeat(1, 90px minmax(100px, 1fr));
                    align-items: center;
                }
                .flex {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                }
                .vflex {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    justify-content: center;
                    align-items: center;
                }
                .settings input[type=range] {
                    width: 100px;
                }
                .settings label {
                    display: flex;
                    align-items: center;
                    flex-shrink: 1;
                }
                .settings label span {
                    margin-right: 4px;
                }
                .settings label.span2 {
                    grid-column: span 2;
                }
                @media (min-width: 400px) {
                    .form { grid-template-columns: repeat(2, 78px minmax(100px, 1fr)); }
                }
                @media (min-width: 768px) {
                    .form { grid-template-columns: repeat(3, 78px minmax(100px, 1fr)); }
                }
                @media (min-width: 992px) {
                    .form { grid-template-columns: repeat(4, 78px minmax(100px, 1fr)); }
                }
                @media (min-width: 1200px) {
                    .form { grid-template-columns: repeat(5, 78px minmax(100px, 1fr)); }
                }
                .icons {
                    flex-grow: 1;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                }
                .icons button {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                }
                .icons div.separator {
                    border-left: 1px solid #ccc;
                    height: 22px;
                    margin: 4px 0px;
                    display: inline-block;
                }
                button:disabled {
                    color: RGBA(0, 0, 0, 0.33);
                }
                button:disabled svg {
                    fill: RGBA(0, 0, 0, 0.33);
                }
                input[type="text"], input[type="number"] {
                    width: 72px;
                }
                .panels {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 0;
                    flex-shrink: 0;
                    width: 100px;
                    height: 100%;
                    gap: 4px;
                }
                .size-indicator {
                    font-size: 9px;
                    text-align: center;
                }
                .move-panel {
                    border: 1px inset;
                    background-color: #f3f3f3;
                    flex-grow: 1;
                    position: relative;
                    box-sizing: border-box;
                }
                .move-panel .mover {
                    border: 1px dotted #ccc;
                    background-color: var(--color-panel);
                    position: absolute;
                    box-sizing: border-box;
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
                eo-popup .grid .grid-title {
                    grid-column: 1 / -1;
                    font-weight: bold;
                }
                eo-popup .grid .full-width {
                    grid-column: 1 / -1;
                }
            </style>
            <div class="modal">
                <div class="close-button">${this.createSVG(
                    '<path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />'
                )}</div>
                <div class="container"><canvas></canvas></div>
                <div class="settings"></div>
                <div class="toolbar">
                    <div class="icons"></div>
                    <div class="panels">
                        <div class="size-indicator">0 x 0</div>
                        <div class="move-panel"><div class="mover"></div></div>
                    </div>
                </div>
                <eo-popup></eo-popup>
                <eo-palette></eo-palette>
            </div>
            <div class="wrapper"></div>
        `;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content);

        this.popup = shadowRoot.querySelector('eo-popup')!;
        this.palette = shadowRoot.querySelector('eo-palette')!;

        this.modalDiv = shadowRoot.querySelector('div.modal')!;

        const clickHandler = (target: EventTarget | null) => {
            if (this.activeObject == null) this.showSettings('');
            else if (target instanceof Node && target.nodeName === 'DIV') {
                this.fc?.discardActiveObject();
                this.fc?.renderAll();
            }
        };

        this.container =
            this.modalDiv.querySelector<HTMLDivElement>('.container')!;
        this.container.addEventListener('click', (e) => {
            clickHandler(e.target);
        });
        this.container.addEventListener('touchstart', (e) => {
            clickHandler(e.target);
        });

        this.canvas = shadowRoot.querySelector('canvas')!;
        this.toolbar =
            this.modalDiv.querySelector<HTMLDivElement>('div.toolbar')!;
        this.icons = this.toolbar.querySelector<HTMLDivElement>('.icons')!;
        this.mover = this.modalDiv.querySelector<HTMLDivElement>('div.mover')!;
        this.settings =
            this.modalDiv.querySelector<HTMLDivElement>('div.settings')!;

        this.container.addEventListener('scroll', () => {
            if (
                this.fcSize == null ||
                this.containerRect == null ||
                this.rect == null
            )
                return;

            const [w, h] = this.fcSize;

            const top = this.container.scrollTop;
            if (top === 0) {
                this.mover.style.top = '0px';
            } else {
                const t = (this.rect.height * top) / h;
                this.mover.style.top = `${t}px`;
            }

            const left = this.container.scrollLeft;
            if (left === 0) {
                this.mover.style.left = '0px';
            } else {
                const l = (this.rect.width * left) / w;
                this.mover.style.left = `${l}px`;
            }
        });

        const adjustMover = (clientX: number, clientY: number) => {
            if (this.rect == null || this.fcSize == null) return;
            // Event.offsetX will be the mover, not the mover container
            const offsetX = clientX - this.rect.left;
            const offsetY = clientY - this.rect.top;
            const w = parseFloat(this.mover.style.width);
            const h = parseFloat(this.mover.style.height);

            const [fw, fh] = this.fcSize;

            let nl: number;
            if (offsetX + w / 2 >= this.rect.width) {
                nl = this.rect.width - 2 - w;
            } else {
                nl = offsetX - w / 2;
                if (nl < 0) nl = 0;
            }
            this.mover.style.left = `${nl}px`;

            this.container.scrollLeft = (fw * nl) / this.rect.width;

            let nt: number;
            if (offsetY + h / 2 >= this.rect.height) {
                nt = this.rect.height - 2 - h;
            } else {
                nt = offsetY - h / 2;
                if (nt < 0) nt = 0;
            }
            this.mover.style.top = `${nt}px`;

            this.container.scrollTop = (fh * nt) / this.rect.height;
        };

        const p = this.mover.parentElement!;
        p.addEventListener('mousedown', (event) => {
            this.preventEvent(event);
            adjustMover(event.clientX, event.clientY);
        });
        p.addEventListener('mousemove', (event) => {
            if (event.buttons !== 1) return;
            this.preventEvent(event);
            adjustMover(event.clientX, event.clientY);
        });
        const touchHandler = (event: TouchEvent) => {
            this.preventEvent(event);
            const x = event.touches.item(0)?.clientX;
            const y = event.touches.item(0)?.clientY;
            if (x == null || y == null) return;
            adjustMover(x, y);
        };
        p.addEventListener('touchstart', touchHandler);
        p.addEventListener('touchmove', touchHandler);

        document.fonts.ready.then((value) => {
            value.forEach((v) => {
                if (!this.fonts.includes(v.family)) this.fonts.push(v.family);
            });
        });
    }

    private preventEvent(event: Event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
    }

    async connectedCallback() {
        const { fabric: f } = await import('fabric');
        fabric = f;

        // https://github.com/fabricjs/fabric.js/issues/3319
        // Change the padding logic to include background-color
        (fabric.Text as any).prototype.set({
            _getNonTransformedDimensions() {
                // Object dimensions
                return new fabric.Point(this.width, this.height).scalarAdd(
                    this.padding
                );
            },
            _calculateCurrentDimensions() {
                // Controls dimensions
                return fabric.util.transformPoint(
                    this._getTransformedDimensions(),
                    this.getViewportTransform(),
                    true
                );
            }
        });

        this.hidden = true;
        this.createCommands();

        if (this.panelColor) {
            this.style.setProperty('--color-panel', this.panelColor);
        }

        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('keydown', this.onKeypress.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.onResize.bind(this));
        window.removeEventListener('keydown', this.onKeypress.bind(this));
    }

    private onKeypress(event: KeyboardEvent) {
        if (this.activeObject) {
            const keys = Keyboard.Keys;
            if (event.key === keys.Delete) {
                this.preventEvent(event);
                this.doAction('delete');
                return;
            } else {
                const change: [number, number] = [0, 0];

                if (event.key === keys.ArrowLeft) {
                    change[0] = -1;
                } else if (event.key === keys.ArrowRight) {
                    change[0] = 1;
                } else if (event.key === keys.ArrowUp) {
                    change[1] = -1;
                } else if (event.key === keys.ArrowDown) {
                    change[1] = 1;
                } else {
                    return;
                }

                this.preventEvent(event);

                const left = this.activeObject.left ?? 0;
                const top = this.activeObject.top ?? 0;

                this.activeObject.left = left + change[0];
                this.activeObject.top = top + change[1];
                this.fc?.renderAll();
            }
        }
    }

    private onResize() {
        this.updateSize();
    }

    private createCommands() {
        const language = this.language ?? window.navigator.language;

        EOImageEditorGetLabels(language).then((l) => {
            this._labels = l;

            this.palette.applyLabel = l.ok;

            const commands: EOImageEditorCommand[] = [
                {
                    name: 'undo',
                    icon: '<path d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" />',
                    label: l.undo
                },
                {
                    name: 'redo',
                    icon: '<path d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z" />',
                    label: l.redo
                },
                EOImageEditorSeparator,
                {
                    name: 'zoomIn',
                    icon: '<path d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z" />',
                    label: l.zoomIn
                },
                {
                    name: 'zoomOut',
                    icon: '<path d="M15.5,14H14.71L14.43,13.73C15.41,12.59 16,11.11 16,9.5A6.5,6.5 0 0,0 9.5,3A6.5,6.5 0 0,0 3,9.5A6.5,6.5 0 0,0 9.5,16C11.11,16 12.59,15.41 13.73,14.43L14,14.71V15.5L19,20.5L20.5,19L15.5,14M9.5,14C7,14 5,12 5,9.5C5,7 7,5 9.5,5C12,5 14,7 14,9.5C14,12 12,14 9.5,14M7,9H12V10H7V9Z" />',
                    label: l.zoomOut
                },
                EOImageEditorSeparator,
                {
                    name: 'rotateLeft',
                    icon: '<path d="M13,4.07V1L8.45,5.55L13,10V6.09C15.84,6.57 18,9.03 18,12C18,14.97 15.84,17.43 13,17.91V19.93C16.95,19.44 20,16.08 20,12C20,7.92 16.95,4.56 13,4.07M7.1,18.32C8.26,19.22 9.61,19.76 11,19.93V17.9C10.13,17.75 9.29,17.41 8.54,16.87L7.1,18.32M6.09,13H4.07C4.24,14.39 4.79,15.73 5.69,16.89L7.1,15.47C6.58,14.72 6.23,13.88 6.09,13M7.11,8.53L5.7,7.11C4.8,8.27 4.24,9.61 4.07,11H6.09C6.23,10.13 6.58,9.28 7.11,8.53Z" />',
                    label: l.rotateLeft
                },
                {
                    name: 'rotateRight',
                    icon: '<path d="M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12C4,16.08 7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12C6,9.03 8.16,6.57 11,6.09V10L15.55,5.55Z" />',
                    label: l.rotateRight
                },
                EOImageEditorSeparator,
                {
                    name: 'text',
                    icon: '<path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />',
                    label: l.text
                },
                {
                    name: 'image',
                    icon: '<path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />',
                    label: l.image
                },
                {
                    name: 'crop',
                    icon: cropPath,
                    label: l.crop
                },
                {
                    name: 'filter',
                    icon: '<path d="M12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16M18.7,12.4C18.42,12.24 18.13,12.11 17.84,12C18.13,11.89 18.42,11.76 18.7,11.6C20.62,10.5 21.69,8.5 21.7,6.41C19.91,5.38 17.63,5.3 15.7,6.41C15.42,6.57 15.16,6.76 14.92,6.95C14.97,6.64 15,6.32 15,6C15,3.78 13.79,1.85 12,0.81C10.21,1.85 9,3.78 9,6C9,6.32 9.03,6.64 9.08,6.95C8.84,6.75 8.58,6.56 8.3,6.4C6.38,5.29 4.1,5.37 2.3,6.4C2.3,8.47 3.37,10.5 5.3,11.59C5.58,11.75 5.87,11.88 6.16,12C5.87,12.1 5.58,12.23 5.3,12.39C3.38,13.5 2.31,15.5 2.3,17.58C4.09,18.61 6.37,18.69 8.3,17.58C8.58,17.42 8.84,17.23 9.08,17.04C9.03,17.36 9,17.68 9,18C9,20.22 10.21,22.15 12,23.19C13.79,22.15 15,20.22 15,18C15,17.68 14.97,17.36 14.92,17.05C15.16,17.25 15.42,17.43 15.7,17.59C17.62,18.7 19.9,18.62 21.7,17.59C21.69,15.5 20.62,13.5 18.7,12.4Z" />',
                    label: l.filter
                },
                EOImageEditorSeparator,
                {
                    name: 'hcenter',
                    icon: '<path d="M19,16V13H23V11H19V8L15,12L19,16M5,8V11H1V13H5V16L9,12L5,8M11,20H13V4H11V20Z" />',
                    label: l.hcenter
                },
                {
                    name: 'vcenter',
                    icon: '<path d="M8,19H11V23H13V19H16L12,15L8,19M16,5H13V1H11V5H8L12,9L16,5M4,11V13H20V11H4Z" />',
                    label: l.vcenter
                },
                {
                    name: 'bringToFront',
                    icon: '<path d="M2,2H16V16H2V2M22,8V22H8V18H10V20H20V10H18V8H22Z" />',
                    label: l.bringToFront
                },
                {
                    name: 'bringToBack',
                    icon: '<path d="M2,2H16V16H2V2M22,8V22H8V18H18V8H22M4,4V14H14V4H4Z" />',
                    label: l.bringToBack
                },
                {
                    name: 'delete',
                    icon: '<path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />',
                    label: l.delete
                },
                EOImageEditorSeparator,
                {
                    name: 'preview',
                    icon: '<path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />',
                    label: l.preview
                },
                {
                    name: 'complete',
                    icon: '<path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" />',
                    label: l.complete
                }
            ];

            // For small screens
            if (this.xs) {
                for (let i = commands.length - 1; i >= 0; i--) {
                    if (commands[i].name === 's') {
                        commands.splice(i, 1);
                    }
                }
            }

            const html =
                commands
                    .map((c) =>
                        c.name === 's'
                            ? '<div class="separator"></div>'
                            : `<button name="${c.name}" title="${c.label}">${
                                  c.name === 'image'
                                      ? '<input id="imageFile" type="file" multiple accept="image/*" style="position: absolute; left: -2px; top: -2px; width: 40px; height: 32px; opacity: 0">'
                                      : ''
                              }${this.createSVG(c.icon)}</button>`
                    )
                    .join('') +
                `<label><input type="checkbox" name="pngFormat">PNG</label>`;

            this.icons.innerHTML = html;

            this.pngFormat = this.toolbar.querySelector<HTMLInputElement>(
                'input[name="pngFormat"]'
            )!;

            this.icons.querySelectorAll('button').forEach((b) => {
                b.addEventListener('click', () => {
                    this.doAction(b.name, b);
                });

                if (b.name === 'redo') this.redo = b;
                else if (b.name === 'undo') this.undo = b;
            });

            const loadFile = (file: File) => {
                if (!file.type.startsWith('image/')) return;
                DomUtils.fileToDataURL(file).then((data) => {
                    fabric.Image.fromURL(data, (image) => {
                        const imageState: EOEditorHistoryState = {
                            title: l.image,
                            action: () => {
                                image.lockUniScaling = true;
                                image.setControlsVisibility({
                                    mt: false, // middle top disable
                                    mb: false, // midle bottom
                                    ml: false, // middle left
                                    mr: false // middle right
                                });
                                this.fc?.add(image);
                            },
                            undo: () => this.fc?.remove(image)
                        };
                        imageState.action();
                        this.fc?.setActiveObject(image);
                        this.history?.pushState(imageState);
                    });
                });
            };

            const fileInput =
                this.icons.querySelector<HTMLInputElement>(
                    'input[type="file"]'
                );
            if (fileInput) {
                fileInput.addEventListener('click', () => {
                    fileInput.value = '';
                });
                fileInput.addEventListener('change', () => {
                    const files = fileInput.files;
                    if (files == null || files.length === 0) return;

                    for (let file of files) {
                        loadFile(file);
                    }
                });
            }

            const closeDiv =
                this.modalDiv.querySelector<HTMLDivElement>('.close-button');
            if (closeDiv) {
                closeDiv.title = l.close;
                closeDiv.addEventListener('click', () => this.reset());
            }
        });
    }

    private createSVG(path: string, size: number = 24) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">${path}</svg>`;
    }

    private clear() {
        if (this.fc == null) return;
        this.fc.remove(
            ...this.fc.getObjects('rect').filter((r) => r.name === 'crop')
        );
        this.fc.remove(
            ...this.fc
                .getObjects('i-text')
                .filter(
                    (t) => t instanceof fabric.IText && t.text?.trim() === ''
                )
        );
        this.fc.discardActiveObject().renderAll();
    }

    private setCursor(cursor: string = 'default') {
        const f = this.fc;
        if (f == null) return;

        if (f.defaultCursor === cursor) return;

        f.defaultCursor = cursor;
        if (this.image) this.image.hoverCursor = cursor;
    }

    private _textInput: boolean = false;
    private get textInput() {
        return this._textInput;
    }
    private set textInput(value: boolean) {
        this._textInput = value;
        if (value) this.setCursor('text');
        else this.setCursor();
    }

    private doAction(name: string, b?: HTMLButtonElement) {
        if (this.fc == null) return;
        const o = this.activeObject ?? this.image;
        const l = this.labels!;

        if (['image', 'crop', 'filter'].includes(name)) {
            this.setCursor();
            this.textInput = false;
        }

        switch (name) {
            case 'bringToBack':
                // o?.sendToBack();
                const bringToBackState: EOEditorHistoryState = {
                    title: l.bringToBack,
                    action: () => o?.sendBackwards(true),
                    undo: () => o?.bringForward(true)
                };
                bringToBackState.action();
                this.history?.pushState(bringToBackState);
                break;
            case 'bringToFront':
                // o?.bringToFront();
                const bringToFrontState: EOEditorHistoryState = {
                    title: l.bringToBack,
                    action: () => o?.bringForward(true),
                    undo: () => o?.sendBackwards(true)
                };
                bringToFrontState.action();
                this.history?.pushState(bringToFrontState);
                break;
            case 'complete':
                this.clear();
                const data = this.fc.toDataURL({
                    format: this.pngFormat?.checked ? 'png' : 'jpeg',
                    quality: 1
                });
                if (data) {
                    if (this.callback) this.callback(data);
                }
                this.reset();
                break;
            case 'crop':
                if (o?.type === 'rect' && o.name === 'crop') {
                    // Size
                    const { width, height, left = 0, top = 0 } = o;
                    if (width == null || height == null) return;

                    // Cache sizes
                    const sizes = [
                        this.fc.getWidth(),
                        this.fc.getHeight(),
                        this.originalWidth,
                        this.originalHeight
                    ];

                    const cropState: EOEditorHistoryState = {
                        title: l.crop,
                        action: () => {
                            if (this.fc == null) return;

                            const zoom = this.fc.getZoom();
                            const scaleX = o.scaleX ?? 1;
                            const scaleY = o.scaleY ?? 1;

                            // Take the rect border into account
                            // Otherwise the saved image will have the mask borders
                            const nw = Math.floor(width * zoom * scaleX) - 1;
                            const nh = Math.floor(height * zoom * scaleY) - 1;
                            const nl = Math.ceil(left * zoom) + 1;
                            const nt = Math.ceil(top * zoom) + 1;

                            // Apply
                            // https://stackoverflow.com/questions/44437734/image-clipping-with-visible-overflow-in-fabricjs/44454016#44454016
                            this.fc.clipPath = o;

                            // Size
                            this.fc.setWidth(nw);
                            this.fc.setHeight(nh);
                            this.fc.absolutePan(new fabric.Point(nl, nt));

                            this.originalWidth = width * scaleX;
                            this.originalHeight = height * scaleY;

                            this.updateSize();

                            this.fc.remove(o);
                        },
                        undo: () => {
                            if (this.fc == null) return;

                            this.fc.clipPath = undefined;

                            // Size
                            this.fc.setWidth(sizes[0]!);
                            this.fc.setHeight(sizes[1]!);
                            this.fc.absolutePan(new fabric.Point(0, 0));

                            this.originalWidth = sizes[2];
                            this.originalHeight = sizes[3];

                            this.updateSize();
                        }
                    };
                    cropState.action();
                    this.history?.pushState(cropState);
                } else {
                    this.cropSettings();
                }
                break;
            case 'delete':
                const objs = this.fc.getActiveObjects();
                if (objs) {
                    const deleteState: EOEditorHistoryState = {
                        title: `${l.delete}`,
                        action: () => this.fc?.remove(...objs),
                        undo: () => this.fc?.add(...objs)
                    };
                    deleteState.action();
                    this.history?.pushState(deleteState);
                }
                break;
            case 'filter':
                if (o instanceof fabric.Image) this.filterSettings(o);
                break;
            case 'hcenter':
                if (o) {
                    const hZoom = this.fc?.getZoom() ?? 1;
                    if (hZoom === 1) {
                        o.centerH();
                    } else {
                        const hCenter =
                            ((this.fc.width ?? 0) / hZoom -
                                (o.width ?? 0) * (o.scaleX ?? 1)) /
                            2;
                        o.left = hCenter;
                        this.fc.renderAll();
                    }
                }
                break;
            case 'preview':
                this.clear();
                const pData = this.fc.toDataURL({
                    format: this.pngFormat?.checked ? 'png' : 'jpeg',
                    quality: 1
                });
                if (pData) {
                    const win = window.open();
                    if (win) {
                        //win.document.open();
                        //win.document.write(`<img src="${pData}" />`);
                        //win.document.close();
                        const img = win.document.createElement('img');
                        img.src = pData;
                        win.document.body.appendChild(img);

                        win.document.title = this.labels!.preview;
                    }
                }
                break;
            case 'redo':
                this.history?.forward();
                break;
            case 'rotateLeft':
                if (o) {
                    const rotateLeftState: EOEditorHistoryState = {
                        title: l.rotateLeft,
                        action: () => this.doRotate(o, -90),
                        undo: () => this.doRotate(o, 90)
                    };
                    rotateLeftState.action();
                    this.history?.pushState(rotateLeftState);
                }
                break;
            case 'rotateRight':
                if (o) {
                    const rotateRightState: EOEditorHistoryState = {
                        title: l.rotateRight,
                        action: () => this.doRotate(o, 90),
                        undo: () => this.doRotate(o, -90)
                    };
                    rotateRightState.action();
                    this.history?.pushState(rotateRightState);
                }
                break;
            case 'text':
                this.textInput = true;
                this.textSettings();
                break;
            case 'undo':
                this.history?.back();
                break;
            case 'vcenter':
                if (o) {
                    const vZoom = this.fc?.getZoom() ?? 1;
                    if (vZoom === 1) {
                        o.centerV();
                    } else {
                        const vCenter =
                            ((this.fc.height ?? 0) / vZoom -
                                (o.height ?? 0) * (o.scaleY ?? 1)) /
                            2;
                        o.top = vCenter;
                        this.fc.renderAll();
                    }
                }
                break;
            case 'zoomIn':
                const zi = (this.fc.getZoom() + 0.1).toExact();
                if (zi > 10) return;

                const zoomInState: EOEditorHistoryState = {
                    title: `${l.zoomIn}: ${zi}`,
                    action: () => {
                        this.fc!.setZoom(zi);
                        this.updateZoomSize();
                    },
                    undo: () => {
                        this.fc?.setZoom(zi - 0.1);
                        this.updateZoomSize();
                    }
                };
                zoomInState.action();

                this.history?.pushState(zoomInState);

                break;
            case 'zoomOut':
                const zo = (this.fc.getZoom() - 0.1).toExact();
                if (zo <= 0.1) return;

                const zoomOutState: EOEditorHistoryState = {
                    title: `${l.zoomOut}: ${zo}`,
                    action: () => {
                        this.fc?.setZoom(zo);
                        this.updateZoomSize();
                    },
                    undo: () => {
                        this.fc!.setZoom(zo + 0.1);
                        this.updateZoomSize();
                    }
                };
                zoomOutState.action();

                this.history?.pushState(zoomOutState);

                break;
        }

        this.fc?.renderAll();
    }

    private updateZoomSize() {
        const fc = this.fc;
        if (
            fc == null ||
            this.originalWidth == null ||
            this.originalHeight == null
        )
            return;

        const zoom = fc.getZoom();
        fc.setWidth(this.originalWidth * zoom);
        fc.setHeight(this.originalHeight * zoom);

        this.updateSize();
    }

    private findFilter(item: any, name: string) {
        const type: string = item.type;
        if (type === 'Convolute') {
            const matrix = item.matrix;
            if (name === 'Emboss' && matrix === embossMatrix) return true;
            if (name === 'Sharpen' && matrix === sharpenMatrix) return true;
            return false;
        }

        return type === name;
    }

    private cropSettings() {
        const fname = 'crop';
        if (this.isSettingShowing(fname)) return;

        const layout = ['*', '1:1', '2:1', '3:2', '4:3', '5:4', '7:5', '16:9']
            .map(
                (r) =>
                    `<button class="vflex">${this.createSVG(
                        cropPath,
                        20
                    )}<span>${r}</span></button>`
            )
            .join('');

        this.showSettings(layout, fname, 'flex');

        this.settings
            .querySelectorAll<HTMLInputElement>('button')
            .forEach((button) => {
                button.addEventListener('click', () => {
                    if (this.fc == null) return;

                    // Size
                    const zoom = this.fc.getZoom();

                    if (this.fc.width == null || this.fc.height == null) return;
                    const width = (this.fc.width / zoom).toExact(0);
                    const height = (this.fc.height / zoom).toExact(0);

                    // Ratio
                    let rText = button.querySelector('span')?.innerText;
                    if (rText == null) return;

                    let rw: number, rh: number, rl: number, rt: number;

                    const custom = rText === '*';
                    const rItems = custom
                        ? [1, 1]
                        : rText.split(':').map((i) => parseFloat(i));
                    const w = rItems[0];
                    const h = rItems[1];

                    if (w / h > width / height) {
                        // More height
                        rw = width;
                        rl = 0;
                        rh = ((rw * h) / w).toExact(0);
                        rt = (height - rh) / 2;
                    } else {
                        // More width
                        rh = height;
                        rt = 0;
                        rw = ((rh * w) / h).toExact(0);
                        rl = (width - rw) / 2;
                    }

                    if (this.fc.clipPath) {
                        rl += this.fc.clipPath.left ?? 0;
                        rt += this.fc.clipPath.top ?? 0;
                    }

                    // http://jsfiddle.net/a7mad24/aPLq5/
                    const rect = new fabric.Rect({
                        width: rw,
                        height: rh,
                        left: rl,
                        top: rt,
                        fill: '#fff',
                        opacity: 0.2,
                        //fill: 'transparent',
                        //stroke: '#ff0000',
                        //strokeDashArray: [5, 5],
                        name: 'crop'
                    });

                    if (custom) {
                        rect.lockUniScaling = false;
                    } else {
                        rect.lockUniScaling = true;
                        rect.setControlsVisibility({
                            mt: false, // middle top disable
                            mb: false, // midle bottom
                            ml: false, // middle left
                            mr: false // middle right
                        });
                    }

                    this.fc.add(rect);
                    rect.bringToFront();
                    this.fc.setActiveObject(rect);

                    // Scroll to here
                    this.container.scrollTop = rt;
                    this.container.scrollLeft = rl;

                    this.showSettings('');
                });
            });
    }

    private filterSettings(o: fabric.Image) {
        const fname = 'filter';
        if (this.isSettingShowing(fname)) return;

        const filters = o.filters ?? [];
        const fd: {
            name: string;
            value?: [number, number, number];
            property?: string;
        }[] = [
            { name: 'Grayscale' },
            { name: 'Invert' },
            { name: 'Brownie' },
            { name: 'Vintage' },
            { name: 'Kodachrome' },
            { name: 'Technicolor' },
            { name: 'Polaroid' },
            { name: 'Sharpen' },
            { name: 'Emboss' },
            {
                name: 'Brightness',
                value: [-1, 1, 0.2]
            },
            {
                name: 'Saturation',
                value: [0, 1, 0.1]
            },
            {
                name: 'Contrast',
                value: [-1, 1, 0.2]
            },
            {
                name: 'Vibrance',
                value: [-1, 1, 0.2]
            },
            {
                name: 'HueRotation',
                value: [-1, 1, 0.2],
                property: 'rotation'
            },
            {
                name: 'Blur',
                value: [0, 1, 0.1]
            },
            {
                name: 'Noise',
                value: [0, 400, 20]
            },
            {
                name: 'Pixelate',
                value: [1, 20, 1],
                property: 'blocksize'
            }
        ];
        const l = this.labels!;
        const layout = fd
            .map((f) => {
                const filter = filters.find((item: any) =>
                    this.findFilter(item, f.name)
                );
                const v = f.value;
                const n = Utils.formatInitial(f.name, false);

                return `<label${
                    v == null ? ' class="span2"' : ''
                }><input type="checkbox"${
                    filter == null ? '' : ' checked'
                } name="${f.name}"/>${Reflect.get(l, n)}</label>${
                    v == null
                        ? ''
                        : ` <input type="range" data-property="${
                              f.property ?? ''
                          }" name="${f.name}-value" min="${v[0]}" max="${
                              v[1]
                          }" step="${v[2]}"${
                              filter == null
                                  ? ' disabled'
                                  : ` value="${
                                        Reflect.get(filter, f.property ?? n) ??
                                        ''
                                    }"`
                          }/>`
                }`;
            })
            .join('');
        this.showSettings(layout, fname, 'form');

        const f = fabric.Image.filters;

        this.settings
            .querySelectorAll<HTMLInputElement>('input')
            .forEach((input) => {
                input.addEventListener('input', () => {
                    let name = input.name;
                    let property: string | undefined;
                    let value: number | null = null;
                    let checked: boolean;
                    if (name.endsWith('-value')) {
                        name = name.substring(0, name.length - 6);
                        value = input.valueAsNumber;
                        property = input.dataset['property'];
                        checked = true;
                    } else {
                        checked = input.checked;
                        const valueInput =
                            this.settings.querySelector<HTMLInputElement>(
                                `input[name="${name}-value"]`
                            );
                        if (valueInput) {
                            valueInput.disabled = !checked;
                            property = valueInput.dataset['property'];
                            value = valueInput.valueAsNumber;
                        }
                    }

                    const fi = filters.findIndex((item: any) =>
                        this.findFilter(item, name)
                    );
                    let filter = fi === -1 ? undefined : filters[fi];

                    if (checked) {
                        if (filter == null) {
                            if (name === 'Emboss') {
                                filter = new f.Convolute({
                                    matrix: embossMatrix
                                });
                            } else if (name === 'Sharpen') {
                                filter = new f.Convolute({
                                    matrix: sharpenMatrix
                                });
                            } else {
                                const fc = Reflect.get(f, name);
                                filter = new fc();
                            }
                            if (o.filters == null) o.filters = [filter!];
                            else o.filters.push(filter!);
                        }
                        if (value != null) {
                            const p = property
                                ? property
                                : Utils.formatInitial(name, false);
                            Reflect.set(filter!, p, value);
                        }
                    } else {
                        filters.splice(fi, 1);
                    }

                    o.applyFilters();
                    this.fc?.renderAll();
                });
            });
    }

    private imageSettings(o: fabric.Image) {
        const layout = `<label>${this.labels?.opacity} <input type="range" name="opacity" value="${o.opacity}" min="0.1" max="1" step="0.1"/></label>`;

        this.showSettings(layout, 'image', 'flex');

        const opacityInput = this.settings.querySelector<HTMLInputElement>(
            'input[name="opacity"]'
        );
        opacityInput?.addEventListener('input', () => {
            o.opacity = opacityInput.valueAsNumber;
            this.fc?.renderAll();
        });
    }

    private getTextSettings() {
        if (this.isSettingShowing('text', false)) {
            const shadowColorInput =
                this.settings.querySelector<HTMLInputElement>(
                    'input[name="shadowColor"]'
                );
            let shadow: fabric.Shadow | undefined;
            const color = shadowColorInput?.value;
            if (color) {
                const offsetX =
                    this.settings.querySelector<HTMLInputElement>(
                        'input[name="shadowOffsetX"]'
                    )?.valueAsNumber ?? 1;
                const offsetY =
                    this.settings.querySelector<HTMLInputElement>(
                        'input[name="shadowOffsetY"]'
                    )?.valueAsNumber ?? 1;
                const blur =
                    this.settings.querySelector<HTMLInputElement>(
                        'input[name="shadowOffsetBlur"]'
                    )?.valueAsNumber ?? 0;

                shadow = new fabric.Shadow({
                    color,
                    offsetX,
                    offsetY,
                    blur
                });
            }

            return {
                fontFamily: this.settings.querySelector<HTMLSelectElement>(
                    'select[name="fontFamily"]'
                )?.value,
                fontWeight: this.settings.querySelector<HTMLInputElement>(
                    'input[name="fontWeight"]'
                )?.valueAsNumber,
                opacity: this.settings.querySelector<HTMLInputElement>(
                    'input[name="opacity"]'
                )?.valueAsNumber,
                padding: this.settings.querySelector<HTMLInputElement>(
                    'input[name="padding"]'
                )?.valueAsNumber,
                fill: this.settings
                    .querySelector<HTMLInputElement>('input[name="fill"]')
                    ?.value.trim(),
                backgroundColor: this.settings
                    .querySelector<HTMLInputElement>('input[name="bgColor"]')
                    ?.value.trim(),
                fontStyle: (this.settings.querySelector<HTMLInputElement>(
                    'input[name="italic"]'
                )?.checked
                    ? 'italic'
                    : 'normal') as any,
                underline: this.settings.querySelector<HTMLInputElement>(
                    'input[name="underline"]'
                )?.checked,
                linethrough: this.settings.querySelector<HTMLInputElement>(
                    'input[name="linethrough"]'
                )?.checked,
                shadow
            };
        }
        return undefined;
    }

    private textSettings(o?: fabric.IText) {
        const l = this.labels!;

        let shadow = o?.shadow
            ? typeof o.shadow === 'string'
                ? new fabric.Shadow(o.shadow)
                : o.shadow
            : undefined;

        const shadowLayout = o
            ? `<label><span>${
                  l.shadow
              }:</span><input type="text" name="shadowColor" title="${
                  l.color
              }" value="${shadow?.color ?? ''}"/>
        </label><input type="range" name="shadowOffsetX" title="${
            l.offsetX
        }" value="${shadow?.offsetX ?? 1}" min="-10" max="10" step="1"/>
  <input type="range" name="shadowOffsetY" title="${l.offsetY}" value="${
      shadow?.offsetY ?? 1
  }" min="-10" max="10" step="1"/>
  <input type="range" name="shadowBlur" title="${l.blur}" value="${
      shadow?.blur ?? 0
  }" min="0" max="15" step="1"/>`
            : '';

        const layout = `<label><span>${
            l.fontFamily
        }:</span><select name="fontFamily">${this.fonts
            .sort()
            .map((f) => `<option>${f}</option>`)
            .join('')}</select>
        </label><label><span>${
            l.fontWeight
        }:</span><input type="range" name="fontWeight" value="${
            o?.fontWeight ?? 100
        }" min="100" max="1000" step="100"/></label>
        <label><span>${
            l.opacity
        }:</span><input type="range" name="opacity" value="${
            o?.opacity ?? 1
        }" min="0.1" max="1" step="0.1"/></label>
        <label><span>${
            l.padding
        }:</span><input type="number" name="padding" value="${
            o?.padding ?? 0
        }" min="0" max="100" step="1"/></label>
        <label><span>${l.color}:</span><input type="text" name="fill" value="${
            o?.fill ?? '#000'
        }"/></label>
        <label><span>${
            l.bgColor
        }:</span><input type="text" name="bgColor" value="${
            o?.backgroundColor ?? ''
        }"/></label>
        <label><input type="checkbox" name="italic"${
            o?.fontStyle === 'italic' ? ' checked' : ''
        }/>${l.italic}</label>
        <label><input type="checkbox" name="underline"${
            o?.underline ? ' checked' : ''
        }/>${l.underline}</label>
        <label><input type="checkbox" name="linethrough"${
            o?.linethrough ? ' checked' : ''
        }/>${l.strikethrough}</label>${shadowLayout}`;

        this.showSettings(layout, 'text', 'flex');

        const fontFamilySelect = this.settings.querySelector<HTMLSelectElement>(
            'select[name="fontFamily"]'
        );

        const fontWeightInput = this.settings.querySelector<HTMLInputElement>(
            'input[name="fontWeight"]'
        );

        const opacityInput = this.settings.querySelector<HTMLInputElement>(
            'input[name="opacity"]'
        );

        const paddingInput = this.settings.querySelector<HTMLInputElement>(
            'input[name="padding"]'
        );

        const italicInput = this.settings.querySelector<HTMLInputElement>(
            'input[name="italic"]'
        );

        const underlineInput = this.settings.querySelector<HTMLInputElement>(
            'input[name="underline"]'
        );

        const linethroughInput = this.settings.querySelector<HTMLInputElement>(
            'input[name="linethrough"]'
        );

        const shadowColorInput = this.settings.querySelector<HTMLInputElement>(
            'input[name="shadowColor"]'
        );

        if (o) {
            if (fontFamilySelect) {
                if (o.fontFamily) fontFamilySelect.value = o.fontFamily;
                fontFamilySelect.addEventListener('change', () => {
                    o.fontFamily = fontFamilySelect.value;
                    this.fc?.renderAll();
                });
            }

            fontWeightInput?.addEventListener('input', () => {
                o.fontWeight = fontWeightInput.valueAsNumber;
                this.fc?.renderAll();
            });

            opacityInput?.addEventListener('input', () => {
                o.opacity = opacityInput.valueAsNumber;
                this.fc?.renderAll();
            });

            paddingInput?.addEventListener('input', () => {
                o.padding = paddingInput.valueAsNumber;
                this.fc?.renderAll();
            });

            italicInput?.addEventListener('change', () => {
                o.fontStyle = italicInput.checked ? 'italic' : 'normal';
                this.fc?.renderAll();
            });

            underlineInput?.addEventListener('change', () => {
                //o.underline = underlineInput.checked;
                o.set('underline', underlineInput.checked);
                this.fc?.renderAll();
            });

            linethroughInput?.addEventListener('change', () => {
                // o.linethrough = linethroughInput.checked;
                o.set('linethrough', linethroughInput.checked);
                this.fc?.renderAll();
            });

            if (shadowColorInput) {
                this.palette.setupInput(shadowColorInput);
                shadowColorInput.addEventListener('change', () => {
                    shadowColorInput.dispatchEvent(new Event('input'));
                });

                const shadowOffsetXInput =
                    this.settings.querySelector<HTMLInputElement>(
                        'input[name="shadowOffsetX"]'
                    );
                const shadowOffsetYInput =
                    this.settings.querySelector<HTMLInputElement>(
                        'input[name="shadowOffsetY"]'
                    );
                const shadowBlurInput =
                    this.settings.querySelector<HTMLInputElement>(
                        'input[name="shadowBlur"]'
                    );

                [
                    shadowColorInput,
                    shadowOffsetXInput,
                    shadowOffsetYInput,
                    shadowBlurInput
                ].forEach((input) => {
                    input?.addEventListener('input', () => {
                        const color = shadowColorInput.value.trim();
                        if (!color) return;

                        if (shadow == null) {
                            shadow = new fabric.Shadow({
                                color,
                                offsetX: shadowOffsetXInput?.valueAsNumber,
                                offsetY: shadowOffsetYInput?.valueAsNumber,
                                blur: shadowBlurInput?.valueAsNumber
                            });
                            o.shadow = shadow;
                        } else {
                            const name = input.name;
                            switch (name) {
                                case 'shadowOffsetX':
                                    shadow.offsetX =
                                        shadowOffsetXInput?.valueAsNumber;
                                    break;
                                case 'shadowOffsetY':
                                    shadow.offsetY =
                                        shadowOffsetYInput?.valueAsNumber;
                                    break;
                                case 'shadowBlur':
                                    shadow.blur =
                                        shadowBlurInput?.valueAsNumber;
                                    break;
                                default:
                                    shadow.color = color;
                                    break;
                            }
                        }

                        this.fc?.renderAll();
                    });
                });
            }
        }

        const fillInput =
            this.settings.querySelector<HTMLInputElement>('input[name="fill"]');
        if (fillInput) {
            this.palette.setupInput(fillInput);

            if (o) {
                fillInput.addEventListener('change', () => {
                    o.set('fill', fillInput.value);
                    this.fc?.renderAll();
                });
            }
        }

        const bgColorInput = this.settings.querySelector<HTMLInputElement>(
            'input[name="bgColor"]'
        );
        if (bgColorInput) {
            this.palette.setupInput(bgColorInput);

            if (o) {
                bgColorInput.addEventListener('change', () => {
                    o.set('backgroundColor', bgColorInput.value);
                    this.fc?.renderAll();
                });
            }
        }
    }

    private showSettings(html: string, name?: string, className?: string) {
        this.settings.innerHTML = html;
        this.settings.style.visibility = html === '' ? 'hidden' : 'visible';
        this.settings.dataset['name'] = name;

        this.settings.classList.forEach((c, _k, p) => {
            if (c === 'settings') return;
            p.remove(c);
        });
        if (className) {
            this.settings.classList.add(className);
        }
    }

    private isSettingShowing(name: string, clear: boolean = true) {
        if (this.settings.dataset['name'] === name) {
            if (this.settings.hasChildNodes()) {
                if (clear) this.showSettings('');
                return true;
            }
        }
        return false;
    }

    private doRotate(o: fabric.Object, angle: number) {
        let na = (o.angle ?? 0) + angle;
        if (na >= 360) na -= 360;
        else if (na < 0) na += 360;

        o.rotate(na).setCoords();

        const i = this.image;
        // Main image
        if (o == i) {
            const w = i.width ?? 0;
            const h = i.height ?? 0;
            if (na === 90 || na === 270) {
                this.fc?.setDimensions({
                    width: h,
                    height: w
                });

                if (na === 90) {
                    this.image?.setPositionByOrigin(
                        new fabric.Point(h, 0),
                        'left',
                        'top'
                    );
                } else {
                    this.image?.setPositionByOrigin(
                        new fabric.Point(0, w),
                        'left',
                        'top'
                    );
                }
            } else {
                this.fc?.setDimensions({
                    width: w,
                    height: h
                });

                if (na === 0) {
                    this.image?.setPositionByOrigin(
                        new fabric.Point(0, 0),
                        'left',
                        'top'
                    );
                } else {
                    this.image?.setPositionByOrigin(
                        new fabric.Point(w, h),
                        'left',
                        'top'
                    );
                }
            }

            this.updateSize();
        }
    }

    private setPngFormat(src: string) {
        if (this.pngFormat) {
            this.pngFormat.checked =
                src.slice(-4).toLocaleLowerCase() === '.png' ||
                src
                    .substring(0, 15)
                    .toLocaleLowerCase()
                    .startsWith('data:image/png');
        }
    }

    addImage(image: fabric.Image) {
        const w = image.width;
        const h = image.height;
        if (w == null || h == null) return;

        this.fc = new fabric.Canvas(this.canvas, {
            controlsAboveOverlay: true,
            width: w,
            height: h
        });

        image.name = 'editingImage';
        image.selectable = false;
        image.hoverCursor = 'default';
        this.fc.add(image);

        this.image = image;

        ExtendUtils.waitFor(
            () => {
                this.setup();
            },
            () => {
                if (this.container.offsetWidth > 0) {
                    const scrollbarWidth =
                        this.container.offsetWidth - this.container.clientWidth;

                    this.style.setProperty(
                        '--close-button-right',
                        scrollbarWidth > 0 ? `${scrollbarWidth + 8}px` : '8px'
                    );
                    return true;
                } else {
                    return false;
                }
            }
        );
    }

    /**
     * Open editor
     * http://fabricjs.com/fabric-filters
     * @param img Image to edit
     * @param callback Callback when doen
     */
    open(img: HTMLImageElement | null, callback?: (data: string) => void) {
        this.callback = callback;
        this.fc?.clear();

        if (img) {
            // default fabric.textureSize is 2048 x 2048, 4096 x 4096 probably support
            const maxSize = 2048;
            fabric.textureSize = maxSize;

            if (img.width > maxSize || img.height > maxSize) {
                ImageUtils.resize(img, ImageUtils.calcMax(img, maxSize)).then(
                    (canvas) => {
                        this.setPngFormat(img.src);
                        const image = new fabric.Image(canvas);
                        this.addImage(image);
                    }
                );
            } else {
                const image = new fabric.Image(img);
                this.setPngFormat(img.src);
                this.addImage(image);
            }
        } else {
            this.toolbar.style.visibility = 'hidden';
            this.imageSize();
        }

        this.hidden = false;
    }

    private imageSize() {
        const l = this.labels!;
        const html = `<div class="grid">
            <div class="grid-title">${l.imageSize}</div>
            <label for="width">${l.width}</label>
            <input type="number" id="width" value="800" min="10" max="2000"/>
            <label for="height">${l.height}</label>
            <input type="number" id="height" value="600" min="10" max="2000"/>
            <label for="bgColor">${l.bgColor}</label>
            <input type="text" id="bgColor" value="#ffffff"/>
            <button class="full-width" name="apply">${l.ok}</button>
        </div>`;

        this.popup.show(html);

        const bgColorInput =
            this.popup.querySelector<HTMLInputElement>('#bgColor')!;
        this.palette.setupInput(bgColorInput);

        this.popup
            .querySelector('button[name="apply"]')
            ?.addEventListener('click', () => {
                const widthInput =
                    this.popup.querySelector<HTMLInputElement>('#width')!;
                if (widthInput.value === '') {
                    widthInput.focus();
                    return;
                }

                const heightInput =
                    this.popup.querySelector<HTMLInputElement>('#height')!;
                if (heightInput.value === '') {
                    heightInput.focus();
                    return;
                }

                if (bgColorInput.value === '') {
                    bgColorInput.focus();
                    return;
                }

                this.popup.hide();

                this.fc = new fabric.Canvas(this.canvas, {
                    controlsAboveOverlay: true,
                    width: widthInput.valueAsNumber,
                    height: heightInput.valueAsNumber,
                    backgroundColor: bgColorInput.value
                });

                if (bgColorInput.value === 'transparent') {
                    if (this.pngFormat) this.pngFormat.checked = true;
                }

                this.setup();

                this.toolbar.style.visibility = 'visible';
            });
    }

    /**
     * Reset editor
     */
    reset() {
        this.settings.innerHTML = '';
        this.fc?.dispose();
        this.fc = undefined;
        this.hidden = true;
        this.container.style.visibility = 'hidden';
        this.history?.clear();
        this.history = undefined;
    }

    private setup() {
        const fc = this.fc!;

        this.container.style.visibility = 'visible';

        this.originalWidth = this.fc?.width;
        this.originalHeight = this.fc?.height;

        this.updateSize();
        this.updateStatus();

        if (this.redo && this.undo) {
            if (this.history == null) {
                this.history = new EOEditorHistory();

                const updateStatus = () => {
                    const h = this.history!;
                    const status = h.getStatus();

                    const u = this.undo!;
                    const r = this.redo!;
                    u.disabled = !status[0];
                    r.disabled = !status[1];

                    const pState = h.states[h.index - 1];
                    const nState = h.states[h.index + 1];

                    u.title = u.disabled || pState == null ? '' : pState.title;
                    r.title = r.disabled || nState == null ? '' : nState.title;
                };

                this.history.on('navigate', (e) => {
                    updateStatus();

                    const index = this.history!.index;
                    const d = e.data.delta;

                    // Only one step
                    if (d > 0) {
                        const state = this.history?.states[index - d + 1];
                        state?.action.call(this);
                    } else {
                        const state = this.history?.states[index - d];
                        state?.undo.call(this);
                    }
                });
                this.history.on('push', () => {
                    updateStatus();
                });
            } else {
                this.history.clear();
            }

            this.redo.disabled = true;
            this.undo.disabled = true;

            this.history.pushState({
                title: 'Start',
                action: () => {},
                undo: () => {}
            });
        }

        fc.on('selection:created', (e) => {
            this.activeObject = fc.getActiveObject();
            this.updateStatus();
        });

        fc.on('selection:cleared', () => {
            this.activeObject = undefined;
            this.updateStatus();
            this.showSettings('');
        });

        fc.on('selection:updated', () => {
            this.activeObject = fc.getActiveObject();
            this.updateStatus();
        });

        let objectLastPos: [fabric.Object, number?, number?] | undefined;
        let movingIndicator: fabric.IText | undefined;
        fc.on('object:moving', (e) => {
            if (objectLastPos == null && e.target) {
                objectLastPos = [e.target, e.target.left, e.target.top];
            }

            if (this.activeObject) {
                const zoom = this.fc?.getZoom() ?? 1;
                if (movingIndicator == null) {
                    movingIndicator = new fabric.IText('', {
                        fontSize: 9 / zoom
                    });
                    this.fc?.add(movingIndicator);
                }
                const {
                    left = 0,
                    top = 0,
                    width = 0,
                    scaleX = 1,
                    height = 0,
                    scaleY = 1
                } = this.activeObject;

                const fcWidth = (this.fc?.width ?? 0) / zoom;
                const fcHeight = (this.fc?.height ?? 0) / zoom;

                const oWidth = width * scaleX;
                const oHeight = height * scaleY;

                if (Math.abs((fcWidth - oWidth) / 2 - left) < 1) {
                    movingIndicator.set('fill', '#ff0000');
                } else {
                    movingIndicator.set('fill', '#000');
                }

                if (Math.abs((fcHeight - oHeight) / 2 - top) < 1) {
                    movingIndicator.set('backgroundColor', '#ffff00');
                } else {
                    movingIndicator.set('backgroundColor', undefined);
                }

                movingIndicator.text = `${(left * zoom).toExact(0)} x ${(
                    top * zoom
                ).toExact(0)}`;
                movingIndicator.left = (left + oWidth / 2 + 4).toExact(0);
                movingIndicator.top = (
                    top <= 30 ? top + 8 + oHeight : top - 22
                ).toExact(0);
                this.fc?.renderAll();
            }
        });

        let objectLastScale: [fabric.Object, number?, number?] | undefined;
        fc.on('object:scaling', (e) => {
            if (objectLastScale == null && e.target) {
                objectLastScale = [e.target, e.target.scaleX, e.target.scaleY];
            }
        });

        let objectLastRotate: [fabric.Object, number?] | undefined;
        fc.on('object:rotating', (e) => {
            if (objectLastRotate == null && e.target) {
                objectLastRotate = [e.target, e.target.angle];
            }
        });

        fc.on('mouse:up', (e) => {
            // Moving
            if (objectLastPos) {
                const [mObject, pLeft, pTop] = objectLastPos;
                const { left, top } = mObject;
                const moveState: EOEditorHistoryState = {
                    title: 'Move',
                    action: () => {
                        mObject.left = left;
                        mObject.top = top;
                    },
                    undo: () => {
                        mObject.left = pLeft;
                        mObject.top = pTop;
                    }
                };
                this.history?.pushState(moveState);

                objectLastPos = undefined;
            }

            if (movingIndicator) {
                this.fc?.remove(movingIndicator);
                movingIndicator = undefined;
            }

            // Scaling
            if (objectLastScale) {
                const [sObject, sx, sy] = objectLastScale;
                const { scaleX, scaleY } = sObject;

                const scaleState: EOEditorHistoryState = {
                    title: 'Scale',
                    action: () => {
                        sObject.scaleX = scaleX;
                        sObject.scaleY = scaleY;
                    },
                    undo: () => {
                        sObject.scaleX = sx;
                        sObject.scaleY = sy;
                    }
                };
                this.history?.pushState(scaleState);

                objectLastScale = undefined;
            }

            // Rotating
            if (objectLastRotate) {
                const [sObject, sa] = objectLastRotate;
                const { angle } = sObject;

                const rotateState: EOEditorHistoryState = {
                    title: 'Rotate',
                    action: () => {
                        sObject.angle = angle;
                    },
                    undo: () => {
                        sObject.angle = sa;
                    }
                };
                this.history?.pushState(rotateState);

                objectLastRotate = undefined;
            }

            // Text
            if (this.textInput) {
                const zoom = this.fc!.getZoom();
                let left: number, top: number;
                if (e.pointer) {
                    left = (e.pointer.x / zoom).toExact(0);
                    top = (e.pointer.y / zoom).toExact(0);
                } else {
                    left = 0;
                    top = 0;
                }

                const settings = this.getTextSettings();

                const itext = new fabric.IText(this.labels!.inputHere, {
                    left,
                    top,
                    ...settings
                });

                let text: string | undefined = itext.text;

                itext.on('editing:entered', () => {
                    text = itext.text;
                });

                itext.on('editing:exited', () => {
                    const oldText = text ?? '';
                    const newText = itext.text ?? '';
                    if (oldText !== newText) {
                        const editedState: EOEditorHistoryState = {
                            title: this.labels?.text!,
                            action: () => (itext.text = newText),
                            undo: () => (itext.text = oldText)
                        };
                        this.history?.pushState(editedState);
                    }
                });

                const textState: EOEditorHistoryState = {
                    title: this.labels?.text!,
                    action: () => {
                        fc.add(itext);
                        fc.setActiveObject(itext);
                    },
                    undo: () => {
                        this.fc?.remove(itext);
                    }
                };
                textState.action();

                itext.enterEditing();
                itext.selectAll();

                this.history?.pushState(textState);

                this.textInput = false;
            }
        });

        fc.on('mouse:dblclick', () => {
            if (
                this.activeObject?.type === 'rect' &&
                this.activeObject.name === 'crop'
            ) {
                this.doAction('crop');
            } else if (this.activeObject == null) {
                const imageInput =
                    this.icons.querySelector<HTMLInputElement>(
                        'input#imageFile'
                    );
                imageInput?.click();
            }
        });
    }

    private updateStatus() {
        const a = this.activeObject;
        const o = a ?? this.image;
        if (o == null) {
            [
                'rotateLeft',
                'rotateRight',
                'bringToBack',
                'bringToFront',
                'crop',
                'filter',
                'hcenter',
                'vcenter',
                'delete'
            ].forEach((n) => {
                const b = this.icons.querySelector<HTMLButtonElement>(
                    `button[name="${n}"]`
                );
                if (b) b.disabled = true;
            });
        } else {
            ['rotateLeft', 'rotateRight'].forEach((n) => {
                const b = this.icons.querySelector<HTMLButtonElement>(
                    `button[name="${n}"]`
                );
                if (b) b.disabled = false;
            });

            [
                'hcenter',
                'vcenter',
                'bringToBack',
                'bringToFront',
                'delete'
            ].forEach((n) => {
                const b = this.icons.querySelector<HTMLButtonElement>(
                    `button[name="${n}"]`
                );
                if (b) b.disabled = this.activeObject == null;
            });

            const isImage = o instanceof fabric.Image;
            const isText = a instanceof fabric.IText;
            if (a instanceof fabric.Image) {
                this.imageSettings(a);
            } else if (isText) {
                this.textSettings(a);
            }

            ['filter'].forEach((n) => {
                const b = this.icons.querySelector<HTMLButtonElement>(
                    `button[name="${n}"]`
                );
                if (b) b.disabled = !isImage;
            });
        }
    }

    private updateSize() {
        const w = this.fc?.getWidth();
        const h = this.fc?.getHeight();
        if (w == null || h == null) return;

        this.fcSize = [w, h];

        this.modalDiv.querySelector<HTMLDivElement>(
            '.size-indicator'
        )!.innerHTML = `${NumberUtils.format(
            w.toExact(0)
        )} x ${NumberUtils.format(h.toExact(0))} px`;

        const c = this.container.getBoundingClientRect();
        this.containerRect = c;

        const rect = this.mover.parentElement!.getBoundingClientRect();
        this.rect = rect;

        const wr = c.width >= w ? 1 : c.width / w;
        const hr = c.height >= h ? 1 : c.height / h;
        const rw = rect.width * wr - 2;
        const rh = rect.height * hr - 2;

        this.mover.style.width = `${rw}px`;
        this.mover.style.height = `${rh}px`;
    }
}

customElements.get('eo-popup') || customElements.define('eo-popup', EOPopup);
customElements.get('eo-palette') ||
    customElements.define('eo-palette', EOPalette);
