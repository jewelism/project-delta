import { Enemy } from '@/phaser/objects/Enemy';
import { getDirectionAngleBySpeed } from '@/phaser/utils/helper';

export class Beam extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 100;
  target: Phaser.GameObjects.GameObject;

  constructor(scene, { shooter, target }) {
    super(scene, shooter.x, shooter.y, 'beam_green');

    this.target = target;
    this.setScale(0.5).setOrigin(0, 0).setDepth(999);

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    // scene.m_beamSound.play();
    scene.physics.add.overlap(this, target, (beam, enemy: Enemy) => {
      beam.destroy();
      enemy.decreaseHp(shooter.attackDamage);
    });
  }
  protected preUpdate(_time: number, _delta: number): void {
    this.moveToTarget();
  }
  moveToTarget() {
    const target = this.target as any;
    if (!target || target.isDestroyed()) {
      this.destroy();
      return;
    }
    const angle = getDirectionAngleBySpeed(target.x - this.x, target.y - this.y);
    this.setAngle(angle + 90);

    this.scene.physics.moveToObject(this, target, Beam.SPEED);
  }
}
