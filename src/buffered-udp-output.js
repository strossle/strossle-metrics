const dgram = require('dgram');
const url = require('url');
const Output = require('./output.js');

class BufferedUdp extends Output {
    constructor(host, options = { bufferSize: 4 * 1024, timeout: 1000 }) {
        super();

        const parsedUrl = url.parse(host);
        const { hostname, port } = parsedUrl;
        let { protocol } = parsedUrl;
        protocol = protocol.replace(':', '');

        this.socket = dgram.createSocket(protocol);
        this.address = hostname;
        this.port = port;
        this.buffer = Buffer.alloc(options.bufferSize); // Alloc unsafe faster?
        this.bufferBytes = 0;
        this.bufferSize = options.bufferSize;
        this.timer = null;
        this.timeout = options.timeout;
    }

    flush() {
        const bufferRef = this.buffer;
        this.socket.send(bufferRef, 0, this.bufferBytes, this.port, this.address, () => {
            // Allow logging of flush info
        });
        this.buffer = Buffer.allocUnsafe(this.bufferSize);
        this.bufferBytes = 0;
        // Clear timer since we have now flushed our buffer
        clearTimeout(this.timer);
        this.timer = null;
    }

    send(data, callback) {
        const dataBytes = Buffer.byteLength(data, 'utf8');
        if (this.bufferBytes + dataBytes > this.bufferSize) {
            this.flush();
        }
        this.buffer.write(data, this.bufferBytes, dataBytes, 'utf8');
        this.bufferBytes += dataBytes;

        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(this.flush.bind(this), this.timeout);

        if (typeof callback === 'function') {
            callback();
        }
    }
}

module.exports = BufferedUdp;
