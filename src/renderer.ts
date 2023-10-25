/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

import * as Colyseus from "colyseus.js"; // not necessary if included via <script> tag.

// const Colyseus = require("colyseus.js");

console.log("renderer.ts");
const client = new Colyseus.Client("ws://localhost:2567");

client
  .joinOrCreate("room_name")
  .then((room) => {
    console.log(room.sessionId, "joined", room.name);
  })
  .catch((e) => {
    console.log("JOIN ERROR", e);
  });
