export class Resource extends Phaser.Physics.Arcade.Image {
  health: number = 100;

  constructor(scene, { x, y, name }) {
    super(scene, x, y, name);
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    scene.physics.add.existing(this);

    this.setName(name).setOrigin(0, 0).setDepth(10).setCollideWorldBounds(true);
  }
  increaseHealth(amount: number) {
    this.health += amount;
  }
  decreaseHealth(amount: number) {
    this.health -= amount;
  }
}
