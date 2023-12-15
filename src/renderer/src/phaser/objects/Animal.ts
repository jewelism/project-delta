import { EaseText } from '@/phaser/ui/EaseText';
import { createFlashFn } from '@/phaser/utils/helper';

export class Animal extends Phaser.GameObjects.Container {
  static MOVE_SPEED_RANK = 100;
  attackRange: number = 500;
  attackSpeed: number = 100;
  attackDamage: number = 100;
  defence: number = 100;
  moveSpeed: number = 75;
  maxHp: number;
  hp: number = 100;
  sprite: Phaser.Physics.Arcade.Sprite;
  frameNo: number;
  spriteKey: string;
  direction: string;
  tween: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, { x, y, hp, spriteKey, frameNo }) {
    super(scene, x, y);
    this.sprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, spriteKey, frameNo);
    this.hp = hp;
    this.maxHp = hp;
    this.frameNo = frameNo;
    this.spriteKey = spriteKey;

    this.setSize(this.sprite.width, this.sprite.height);

    const text = new Phaser.GameObjects.Text(scene, 0, 0, 'test', {
      color: 'white',
      fontSize: '10px',
    });
    this.sprite.anims.create({
      key: `${spriteKey}_move${frameNo}`,
      frames: this.sprite.anims.generateFrameNames(spriteKey, {
        frames: [frameNo, frameNo + 1],
      }),
      frameRate: this.moveSpeed / Animal.MOVE_SPEED_RANK,
    });
    scene.physics.world.enable(this);

    this.add([text, this.sprite]);
    scene.add.existing(this);
  }
  preUpdate() {}
  isDestroyed() {
    return !this.active || this.hp <= 0;
  }
  getAttackSpeedMs() {
    return (250 - this.attackSpeed) * 10;
  }
  decreaseHp(amount: number) {
    if (this.isDestroyed()) {
      return;
    }
    this.hp -= amount;
    createFlashFn()(this.sprite);
    new EaseText(this.scene, { x: this.x, y: this.y, text: `${amount}`, color: '#ff0000' });
    if (this.hp <= 0) {
      this.destroy();
    }
  }
}
