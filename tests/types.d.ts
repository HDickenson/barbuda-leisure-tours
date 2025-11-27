declare module 'pngjs' {
  export class PNG {
    static sync: {
      read(buffer: Buffer): PNG;
      write(png: PNG): Buffer;
    };
    static bitblt(src: PNG, dst: PNG, srcX: number, srcY: number, width: number, height: number, dstX: number, dstY: number): void;

    width: number;
    height: number;
    data: Buffer;

    constructor(options?: { width?: number; height?: number });
  }
}

declare module 'pixelmatch' {
  function pixelmatch(
    img1: Buffer,
    img2: Buffer,
    output: Buffer | null,
    width: number,
    height: number,
    options?: { threshold?: number }
  ): number;

  export = pixelmatch;
}
