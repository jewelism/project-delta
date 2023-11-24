import { getUIStyle } from '@/phaser/constants';

export class ResourceState extends Phaser.GameObjects.Text {
  resourceAmount: number;

  constructor(
    scene: Phaser.Scene,
    { x, y, initAmount, texture }: { x: number; y: number; initAmount: number; texture: string },
  ) {
    super(scene, x, y, String(initAmount), getUIStyle());
    this.resourceAmount = initAmount;

    scene.add
      .image(x - 25, y - 3, texture)
      .setDisplaySize(20, 20)
      .setOrigin(0)
      .setScrollFactor(0.1)
      .setDepth(9999);

    const backgroundColor = new Phaser.GameObjects.Rectangle(
      scene,
      x - 25,
      y - 3,
      20,
      20,
      0xffffff,
    );
    backgroundColor.setOrigin(0).setScrollFactor(0).setDepth(9998);
    scene.add.existing(backgroundColor);

    this.setScrollFactor(0).setDepth(9999).setName(texture);
    scene.add.existing(this);
  }
  increase(amount: number) {
    this.resourceAmount += amount;
    this.setText(String(this.resourceAmount));
  }
  decrease(amount: number) {
    this.resourceAmount -= amount;
    this.setText(String(this.resourceAmount));
  }
}
