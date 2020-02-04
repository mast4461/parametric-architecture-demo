export class Rect {
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

  /**
   * 
   * @param splitCount integer
   */
  public splitEvenlyX(splitCount: number): Rect[] {
    const dx = (this.x2 - this.x1) / splitCount;
    
    return Array(splitCount).fill(this.x1).map((x1, i) => new Rect(
      x1 + i * dx,
      this.y1,
      dx,
      this.h,
    ));
  }
}