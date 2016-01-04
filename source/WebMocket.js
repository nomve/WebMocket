let instanceCallbacks = new Map();
let realWebSocket = window.WebSocket;

function openSocket(socket) {
    let events = instanceCallbacks.get(socket);
    
    setTimeout(() => {
        socket.readyState = realWebSocket.OPEN;
        events.get('open').forEach(callback => {
            callback();
        });
        if (typeof socket.onopen === 'function') {
            socket.onopen();
        }
    }, 0);
}

function initSocketEvents(socket) {
    let events = new Map();
    ['open', 'message'].forEach(event => events.set(event, []));

    instanceCallbacks.set(socket, events);
}

export class WebMocket {
    constructor(url) {
        this.url = url;
        this.readyState = realWebSocket.CONNECTING;
        
        initSocketEvents(this);
        openSocket(this);
    }
    
    addEventListener(event, callback) {
        let events = instanceCallbacks.get(this);
        
        let callbacks = events.get(event);
        
        if (typeof callbacks !== 'undefined') {
            callbacks.push(callback);   
        }
    }
}

export class MocketServer {
    constructor(url) {
        this.url = url;
    }
    send(data) {
        instanceCallbacks.forEach((events, socket) => {
            if (socket.url === this.url) {
                let event = new MessageEvent('message', {data: data});
                
                events.get('message').forEach(callback => {
                    callback(event); 
                });
                if (typeof socket.onmessage === 'function') {
                    socket.onmessage(event);
                }
            } 
        });
    }
}