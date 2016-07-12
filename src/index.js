const Metrics = require('./metrics.js');

/* Formatters */
const InfluxdbLineProtocol = require('./formatter/influxdb-line-protocol-formatter.js');
const JSONFormatter = require('./formatter/json-formatter.js');
const LogstashJSON = require('./formatter/logstash-json-formatter.js');

/* Plugins */
const Rancher = require('./plugin/rancher-plugin.js');
const ApplicationVersion = require('./plugin/application-version-plugin.js');
const Node = require('./plugin/node-plugin.js');

/* Outputs */
const Stdout = require('./output/stdout-output.js');
const Tcp = require('./output/tcp-output.js');
const BufferedTcp = require('./output/buffered-tcp-output.js');
const Udp = require('./output/udp-output.js');
const BufferedUdp = require('./output/buffered-udp-output.js');

Metrics.Output = {
    BufferedTcp,
    BufferedUdp,
    Stdout,
    Tcp,
    Udp,
};

Metrics.Plugin = {
    ApplicationVersion,
    Node,
    Rancher,
};

Metrics.Formatter = {
    InfluxdbLineProtocol,
    JSON: JSONFormatter,
    LogstashJSON,
};

module.exports = Metrics;
