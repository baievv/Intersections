import findIntersections from "./app/utils/intersection";

export interface IPoint {
  x: number;
  y: number;
}
export interface ILine {
  a: IPoint;
  b: IPoint;
}

export interface ILineCoef {
  k: number;
  b: number;
  step: number;
}

export enum MouseButton {
  Left,
  Right,
}

export class Lines {
  canva: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canva = canvas;
    this.context = canvas!.getContext("2d");
  }

  items: ILine[] = [];
  itemsCoef: ILineCoef[] = [];
  fps: number = 20;
  steps: number = 0;
  delayTimeout: number = 0;
  delay: number = 2000;
  nowPoint: IPoint = { x: 0, y: 0 };
  intersectPoints: IPoint[] = [];
  flag: boolean = false;
  nowLine: ILine | null = null;

  addNowPoint(x1: number, y1: number) {
    this.nowPoint = { x: x1, y: y1 };
  }
  addNowLine(end: IPoint) {
    this.nowLine = { a: this.nowPoint, b: end };
  }
  addLine(end: IPoint) {
    let line: ILine = { a: this.nowPoint, b: end };
    this.items.push(line);
  }

  mouseClick(button: MouseButton, point: IPoint) {
    if (!this.flag && button == MouseButton.Left) {
      this.addNowPoint(point.x, point.y);
      this.flag = true;
      return;
    }
    if (this.flag && button == MouseButton.Left) {
      this.addLine(point);
      this.flag = false;
      this.items.map((item) => {
        let res = findIntersections(item, this.nowLine!);
        if (res.x !== -1) {
          this.intersectPoints.push(res);
        }
      });

      return;
    }
    if (this.flag && button == MouseButton.Right) {
      this.flag = false;
      this.context!.clearRect(0, 0, this.canva.width, this.canva.height);
      this.draw();
    }
  }

  drawPoints(
    ctx: CanvasRenderingContext2D = this.context!,
    pointsArr: IPoint[] = this.intersectPoints
  ) {
    pointsArr.map((item) => {
      let circle = new Path2D();
      circle.moveTo(item.x, item.y);
      circle.arc(item.x, item.y, 5, 0, 2 * Math.PI);
      ctx.fill(circle);
    });
  }

  drawLines(
    ctx: CanvasRenderingContext2D = this.context!,
    lineArr: ILine[] = this.items
  ) {
    lineArr.map((item) => {
      ctx.beginPath();
      ctx.moveTo(item.a.x, item.a.y);
      ctx.lineTo(item.b.x, item.b.y);
      ctx.stroke();
      ctx.closePath();
    });
  }
  decreaseLine(
    items: ILine[] = this.items,
    itemsC: ILineCoef[] = this.itemsCoef
  ) {
    let line: ILine[] = [];
    for (let i = 0; i < itemsC.length; i++) {
      let newAX: number = items[i].a.x + itemsC[i].step;
      let newBX: number = items[i].b.x - itemsC[i].step;
      let newAY: number = itemsC[i].k * newAX + itemsC[i].b;
      let newBY = itemsC[i].k * newBX + itemsC[i].b;
      line.push({ a: { x: newAX, y: newAY }, b: { x: newBX, y: newBY } });
    }
    return line;
  }

  decrease() {
    let temp: ILine[] = this.decreaseLine();
    this.items = [...temp];
  }

  draw() {
    this.drawLines();
    this.drawPoints();
  }

  collapse(items: ILine[] = this.items) {
    this.itemsCoef = [];
    items.map((item) => {
      let k: number = (item.b.y - item.a.y) / (item.b.x - item.a.x);
      let b: number = item.b.y - item.b.x * k;
      let step = (item.b.x - item.a.x) / ((this.delay * this.fps) / 500);
      this.itemsCoef.push({ k, b, step });
    });
    this.delayTimeout = Math.round(1000 / this.fps);
    this.steps = Math.round((this.delay * this.fps) / 1000);
  }

  mouseMove(ctx: CanvasRenderingContext2D = this.context!, point: IPoint) {
    ctx.clearRect(0, 0, this.canva.width, this.canva.height);
    this.draw();
    ctx.beginPath();
    ctx.moveTo(this.nowPoint.x, this.nowPoint.y);
    ctx.lineTo(point.x, point.y);
    let a: IPoint = { x: this.nowPoint.x, y: this.nowPoint.y };
    this.nowLine = { a, b: point };
    ctx.stroke();
    ctx.closePath();
    this.items.map((item) => {
      let res = findIntersections(item, this.nowLine!);
      if (res.x !== -1) {
        let circle = new Path2D();
        circle.moveTo(res.x, res.y);
        circle.arc(res.x, res.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill(circle);
      }
    });
  }
}
