import { InGameScene } from '@/phaser/scenes/InGameScene';
import { Button } from '@/phaser/ui/UpgradeButton';
import { ResourceState } from '@/phaser/ui/ResourceState';

export class InGameUIScene extends Phaser.Scene {
  upgradeUI: Phaser.GameObjects.Container;
  constructor() {
    super('InGameUIScene');
  }
  preload() {
    this.load.spritesheet('sword1', 'phaser/ui/upgrade_icon32x32.png', {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0,
    });
    this.load.spritesheet('defence1', 'phaser/ui/upgrade_icon32x32.png', {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 3,
    });
    this.load.spritesheet('book1', 'phaser/ui/upgrade_icon32x32.png', {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 6,
    });
    this.load.spritesheet('boots', 'phaser/ui/upgrade_icon32x32.png', {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 8,
    });
    this.load.spritesheet('fist', 'phaser/ui/upgrade_icon32x32.png', {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 9,
    });
  }
  create() {
    const x = Number(this.game.config.width) - 50;
    const inGameScene = this.scene.get('InGameScene') as InGameScene;
    inGameScene.resourceStates = [
      new ResourceState(this, {
        x,
        y: 35,
        initAmount: 0,
        texture: 'rock',
      }),
      new ResourceState(this, {
        x,
        y: 60,
        initAmount: 0,
        texture: 'tree',
      }),
    ];
    // this.scene.get('InGameScene').data.set('resourceStates', [
    //   new ResourceState(this, {
    //     x,
    //     y: 35,
    //     initAmount: 0,
    //     texture: 'rock',
    //   }),
    //   new ResourceState(this, {
    //     x,
    //     y: 60,
    //     initAmount: 0,
    //     texture: 'tree',
    //   }),
    // ]);
    this.createUpgradeUI(this);
  }
  createUpgradeUI(scene: Phaser.Scene) {
    this.upgradeUI = scene.add.container(0, 0);
    const uiWrap = scene.add
      .rectangle(0, 0, Number(scene.game.config.width), Number(scene.game.config.height))
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setFillStyle(0x000000, 0.5);
    // const button = new SelectLevelButton(scene, 100, 100, 1);
    const buttons = [
      { id: 'spell', spriteKey: 'book1', desc: 'spell attack +1' },
      { id: 'moveSpeed', spriteKey: 'boots', desc: 'move speed +1%' },
      { id: 'attackSpeed', spriteKey: 'fist', desc: 'attack speed +2%' },
      { id: 'defence', spriteKey: 'defence1', desc: 'defence +1' },
      {
        id: 'attackDamage',
        spriteKey: 'sword1',
        desc: 'attack damage +1',
      },
    ].map(({ id, spriteKey, desc }, index) => {
      const button = new Button(scene, {
        x: 50,
        y: 50 * (index + 1),
        width: 50,
        height: 50,
        spriteKey,
        desc,
        onClick: () => {
          this.events.emit('upgrade', id);
        },
      });
      return button;
    });
    this.upgradeUI.add([uiWrap, ...buttons]).setDepth(9997);
  }
}
