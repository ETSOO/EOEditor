/**
 * Size
 */
export interface Size {
  /**
   * Width
   */
  width: number;

  /**
   * Height
   */
  height: number;
}

/**
 * Image utilies
 */
export namespace ImageUtils {
  /**
   * Calcuate max size
   * @param source Source size
   * @param maxSize Max size
   * @returns Result
   */
  export function calcMax(source: Size, maxSize: number): Size {
    if (source.width > maxSize || source.height > maxSize) {
      const wr = source.width / maxSize;
      const hr = source.height / maxSize;
      if (hr > wr) {
        return {
          width: source.width / hr,
          height: maxSize
        };
      } else {
        return {
          width: maxSize,
          height: source.height / wr
        };
      }
    } else {
      return source;
    }
  }

  /**
   * Resize
   * @param source Source
   * @param size Target size
   * @param quality Quality
   * @returns Canvas
   */
  export async function resize(
    // For Blob, createImageBitmap(blob)
    source: HTMLCanvasElement | HTMLImageElement | ImageBitmap,
    size: Size,
    quality?: 0 | 1 | 2 | 3
  ) {
    // Dynamic load pica
    const pica = (await import("pica")).default;

    // Canvas
    const to = document.createElement("canvas");
    to.width = size.width;
    to.height = size.height;

    // pica instance
    const pi = pica();
    return await pi.resize(source, to, {
      quality,
      unsharpAmount: 160,
      unsharpRadius: 0.6,
      unsharpThreshold: 1
    });
  }
}
