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
    
    it('should be able to send data to the server', () => {
        let spy = sinon.spy();
        server.addEventListener('message', spy);
        
        let data = 1;
        socket.send(data);
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
    
    it('should trigger the close event when closed by server', () => {
        let spy = sinon.spy();
        socket.addEventListener('close', spy);
        socket.onclose = spy;
        server.addEventListener('close', spy);
        server.onclose = spy;
        server.close();
        expect(spy.callCount).to.equal(4);
    });
    
    it('should trigger the close event when closed by client', () => {
        let spy = sinon.spy();
        socket.addEventListener('close', spy);
        socket.onclose = spy;
        server.addEventListener('close', spy);
        server.onclose = spy;
        socket.close();
        expect(spy.callCount).to.equal(4);
    });
    
    it('should pass close event data on close', () => {
        let spy = sinon.spy();
        socket.onclose = spy;
        
        let code = 999,
            reason = 'reason';
        server.close(code, reason);
        
        let eventData = spy.args[0][0];
        expect(eventData.code).to.equal(code);
        expect(eventData.reason).to.equal(reason);
    });
    
    it('should not pass data if the connection was closed by server', () => {
        let spy = sinon.spy();
        socket.onmessage = spy;
        
        server.close();
        server.send(0);
        
        expect(spy.callCount).to.equal(0);
    });
    
    it('should not pass data if the connection was closed by client', () => {
        let spy = sinon.spy();
        socket.onmessage = spy;
        
        socket.close();
        server.send(0);
        
        expect(spy.callCount).to.equal(0);
    });
    
    
});