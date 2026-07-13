import { EOButton } from "./components/EOButton";
import { EOImageEditor } from "./components/EOImageEditor";
import { EOEditor } from "./EOEditor";

/**
 * Register custom elements for EOEditor
 */
export function EOEditorDefine() {
  customElements.get("eo-button") ||
    customElements.define("eo-button", EOButton, { extends: "button" });
  customElements.get("eo-image-editor") ||
    customElements.define("eo-image-editor", EOImageEditor);
  customElements.get("eo-editor") ||
    customElements.define("eo-editor", EOEditor);
}
