import { Resource } from '@/phaser/objects/Resource';
import { InGameScene } from '@/phaser/scenes/InGameScene';
import { EaseText } from '@/phaser/ui/EaseText';
import { createMoveAnim, playMoveAnim } from '@/phaser/utils/helper';

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

    // this.missiles = scene.add.group();

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
  }
  bindPressQ() {
    // GATHER resources
    let canPressQ = true;
    this.scene.input.keyboard.on('keydown-Q', () => {
      if (canPressQ) {
        const { resources } = this.scene as InGameScene;
        const closest: Resource & any = this.scene.physics.closest(this, resources.getChildren());

        const { x: closestX, y: closestY } = closest.getCenter();
        const { x, y } = this.getCenter();
        const distance = Phaser.Math.Distance.Between(x, y, closestX, closestY);

        if (distance > this.attackRange) {
          return;
        }
        closest.setTint(0xff0000);
        const resourceReward = closest.decreaseHealth(this.attackDamage);
        new EaseText(this.scene, {
          x: (closest as any).x,
          y: (closest as any).y,
          text: `+${resourceReward}`,
          color: closest.name === 'rock' ? '#84b4c8' : '#619196',
        });
        (this.scene as InGameScene).resourceStates[closest.name].increase(resourceReward);

        this.scene.time.delayedCall(150, () => {
          closest.clearTint();
        });

        canPressQ = false;
        this.scene.time.delayedCall(this.getAttackSpeedMs(), () => {
          canPressQ = true;
        });
      }
    });
    return this;
  }
  attackW() {}
  // shoot() {
  //   if ((this.scene as InGameScene).enemies?.getChildren().length === 0) {
  //     return;
  //   }
  //   const closestEnemy = this.scene.physics.closest(
  //     this,
  //     (this.scene as PlayScene).enemies.getChildren()
  //   );
  //   const distance = Phaser.Math.Distance.Between(
  //     this.x,
  //     this.y,
  //     (closestEnemy as Enemy).x,
  //     (closestEnemy as Enemy).y
  //   );
  //   if (distance > this.attackRange) {
  //     return;
  //   }
  //   this.createMissile();
  // }
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

    const xSpeed = left.isDown ? -speed : right.isDown ? speed : 0;
    const ySpeed = up.isDown ? -speed : down.isDown ? speed : 0;

    this.setVelocityX(xSpeed);
    this.setVelocityY(ySpeed);
  }
  getUpgradeCost(id: string) {
    if (this[id] >= 200) {
      return { rock: this[id] * 20, tree: this[id] * 20, gold: this[id] * 2 };
    }
    return { rock: this[id] * 5, tree: this[id] * 5, gold: 0 };
  }
}
