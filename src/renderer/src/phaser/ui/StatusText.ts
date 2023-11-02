import { getUIStyle } from '@/phaser/constants';

export class StatusText extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, { x, y, template }: { x: number; y: number; template: string }) {
    super(scene, x, y, template, getUIStyle());
    scene.add.existing(this);
  }
}
