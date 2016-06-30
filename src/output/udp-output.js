const dgram = require('dgram');
const url = require('url');
const Output = require('./output.js');

class Udp extends Output {
    constructor(host) {
        super();

        const parsedUrl = url.parse(host);
        let { protocol } = parsedUrl;
        const { hostname, port } = url.parse(host);
        protocol = protocol.replace(':', '');

        this.socket = dgram.createSocket(protocol);
        this.address = hostname;
        this.port = port;
    }

    send(data, callback) {
        const buffer = Buffer.from(data, 'utf8');
        this.socket.send(buffer, 0, buffer.length, this.port, this.address, () => {
            if (typeof callback === 'function') {
                callback();
            }
        });
    }
}

module.exports = Udp;
