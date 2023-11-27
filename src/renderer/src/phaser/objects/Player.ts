import { Resource } from '@/phaser/objects/Resource';
import { InGameScene } from '@/phaser/scenes/InGameScene';
import { EaseText } from '@/phaser/ui/EaseText';
import { createMoveAnim, playMoveAnim } from '@/phaser/utils/helper';

export class Player extends Phaser.Physics.Arcade.Sprite {
  attackTimer: Phaser.Time.TimerEvent;
  attackRange: number = 200;
  attackSpeed: number = 1000;
  damage: number = 2;
  moveSpeed: number = 100;
  spriteKey: string;

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
    // scene.m_beamSound.play();
  }

  preUpdate() {
    playMoveAnim(this, this.spriteKey);
    this.playerMoveWithKeyboard();
    // if (!this.attackTimer) {
    //   this.attackTimer = this.scene.time.delayedCall(
    //     this.attackSpeed / GAME.speed,
    //     () => {
    //       this.attack();
    //       this.attackTimer = null;
    //     }
    //   );
    // }
  }
  attack() {}
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

        if (distance > 30) {
          return;
        }
        closest.setTint(0xff0000);
        const resourceReward = closest.decreaseHealth(this.damage);
        new EaseText(this.scene, {
          x: (closest as any).x,
          y: (closest as any).y,
          text: `+${resourceReward}`,
          color: closest.name === 'rock' ? '#84b4c8' : '#619196',
        });
        (this.scene as InGameScene).resourceStates
          .find(({ name }) => name === closest.name)
          .increase(this.damage);

        this.scene.time.delayedCall(150, () => {
          closest.clearTint();
        });

        canPressQ = false;
        this.scene.time.delayedCall(this.attackSpeed, () => {
          canPressQ = true;
        });
      }
    });
    return this;
  }
  attackW() {}
  // get upgradeCost() {
  //   return this.damage * 2;
  // }
  // shoot() {
  //   if ((this.scene as PlayScene).enemies?.getChildren().length === 0) {
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
  // createMissile() {
  //   new Missile(this.scene, {
  //     shooter: this,
  //     damage: this.damage,
  //   })
  //     .setX(this.x - 15)
  //     .setY(this.y + 15);
  // }

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
}
