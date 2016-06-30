const { Socket } = require('net');
const Output = require('./output.js');

class Tcp extends Output {
    constructor(host, port, options = { keepAlive: false }) {
        super();

        const { keepAlive } = options;

        this.host = host;
        this.port = port;
        this.socket = new Socket();
        this.socket.connect(port, host, () => {
            this.socket.setKeepAlive(keepAlive);
        });
    }

    send(data, callback) {
        const buffer = Buffer.from(data, 'utf8');
        this.socket.write(buffer, () => {
            if (typeof callback === 'function') {
                callback();
            }
        });
    }
}

module.exports = Tcp;

