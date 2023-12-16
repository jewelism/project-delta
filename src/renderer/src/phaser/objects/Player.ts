import { Animal } from '@/phaser/objects/Animal';
import { Enemy } from '@/phaser/objects/Enemy';
import { Resource } from '@/phaser/objects/Resource';
import { Beam } from '@/phaser/objects/weapons/Beam';
import { InGameScene } from '@/phaser/scenes/InGameScene';
import { createThrottleFn } from '@/phaser/utils/helper';

const keyActions = {
  Q: createThrottleFn(),
  W: createThrottleFn(),
};

export class Player {
  body: Animal;
  keyboard: Record<string, Phaser.Input.Keyboard.Key> = {};

  constructor(scene: Phaser.Scene, { x, y, hp, spriteKey, frameNo }) {
    this.body = new Animal(scene, { x, y, hp, spriteKey, frameNo });

    this.body.preUpdate = this.preUpdate.bind(this);

    // this.sprite.setBodySize(12, 12).setDepth(9).setCollideWorldBounds(true);

    ['Q', 'W'].forEach((key) => {
      this.keyboard[key] = this.body.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[key],
      );
    });
  }
  preUpdate() {
    this.playerVelocityMoveWithKeyboard();
    Object.keys(keyActions).forEach((key) => {
      if (this.keyboard[key].isDown) {
        keyActions[key](
          this.body.scene,
          this[`press${key}`].bind(this),
          this.body.getAttackSpeedMs(),
        );
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
    const { resources } = this.body.scene as InGameScene;
    const closest = this.body.scene.physics.closest(this.body, resources.getChildren()) as Resource;

    const { x: closestX, y: closestY } = closest.getCenter();
    const { x, y } = this.body.sprite.getCenter();
    const distance = Phaser.Math.Distance.Between(x, y, closestX, closestY);

    if (distance > this.body.attackRange) {
      return;
    }
    const resourceReward = closest.decreaseHp(this.body.attackDamage);

    (this.body.scene as InGameScene).resourceStates[closest.name].increase(resourceReward);
  }
  shootBeamToClosestEnemy() {
    if ((this.body.scene as InGameScene).enemies?.getChildren().length === 0) {
      return;
    }
    const closestEnemy = this.body.scene.physics.closest(
      this.body,
      (this.body.scene as InGameScene).enemies.getChildren(),
    ) as unknown as Enemy;
    const distance = Phaser.Math.Distance.Between(
      this.body.x,
      this.body.y,
      closestEnemy.body.x,
      closestEnemy.body.y,
    );
    if (distance > this.body.attackRange) {
      return;
    }
    new Beam(this.body.scene, {
      shooter: this.body,
      target: closestEnemy,
    })
      .setX(this.body.x)
      .setY(this.body.y);
  }
  playerVelocityMoveWithKeyboard() {
    const { left, right, up, down } = (this.body.scene as InGameScene).cursors;
    const speed = this.body.moveSpeed;
    const xSpeed = left.isDown ? -speed : right.isDown ? speed : 0;
    const ySpeed = up.isDown ? -speed : down.isDown ? speed : 0;
    (this.body.body as any).setVelocity(xSpeed, ySpeed);
    if (xSpeed === 0 && ySpeed === 0) {
      return;
    }
    this.body.sprite.anims.play(`pixel_animals_move${this.body.frameNo}`, true);
  }
  getUpgradeCost(id: string) {
    if (this.body[id] >= 200) {
      return { rock: this.body[id] * 20, tree: this.body[id] * 20, gold: this.body[id] * 2 };
    }
    return { rock: this.body[id] * 5, tree: this.body[id] * 5, gold: 0 };
  }
}
