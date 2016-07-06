const Metrics = require('./metrics.js');
const Stdout = require('./output/stdout-output.js');
const Tcp = require('./output/tcp-output.js');
const BufferedTcp = require('./output/buffered-tcp-output.js');
const Udp = require('./output/udp-output.js');
const BufferedUdp = require('./output/buffered-udp-output.js');
const InfluxdbLineProtocol = require('./formatter/influxdb-line-protocol-formatter.js');
const JSONFormatter = require('./formatter/json-formatter.js');

Metrics.Output = {
    Stdout,
    Tcp,
    BufferedTcp,
    Udp,
    BufferedUdp,
};
Metrics.Formatter = {
    InfluxdbLineProtocol,
    JSON:JSONFormatter,
};

module.exports = Metrics;
