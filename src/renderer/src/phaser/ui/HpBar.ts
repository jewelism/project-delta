const HP_BAR = {
  WIDTH: 36,
  HEIGHT: 8,
};

export class HpBar extends Phaser.GameObjects.Graphics {
  hp: number;
  maxHp: number;
  owner: any;

  constructor(scene, { maxHp, owner }) {
    super(scene);

    this.hp = 500;
    // this.hp = maxHp;
    this.maxHp = maxHp;
    this.owner = owner;

    scene.add.existing(this);
    this.updateHpBar();
  }
  updateHpBar() {
    this.clear();
    this.fillStyle(0xff0000, 1);
    const hpWidth = (this.hp / this.maxHp) * HP_BAR.WIDTH;

    const ownerHpBarGap = 5;

    this.fillRect(
      this.owner.x + this.owner.width / 2 - HP_BAR.WIDTH / 2,
      this.owner.y + this.owner.height + ownerHpBarGap,
      hpWidth,
      HP_BAR.HEIGHT,
    );

    this.strokeRect(
      this.owner.x + this.owner.width / 2 - HP_BAR.WIDTH / 2,
      this.owner.y + this.owner.height + ownerHpBarGap,
      HP_BAR.WIDTH,
      HP_BAR.HEIGHT,
    );
    this.strokePath();
  }
}
