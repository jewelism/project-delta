const HP_BAR = {
  WIDTH: 30,
  HEIGHT: 6,
};

export class HpBar extends Phaser.GameObjects.Graphics {
  maxHp: number;

  constructor(scene, { maxHp }) {
    super(scene);

    this.maxHp = maxHp;

    scene.add.existing(this);
    this.updateHpBar(this.maxHp);
  }
  updateHpBar(hp: number) {
    this.clear();
    this.fillStyle(0xff0000, 1);
    const hpWidth = (hp / this.maxHp) * HP_BAR.WIDTH;

    const ownerHpBarGapY = 10;

    this.fillRect(-HP_BAR.WIDTH / 2, ownerHpBarGapY, hpWidth, HP_BAR.HEIGHT);
    this.strokeRect(-HP_BAR.WIDTH / 2, ownerHpBarGapY, HP_BAR.WIDTH, HP_BAR.HEIGHT);
    this.strokePath();
  }
}
