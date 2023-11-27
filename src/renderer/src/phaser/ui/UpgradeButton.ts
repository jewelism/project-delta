import { UPGRADE_TEXT_STYLE } from '@/phaser/constants';
import { IconButton } from '@/phaser/ui/IconButton';

export class UpgradeButton extends Phaser.GameObjects.Container {
  max: number;
  upgradeStateText: Phaser.GameObjects.Text;
  constructor(
    scene: Phaser.Scene,
    { x, y, width, height, shortcutText, spriteKey, desc, max, onClick },
  ) {
    super(scene, x, y);
    this.max = max;

    const buttonContainer = new IconButton(scene, {
      x: 0,
      y: 0,
      width,
      height,
      shortcutText,
      spriteKey,
      onClick,
    });
    const descText = new Phaser.GameObjects.Text(
      scene,
      width + 10,
      height / 2,
      desc,
      UPGRADE_TEXT_STYLE,
    );
    this.upgradeStateText = new Phaser.GameObjects.Text(
      scene,
      width + 10,
      height / 2,
      `(1 / ${this.max})`,
      UPGRADE_TEXT_STYLE,
    );

    const rock = [
      new Phaser.GameObjects.Sprite(scene, 10, 3, 'rock').setScale(0.5),
      new Phaser.GameObjects.Text(scene, 20, -5, '1', UPGRADE_TEXT_STYLE),
    ];
    const tree = [
      new Phaser.GameObjects.Sprite(scene, 50, 3, 'tree').setScale(0.35),
      new Phaser.GameObjects.Text(scene, 60, -5, '1', UPGRADE_TEXT_STYLE),
    ];
    const upgradeResource = new Phaser.GameObjects.Container(scene, width + 10, height / 2 - 15, [
      ...rock,
      ...tree,
    ]);

    this.add([buttonContainer, upgradeResource, descText, this.upgradeStateText]);
    scene.add.existing(this);
  }
  setStateText(text: string) {}
}
