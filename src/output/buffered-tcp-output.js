const { Socket } = require('net');
const Output = require('./output.js');

class BufferedTcp extends Output {
    constructor(host, port, options = { bufferSize: 4 * 1024, timeout: 1000, keepAlive: false }) {
        super();

        const { bufferSize, timeout, keepAlive } = options;

        this.host = host;
        this.port = port;
        this.socket = new Socket();
        this.socket.connect(port, host, () => {
            this.socket.setKeepAlive(keepAlive);
        });
        this.buffer = Buffer.alloc(options.bufferSize); // Alloc unsafe faster?
        this.bufferSize = bufferSize;
        this.bufferBytes = 0;
        this.timer = null;
        this.timeout = timeout;
    }

    flush(callback) {
        const bufferRef = this.buffer.slice(0, this.bufferBytes);
        this.socket.write(bufferRef, () => {
            if (typeof callback === 'function') {
                callback();
            }
            // Allow logging of flush info
        });
        this.buffer = Buffer.alloc(this.bufferSize);
        this.bufferBytes = 0;
        // Clear timer since we have now flushed our buffer
        clearTimeout(this.timer);
        this.timer = null;
    }

    send(data, callback) {
        const dataBytes = Buffer.byteLength(data, 'utf8');
        if ((this.bufferBytes + dataBytes) > this.bufferSize) {
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

module.exports = BufferedTcp;
