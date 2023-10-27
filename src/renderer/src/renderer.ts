import io from 'socket.io-client';
import { createPhaser } from '@/phaser';

function init(): void {
  window.addEventListener('DOMContentLoaded', () => {
    createPhaser();

    // TODO: input address
  });
}

init();
