# WebMocket

A WebSocket mock, that makes unit testing possible when there is a WebSocket connection involved. It is advisable to check out [mock-socket](https://github.com/thoov/mock-socket) that does the same thing and a bit more. However, at the time of this writing, it had problems working in Firefox.

## Installation
```shell
npm install webmocket
```
## Usage
```
let wm = require('webmocket'),
    WebMocket = wm.WebMocket,
    MocketServer = wm.MocketServer;
    
window.WebSocket = WebMocket;
let socket = new WebSocket('test-url'),
    server = new MocketServer('test-url');

socket.addEventListener('message', function...);
socket.onmessage = function...

server.send([1, 2, 3, 4]);
// when finished
server.close();
```

**Important**: if you are counting on the `socket.onopen` event firing, send data using a `setTimeout`. This is because the open event fires using a timeout after the socket instance has been created.

```
setTimeout(function() {
    server.send(...);
}, 0);
```
