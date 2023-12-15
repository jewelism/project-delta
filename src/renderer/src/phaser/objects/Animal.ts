import { InGameScene } from '@/phaser/scenes/InGameScene';
import { EaseText } from '@/phaser/ui/EaseText';
import { createFlashFn, createThrottleFn } from '@/phaser/utils/helper';

const keyActions = {
  Q: createThrottleFn(),
  W: createThrottleFn(),
};

const MOVE_SPEED_RANK = 100;
export class Animal extends Phaser.GameObjects.Container {
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
  keyboard: Record<string, Phaser.Input.Keyboard.Key> = {};

  constructor(scene, { x, y, hp, spriteKey, frameNo }) {
    super(scene, x, y);
    this.sprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, spriteKey, frameNo);
    this.hp = hp;
    this.maxHp = hp;
    this.frameNo = frameNo;
    this.spriteKey = spriteKey;

    this.setSize(this.sprite.width, this.sprite.height);
    // this.sprite.setOrigin(0);

    const text = new Phaser.GameObjects.Text(scene, 0, 0, 'test', {
      color: 'white',
      fontSize: '10px',
    });
    this.sprite.anims.create({
      key: `${spriteKey}_move${frameNo}`,
      frames: this.sprite.anims.generateFrameNames(spriteKey, {
        frames: [frameNo, frameNo + 1],
      }),
      frameRate: this.moveSpeed / MOVE_SPEED_RANK,
    });

    this.add([text, this.sprite]);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.add.existing(this.sprite);

    ['Q', 'W'].forEach((key) => {
      this.keyboard[key] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]);
    });
    // scene.input.on('pointerdown', (pointer) => {
    //   const touchX = pointer.x;
    //   const touchY = pointer.y;
    //   const movePoint = new Phaser.Math.Vector2(touchX, touchY);

    //   this.scene.physics.moveToObject(this, movePoint, this.moveSpeed);
    //   // this.scene.physics.moveTo(this, touchX, touchY, this.moveSpeed);
    //   console.log(this, 'touchX', touchX, 'touchY', touchY);
    //   // this.moveTo.moveTo(touchX, touchY);
    //   console.log(this.x, this.y);
    //   // this.scene.physics.moveToObject(this, pointer, this.moveSpeed);

    //   this.sprite.anims.play(`${spriteKey}_move${frameNo}`, true);
    // });
  }
  preUpdate() {
    this.playerMoveWithKeyboard();
    Object.keys(keyActions).forEach((key) => {
      if (this.keyboard[key].isDown) {
        keyActions[key](this.scene, this[`press${key}`].bind(this), this.getAttackSpeedMs());
      }
    });
  }
  isDestroyed() {
    return !this.active || this.hp <= 0;
  }
  getAttackSpeedMs() {
    return (250 - this.attackSpeed) * 10;
  }
  playerMoveWithKeyboard() {
    const { left, right, up, down } = (this.scene as InGameScene).cursors;
    const speed = this.moveSpeed;
    let xSpeed = left.isDown ? -speed : right.isDown ? speed : 0;
    let ySpeed = up.isDown ? -speed : down.isDown ? speed : 0;

    this.emit('moved');
    this.sprite.anims.play(`pixel_animals_move${this.frameNo}`, true);
    if (xSpeed < 0) {
      this.sprite.setFlipX(false);
      this.direction = 'left';
    } else if (xSpeed > 0) {
      this.sprite.setFlipX(true);
      this.direction = 'right';
    }
    this.tween = this.scene.tweens.add({
      targets: this,
      x: this.x + xSpeed,
      y: this.y + ySpeed,
      duration: this.moveSpeed * MOVE_SPEED_RANK,
      ease: 'Power2',
    });
  }
  getUpgradeCost(id: string) {
    if (this[id] >= 200) {
      return { rock: this[id] * 20, tree: this[id] * 20, gold: this[id] * 2 };
    }
    return { rock: this[id] * 5, tree: this[id] * 5, gold: 0 };
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
