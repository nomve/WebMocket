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

function socketEvents() {
    let events = new Map();
    ['open', 'message', 'close'].forEach(event => events.set(event, []));
    
    return events;
}

function transfer(eventName, data, events, receiver) {
    if (receiver.url === this.url) {
        let eventData;
        
        switch(eventName) {
        case 'message':
            eventData = new MessageEvent('message', {data: data});
            break;
        case 'close':
            eventData = new CloseEvent('close', {
                code: data.code,
                reason: data.reason
            });
            break;
        }

        events.get(eventName).forEach(callback => {
            callback(eventData); 
        });
        if (typeof receiver['on' + eventName] === 'function') {
            receiver['on' + eventName](eventData);
        }
    }
}

class Connection {
    constructor(url) {
        this.url = url;
    }
    
    close(code, reason) {
        socketCallbacks.forEach(transfer.bind(this, 'close', {code, reason}));
        serverCallbacks.forEach(transfer.bind(this, 'close', {code, reason}));
        
        socketCallbacks.forEach((events, socket) => {
            if (socket.url === this.url) {
                socketCallbacks.delete(socket);
            }
        });
        serverCallbacks.forEach((events, server) => {
            if (server === this) {
                serverCallbacks.delete(this);
            }
        });
    }
}

export class WebMocket extends Connection {
    constructor(url) {
        super(url);
        this.readyState = realWebSocket.CONNECTING;
        socketCallbacks.set(this, socketEvents());
        openSocket(this);
    }
    
    send(data) {
        serverCallbacks.forEach(transfer.bind(this, 'message', data));
    }
    
    addEventListener(event, callback) {
        let events = socketCallbacks.get(this);
        
        let callbacks = events.get(event);
        
        if (typeof callbacks !== 'undefined') {
            callbacks.push(callback);   
        }
    }
}

export class MocketServer extends Connection {
    constructor(url) {
        super(url);
        serverCallbacks.set(this, socketEvents());
    }
    
    send(data) {
        socketCallbacks.forEach(transfer.bind(this, 'message', data));
    }
    
    addEventListener(event, callback) {
        let events = serverCallbacks.get(this);
        
        let callbacks = events.get(event);
        
        if (typeof callbacks !== 'undefined') {
            callbacks.push(callback);   
        }
    }
}