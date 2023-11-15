import { Player } from '@/phaser/objects/Player';
import { Resource } from '@/phaser/objects/Resource';
import { ResourceState } from '@/phaser/ui/ResourceState';
import { resourceGapCheck } from '@/phaser/utils';

export class InGameScene extends Phaser.Scene {
  enemies: Phaser.Physics.Arcade.Group;
  timer: Phaser.Time.TimerEvent;
  projectiles: Phaser.Physics.Arcade.Group;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  player: Player;
  resources: Phaser.Physics.Arcade.Group;
  rockState: ResourceState;
  treeState: ResourceState;

  constructor() {
    super('InGameScene');
  }
  preload() {
    this.load.tilemapTiledJSON('map', 'phaser/tiled/map.json');
    this.load.image('16tiles', 'phaser/tiled/16tiles.png');
    this.load.image('rock', 'phaser/objects/rock31x29.png');

    this.load.spritesheet('tree', 'phaser/objects/tree45x45.png', {
      frameWidth: 45,
      frameHeight: 45,
      startFrame: 0,
    });

    this.load.spritesheet('alex', 'phaser/players/spr_alex.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.resources = this.physics.add.group({
      immovable: true,
    });

    this.createUI(this);
    const { map, playerSpawnPoints } = this.createMap(this);

    this.player = new Player(this, {
      spriteKey: 'alex',
      x: playerSpawnPoints.x,
      y: playerSpawnPoints.y,
    });

    this.rockState = new ResourceState(this, {
      x: Number(this.game.config.width) - 50,
      y: 10,
      initAmount: 0,
      texture: 'rock',
    });
    this.treeState = new ResourceState(this, {
      x: Number(this.game.config.width) - 50,
      y: 35,
      initAmount: 0,
      texture: 'tree',
    });
    const graphics = this.add
      .graphics({ fillStyle: { color: 0xff0000 } })
      .fillCircle(0, 0, 5)
      .setScale(20);
    const playerIndicator = this.add.container(this.player.x, this.player.y, graphics);
    this.cameras.main
      .setBounds(0, 0, map.heightInPixels, map.widthInPixels)
      .startFollow(this.player, false)
      .ignore(playerIndicator);
    this.cameras
      .add(0, 0, 200, 200)
      .setZoom(0.02)
      .setOrigin(0, 0)
      .ignore(this.player)
      .setAlpha(0.7);
    this.player.on('moved', () => {
      playerIndicator.setPosition(this.player.x, this.player.y);
    });

    this.physics.add.collider(this.resources, this.player);
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
    map.createLayer('bg_collision', bgTiles);
    map.createLayer('MonsterSpawn', bgTiles);
    const playerSpawnPoints = map.findObject('PlayerSpawn', ({ name }) => {
      return name.includes('PlayerSpawn');
    });
    const resourceSpawnPoints = map.filterObjects('ResourceSpawn', ({ name }) => {
      return name.includes('ResourceSpawn');
    });
    this.generateResource(scene, resourceSpawnPoints, bgLayer);
    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    return { map, playerSpawnPoints };
  }
  generateResource(
    scene: Phaser.Scene,
    resourceSpawnPoints: Phaser.Types.Tilemaps.TiledObject[],
    bgLayer: Phaser.Tilemaps.TilemapLayer,
  ) {
    resourceSpawnPoints.forEach(({ x, y, width, height }) => {
      const tiles = bgLayer.getTilesWithinWorldXY(x, y, width, height);
      tiles.forEach((tile, index) => {
        const tileGap = Phaser.Math.RND.pick(
          Array.from({ length: 20 }, (_, i) => tile.width * (i + 5)),
        );
        if (!resourceGapCheck(tile, this.resources.getChildren(), tileGap)) {
          return;
        }
        const resource = this.getRandomResource(this, { x: tile.pixelX, y: tile.pixelY });
        scene.physics.add.existing(resource, true);
        this.resources.add(resource);
      });

      // let tiles = resourceSpawnPoints.getTilesWithin(x, y, width, height, filteringOptions);
      // do {
      //   xPosition = Phaser.Math.Between(x, x + width);
      //   yPosition = Phaser.Math.Between(y, y + height);

      //   isFarEnough = this.resources.getChildren().every((resource: any) => {
      //     const distance = Phaser.Math.Distance.Between(
      //       xPosition,
      //       yPosition,
      //       resource.x,
      //       resource.y,
      //     );
      //     return distance >= 16 * 5 && distance <= 16 * 20;
      //   });
      // } while (!isFarEnough);

      // const resource = this.getRandomResource(this, { x: xPosition, y: yPosition });
      // scene.physics.add.existing(resource, true);
      // this.resources.add(resource);
    });
  }
  getRandomResource(scene: Phaser.Scene, { x, y }) {
    return Phaser.Math.RND.pick([
      () => new Resource(scene, { x, y, name: 'rock' }).setScale(0.6),
      () => new Resource(scene, { x, y, name: 'tree' }).setScale(0.5),
    ])();
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
