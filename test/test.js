const Metrics = require('./metrics.js');
const Udp = require('./udp-output.js');
const BufferedUdp = require('./buffered-udp-output.js');
const Tcp = require('./tcp-output.js');
const BufferedTcp = require('./buffered-tcp-output.js');
const InfluxDBLineProtocol = require('./influxdb-line-protocol-formatter.js');

//const reporter = new Metrics();
//const reporter = new Metrics({ formatter: new InfluxDBLineProtocol(), output: new Tcp('localhost', 12345) });
//const reporter = new Metrics({ formatter: new InfluxDBLineProtocol(), output: new BufferedTcp('localhost', 12345) });
//const reporter = new Metrics({ formatter: new InfluxDBLineProtocol(), output: new Udp('udp4://localhost:12345') });
const reporter = new Metrics({ formatter: new InfluxDBLineProtocol(), output: new BufferedUdp('udp4://localhost:12345') });

let i = 0;
const iterations = 100000;
const start = process.hrtime();
for (;i < iterations; i += 1) {
    reporter.send('test_metric', { first: i, second: 2.5, bool: true, text: 'Hello "world!' }, { tags: { some: "text here", number: 1 }, timestamp: Date.now() * 1e6 });
}
const elapsed = process.hrtime(start);
const nsElapsed = elapsed[0] * 1e9 + elapsed[1];
const nsElapsedPerCall = nsElapsed / iterations;

console.log(`Ran ${iterations} iterations`);
console.log(`Average ns per call ${nsElapsedPerCall}`);

