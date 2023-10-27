import { TitleText } from '@/phaser/ui/TitleText';
import { io } from 'socket.io-client';

export class StartScene extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('StartScene');
  }
  preload() {}
  create() {
    const socket = io(`http://localhost:20058`);

    socket.on('error', (e) => {
      console.log(e); // not displayed
    });
    socket.on('connect', () => {
      console.log('connected renderer', localStorage.getItem('token')); // displayed
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    const title = new TitleText(this, 'Project Delta');
    console.log('title', title.x, title.y);

    const pressAnyKeyText = this.add
      // .text(title.x, title.y + 500, 'press any key', {
      .text(50, 50, 'press any key', {
        fontSize: '20px',
        color: '#ffaabb',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: pressAnyKeyText,
      alpha: 0,
      duration: 600,
      ease: 'Power2',
      yoyo: true,
      repeat: -1,
    });
    const onKeydown = () => {
      socket.emit('test', 'test msg1');
      // this.scene.start('SelectLevelScene');
    };
    this.input.keyboard.on('keydown', onKeydown);
    this.input.on('pointerdown', onKeydown);
  }
}
