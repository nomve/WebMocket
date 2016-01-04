let socketCallbacks = new Map();
let serverCallbacks = new Map();
let realWebSocket = window.WebSocket;

function openSocket(socket) {
    let events = socketCallbacks.get(socket);
    
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

function initSocketEvents() {
    let events = new Map();
    ['open', 'message'].forEach(event => events.set(event, []));
    
    return events;
}

function transferMessage(data, events, server) {
    if (server.url === this.url) {
        let event = new MessageEvent('message', {data: data});

        events.get('message').forEach(callback => {
            callback(event); 
        });
        if (typeof server.onmessage === 'function') {
            server.onmessage(event);
        }
    }
}
export class WebMocket {
    constructor(url) {
        this.url = url;
        this.readyState = realWebSocket.CONNECTING;
        
        let events = initSocketEvents(this);
        socketCallbacks.set(this, events);
        openSocket(this);
    }
    
    send(data) {
        serverCallbacks.forEach(transferMessage.bind(this, data));
    }
    
    addEventListener(event, callback) {
        let events = socketCallbacks.get(this);
        
        let callbacks = events.get(event);
        
        if (typeof callbacks !== 'undefined') {
            callbacks.push(callback);   
        }
    }
}

export class MocketServer {
    constructor(url) {
        this.url = url;
        
        let events = initSocketEvents(this);
        serverCallbacks.set(this, events);
    }
    send(data) {
        socketCallbacks.forEach(transferMessage.bind(this, data));
    }
    
    addEventListener(event, callback) {
        let events = serverCallbacks.get(this);
        
        let callbacks = events.get(event);
        
        if (typeof callbacks !== 'undefined') {
            callbacks.push(callback);   
        }
    }
}