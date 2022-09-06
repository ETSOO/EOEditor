/**
 * EOEditor Popup
 */
export class EOPopup extends HTMLElement {
    // Layout update timeout seed
    private updateSeed: number = 0;

    constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    position: absolute;
                    background-color: #fff;
                    border-radius: 4px;
                    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
                    z-index: 990;
                    user-select: none;
                }
            </style>
            <slot></slot>
        `;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content);

        document.addEventListener('mousedown', this.clickHandler.bind(this));
    }

    private updatePos(location?: DOMRect) {
        const { clientWidth: maxWidth, clientHeight: maxHeight } =
            window.document.body;

        const prect: DOMRect = this.getBoundingClientRect();

        const rect =
            location ??
            new DOMRect(
                (maxWidth - prect.width) / 2,
                (maxHeight - prect.height) / 2,
                0,
                0
            );

        // Left
        let left = rect.left;

        if (left + prect.width > maxWidth) {
            // Right
            left = rect.right - prect.width;
            if (left < 0) {
                // Middle
                left = rect.left - (prect.width - rect.width) / 2;

                // Still more than screen width (16px spacing considered to avoid too close to right side)
                const gap = 8;
                const stillMore = left + prect.width + gap - maxWidth;
                if (stillMore > 0) {
                    left -= stillMore;
                }

                if (left < gap) left = gap;
            }
        }

        this.style.left = `${window.scrollX + left}px`;
        this.style.top = `${window.scrollY + rect.bottom + 2}px`;
    }

    private clickHandler(event: MouseEvent) {
        // https://stackoverflow.com/questions/57963312/get-event-target-inside-a-web-component
        const cp = event.composedPath();
        if (
            this.style.visibility === 'hidden' ||
            cp.includes(this) ||
            (this.nodeName !== 'EO-PALETTE' &&
                cp.some(
                    (p) =>
                        p instanceof HTMLElement &&
                        (p.nodeName === 'EO-PALETTE' ||
                            p.nodeName === 'EO-IMAGE-EDITOR')
                ))
        ) {
            return;
        }
        this.hide();
    }

    connectedCallback() {
        this.hide();
    }

    disconnectedCallback() {
        document.removeEventListener('mousedown', this.clickHandler.bind(this));
        this.clearUpdateSeed();
    }

    /**
     * Hide the popup
     */
    hide() {
        //console.trace();
        this.style.visibility = 'hidden';
    }

    /**
     * Is visible
     * @returns result
     */
    isVisible() {
        return this.style.visibility === 'visible';
    }

    private clearUpdateSeed() {
        if (this.updateSeed > 0) {
            window.clearTimeout(this.updateSeed);
            this.updateSeed = 0;
        }
    }

    /**
     * Reshow the popup
     */
    reshow() {
        this.style.visibility = 'visible';
    }

    /**
     * Show the popup
     * @param message Message
     * @param location Location deciding rect
     * @param ready Ready callback
     */
    show(message: string, location?: DOMRect, ready?: () => void) {
        this.clearUpdateSeed();
        this.innerHTML = message;

        this.updateSeed = window.setTimeout(() => {
            this.updatePos(location);
            this.reshow();
            if (ready) ready();
        }, 20);
    }
}
