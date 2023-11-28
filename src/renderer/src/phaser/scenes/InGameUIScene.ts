import { InGameScene } from '@/phaser/scenes/InGameScene';
import { ResourceState } from '@/phaser/ui/ResourceState';
import { IconButton } from '@/phaser/ui/IconButton';

const INIT_PLAYER_STATE_LIST = [
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
];

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
      decreaseByUpgrade({ tree, rock, gold }) {
        this.tree.decrease(tree);
        this.rock.decrease(rock);
        this.gold.decrease(gold);
      },
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

    this.buttonElements = INIT_PLAYER_STATE_LIST.map(
      ({ id, spriteKey, shortcutText, desc }, index) => {
        const element = new Phaser.GameObjects.DOMElement(scene, 300, (index + 1) * 50)
          .setOrigin(0, 0)
          .createFromCache('upgrade')
          .addListener('click')
          .setName(id);
        element.getChildByID('upgrade-icon').classList.add(spriteKey);
        element.getChildByID('shortcutText').textContent = shortcutText;
        element.getChildByID('desc').textContent = desc;
        const inGameScene = this.scene.get('InGameScene') as InGameScene;
        const { tree, rock, gold } = inGameScene.player.getUpgradeCost(id);
        element.getChildByID('tree').textContent = String(tree);
        element.getChildByID('rock').textContent = String(rock);
        element.getChildByID('gold').textContent = String(gold);

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
    if (inGameScene.player[id] >= inGameScene.player.getUpgradeMax(id)) {
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
    if (!canUpgrade) {
      return;
    }
    inGameScene.resourceStates.decreaseByUpgrade(cost);
    inGameScene.player[id] += 1;
    this.updatePlayerStateUI(id);
  }
  createPlayerStateUI(scene: Phaser.Scene) {
    this.stateElement = new Phaser.GameObjects.DOMElement(scene, 50, 50)
      .setOrigin(0, 0)
      .createFromCache('player_state');
    const inGameScene = this.scene.get('InGameScene') as InGameScene;
    INIT_PLAYER_STATE_LIST.forEach(({ id }) => {
      this.updatePlayerStateUI(id);
      this.stateElement.getChildByID(`${id}-max`).textContent = String(
        inGameScene.player.getUpgradeMax(id),
      );
    });
  }
  updatePlayerStateUI(id: string) {
    const inGameScene = this.scene.get('InGameScene') as InGameScene;
    this.stateElement.getChildByID(id).textContent = inGameScene.player[id];
  }
}
