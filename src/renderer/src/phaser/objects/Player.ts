export class Player extends Phaser.Physics.Arcade.Sprite {
  attackTimer: Phaser.Time.TimerEvent;
  attackRange: number = 200;
  attackSpeed: number = 300;
  damage: number;
  moveSpeed: number = 500;

  constructor(scene, { x, y, sprite }) {
    super(scene, x, y, sprite);
    this.damage = 1;

    // this.anims.create({
    //   key: "player-idle",
    //   frames: [{ key: "player", frame: 13 }],
    // });
    // [
    //   { key: "player-up", frames: [14, 17, 20, 23] },
    //   { key: "player-down", frames: [13, 16, 19, 22] },
    //   { key: "player-left", frames: [12, 15, 18, 21] },
    // ].forEach(({ key, frames }) => {
    //   this.anims.create({
    //     key,
    //     frames: this.anims.generateFrameNames("player", {
    //       frames,
    //     }),
    //     frameRate: 5,
    //   });
    // });
    scene.missiles = scene.add.group();

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setOrigin(0, 0).setCircle(5, 5, 10).setDepth(9).setCollideWorldBounds(true);

    // scene.m_beamSound.play();
  }

  preUpdate() {
    this.playerMove();
    // if (!this.attackTimer) {
    //   this.attackTimer = this.scene.time.delayedCall(
    //     this.attackSpeed / GAME.speed,
    //     () => {
    //       this.shoot();
    //       this.attackTimer = null;
    //     }
    //   );
    // }
  }
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
  playerMove() {
    const { left, right, up, down } = (this.scene as any).cursors;
    if (left.isDown && up.isDown) {
      this.setFlipX(true);
      this.setVelocityX(-this.getMoveSpeed());
      this.setVelocityY(-this.getMoveSpeed());
      // this.anims.play("player-left", true);
    } else if (left.isDown && down.isDown) {
      this.setFlipX(true);
      this.setVelocityX(-this.getMoveSpeed());
      this.setVelocityY(this.getMoveSpeed());
      // this.anims.play("player-left", true);
    } else if (right.isDown && up.isDown) {
      this.setFlipX(false);
      this.setVelocityX(this.getMoveSpeed());
      this.setVelocityY(-this.getMoveSpeed());
      // this.anims.play("player-left", true);
    } else if (right.isDown && down.isDown) {
      this.setFlipX(false);
      this.setVelocityX(this.getMoveSpeed());
      this.setVelocityY(this.getMoveSpeed());
      // this.anims.play("player-left", true);
    } else if (left.isDown) {
      this.setFlipX(true);
      this.setVelocityX(-this.getMoveSpeed());
      this.setVelocityY(0);
      // this.anims.play("player-left", true);
    } else if (right.isDown) {
      this.setFlipX(false);
      this.setVelocityX(this.getMoveSpeed());
      this.setVelocityY(0);
      // this.anims.play("player-left", true);
    } else if (up.isDown) {
      this.setVelocityX(0);
      this.setVelocityY(-this.getMoveSpeed());
      // this.anims.play("player-up", true);
    } else if (down.isDown) {
      this.setVelocityX(0);
      this.setVelocityY(this.getMoveSpeed());
      // this.anims.play("player-down", true);
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);
      // this.anims.play("player-idle");
    }
  }
}
