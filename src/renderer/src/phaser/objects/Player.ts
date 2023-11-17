import { Resource } from '@/phaser/objects/Resource';
import { InGameScene } from '@/phaser/scenes/InGameScene';

export class Player extends Phaser.Physics.Arcade.Sprite {
  attackTimer: Phaser.Time.TimerEvent;
  attackRange: number = 200;
  attackSpeed: number = 1000;
  damage: number = 1;
  moveSpeed: number = 500;
  spriteKey: string;

  constructor(scene, { x, y, spriteKey }) {
    super(scene, x, y, spriteKey);
    this.damage = 1;

    this.spriteKey = spriteKey;
    this.anims.create({
      key: `${spriteKey}-idle`,
      frames: [{ key: spriteKey, frame: 0 }],
    });
    [
      { key: `${spriteKey}-down`, frames: Array.from({ length: 4 }, (_, i) => i) },
      { key: `${spriteKey}-left`, frames: Array.from({ length: 4 }, (_, i) => i + 4) },
      { key: `${spriteKey}-right`, frames: Array.from({ length: 4 }, (_, i) => i + 8) },
      { key: `${spriteKey}-up`, frames: Array.from({ length: 4 }, (_, i) => i + 12) },
    ].forEach(({ key, frames }) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNames(spriteKey, {
          frames,
        }),
        frameRate: 24,
      });
    });
    scene.missiles = scene.add.group();

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setOrigin(0, 0).setBodySize(12, 18).setDepth(9).setCollideWorldBounds(true);

    this.attackQ();
    // scene.m_beamSound.play();
  }

  preUpdate() {
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
  attackQ() {
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
        closest.decreaseHealth(this.damage);
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
    const { left, right, up, down } = (this.scene as any).cursors;
    if (left.isDown && up.isDown) {
      this.setVelocityX(-this.getMoveSpeed());
      this.setVelocityY(-this.getMoveSpeed());
      this.anims.play(`${this.spriteKey}-left`, true);
    } else if (left.isDown && down.isDown) {
      this.setVelocityX(-this.getMoveSpeed());
      this.setVelocityY(this.getMoveSpeed());
      this.anims.play(`${this.spriteKey}-left`, true);
    } else if (right.isDown && up.isDown) {
      this.setVelocityX(this.getMoveSpeed());
      this.setVelocityY(-this.getMoveSpeed());
      this.anims.play(`${this.spriteKey}-right`, true);
    } else if (right.isDown && down.isDown) {
      this.setVelocityX(this.getMoveSpeed());
      this.setVelocityY(this.getMoveSpeed());
      this.anims.play(`${this.spriteKey}-right`, true);
    } else if (left.isDown) {
      this.setVelocityX(-this.getMoveSpeed());
      this.setVelocityY(0);
      this.anims.play(`${this.spriteKey}-left`, true);
    } else if (right.isDown) {
      this.setVelocityX(this.getMoveSpeed());
      this.setVelocityY(0);
      this.anims.play(`${this.spriteKey}-right`, true);
    } else if (up.isDown) {
      this.setVelocityX(0);
      this.setVelocityY(-this.getMoveSpeed());
      this.anims.play(`${this.spriteKey}-up`, true);
    } else if (down.isDown) {
      this.setVelocityX(0);
      this.setVelocityY(this.getMoveSpeed());
      this.anims.play(`${this.spriteKey}-down`, true);
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);
    }
  }
}
