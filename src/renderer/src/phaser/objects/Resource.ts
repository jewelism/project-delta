export class Resource extends Phaser.Physics.Arcade.Image {
  constructor(scene, { x, y, name }) {
    super(scene, x, y, name);
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    scene.physics.add.existing(this);

    this.setName(name).setOrigin(0, 0).setDepth(10).setCollideWorldBounds(true);
  }
}
