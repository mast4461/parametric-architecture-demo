interface Vec2 {
  x: number;
  y: number;
}

export class BoundingBox {
  public readonly x1: number;
  public readonly y1: number;
  public readonly x2: number;
  public readonly y2: number;
  public readonly w: number;
  public readonly h: number;

  constructor(x1: number, y1: number, w: number, h: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x1 + w;
    this.y2 = y1 + h;
    this.w = w;
    this.h = h;
  }

  public static bounds(bbs: BoundingBox[]): BoundingBox {
    const allX = bbs.flatMap(bb => [bb.x1, bb.x2]);
    const allY = bbs.flatMap(bb => [bb.y1, bb.y2]);
    const x = Math.min(...allX);
    const y = Math.min(...allY);
    const w = Math.max(...allX) - x;
    const h = Math.max(...allY) - y;
    return new BoundingBox(x, y, w, h);
  }

  /**
   * 
   * @param k weight, from 0 to 1
   */
  public splitX(k: number): BoundingBox[] {
    const xm = (1-k) * this.x1 + k * this.x2;
    return [
      new BoundingBox(this.x1, this.y1, xm - this.x1, this.h),
      new BoundingBox(xm, this.y1, this.x2 - xm, this.h),
    ];
  }

  /**
   * 
   * @param k weight, from 0 to 1
   */
  public splitY(k: number): BoundingBox[] {
    const ym = (1-k) * this.y1 + k * this.y2;
    return [
      new BoundingBox(this.x1, this.y1, this.w, ym - this.y1),
      new BoundingBox(this.x1, ym, this.w, this.y2 - ym),
    ];
  }

  /**
   * 
   * @param splitCount integer
   */
  public splitEvenlyX(splitCount: number): BoundingBox[] {
    const dx = (this.x2 - this.x1) / splitCount;
    
    return Array(splitCount).fill(this.x1).map((x1, i) => new BoundingBox(
      x1 + i * dx,
      this.y1,
      dx,
      this.h,
    ));
  }

  /**
   * 
   * @param splitCount integer
   */
  public splitEvenlyY(splitCount: number): BoundingBox[] {
    const dy = (this.y2 - this.y1) / splitCount;
    
    return Array(splitCount).fill(this.y1).map((y1, i) => new BoundingBox(
      this.x1,
      y1 + i * dy,
      this.w,
      dy,
    ));
  }

  public cellsX(maxCellSize: number): BoundingBox[] {
    const n = Math.ceil(this.w / maxCellSize);
    return this.splitEvenlyX(n);
  }

  public cellsY(maxCellSize: number): BoundingBox[] {
    const n = Math.ceil(this.h / maxCellSize);
    return this.splitEvenlyY(n);
  }

  public gridX(maxCellSize: number, gridLineWidth: number): BoundingBox[] {
    const nSpaces = Math.ceil(this.w / maxCellSize);
    gridLineWidth = Math.min(gridLineWidth, this.w / (nSpaces - 1));

    const dxg = (this.w + gridLineWidth) / nSpaces;
    return Array(nSpaces - 1).fill(this.x1 + dxg - gridLineWidth).map((x, i) =>
      new BoundingBox(x + i * dxg, this.y1, gridLineWidth, this.h)
    );
  }

  public gridY(maxCellSize: number, gridLineWidth: number): BoundingBox[] {
    return this.transpose().gridX(maxCellSize, gridLineWidth).map(bb => bb.transpose());
  }

  public transpose(): BoundingBox {
    return new BoundingBox(this.y1, this.x1, this.h, this.w);
  }

  private runTransposed(fn: (bbs: BoundingBox[]) => BoundingBox[], bbs: BoundingBox[]): BoundingBox[] {
    const bbst = bbs.map(bb => bb.transpose());
    const resultt = fn(bbst);
    return resultt.map(bbt => bbt.transpose());
  }

  public splitBorders(opts: {t: number, r: number, b: number, l: number}): {
    c: BoundingBox,
    t: BoundingBox,
    r: BoundingBox,
    b: BoundingBox,
    l: BoundingBox,
  } {
    const {
      t = 0,
      r = 0,
      b = 0,
      l = 0,
    } = opts;

    const xa = this.x1;
    const xb = this.x1 + l;
    const xc = this.x2 - r;

    const ya = this.y1;
    const yb = this.y1 + b;
    const yc = this.y2 - t;

    const mh = this.h - t - b;

    return {
      c: new BoundingBox(xb, yb, xc - xb, mh),
      t: new BoundingBox(xa, yc, this.w, t),
      r: new BoundingBox(xc, yb, r, mh),
      b: new BoundingBox(xa, ya, this.w, b),
      l: new BoundingBox(xa, yb, l, mh),
    }
  }
}