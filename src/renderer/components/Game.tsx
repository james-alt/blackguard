import * as React from "react";
import * as Phaser from "phaser";
import BootScene from "../scenes/BootScene";
import NewGameScene from "../scenes/NewGameScene";
import DungeonScene from "../scenes/DungeonScene";
import MenuScene from "../scenes/MenuScene";
import styled from "styled-components";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const config: GameConfig = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  render: {
    pixelArt: true,
  },
  scene: [BootScene, NewGameScene, DungeonScene, MenuScene],
  parent: "game",
  backgroundColor: 0x444444,
};

function Game(): React.ReactNode {
  React.useEffect(() => {
    new Phaser.Game(config);
  });

  return (
    <>
      <div id="game" />
      <VBorder style={{ right: 288, backgroundColor: "#666" }} />
      <VBorder style={{ right: 289, backgroundColor: "#333" }} />
      <QRCode id="qr-code" />
    </>
  );
}

const VBorder = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 2px;
  z-index: 1;
`;

const QRCode = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  border-top: 2px solid #666;
`;

export default Game;
