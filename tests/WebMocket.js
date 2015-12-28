import {WebMocket,
            MocketServer} from '../source/WebMocket';

describe('WebMocket', () => {
    
    let socket,
        server,
        testUrl = 'test-url';
    
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
});