import { InGameScene } from '@/phaser/scenes/InGameScene';
import { ResourceState } from '@/phaser/ui/ResourceState';
import { IconButton } from '@/phaser/ui/IconButton';
import { getUpgradeMax, updateUpgradeUIText } from '@/phaser/utils/helper';
import { INIT_PLAYER_STATE_LIST } from '@/phaser/constants';
import { convertSecondsToMinSec } from '@/phaser/utils';

export class InGameUIScene extends Phaser.Scene {
  upgradeUI: Phaser.GameObjects.Container;
  buttonElements: Phaser.GameObjects.DOMElement[];
  stateElement: Phaser.GameObjects.DOMElement;

  constructor() {
    super('InGameUIScene');
  }
  preload() {
    this.load.html('upgrade', 'phaser/upgrade.html');
    this.load.html('player_state', 'phaser/player_state.html');
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
    const x = this.scale.gameSize.width;
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
      decreaseByUpgrade({ tree, rock, gold }) {
        this.tree.decrease(tree);
        this.rock.decrease(rock);
        this.gold.decrease(gold);
      },
    };

    this.createOpenUpgradeUIButton(this);
    this.createUpgradeUI(this);
    this.createPlayerKeyButton(this);
  }
  createOpenUpgradeUIButton(scene: Phaser.Scene) {
    const onClick = (visible: boolean = !this.upgradeUI.visible) => {
      this.upgradeUI.setVisible(visible);
    };
    scene.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      .on('down', () => onClick(false));
    new IconButton(scene, {
      x: this.scale.gameSize.width,
      y: this.scale.gameSize.height,
      width: 50,
      height: 50,
      spriteKey: 'book1',
      shortcutText: 'C',
      onClick,
    }).setDepth(9999);
  }
  createPlayerKeyButton(scene: Phaser.Scene) {
    [
      { spriteKey: 'sword1', shortcutText: 'Q' },
      { spriteKey: 'sword1', shortcutText: 'W' },
      { spriteKey: 'sword1', shortcutText: 'E' },
      { spriteKey: 'sword1', shortcutText: 'R' },
    ]
      .reverse()
      .forEach(({ spriteKey, shortcutText }, index) => {
        new IconButton(scene, {
          x: this.scale.gameSize.width - 50 * (index + 1),
          y: this.scale.gameSize.height,
          width: 50,
          height: 50,
          spriteKey,
          shortcutText,
          onClick: null,
        }).setDepth(9999);
      });
  }
  createTimer(min: number, callback: () => void) {
    let remainingTime = min * 60;

    const inGameScene = this.scene.get('InGameScene') as InGameScene;

    const remainingTimeText = this.add
      .text(this.cameras.main.centerX, 10, convertSecondsToMinSec(remainingTime), {
        fontSize: '30px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0);

    const timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (inGameScene.player.body.isDestroyed()) {
          return;
        }
        remainingTime--;
        remainingTimeText.setText(convertSecondsToMinSec(remainingTime));
        if (remainingTime < 0) {
          callback();
          remainingTimeText.destroy();
          timer.destroy();
        }
      },
      loop: true,
    });
  }
  createUpgradeUI(scene: Phaser.Scene) {
    this.upgradeUI = scene.add.container(0, 0).setVisible(false);

    this.buttonElements = INIT_PLAYER_STATE_LIST.map(
      ({ id, spriteKey, shortcutText, desc }, index) => {
        const element = new Phaser.GameObjects.DOMElement(scene, 300, (index + 1) * 50)
          .setOrigin(0, 0)
          .createFromCache('upgrade')
          .addListener('click')
          .setName(id);

        const inGameScene = this.scene.get('InGameScene') as InGameScene;
        const { tree, rock, gold } = inGameScene.player.getUpgradeCost(id);

        updateUpgradeUIText(element, { spriteKey, shortcutText, desc, tree, rock, gold });

        const buttonEl = element.getChildByID('button');
        const onKeyDown = () => {
          buttonEl.classList.add('keydown');
          this.upgrade(id);
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
      },
    );

    const uiWrap = scene.add
      .rectangle(0, 0, Number(scene.game.config.width), Number(scene.game.config.height))
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setFillStyle(0x000000, 0.7);

    this.createPlayerStateUI(this);
    this.upgradeUI.add([uiWrap, this.stateElement, ...this.buttonElements]).setDepth(9997);
  }
  canUpgrade(id: string) {
    const inGameScene = this.scene.get('InGameScene') as InGameScene;
    if (inGameScene.player.body[id] >= getUpgradeMax(id)) {
      return { canUpgrade: false, cost: { tree: 0, rock: 0, gold: 0 } };
    }
    const { tree, rock, gold } = inGameScene.player.getUpgradeCost(id);
    const { tree: treeState, rock: rockState, gold: goldState } = inGameScene.resourceStates;
    return {
      canUpgrade:
        treeState.resourceAmount >= tree &&
        rockState.resourceAmount >= rock &&
        goldState.resourceAmount >= gold,
      cost: { tree, rock, gold },
    };
  }
  upgrade(id: string) {
    const inGameScene = this.scene.get('InGameScene') as InGameScene;
    const { canUpgrade, cost } = this.canUpgrade(id);
    // if (!canUpgrade) {
    //   return;
    // }
    inGameScene.resourceStates.decreaseByUpgrade(cost);
    inGameScene.player.body[id] += 1;
    this.updatePlayerStateUI(id);
    this.buttonElements.forEach((element) => {
      const { name } = element;
      const { tree, rock, gold } = inGameScene.player.getUpgradeCost(name);
      updateUpgradeUIText(element, {
        ...INIT_PLAYER_STATE_LIST.find(({ id }) => id === name),
        tree,
        rock,
        gold,
      });
    });
  }
  createPlayerStateUI(scene: Phaser.Scene) {
    this.stateElement = new Phaser.GameObjects.DOMElement(scene, 50, 50)
      .setOrigin(0, 0)
      .createFromCache('player_state');
    INIT_PLAYER_STATE_LIST.forEach(({ id }) => {
      this.updatePlayerStateUI(id);
      this.stateElement.getChildByID(`${id}-max`).textContent = String(getUpgradeMax(id));
    });
  }
  updatePlayerStateUI(id: string) {
    const inGameScene = this.scene.get('InGameScene') as InGameScene;
    this.stateElement.getChildByID(id).textContent = inGameScene.player.body[id];
  }
}
