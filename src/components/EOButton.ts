/**
 * Tooltip div
 */
let tooltipDiv: HTMLElement | null;

/**
 * EOEditor extended button
 */
export class EOButton extends HTMLButtonElement {
    /**
     * Tooltip
     */
    get tooltip() {
        return this.getAttribute('tooltip');
    }
    set tooltip(value: string | null) {
        if (value) this.setAttribute('tooltip', value);
        else this.removeAttribute('tooltip');
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener('mouseenter', this.showTooltip.bind(this));
        this.addEventListener('mouseleave', this.hideTooltip.bind(this));
        this.addEventListener('mousedown', this.hideTooltip.bind(this));
    }

    disconnectedCallback() {
        this.hideTooltip();
        this.removeEventListener('mouseenter', this.showTooltip.bind(this));
        this.removeEventListener('mouseleave', this.hideTooltip.bind(this));
        this.removeEventListener('mousedown', this.hideTooltip.bind(this));
    }

    hideTooltip() {
        if (tooltipDiv == null) return;
        tooltipDiv.hidden = true;
    }

    showTooltip() {
        if (this.tooltip == null) return;

        if (tooltipDiv == null) {
            document.head.insertAdjacentHTML(
                'beforeend',
                `<style>
                    #EOEditorTooltipDiv {
                        position: absolute;
                        font-size: 12px;
                        padding: 4px 8px;
                        background: #000;
                        color: #fff;
                        z-index: 1000;
                        white-space: nowrap;
                        user-select: none;
                    }
                    #EOEditorTooltipDiv:after {
                        content: '';
                        position: absolute;
                        margin-left: calc(-50% + 4px);
                        margin-top: -12px;
                        z-index: 1000;
                        color: #fff;
                        border: 4px solid transparent;	
                        border-bottom: 4px solid #000;
                    }
                    #EOEditorTooltipDiv.tooltip-start:after {
                        content: '';
                        position: absolute;
                        margin-left: calc(-100% + 19px);
                        margin-top: -12px;
                        z-index: 1000;
                        color: #fff;
                        border: 4px solid transparent;	
                        border-bottom: 4px solid #000;
                    }
                    #EOEditorTooltipDiv.tooltip-end:after {
                        content: '';
                        position: absolute;
                        margin-left: -11px;
                        margin-top: -12px;
                        z-index: 1000;
                        color: #fff;
                        border: 4px solid transparent;	
                        border-bottom: 4px solid #000;
                    }
                </style>`
            );

            tooltipDiv = document.createElement('div');
            tooltipDiv.id = 'EOEditorTooltipDiv';
            document.documentElement.appendChild(tooltipDiv);
        }

        tooltipDiv.innerHTML = this.tooltip;
        tooltipDiv.hidden = false;
        const divRect = tooltipDiv.getBoundingClientRect();

        const rect = this.getBoundingClientRect();

        // Middle
        let left = rect.left - (divRect.width - rect.width) / 2;
        if (left < 0) {
            // Left
            left = rect.left;
            tooltipDiv.classList.add('tooltip-start');
        } else {
            tooltipDiv.classList.remove('tooltip-start');

            if (left + divRect.width > window.innerWidth) {
                // Right
                left = rect.right - divRect.width;
                tooltipDiv.classList.add('tooltip-end');
            } else {
                tooltipDiv.classList.remove('tooltip-end');
            }
        }

        tooltipDiv.style.left = `${window.scrollX + left}px`;
        tooltipDiv.style.top = `${window.scrollY + rect.bottom + 4}px`;
    }
}

customElements.define('eo-button', EOButton, { extends: 'button' });
