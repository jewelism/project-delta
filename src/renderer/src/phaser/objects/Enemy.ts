import { InGameScene } from '@/phaser/scenes/InGameScene';
import { createMoveAnim, playMoveAnim } from '@/phaser/utils/helper';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  moveSpeed: number = 50;
  hp: number;
  spriteKey: any;

  constructor(scene, { x, y, hp, spriteKey }) {
    super(scene, x, y, spriteKey);

    this.hp = hp;
    this.spriteKey = spriteKey;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    scene.physics.add.existing(this);

    this.setDepth(9).setBodySize(10, 15);
    // .setCollideWorldBounds(true);
    // this.setImmovable(true);
    createMoveAnim(this, spriteKey);
  }
  preUpdate() {
    this.moveToPlayer();
    playMoveAnim(this, this.spriteKey);
  }
  isDestroyed() {
    return !this.active;
  }
  moveToPlayer() {
    const player = (this.scene as InGameScene).player;
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (distance < 10) {
      this.setVelocity(0);
      return;
    }

    this.scene.physics.moveToObject(this, player, this.moveSpeed);
  }
}
