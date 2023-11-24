import { InGameScene } from '@/phaser/scenes/InGameScene';
import { Button } from '@/phaser/ui/Button';
import { ResourceState } from '@/phaser/ui/ResourceState';

export class InGameUIScene extends Phaser.Scene {
  constructor() {
    super('InGameUIScene');
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
    this.createUI(this);
  }
  createUI(scene: Phaser.Scene, UI = { height: 50 }) {
    const uiContainer = scene.add.container(0, Number(scene.game.config.height) - UI.height);
    const uiWrap = scene.add
      .rectangle(
        0,
        0,
        // Number(scene.game.config.height) - height,
        Number(scene.game.config.width),
        UI.height,
      )
      .setOrigin(0, 0)
      .setScrollFactor(0);
    // const button = new SelectLevelButton(scene, 100, 100, 1);
    const buttons = [
      { id: 'income', spriteKey: 'book1', desc: 'increase income +0.5%' },
      { id: 'addSoldier', spriteKey: '', desc: 'add new random attacker +1' },
      { id: 'attackSpeed', spriteKey: '', desc: 'increase attack speed 1%' },
      {
        id: 'attackDamage',
        spriteKey: 'sword1',
        desc: 'increase attack damage 1%',
      },
      { id: 'upgradeBunker', spriteKey: 'defence1', desc: 'upgrade bunker' },
    ].map(({ id, spriteKey, desc }, index) => {
      const button = new Button(scene, {
        x: Number(scene.game.config.width) - 50 * (index + 1),
        y: 0,
        width: 50,
        height: 50,
        spriteKey,
        hoverText: desc,
        onClick: () => {
          this.events.emit('upgrade', id);
        },
      });
      return button;
    });
    uiContainer.add([uiWrap, ...buttons]).setDepth(9997);
  }
}
