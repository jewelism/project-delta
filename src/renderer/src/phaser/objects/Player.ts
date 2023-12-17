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
    this.body.moveSpeed = 70;
    this.body.setDepth(999);
    this.body.preUpdate = this.preUpdate.bind(this);

    ['Q', 'W', 'E'].forEach((key) => {
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
    this.shootBeamToClosestEnemy();
  }
  pressW() {
    this.getherResource();
  }
  pressE() {
    this.fiya();
  }
  fiya() {
    const particles = this.body.scene.add.particles(this.body.x, this.body.y, 'fire');

    // const emitter = particles.createEmitter({
    //   speed: { min: -100, max: 100 },
    //   angle: { min: -85, max: -95 },
    //   scale: { start: 1, end: 0 },
    //   blendMode: 'ADD',
    //   lifespan: 2000,
    //   emitZone: {
    //     type: 'random',
    //     source: new Phaser.Geom.Circle(0, 0, 100),
    //   },
    // });

    // 원하는 위치에 이터를 배치합니다.
  }
  getherResource() {
    const { resources } = this.body.scene as InGameScene;
    const closest = this.body.scene.physics.closest(this.body, resources.getChildren()) as Resource;

    const { x: closestX, y: closestY } = closest.getCenter();
    const { x, y } = this.body.sprite.getCenter();
    const distance = Phaser.Math.Distance.Between(x, y, closestX, closestY);

    console.log(distance, this.body.attackRange);
    // TODO: 가까이 있는데 멀리있는 리소스가 선택되는 버그. 메커니즘 바꿔야함
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
    this.body.flipSpriteByDirection();
    this.body.sprite.anims.play(`pixel_animals_move${this.body.frameNo}`, true);
  }
  getUpgradeCost(id: string) {
    if (this.body[id] >= 200) {
      return { rock: this.body[id] * 20, tree: this.body[id] * 20, gold: this.body[id] * 2 };
    }
    return { rock: this.body[id] * 5, tree: this.body[id] * 5, gold: 0 };
  }
}
