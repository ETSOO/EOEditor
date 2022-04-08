/**
 * EOEditor Image Editor
 */
export class EOImageEditor extends HTMLElement {
    // Modal div
    modalDiv: HTMLDivElement;

    constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                }
                .wrapper {
                    position: fixed;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: gray;
                    opacity: 1;
                    visibility: visible;
                    transform: scale(1.1);
                    transition: visibility 0s linear .25s,opacity .25s 0s,transform .25s;
                    z-index: 1000;
                }
                .modal {
                    position: fixed;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                }
            </style>
            <div class="wrapper">
                <div class="modal"></div>
            </div>
        `;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content);

        this.modalDiv = shadowRoot.querySelector('div.modal')!;
    }

    connectedCallback() {
        this.hidden = true;
    }

    disconnectedCallback() {}
}
