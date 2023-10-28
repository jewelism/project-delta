import * as Phaser from 'phaser';

import { StartScene } from '@/phaser/scenes/StartScene';
import { MultiplayLobbyScene } from '@/phaser/scenes/MultiplayLobbyScene';

const config: Phaser.Types.Core.GameConfig = {
  title: 'project alpha',
  url: 'jewelism.github.io',
  type: Phaser.WEBGL,
  // type: Phaser.CANVAS,
  scale: {
    // mode: Phaser.Scale.FIT,
    mode: Phaser.Scale.ENVELOP,
    width: Number(import.meta.env.RENDERER_VITE_WINDOW_WIDTH),
    height: Number(import.meta.env.RENDERER_VITE_WINDOW_HEIGHT),
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  parent: 'body',
  render: { pixelArt: true, antialias: false },
  dom: {
    createContainer: true,
  },
  scene: [
    StartScene,
    MultiplayLobbyScene,
    // InGameScene,
  ],
  // backgroundColor: '#222',
  // fps: {
  //   target: 10,
  //   forceSetTimeOut: true,
  // },
};

export const createPhaser = () => new Phaser.Game(config);
