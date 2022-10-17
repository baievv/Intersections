import React, { useState, useEffect, useRef } from "react";
import { IPoint, Lines, MouseButton } from "../Lines";
import "./canvas.css";

type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const Canvas: React.FC<CanvasProps> = ({ ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lines, setLines] = useState<Lines>();

  const handlerUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    let buttonType: MouseButton | null = null;
    if (event.button == 0) {
      buttonType = MouseButton.Left;
    } else if (event.button == 2) {
      buttonType = MouseButton.Right;
    }
    let point: IPoint = { x: event.clientX - 10, y: event.clientY - 10 };
    lines!.mouseClick(buttonType!, point);
  };

  const handlerMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (lines?.flag) {
      let x = event.clientX - 10;
      let y = event.clientY - 10;
      lines?.mouseMove(lines.context!, { x, y });
    }
  };

  const onCollapse = () => {
    lines?.collapse();
    let i = 1;
    let timerId = setInterval(function () {
      lines?.decrease();
      lines!.context?.clearRect(0, 0, lines!.canva.width, lines!.canva.height);
      lines!.draw();
      if (i == lines!.steps - 1) lines!.intersectPoints = [];
      if (i == lines!.steps) {
        clearInterval(timerId);
      }
      i++;
    }, lines?.delayTimeout);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    setLines(new Lines(canvas));
  }, []);

  return (
    <>
      <div className="canvas_item">
        <canvas
          width={props.width}
          height={props.height}
          onMouseUp={handlerUp}
          onMouseMove={handlerMove}
          ref={canvasRef}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <button className="collapse_button" onClick={onCollapse}>
        collapse lines
      </button>
    </>
  );
};

export default Canvas;
