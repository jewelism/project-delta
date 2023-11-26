export class IconButton extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, { x, y, width, height, spriteKey, onClick }) {
    super(scene, x, y);

    const button = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height)
      .setStrokeStyle(2, 0x0000ff, 1)
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerdown', () => {
        button.setAlpha(0.4);
        icon.setAlpha(0.4);
        onClick();
      })
      .on('pointerup', () => {
        button.setAlpha(1);
        icon.setAlpha(1);
      })
      .on('pointerover', () => {})
      .on('pointerout', () => {
        button.setAlpha(1);
        icon.setAlpha(1);
      });
    const icon = new Phaser.GameObjects.Sprite(
      scene,
      button.width / 2,
      button.height / 2,
      spriteKey,
    );

    const buttonContainer = new Phaser.GameObjects.Container(scene, 0, 0, [button, icon]);

    this.add(buttonContainer);
    scene.add.existing(this);
  }
}
