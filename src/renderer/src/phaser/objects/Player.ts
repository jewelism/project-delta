import { Enemy } from '@/phaser/objects/Enemy';
import { Resource } from '@/phaser/objects/Resource';
import { Beam } from '@/phaser/objects/weapons/Beam';
import { InGameScene } from '@/phaser/scenes/InGameScene';
import { EaseText } from '@/phaser/ui/EaseText';
import { createThrottleFn, createFlashFn } from '@/phaser/utils/helper';

const keyActions = {
  Q: createThrottleFn(),
  W: createThrottleFn(),
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  // attackRange: number = 50;
  attackRange: number = 500;
  attackSpeed: number = 100;
  attackDamage: number = 100;
  defence: number = 100;
  moveSpeed: number = 75;
  // moveSpeed: number = 200;
  attackRangeCircle: Phaser.GameObjects.Graphics;
  spriteKey: string;
  maxHp: number = 100;
  hp: number = this.maxHp;
  keyboard: Record<string, Phaser.Input.Keyboard.Key> = {};
  direction: string;
  frameNo: any;

  constructor(scene: Phaser.Scene, { x, y, frameNo }) {
    super(scene, x, y, 'pixel_animals', frameNo);

    this.frameNo = frameNo;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setOrigin(0, 0).setBodySize(12, 18).setDepth(9).setCollideWorldBounds(true);

    ['Q', 'W'].forEach((key) => {
      this.keyboard[key] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]);
    });

    this.anims.create({
      key: `pixel_animals_move${frameNo}`,
      frames: this.anims.generateFrameNames('pixel_animals', {
        // prefix: 'pixel_animals_walk_',
        frames: [frameNo, frameNo + 1],
      }),
      frameRate: 12,
      repeat: -1,
    });
  }
  isDestroyed() {
    return !this.active;
  }
  preUpdate() {
    this.playerMoveWithKeyboard();
    Object.keys(keyActions).forEach((key) => {
      if (this.keyboard[key].isDown) {
        keyActions[key](this.scene, this[`press${key}`].bind(this), this.getAttackSpeedMs());
      }
    });
  }
  pressQ() {
    this.getherResource();
  }
  pressW() {
    this.shootBeamToClosestEnemy();
  }
  getherResource() {
    const { resources } = this.scene as InGameScene;
    const closest = this.scene.physics.closest(this, resources.getChildren()) as Resource;

    const { x: closestX, y: closestY } = closest.getCenter();
    const { x, y } = this.getCenter();
    const distance = Phaser.Math.Distance.Between(x, y, closestX, closestY);

    if (distance > this.attackRange) {
      return;
    }
    const resourceReward = closest.decreaseHp(this.attackDamage);

    (this.scene as InGameScene).resourceStates[closest.name].increase(resourceReward);
  }
  shootBeamToClosestEnemy() {
    if ((this.scene as InGameScene).enemies?.getChildren().length === 0) {
      return;
    }
    const closestEnemy = this.scene.physics.closest(
      this,
      (this.scene as InGameScene).enemies.getChildren(),
    );
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      (closestEnemy as Enemy).x,
      (closestEnemy as Enemy).y,
    );
    if (distance > this.attackRange) {
      return;
    }
    new Beam(this.scene, {
      shooter: this,
      target: closestEnemy,
    })
      .setX(this.x)
      .setY(this.y);
  }
  getAttackSpeedMs() {
    return (250 - this.attackSpeed) * 10;
  }
  playerMoveWithKeyboard() {
    const { left, right, up, down } = (this.scene as InGameScene).cursors;
    const speed = this.moveSpeed;
    const xSpeed = left.isDown ? -speed : right.isDown ? speed : 0;
    const ySpeed = up.isDown ? -speed : down.isDown ? speed : 0;
    if (xSpeed === 0 && ySpeed === 0) {
      this.setVelocity(0);
      return;
    }
    this.emit('moved');
    this.setVelocity(xSpeed, ySpeed);
    this.anims.play(`pixel_animals_move${this.frameNo}`, true);
    if (xSpeed < 0) {
      this.setFlipX(false);
      this.direction = 'left';
    } else if (xSpeed > 0) {
      this.setFlipX(true);
      this.direction = 'right';
    }
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
    createFlashFn()(this);
    new EaseText(this.scene, { x: this.x, y: this.y, text: `${amount}`, color: '#ff0000' });
    if (this.hp <= 0) {
      this.destroy();
    }
  }
}
