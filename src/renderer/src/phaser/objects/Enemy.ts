import { Animal } from '@/phaser/objects/Animal';
import { InGameScene } from '@/phaser/scenes/InGameScene';
import { EaseText } from '@/phaser/ui/EaseText';
import { createFlashFn } from '@/phaser/utils/helper';

export class Enemy {
  body: Animal;
  static sightRange: number = 100;
  isAttacking: boolean = false;

  constructor(scene, { x, y, hp, spriteKey, frameNo }) {
    this.body = new Animal(scene, { x, y, hp, spriteKey, frameNo });
    this.body.attackRange = 50;
    this.body.preUpdate = this.preUpdate.bind(this);

    // this.body.sprite.setDepth(999).setBodySize(10, 15).setCollideWorldBounds(true);

    scene.time.addEvent({
      delay: Phaser.Math.Between(500, 1000), // ms
      callback: this.move, // 호출할 함수
      callbackScope: this, // 함수의 'this' 값
      loop: true, // 이 이벤트를 계속 반복할 것인지
    });
  }
  preUpdate() {
    this.body.sprite.anims.play(`pixel_animals_move${this.body.frameNo}`, true);
  }
  move() {
    if (this.body.isDestroyed()) {
      return;
    }
    const player = (this.body.scene as InGameScene).player;
    if (player.body.isDestroyed()) {
      return;
    }
    const distance = Phaser.Math.Distance.Between(
      this.body.x,
      this.body.y,
      player.body.x,
      player.body.y,
    );
    if (distance < this.body.attackRange) {
      (this.body.body as any).setVelocity(0);
      return;
    }
    if (distance < Enemy.sightRange || this.body.isDamaged()) {
      this.body.scene.physics.moveToObject(this.body, player.body, this.body.moveSpeed);
      return;
    }
    this.randomMove();
  }
  randomMove() {
    const randomX = Phaser.Math.Between(-100, 100);
    const randomY = Phaser.Math.Between(-100, 100);
    const randomPoint = new Phaser.Math.Vector2(this.body.x + randomX, this.body.y + randomY);
    this.body.scene.physics.moveToObject(this.body, randomPoint, this.body.moveSpeed);
  }
  decreaseHp(amount: number) {
    if (this.body.isDestroyed()) {
      return;
    }
    this.body.hp -= amount;
    createFlashFn()(this.body);
    new EaseText(this.body.scene, {
      x: this.body.x,
      y: this.body.y,
      text: `${amount}`,
      color: '#ff0000',
    });
    if (this.body.hp <= 0) {
      this.body.destroy();
    }
  }
  // TODO: 원거리 공격 추가하기
}
