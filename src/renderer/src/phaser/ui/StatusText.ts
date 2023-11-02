import { getUIStyle } from '@/phaser/constants';

export class StatusText extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    { x, y, text, texture }: { x: number; y: number; text: string; texture: string },
  ) {
    super(scene, x, y, text, getUIStyle());
    const image = scene.add
      .image(x - 20, y - 3, texture)
      .setDisplaySize(20, 20)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(9999);
    console.log(image.width, image.height, texture);

    const backgroundColor = new Phaser.GameObjects.Rectangle(
      scene,
      x - 20,
      y - 3,
      20,
      20,
      0xffffff,
    );
    backgroundColor.setOrigin(0).setScrollFactor(0).setDepth(9998);
    scene.add.existing(backgroundColor);

    this.setScrollFactor(0).setDepth(9999);
    scene.add.existing(this);
  }
}
