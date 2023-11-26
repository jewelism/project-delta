const TEXT_STYLE = {
  fontSize: 14,
  fontStyle: 'bold',
  color: '#000000',
  stroke: '#ffffff', // 테두리 색상
  strokeThickness: 2, // 테두리 두께
};

export class UpgradeButton extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, { x, y, width, height, spriteKey, desc, onClick }) {
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
    const rockIcon = new Phaser.GameObjects.Sprite(scene, 10, 3, 'rock').setScale(0.5);
    const rockText = new Phaser.GameObjects.Text(scene, 20, -5, '1', TEXT_STYLE);
    const treeIcon = new Phaser.GameObjects.Sprite(scene, 50, 3, 'tree').setScale(0.35);
    const treeText = new Phaser.GameObjects.Text(scene, 60, -5, '1', TEXT_STYLE);

    const upgradeResource = new Phaser.GameObjects.Container(
      scene,
      button.width + 10,
      button.height / 2 - 15,
      [rockIcon, rockText, treeIcon, treeText],
    );
    const upgradeButton = new Phaser.GameObjects.Container(scene, 0, 0, [button, icon]);
    const descText = new Phaser.GameObjects.Text(
      scene,
      button.width + 10,
      button.height / 2,
      desc,
      TEXT_STYLE,
    );
    this.add([upgradeResource, descText, upgradeButton]);
    scene.add.existing(this);
  }
}
