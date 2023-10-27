import io from 'socket.io-client';

export function init(): void {
  window.addEventListener('DOMContentLoaded', () => {
    doAThing();

    // TODO: input address
    const socket = io(`http://localhost:20058`);

    socket.on('error', (e) => {
      console.log(e); // not displayed
    });
    socket.on('connect', () => {
      console.log('connected renderer', localStorage.getItem('token')); // displayed
      socket.emit('test', 'test msg1');
    });
  });
}

function doAThing(): void {
  const versions = window.electron.process.versions;
  replaceText('.electron-version', `Electron v${versions.electron}`);
  replaceText('.chrome-version', `Chromium v${versions.chrome}`);
  replaceText('.node-version', `Node v${versions.node}`);
  replaceText('.v8-version', `V8 v${versions.v8}`);
}

function replaceText(selector: string, text: string): void {
  const element = document.querySelector<HTMLElement>(selector);
  if (element) {
    element.innerText = text;
  }
}

init();
