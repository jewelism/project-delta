// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

const socket = (window as any).io(`http://localhost:3001`);

socket.on("error", (e) => {
  console.log(e); // not displayed
});
socket.on("ok", () => {
  console.log("OK received renderer"); // not displayed
});
socket.on("connect", () => {
  console.log("connected renderer"); // displayed
  // socket.emit("test", "test msg");
});

setTimeout(() => {
  console.log("sending test msg");

  socket.emit("test", "test msg");
}, 2000);
