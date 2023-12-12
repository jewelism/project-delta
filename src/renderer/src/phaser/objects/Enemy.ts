import { InGameScene } from '@/phaser/scenes/InGameScene';
import { EaseText } from '@/phaser/ui/EaseText';
import { createFlashFn, createMoveAnim, playMoveAnim } from '@/phaser/utils/helper';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  static moveSpeed: number = 50;

  maxHp: number;
  hp: number;
  spriteKey: any;
  static damage: number = 10;
  static attackRange: number = 50;
  static attackSpeed: number = 2000;
  static sightRange: number = 100;
  isAttacking: boolean = false;

  constructor(scene, { x, y, hp, spriteKey }) {
    super(scene, x, y, spriteKey);

    this.maxHp = hp;
    this.hp = hp;
    this.spriteKey = spriteKey;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    scene.physics.add.existing(this);

    this.setDepth(999).setBodySize(10, 15).setCollideWorldBounds(true);
    createMoveAnim(this, spriteKey);
    scene.time.addEvent({
      delay: Phaser.Math.Between(500, 1000), // ms
      callback: this.move, // 호출할 함수
      callbackScope: this, // 함수의 'this' 값
      loop: true, // 이 이벤트를 계속 반복할 것인지
    });
  }
  preUpdate() {
    playMoveAnim(this, this.spriteKey);
  }
  isDestroyed() {
    return !this.active;
  }
  isDamaged() {
    return this.hp < this.maxHp;
  }
  move() {
    if (this.isDestroyed()) {
      return;
    }
    const player = (this.scene as InGameScene).player;
    if (player.isDestroyed()) {
      return;
    }
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (distance < Enemy.attackRange) {
      this.setVelocity(0);
      return;
    }
    if (distance < Enemy.sightRange || this.isDamaged()) {
      this.scene.physics.moveToObject(this, player, Enemy.moveSpeed);
      return;
    }
    this.randomMove();
  }
  randomMove() {
    const randomX = Phaser.Math.Between(-100, 100);
    const randomY = Phaser.Math.Between(-100, 100);
    const randomPoint = new Phaser.Math.Vector2(this.x + randomX, this.y + randomY);
    this.scene.physics.moveToObject(this, randomPoint, Enemy.moveSpeed);
  }
  decreaseHp(amount: number) {
    if (this.isDestroyed()) {
      return;
    }
    this.hp -= amount;
    createFlashFn()(this);
    new EaseText(this.scene, { x: this.x, y: this.y, text: `${amount}`, color: '#ff0000' });
    if (this.hp <= 0) {
      this.destroy();
    }
  }
  // TODO: 원거리 공격 추가하기
}
