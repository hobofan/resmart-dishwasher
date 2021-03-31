import React from "react";
import path from "path";

import JscadRenderer from "@landaujs/landau";

const outputPath = {
  path: path.join(__dirname, "../output/toasty.stl"),
};

// Based on the drawing for "Raspberry Pi 3B"
// https://www.raspberrypi.org/documentation/hardware/raspberrypi/mechanical/README.md
const RaspberryPiBoard3B = () => {
  const boardWidth = 56;
  const boardLength = 85;
  const boardHeight = 2; // TODO: ?

  const boardCornerRadius = 3;

  // X offset of the center point of the mounting holes
  const mountingHolesXOffset = 3.5;
  // Y offset of the two outer mounting holes
  const mountingHolesYOffsetOuter = mountingHolesXOffset;
  // Y offset of the two inner mounting holes
  const mountingHolesYOffsetInner = mountingHolesXOffset + 58;
  const mountingHolesRadius = 2.75 / 2;

  const peripheralsYOverhang = 2.25;

  const ethernetWidth = 15.25;
  const ethernetLength = 21.5;
  const ethernetHeight = 13.5;
  const ethernetXOffset = 10.25;

  const usbPortWidth = 13;
  const usbPortLength = 17.5;
  const usbPortHeight = 16;
  const usbPort1XOffset = 29;
  const usbPort2XOffset = 47;

  return (
    <union>
      <align modes={["min", "min", "max"]}>
        <subtract>
          <align modes={["min", "min", "min"]}>
            <CircuitBoard
              size={[boardWidth, boardLength, boardHeight]}
              cornerRadius={boardCornerRadius}
            />
          </align>
          <MountingHoles
            boardSize={[boardWidth, boardLength, boardHeight]}
            mountingHolesXOffset={mountingHolesXOffset}
            mountingHolesYOffsetOuter={mountingHolesYOffsetOuter}
            mountingHolesYOffsetInner={mountingHolesYOffsetInner}
            mountingHolesRadius={mountingHolesRadius}
          />
        </subtract>
      </align>
      <EthernetPort
        size={[ethernetWidth, ethernetLength, ethernetHeight]}
        xOffset={ethernetXOffset}
        yOverhang={peripheralsYOverhang}
      />
      <UsbPorts
        portSize={[usbPortWidth, usbPortLength, usbPortHeight]}
        port1XOffset={usbPort1XOffset}
        port2XOffset={usbPort2XOffset}
        yOverhang={peripheralsYOverhang}
      />
    </union>
  );
};

const CircuitBoard = ({ size, cornerRadius }) => {
  const [width, length, height] = size;
  return (
    <extrudeLinear height={height}>
      <roundedRectangle size={[width, length]} roundRadius={cornerRadius} />
    </extrudeLinear>
  );
};

const MountingHoles = ({
  mountingHolesRadius,
  mountingHolesXOffset,
  mountingHolesYOffsetOuter,
  mountingHolesYOffsetInner,
  boardSize,
}) => {
  const [boardWidth, boardLength, boardHeight] = boardSize;
  return (
    <union>
      <cylinder
        height={boardHeight * 3}
        center={[
          boardWidth - mountingHolesXOffset,
          boardLength - mountingHolesYOffsetOuter,
          0,
        ]}
        mountingHolesRadius={mountingHolesRadius}
      />
      <cylinder
        height={boardHeight * 3}
        center={[
          mountingHolesXOffset,
          boardLength - mountingHolesYOffsetOuter,
          0,
        ]}
        mountingHolesRadius={mountingHolesRadius}
      />
      <cylinder
        height={boardHeight * 3}
        center={[
          boardWidth - mountingHolesXOffset,
          boardLength - mountingHolesYOffsetInner,
          0,
        ]}
        mountingHolesRadius={mountingHolesRadius}
      />
      <cylinder
        height={boardHeight * 3}
        center={[
          mountingHolesXOffset,
          boardLength - mountingHolesYOffsetInner,
          0,
        ]}
        mountingHolesRadius={mountingHolesRadius}
      />
    </union>
  );
};

const EthernetPort = ({ size, xOffset, yOverhang }) => {
  const [_, length, height] = size;

  return (
    <cuboid
      size={size}
      center={[xOffset, length / 2 - yOverhang, height / 2]}
    />
  );
};

const UsbPorts = ({ portSize, port1XOffset, port2XOffset, yOverhang }) => {
  const [_, length, height] = portSize;

  const UsbPort = ({ xOffset }) => {
    return (
      <cuboid
        size={portSize}
        center={[xOffset, length / 2 - yOverhang, height / 2]}
      />
    );
  };
  return (
    <union>
      <UsbPort xOffset={port1XOffset} />
      <UsbPort xOffset={port2XOffset} />
    </union>
  );
};

JscadRenderer.render(<RaspberryPiBoard3B />, outputPath);
