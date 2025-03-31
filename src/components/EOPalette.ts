import { EColor } from "@etsoo/shared";
import { EOPopup } from "./EOPopup";

/**
 * Favorite colors key
 */
const FavoriteColorsKey = "EOEditor-Favorite-Colors";

// Add to colors
function addToColors(colors: string[], colorText: string) {
  const color = EColor.parse(colorText)?.toRGBColor();
  if (color) colors.push(color);
}

// Get colors from stylesheet declarations
function getColors(doc: Document) {
  const colors: string[] = [];
  const sheets = doc.styleSheets;
  for (let c = 0; c < sheets.length; c++) {
    const sheet = sheets.item(c);
    if (sheet == null) continue;

    // CORS security rules are applicable for style-sheets
    try {
      for (let r = 0; r < sheet.cssRules.length; r++) {
        const rule = sheet.cssRules[r] as CSSStyleRule;
        if ("style" in rule) {
          addToColors(colors, rule.style.color);
          addToColors(colors, rule.style.backgroundColor);
          addToColors(colors, rule.style.borderColor);
        }
      }
    } catch {}
  }
  return colors;
}

function getPointColor(event: MouseEvent) {
  const ctx = (event.target as HTMLCanvasElement).getContext("2d")!;
  const data = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
  return `rgb(${data.slice(0, 3).join(", ")})`;
}

function createColorStrip(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;

  ctx.rect(0, 0, width, height);
  var grd1 = ctx.createLinearGradient(0, 0, 0, height);
  grd1.addColorStop(0, "rgb(255, 0, 0)");
  grd1.addColorStop(0.17, "rgb(255, 255, 0)");
  grd1.addColorStop(0.34, "rgb(0, 255, 0)");
  grd1.addColorStop(0.51, "rgb(0, 255, 255)");
  grd1.addColorStop(0.68, "rgb(0, 0, 255)");
  grd1.addColorStop(0.85, "rgb(255, 0, 255)");
  grd1.addColorStop(1, "rgb(255, 0, 0)");
  ctx.fillStyle = grd1;
  ctx.fill();
}

/**
 * EOEditor Palette
 */
export class EOPalette extends EOPopup {
  /**
   * Style reference document
   */
  refDocument?: Document;

  // Refered colors
  private referedColors?: string[];

  /**
   * Apply label
   */
  get applyLabel() {
    return this.getAttribute("applyLabel");
  }
  set applyLabel(value: string | null) {
    if (value) this.setAttribute("applyLabel", value);
    else this.removeAttribute("applyLabel");
  }

  constructor() {
    super();
  }

  connectedCallback() {
    if (this.refDocument) {
      this.referedColors = getColors(this.refDocument);
    }
  }

  disconnectedCallback() {
    this.hide();
  }

  /**
   * Popup palette
   * @param color Default color
   * @param callback Callback
   * @param rect Display location
   * @param hexColor Return Hex color
   */
  popup(
    color: string | null | undefined,
    callback: (color: string) => void,
    rect?: DOMRect,
    hexColor?: boolean
  ) {
    // Favorite colors
    const textFavoriteColors = window.localStorage.getItem(FavoriteColorsKey);

    const favoriteColors: string[] = textFavoriteColors
      ? JSON.parse(textFavoriteColors)
      : [];

    // CSS defined colors
    const colors = [
      ...new Set<string>([
        ...favoriteColors,
        ...(this.referedColors ?? []),
        "transparent",
        new EColor(0, 0, 0).toRGBColor(),
        new EColor(255, 255, 255).toRGBColor(),
        new EColor(255, 0, 0).toRGBColor(),
        new EColor(0, 255, 0).toRGBColor(),
        new EColor(0, 0, 255).toRGBColor(),
        new EColor(0, 255, 255).toRGBColor(),
        new EColor(255, 255, 0).toRGBColor(),
        new EColor(255, 0, 255).toRGBColor()
      ])
    ];

    const html = `<style>
            .content1 {
                font-size: 12px;
                padding: 1em;
            }
            .preview {
                display: flex;
                gap: 6px;
            }
            .box {
                flex-grow: 2;
                border: 1px solid #ccc;
                background-color: ${color};
            }
            .color-more {
                margin-top: 6px;
                display: flex;
                width: 290px;
                flex-wrap: wrap;
                gap: 4px;
            }
                .color-more .color-circle {
                    width: 24px;
                    height: 24px;
                    border: 1px solid #ccc;
                    border-radius: 50%;
                    cursor: pointer;
                    text-align: center;
                    line-height: 22px;
                    vertical-align: middle;
                }
            .color-container {
                display: flex;
                gap: 5px;
                margin-top: 6px;
                width: 290px;
                height: 200px;
            }
        </style>
        <div class="content1">
            <div class="preview">
                <div class="box"></div>
                <input size="12" value="${color}" />
                <button style="min-width: 60px;">${
                  this.applyLabel ?? "Apply"
                }</button>
            </div>
            <div class="color-more">${colors
              .map(
                (c) =>
                  `<div class="color-circle" style="background-color: ${c}">${
                    c === "transparent" ? "T" : ""
                  }</div>`
              )
              .join("")}</div>
            <div class="color-container">
                <div id="color-preview" style="height: 200; width: 40px;"></div>
                <canvas id="color-block" height="200" width="200"></canvas>
                <canvas id="color-strip" height="200" width="40"></canvas>
            </div>
        </div>`;

    this.show(html, rect, () => {});

    const previewDiv = this.querySelector<HTMLDivElement>("div.preview")!;
    const div = previewDiv.querySelector<HTMLDivElement>("div.box")!;

    const input = previewDiv.querySelector("input")!;
    input.addEventListener("change", () => {
      div.style.backgroundColor = input.value;
    });

    const button = previewDiv.querySelector("button")!;
    button.addEventListener("click", () => {
      const colorText = input.value.trim();
      if (!colorText) {
        input.focus();
        return;
      }

      const color = EColor.format(colorText, hexColor);
      if (color == null) {
        input.focus();
        return;
      }

      returnColor(color);
    });

    const returnColor = (color: string) => {
      // Add to favorite colors
      const index = favoriteColors.indexOf(color);
      if (index !== 0) {
        if (index !== -1) {
          favoriteColors.splice(index, 1);
        }

        favoriteColors.unshift(color);
        if (favoriteColors.length > 16) favoriteColors.pop();

        window.localStorage.setItem(
          FavoriteColorsKey,
          JSON.stringify(favoriteColors)
        );
      }

      callback(color);

      this.hide();
    };

    const colorPreview = this.querySelector<HTMLDivElement>("#color-preview")!;

    const colorBlock =
      this.querySelector<HTMLCanvasElement>("canvas#color-block")!;
    const ctx = colorBlock.getContext("2d")!;

    const previewColor = (event: MouseEvent) => {
      const color = getPointColor(event);
      colorPreview.style.backgroundColor = color;
    };

    const setColor = (event: MouseEvent) => {
      const color = getPointColor(event);
      div.style.backgroundColor = color;
      input.value = color;
      return color;
    };

    colorBlock.addEventListener("mousemove", previewColor);
    colorBlock.addEventListener("click", setColor);

    this.querySelectorAll<HTMLDivElement>("div.color-circle").forEach((div) => {
      div.addEventListener("click", () => {
        const color = EColor.format(div.style.backgroundColor, hexColor);
        if (color) returnColor(color);
      });
    });

    const colorStrip =
      this.querySelector<HTMLCanvasElement>("canvas#color-strip")!;
    colorStrip.addEventListener("click", (event) => {
      const color = setColor(event);
      fillGradient(color);
    });
    colorStrip.addEventListener("mousemove", previewColor);

    createColorStrip(colorStrip);

    const fillGradient = (color: string) => {
      colorPreview.style.backgroundColor = color;

      const { width, height } = colorBlock;

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);

      var grdWhite = ctx.createLinearGradient(0, 0, width, 0);
      grdWhite.addColorStop(0, "rgba(255,255,255,1)");
      grdWhite.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grdWhite;
      ctx.fillRect(0, 0, width, height);

      var grdBlack = ctx.createLinearGradient(0, 0, 0, height);
      grdBlack.addColorStop(0, "rgba(0,0,0,0)");
      grdBlack.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = grdBlack;
      ctx.fillRect(0, 0, width, height);
    };

    fillGradient("rgba(255,0,0,1)");
  }

  /**
   * Setup input choose and preview
   * @param input Input
   * @param hexColor Return Hex color
   */
  setupInput(input: HTMLInputElement, hexColor?: boolean) {
    input.addEventListener("click", () => {
      this.popup(
        input.value,
        (color) => {
          input.value = color;
          input.style.borderColor = color;
          input.dispatchEvent(new Event("change"));
        },
        undefined,
        hexColor
      );
      this.style.zIndex = "992";
    });
    input.addEventListener("change", () => {
      input.style.borderColor = input.value;
    });
    input.dispatchEvent(new Event("change"));
  }
}
