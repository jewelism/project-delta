import { EaseText } from '@/phaser/ui/EaseText';
import { createFlashFn } from '@/phaser/utils/helper';

export class Resource extends Phaser.Physics.Arcade.Image {
  hp: number;

  constructor(scene, { x, y, name, hp }) {
    super(scene, x, y, name);

    this.hp = hp;
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    scene.physics.add.existing(this);

    this.setName(name).setOrigin(0, 0).setDepth(10).setCollideWorldBounds(true);
  }
  decreaseHp(amount: number) {
    const reward = this.hp - amount < 0 ? this.hp : amount;

    this.hp -= amount;
    this.damageEffect(amount, reward);
    if (this.hp <= 0) {
      this.destroy();
    }
    return reward;
  }
  damageEffect(damage: number, reward: number) {
    createFlashFn()(this);
    const color = this.name === 'rock' ? '#84b4c8' : '#619196';
    new EaseText(this.scene, { x: this.x, y: this.y, text: `${reward}`, color });
  }
}
