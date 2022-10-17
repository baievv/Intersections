import { IPoint, ILine } from "../../Lines";

export default function findIntersections(line1: ILine, line2: ILine): IPoint {
  let point: IPoint;
  if (line1.b.x < line1.a.x) {
    let tmp: IPoint = line1.a;
    line1.a = line1.b;
    line1.b = tmp;
  }
  if (line2.b.x < line2.a.x) {
    let tmp: IPoint = line2.a;
    line2.a = line2.b;
    line2.b = tmp;
  }

  if (line1.b.x < line2.a.x) return { x: -1, y: -1 };
  if (line1.a.x - line1.b.x === 0 && line2.a.x - line2.b.x === 0) {
    return { x: -1, y: -1 };
  }

  if (line1.a.x - line1.b.x === 0) {
    let Xa: number = line1.a.x;
    let A2 = (line2.a.y - line2.b.y) / (line2.a.x - line2.b.x);
    let b2 = line2.a.y - A2 * line2.a.x;
    let Ya = A2 * Xa + b2;
    if (
      line2.a.x <= Xa &&
      line2.b.x >= Xa &&
      Math.min(line1.a.y, line1.b.y) <= Ya &&
      Math.max(line1.b.y, line1.a.y) >= Ya
    ) {
      return (point = { x: Xa, y: Ya });
    } else return { x: -1, y: -1 };
  }

  if (line2.a.x - line2.b.x === 0) {
    let Xa: number = line2.a.x;
    let A1 = (line1.a.y - line1.b.y) / (line1.a.x - line1.b.x);
    let b1 = line1.a.y - A1 * line1.a.x;
    let Ya = A1 * Xa + b1;
    if (
      line1.a.x <= Xa &&
      line1.b.x >= Xa &&
      Math.min(line2.a.y, line2.b.y) <= Ya &&
      Math.max(line2.b.y, line2.a.y) >= Ya
    ) {
      return (point = { x: Xa, y: Ya });
    } else return { x: -1, y: -1 };
  }

  let A1 = (line1.a.y - line1.b.y) / (line1.a.x - line1.b.x);
  let A2 = (line2.a.y - line2.b.y) / (line2.a.x - line2.b.x);
  let b1 = line1.a.y - A1 * line1.a.x;
  let b2 = line2.a.y - A2 * line2.a.x;

  if (A1 == A2) return { x: -1, y: -1 };
  let Xa = (b2 - b1) / (A1 - A2);
  if (
    Xa < Math.max(line1.a.x, line2.a.x) ||
    Xa > Math.min(line1.b.x, line2.b.x)
  ) {
    return { x: -1, y: -1 };
  } else {
    let Ya = A1 * Xa + b1;
    return (point = { x: Xa, y: Ya });
  }
}
