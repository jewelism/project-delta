import { Enemy } from '@/phaser/objects/Enemy';
import { Resource } from '@/phaser/objects/Resource';
import { Beam } from '@/phaser/objects/weapons/Beam';
import { InGameScene } from '@/phaser/scenes/InGameScene';
import { EaseText } from '@/phaser/ui/EaseText';
import { createThrottleFn, createMoveAnim, playMoveAnim } from '@/phaser/utils/helper';

const throttle = createThrottleFn();
const throttle2 = createThrottleFn();

export class Player extends Phaser.Physics.Arcade.Sprite {
  attackRange: number = 50;
  attackSpeed: number = 100;
  attackDamage: number = 100;
  defence: number = 100;
  moveSpeed: number = 75;
  attackRangeCircle: Phaser.GameObjects.Graphics;
  spriteKey: string;
  maxHp: number = 100;
  hp: number = this.maxHp;

  constructor(scene: Phaser.Scene, { x, y, spriteKey }) {
    super(scene, x, y, spriteKey);

    this.spriteKey = spriteKey;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setOrigin(0, 0).setBodySize(12, 18).setDepth(9).setCollideWorldBounds(true);

    this.bindPressQ();
    createMoveAnim(this, spriteKey);
  }

  preUpdate() {
    playMoveAnim(this, this.spriteKey);
    this.playerMoveWithKeyboard();
    this.shoot();
  }
  bindPressQ() {
    // GATHER resources
    this.scene.input.keyboard.on('keydown-Q', () => {
      throttle2(this.scene, this.pressQ.bind(this), this.getAttackSpeedMs());
    });
    return this;
  }
  pressQ() {
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
  attackW() {}
  shoot() {
    const fn = () => {
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
    };
    throttle(this.scene, fn, this.getAttackSpeedMs());
  }
  getAttackSpeedMs() {
    return (250 - this.attackSpeed) * 10;
  }
  getMoveSpeed() {
    return this.moveSpeed;
  }
  playerMoveWithKeyboard() {
    this.emit('moved');
    const { left, right, up, down } = (this.scene as InGameScene).cursors;
    const speed = this.getMoveSpeed();
    // const xSpeed = left.isDown ? -speed : right.isDown ? speed : 0;
    // const ySpeed = up.isDown ? -speed : down.isDown ? speed : 0;
    let xSpeed = 0;
    let ySpeed = 0;
    if (left.isDown) {
      xSpeed = -speed;
    } else if (right.isDown) {
      xSpeed = speed;
    } else if (up.isDown) {
      ySpeed = -speed;
    } else if (down.isDown) {
      ySpeed = speed;
    }
    this.setVelocity(xSpeed, ySpeed);
  }
  getUpgradeCost(id: string) {
    if (this[id] >= 200) {
      return { rock: this[id] * 20, tree: this[id] * 20, gold: this[id] * 2 };
    }
    return { rock: this[id] * 5, tree: this[id] * 5, gold: 0 };
  }
}
