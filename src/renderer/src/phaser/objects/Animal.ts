import { GAME } from '@/phaser/constants';
import { EaseText } from '@/phaser/ui/EaseText';
import { HpBar } from '@/phaser/ui/HpBar';
import { createFlashFn } from '@/phaser/utils/helper';

export class Animal extends Phaser.GameObjects.Container {
  static MOVE_SPEED_RANK = 25;
  attackRange: number = 500;
  attackSpeed: number = 100;
  attackDamage: number = 100;
  defence: number = 100;
  moveSpeed: number = 50;
  maxHp: number;
  hp: number = 100;
  sprite: Phaser.Physics.Arcade.Sprite;
  frameNo: number;
  spriteKey: string;
  direction: string;
  hpBar: HpBar;

  constructor(scene: Phaser.Scene, { x, y, hp, spriteKey, frameNo }) {
    super(scene, x, y);
    this.sprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, spriteKey, frameNo);
    this.hp = hp;
    this.maxHp = hp;
    this.frameNo = frameNo;
    this.spriteKey = spriteKey;

    this.setSize(this.sprite.width, this.sprite.height).setScale(GAME.scale);

    this.hpBar = new HpBar(scene, { maxHp: this.maxHp });
    this.sprite.anims.create({
      key: `${spriteKey}_move${frameNo}`,
      frames: this.sprite.anims.generateFrameNames(spriteKey, {
        frames: [frameNo, frameNo + 1],
      }),
      frameRate: this.moveSpeed / Animal.MOVE_SPEED_RANK,
    });
    scene.physics.world.enable(this);

    this.add([this.hpBar, this.sprite]);
    scene.add.existing(this);
  }
  preUpdate() {}
  isDestroyed() {
    return !this.active || this.hp <= 0;
  }
  isDamaged() {
    return this.hp < this.maxHp;
  }
  getAttackSpeedMs() {
    return (250 - this.attackSpeed) * 10;
  }
  decreaseHp(amount: number) {
    if (this.isDestroyed()) {
      return;
    }
    this.hp -= amount;
    this.hpBar.updateHpBar(this.hp);
    createFlashFn()(this.sprite);
    new EaseText(this.scene, { x: this.x, y: this.y, text: `${amount}`, color: '#ff0000' });
    if (this.hp <= 0) {
      this.destroy();
    }
  }
  flipSpriteByDirection() {
    if (this.body.velocity.x > 0) {
      this.sprite.setFlipX(true);
      return;
    }
    this.sprite.setFlipX(false);
  }
}
