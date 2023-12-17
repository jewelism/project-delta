import { Animal } from '@/phaser/objects/Animal';
import { Enemy } from '@/phaser/objects/Enemy';
import { Player } from '@/phaser/objects/Player';
import { InGameUIScene } from '@/phaser/scenes/InGameUIScene';
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
  resources: Phaser.Physics.Arcade.Group;
  resourceStates: {
    tree: ResourceState;
    rock: ResourceState;
    gold: ResourceState;
    decreaseByUpgrade: ({ tree, rock, gold }) => void;
    setXAll(x: number): void;
  };
  player: Player;

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
    this.load.spritesheet('fire', 'phaser/objects/tree45x45.png', {
      frameWidth: 45,
      frameHeight: 45,
      startFrame: 0,
    });
    this.load.spritesheet('goldMine', 'phaser/objects/Stones_ores_gems_without_grass_x16.png', {
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 23,
    });
    this.load.spritesheet('goldBar', 'phaser/objects/Stones_ores_gems_without_grass_x16.png', {
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 27,
    });
    this.load.spritesheet('pixel_animals', 'phaser/chars/pixel_animals.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('skel', 'phaser/chars/Skel_walk_v2.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('goblin', 'phaser/chars/Goblin_walk_v2.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('beam_green', 'phaser/effect/beams_9x21.png', {
      frameWidth: 9,
      frameHeight: 21,
      startFrame: 0,
    });
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.resources = this.physics.add.group({
      immovable: true,
    });
    this.enemies = this.physics.add.group();

    const { map, playerSpawnPoints, monsterSpawnPoints } = this.createMap(this);

    this.player = new Player(this, {
      x: playerSpawnPoints.x,
      y: playerSpawnPoints.y,
      hp: 1000,
      spriteKey: 'pixel_animals',
      frameNo: 0,
    });
    this.scene.launch('InGameUIScene');
    this.createEnemy(monsterSpawnPoints);

    this.cameras.main
      .setBounds(0, 0, map.heightInPixels, map.widthInPixels)
      .startFollow(this.player.body, false)
      .setZoom(GAME.ZOOM);

    this.physics.add.collider(this.resources, this.player.body);
    this.physics.add.collider(this.resources, this.enemies);

    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.enemies, this.player.body, (player: any, enemy: any) => {
      if (enemy.isAttacking) {
        return;
      }
      enemy.isAttacking = true;
      (player as Animal).decreaseHp(enemy.attackDamage);
      this.time.addEvent({
        delay: enemy.getAttackSpeedMs(),
        callback: () => {
          enemy.isAttacking = false;
        },
        callbackScope: this,
      });
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
  createEnemy(monsterSpawnPoints: Phaser.Types.Tilemaps.TiledObject[]) {
    const inGameUIScene = this.scene.get('InGameUIScene') as InGameUIScene;
    inGameUIScene.createTimer(0.1, () => {
      monsterSpawnPoints.forEach(({ x, y }) => {
        const tempEnemies = Array.from({ length: 5 }, (_, index) => {
          const enemy = new Enemy(this, {
            x: x + index * 10,
            y: y + index * 10,
            hp: 300,
            spriteKey: 'pixel_animals',
            frameNo: 38,
          }).body;
          return enemy;
        });
        this.enemies.addMultiple(tempEnemies);
      });
      inGameUIScene.createTimer(0.1, () => {});
    });
  }
}
