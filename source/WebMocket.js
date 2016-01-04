let instanceCallbacks = new Map();
let realWebSocket = window.WebSocket;

export class WebMocket {
    constructor(url) {
        this.url = url;
        this.readyState = realWebSocket.OPEN;
        instanceCallbacks.set(this, new Map());
    }
    
    addEventListener(event, callback) {
        let events = instanceCallbacks.get(this);
        
        if (!events.has(event)) {
            events.set(event, []);
        }
        
        let callbacks = events.get(event);
        callbacks.push(callback);
    }
}

export class MocketServer {
    constructor(url) {
        this.url = url;
    }
    send(data) {
        instanceCallbacks.forEach((events, socket) => {
            if (socket.url === this.url) {
                let event = new MessageEvent('message', {data: data}),
                    messageCallbacks = events.get('message');

                if (typeof messageCallbacks !== 'undefined') {
                    messageCallbacks.forEach(callback => {
                        callback(event); 
                    });
                }
                if (typeof socket.onmessage === 'function') {
                    socket.onmessage(event);
                }
            } 
        });
    }
}