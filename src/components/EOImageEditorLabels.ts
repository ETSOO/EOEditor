import { DomUtils } from "@etsoo/shared";

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

const zhHans = DomUtils.zhHans<EOImageEditorLabelLanguage>(async () => {
  const labels = await import("./i18n/zh-Hans.json");
  return labels.default ?? labels;
});

const zhHant = DomUtils.zhHans<EOImageEditorLabelLanguage>(async () => {
  const labels = await import("./i18n/zh-Hant.json");
  return labels.default ?? labels;
});

const en = DomUtils.zhHans<EOImageEditorLabelLanguage>(async () => {
  const labels = await import("./i18n/en.json");
  return labels.default ?? labels;
});

/**
 * EOEditor Image Editor get labels
 * @param language Language
 * @returns Language labels
 */
export async function EOImageEditorGetLabels(language: string) {
  const culture = DomUtils.getCulture([en, zhHans, zhHant], language)[0] ?? en;
  if (typeof culture.resources === "object") return culture.resources;
  else return await culture.resources();
}
