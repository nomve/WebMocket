import {WebMocket,
            MocketServer} from '../source/WebMocket';

describe('WebMocket', () => {
    
    let socket,
        server,
        testUrl = 'test-url',
        realWebSocket = window.WebSocket;
    
    beforeEach(() => {
        window.WebSocket = WebMocket;
        socket = new WebSocket(testUrl);
        server = new MocketServer(testUrl);
    });
    
    it('should construct', () => {
        expect(socket).to.be.an('object');
    });
    
    it('should replace websocket', () => {
        expect(socket instanceof WebMocket).to.equal(true);
    });
    
    it('should accept url in the constructor and store it', () => {
        expect(socket.url).to.equal(testUrl);
    });
    
    it('should be able to receive data', () => {
        let spy = sinon.spy(),
            data = 1;
        socket.addEventListener('message', spy);
        server.send(data);
        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0].data).to.equal(data);
    });
    
    it('should receive data over the onmessage callback', () => {
        let spy = sinon.spy(),
            data = 0;
        socket.onmessage = spy;
        server.send(data);
        expect(spy.args[0][0].data).to.equal(data);
    });
    
    it('should have the connecting readystate on construction', () => {
        expect(socket.readyState).to.equal(realWebSocket.CONNECTING);
    });
    
    it('should change the readystate to open when ready', (asyncDone) => {
        setTimeout(() => {
            expect(socket.readyState).to.equal(realWebSocket.OPEN);
            asyncDone();
        }, 0);
    });
    
    it('should trigger the open event when ready', (asyncDone) => {
        let spy = sinon.spy();
        socket.addEventListener('open', spy);
        socket.onopen = spy;
        setTimeout(() => {
            expect(spy.callCount).to.equal(2);
            asyncDone();
        }, 0);
    });
});