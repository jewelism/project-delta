import { IconButton } from '@/phaser/ui/IconButton';

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

    const buttonContainer = new IconButton(scene, {
      x: 0,
      y: 0,
      width,
      height,
      spriteKey,
      onClick,
    });
    const descText = new Phaser.GameObjects.Text(scene, width + 10, height / 2, desc, TEXT_STYLE);

    const rock = [
      new Phaser.GameObjects.Sprite(scene, 10, 3, 'rock').setScale(0.5),
      new Phaser.GameObjects.Text(scene, 20, -5, '1', TEXT_STYLE),
    ];
    const tree = [
      new Phaser.GameObjects.Sprite(scene, 50, 3, 'tree').setScale(0.35),
      new Phaser.GameObjects.Text(scene, 60, -5, '1', TEXT_STYLE),
    ];
    const upgradeResource = new Phaser.GameObjects.Container(scene, width + 10, height / 2 - 15, [
      ...rock,
      ...tree,
    ]);

    this.add([buttonContainer, upgradeResource, descText]);
    scene.add.existing(this);
  }
}
