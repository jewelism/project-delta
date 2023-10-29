import { Player } from '@/phaser/objects/Player';

export class InGameScene extends Phaser.Scene {
  enemies: Phaser.Physics.Arcade.Group;
  timer: Phaser.Time.TimerEvent;
  projectiles: Phaser.Physics.Arcade.Group;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  player: Player;

  constructor() {
    super('InGameScene');
  }
  preload() {
    this.load.tilemapTiledJSON('map', 'phaser/tiled/map.json');
    this.load.image('16tiles', 'phaser/tiled/16tiles.png');
    this.load.image('rock', 'phaser/objects/rock31x29.png');

    // this.load.spritesheet('sword1', 'assets/upgrade_icon.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    //   startFrame: 0,
    // });

    this.load.spritesheet('alex', 'phaser/players/spr_alex.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createUI(this);
    const { map, playerSpawnPoints } = this.createMap(this);
    console.log('playerSpawnPoints', playerSpawnPoints);

    this.player = new Player(this, {
      sprite: 'alex',
      x: playerSpawnPoints.x,
      y: playerSpawnPoints.y,
    });
    this.cameras.main
      .setBounds(0, 0, map.heightInPixels, map.widthInPixels)
      .setZoom(2)
      .startFollow(this.player);

    // this.bunker = new Bunker(this);

    // this.gaugeBar = new GaugeBar(this, {
    //   x: this.bunker.x - HealthBarConfig.width / 2,
    //   y: this.bunker.y + 40,
    //   max: INIT.soliderCountMax,
    //   value: INIT.soliderCount,
    // });
    // this.healthBar = new HealthBar(
    //   this,
    //   this.bunker.x - HealthBarConfig.width / 2,
    //   this.bunker.y - 40,
    //   INIT.health,
    // );
    // this.enemies = this.physics.add.group();
    // this.missiles = this.physics.add.group();
    // this.createEnemy();

    // this.physics.add.collider(this.enemies, this.missiles, (enemy, missile) => {
    //   missile.destroy();
    //   enemy.destroy();
    //   new EaseText(this, {
    //     x: (enemy as any).x,
    //     y: (enemy as any).y,
    //     text: '+1',
    //     color: '#84b4c8',
    //   });
    // });
    // this.physics.add.collider(this.enemies, this.bunker, (_bunker, enemy) => {
    //   enemy.destroy();
    //   this.healthBar.decrease(1);

    //   if (this.healthBar.value === 0) {
    //     this.bunker.setAlpha(0.1);

    //     createTitleText(this, 'Game Over', Number(this.game.config.height) / 2);
    //     this.time.delayedCall(500, () => {
    //       const onKeydown = () => {
    //         this.scene.start('StartScene');
    //       };
    //       this.input.keyboard.on('keydown', onKeydown);
    //       this.input.on('pointerdown', onKeydown);
    //     });
    //     // this.healthBar.bar.destroy();
    //     // overlay game over
    //     // this.scene.start("StartScene");
    //     return;
    //   }

    //   this.bunker.flash();
    //   new EaseText(this, {
    //     x: (enemy as any).x,
    //     y: (enemy as any).y,
    //     text: 'boom!',
    //     color: '#ff0000',
    //   });
    // });
  }
  createUI(scene: Phaser.Scene) {
    // const uiContainer = scene.add.container(0, Number(scene.game.config.height) - UI.height);
    // const uiWrap = scene.add
    //   .rectangle(
    //     0,
    //     0,
    //     // Number(scene.game.config.height) - height,
    //     Number(scene.game.config.width),
    //     UI.height,
    //   )
    //   .setOrigin(0, 0)
    //   .setScrollFactor(0)
    //   .setFillStyle(0x00ff00);
    // // const button = new SelectLevelButton(scene, 100, 100, 1);
    // const buttons = [
    //   { id: 'income', spriteKey: 'book1', desc: 'increase income +0.5%' },
    //   { id: 'addSoldier', spriteKey: '', desc: 'add new random attacker +1' },
    //   { id: 'attackSpeed', spriteKey: '', desc: 'increase attack speed 1%' },
    //   {
    //     id: 'attackDamage',
    //     spriteKey: 'sword1',
    //     desc: 'increase attack damage 1%',
    //   },
    //   { id: 'upgradeBunker', spriteKey: 'defence1', desc: 'upgrade bunker' },
    // ].map(({ id, spriteKey, desc }, index) => {
    //   const button = new Button(scene, {
    //     x: Number(scene.game.config.width) - 50 * (index + 1),
    //     y: 0,
    //     width: 50,
    //     height: 50,
    //     spriteKey,
    //     hoverText: desc,
    //     onClick: () => {
    //       this.events.emit('upgrade', id);
    //     },
    //   });
    //   return button;
    // });
    // uiContainer.add([uiWrap, ...buttons]).setDepth(9999);
  }
  createMap(scene: Phaser.Scene) {
    const map = scene.make.tilemap({
      key: 'map',
    });
    const bgTiles = map.addTilesetImage('16tiles', '16tiles');
    const bgLayer = map.createLayer('bg', bgTiles);

    const playerSpawnPoints = map.findObject('PlayerSpawn', ({ name }) => {
      return name.includes('PlayerSpawn');
    });

    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const resourceTiles: Phaser.Tilemaps.Tile[] = [];
    bgLayer.forEachTile((tile, index) => {
      const tileGap = Phaser.Math.RND.pick(Array.from({ length: 20 }, (_, i) => i + 10));
      const resourceGapCheck = resourceTiles.some((rockTile) => {
        if (Math.abs(rockTile.x - tile.x) < tileGap && Math.abs(rockTile.y - tile.y) < tileGap) {
          return true;
        }
        return false;
      });
      if (resourceGapCheck) {
        return;
      }
      // last tiles
      if (index > 39000) {
        return;
      }
      // rock or another resource
      const resouce = scene.add.image(tile.pixelX, tile.pixelY, 'rock').setOrigin(0, 0);
      scene.physics.add.existing(resouce);
      scene.physics.world.enableBody(resouce);
      scene.physics.add.collider(resouce, (scene as any).player);
      resourceTiles.push(tile);
    });

    return { map, playerSpawnPoints };
  }
  // createEnemy() {
  //   const phaseData = getPhaseData();
  //   let index = 0;
  //   let count = 0;

  //   this.timer = this.time.addEvent({
  //     delay: 100 / GAME.speed,
  //     callback: () => {
  //       if (this.healthBar.value === 0) {
  //         return;
  //       }
  //       const { phase, hp, spriteKey, frameNo } = phaseData[index];
  //       const direction = Phaser.Math.RND.integerInRange(0, 3);
  //       let x, y;
  //       if (direction === 0) {
  //         x = Phaser.Math.RND.integerInRange(0, this.cameras.main.worldView.right);
  //         y = this.cameras.main.worldView.top - 50;
  //       } else if (direction === 1) {
  //         x = this.cameras.main.worldView.right + 50;
  //         y = Phaser.Math.RND.integerInRange(0, this.cameras.main.worldView.bottom);
  //       } else if (direction === 2) {
  //         x = Phaser.Math.RND.integerInRange(0, this.cameras.main.worldView.right);
  //         y = this.cameras.main.worldView.bottom + 50;
  //       } else if (direction === 3) {
  //         x = this.cameras.main.worldView.left - 50;
  //         y = Phaser.Math.RND.integerInRange(0, this.cameras.main.worldView.bottom);
  //       }

  //       const pixelAnimal = new PixelAnimal(this, {
  //         x,
  //         y,
  //         hp,
  //         frameNo,
  //       });
  //       this.enemies.add(pixelAnimal);
  //       count++;
  //     },
  //     loop: true,
  //     callbackScope: this,
  //   });
  // }
}
