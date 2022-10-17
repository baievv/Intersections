import React, { useEffect, useRef, useState } from "react";
import "./app.css";
import Canvas from "../canvas";

const App: React.FC = () => {
  return (
    <main role="main" className="container">
      <Canvas width={700} height={500} />
    </main>
  );
};

export default App;
