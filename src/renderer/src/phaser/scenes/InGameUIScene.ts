import { InGameScene } from '@/phaser/scenes/InGameScene';
import { ResourceState } from '@/phaser/ui/ResourceState';
import { IconButton } from '@/phaser/ui/IconButton';

export class InGameUIScene extends Phaser.Scene {
  upgradeUI: Phaser.GameObjects.Container;
  buttonElements: Phaser.GameObjects.DOMElement[];

  constructor() {
    super('InGameUIScene');
  }
  preload() {
    this.load.html('upgrade', 'phaser/upgrade.html');
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
    inGameScene.resourceStates = {
      rock: new ResourceState(this, {
        x,
        y: 35,
        texture: 'rock',
      }),
      tree: new ResourceState(this, {
        x,
        y: 60,
        texture: 'tree',
      }),
      gold: new ResourceState(this, {
        x,
        y: 85,
        texture: 'goldBar',
      }),
    };

    this.createOpenUpgradeUIButton(this);
    this.createUpgradeUI(this);
  }
  createOpenUpgradeUIButton(scene: Phaser.Scene) {
    const onClick = () => {
      this.upgradeUI.setVisible(!this.upgradeUI.visible);
    };
    new IconButton(scene, {
      x: Number(scene.game.config.width) - 100,
      y: Number(scene.game.config.height) - 100,
      width: 50,
      height: 50,
      spriteKey: 'book1',
      shortcutText: 'C',
      onClick,
    }).setDepth(9999);
  }
  createUpgradeUI(scene: Phaser.Scene) {
    this.upgradeUI = scene.add.container(0, 0).setVisible(false);

    const buttonElements = [
      {
        id: 'attackDamage',
        spriteKey: 'sword1',
        shortcutText: 'A',
        desc: 'attack damage +1',
      },
      {
        id: 'attackSpeed',
        spriteKey: 'fist',
        shortcutText: 'S',
        desc: 'attack speed +1%',
      },
      { id: 'defence', spriteKey: 'defence1', shortcutText: 'D', desc: 'defence +1' },
      { id: 'moveSpeed', spriteKey: 'boots', shortcutText: 'F', desc: 'move speed +1%' },
    ].map(({ id, spriteKey, shortcutText, desc }, index) => {
      const element = new Phaser.GameObjects.DOMElement(scene, 50, (index + 1) * 50)
        .setOrigin(0, 0)
        .createFromCache('upgrade')
        .addListener('click');
      element.getChildByID('upgrade-icon').classList.add(spriteKey);
      element.getChildByID('shortcutText').textContent = shortcutText;
      element.getChildByID('desc').textContent = desc;
      const buttonEl = element.getChildByID('button');
      const onKeyDown = () => {
        const inGameScene = this.scene.get('InGameScene') as InGameScene;
        inGameScene.events.emit('upgrade', id);
        buttonEl.classList.add('keydown');
      };
      const onKeyUp = () => {
        buttonEl.classList.remove('keydown');
      };
      buttonEl.addEventListener('pointerdown', onKeyDown);
      buttonEl.addEventListener('pointerup', onKeyUp);
      buttonEl.addEventListener('pointerout', onKeyUp);
      scene.input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes[shortcutText])
        .on('down', onKeyDown)
        .on('up', onKeyUp);
      return element;
    });

    const uiWrap = scene.add
      .rectangle(0, 0, Number(scene.game.config.width), Number(scene.game.config.height))
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setFillStyle(0x000000, 0.7);

    this.upgradeUI.add([uiWrap, ...buttonElements]).setDepth(9997);
  }
  canUpgrade() {
    const inGameScene = this.scene.get('InGameScene') as InGameScene;
    const { tree, rock, gold } = inGameScene.player.getAttackDamageUpgradeCost();
    const { tree: treeState, rock: rockState, gold: goldState } = inGameScene.resourceStates;
    return {
      canUpgrade:
        treeState.resourceAmount >= tree &&
        rockState.resourceAmount >= rock &&
        goldState.resourceAmount >= gold,
      cost: { tree, rock, gold },
    };
  }
  attackDamageUpgrade() {
    const inGameScene = this.scene.get('InGameScene') as InGameScene;
    const { canUpgrade, cost } = this.canUpgrade();
    if (!canUpgrade) {
      return;
    }
    const { tree, rock, gold } = cost;
    inGameScene.resourceStates.tree.decrease(tree);
    inGameScene.resourceStates.rock.decrease(rock);
    inGameScene.resourceStates.gold.decrease(gold);
    inGameScene.player.attackDamage += 1;
  }
}
