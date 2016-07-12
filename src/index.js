const Metrics = require('./metrics.js');

/* Formatters */
const InfluxdbLineProtocol = require('./formatter/influxdb-line-protocol-formatter.js');
const JSONFormatter = require('./formatter/json-formatter.js');
const LogstashJSON = require('./formatter/logstash-json-formatter.js');

/* Plugins */
const Rancher = require('./plugin/rancher-plugin.js');
const Npm = require('./plugin/npm-plugin.js');
const Node = require('./plugin/node-plugin.js');

/* Outputs */
const Stdout = require('./output/stdout-output.js');
const Tcp = require('./output/tcp-output.js');
const BufferedTcp = require('./output/buffered-tcp-output.js');
const Udp = require('./output/udp-output.js');
const BufferedUdp = require('./output/buffered-udp-output.js');

Metrics.Output = {
    Stdout,
    Tcp,
    BufferedTcp,
    Udp,
    BufferedUdp,
};

Metrics.Plugin = {
    Rancher,
    Npm,
    Node,
};

Metrics.Formatter = {
    InfluxdbLineProtocol,
    LogstashJSON,
    JSON: JSONFormatter,
};

module.exports = Metrics;
