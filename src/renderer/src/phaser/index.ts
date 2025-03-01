import * as Phaser from 'phaser';

import { StartScene } from '@/phaser/scenes/StartScene';
import { MultiplayLobbyScene } from '@/phaser/scenes/MultiplayLobbyScene';
import { InGameScene } from '@/phaser/scenes/InGameScene';
import { InGameUIScene } from '@/phaser/scenes/InGameUIScene';

const config: Phaser.Types.Core.GameConfig = {
  title: 'project alpha',
  url: 'jewelism.github.io',
  type: Phaser.WEBGL,
  // type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
    // width: Number(import.meta.env.RENDERER_VITE_WINDOW_WIDTH),
    // height: Number(import.meta.env.RENDERER_VITE_WINDOW_HEIGHT),
    min: {
      width: 480 * 2,
      height: 270 * 2,
    },
    max: {
      width: 1920,
      height: 1080,
    },
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
    // StartScene, MultiplayLobbyScene,
    InGameScene,
    InGameUIScene,
  ],
  // backgroundColor: '#222',
  // fps: {
  //   target: 10,
  //   forceSetTimeOut: true,
  // },
};

export const createPhaser = () => new Phaser.Game(config);
