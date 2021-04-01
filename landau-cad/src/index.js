import React from "react";
import path from "path";

import JscadRenderer from "@landaujs/landau";
import { RaspberryPi3B } from "@hobofan/landau-rpi";

const outputPath = {
  path: path.join(__dirname, "../output/rpi3b.stl"),
};

const Composite = () => {
  return <RaspberryPi3B />;
};

JscadRenderer.render(<Composite />, outputPath);
