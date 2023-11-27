import { Enemy } from '@/phaser/objects/Enemy';
import { Player } from '@/phaser/objects/Player';
import { ResourceState } from '@/phaser/ui/ResourceState';
import { generateResource } from '@/phaser/utils/helper';

const GAME = {
  ZOOM: 2,
};
export class InGameScene extends Phaser.Scene {
  enemies: Phaser.Physics.Arcade.Group;
  timer: Phaser.Time.TimerEvent;
  projectiles: Phaser.Physics.Arcade.Group;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  player: Player;
  resources: Phaser.Physics.Arcade.Group;
  playerIndicator: Phaser.GameObjects.Container;
  resourceStates: ResourceState[];

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
    this.load.spritesheet('skel', 'phaser/chars/Skel_walk_v2.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('goblin', 'phaser/chars/Goblin_walk_v2.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.resources = this.physics.add.group({
      immovable: true,
    });

    const { map, playerSpawnPoints } = this.createMap(this);

    this.player = new Player(this, {
      spriteKey: 'alex',
      x: playerSpawnPoints.x,
      y: playerSpawnPoints.y,
    });
    this.scene.launch('InGameUIScene');

    this.createMinimap(this.player);
    new Enemy(this, { x: 200, y: 200, hp: 2, spriteKey: 'skel' });

    this.cameras.main
      .setBounds(0, 0, map.heightInPixels, map.widthInPixels)
      .startFollow(this.player, false)
      .ignore(this.playerIndicator)
      .setZoom(GAME.ZOOM);

    this.physics.add.collider(this.resources, this.player);

    this.events.on('upgrade', (upgradeId: string) => {
      console.log('upgradeId', upgradeId);
    });
  }
  createMap(scene: Phaser.Scene) {
    const map = scene.make.tilemap({
      key: 'map',
    });
    const bgTiles = map.addTilesetImage('16tiles', '16tiles');
    const bgLayer = map.createLayer('bg', bgTiles);
    map.createLayer('bg_collision', bgTiles).setCollisionByExclusion([-1]);

    map.createLayer('MonsterSpawn', bgTiles);
    const playerSpawnPoints = map.findObject('PlayerSpawn', ({ name }) => {
      return name.includes('PlayerSpawn');
    });
    const resourceSpawnPoints = map.filterObjects('ResourceSpawn', ({ name }) => {
      return name.includes('ResourceSpawn');
    });
    const monsterSpawnPoints = map.filterObjects('MonsterSpawn', ({ name }) => {
      return name.includes('MonsterSpawn');
    });
    generateResource({ scene, resourceSpawnPoints, bgLayer, resources: this.resources });
    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    return { map, playerSpawnPoints, monsterSpawnPoints };
  }
  createMinimap(player: Player) {
    const graphics = this.add
      .graphics({ fillStyle: { color: 0x84b4c8 } })
      .fillCircle(0, 0, 5)
      .setScale(20);
    this.playerIndicator = this.add.container(player.x, player.y, graphics);
    const minimapSize = 300;
    const y = Number(this.game.config.height) - minimapSize;

    this.cameras
      .add(0, y, minimapSize, minimapSize)
      .setZoom(0.05)
      .setOrigin(0, 0.5)
      .ignore(player)
      .setAlpha(0.7);
    player.on('moved', () => {
      this.playerIndicator.setPosition(player.x, player.y);
    });
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
