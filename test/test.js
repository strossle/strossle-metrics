const Metrics = require('../src/index.js');
const { LogstashJSON } = Metrics.Formatter;
const { Stdout } = Metrics.Output;
const { Node, Npm, Rancher } = Metrics.Plugin;

const reporter = new Metrics()
    .setFormatter(new LogstashJSON())
    .setOutput(new Stdout())
    .addPlugin(new Rancher({
        metadata: [
            Rancher.CONTAINER,
            Rancher.SERVICE,
            Rancher.STACK,
        ],
    }))
    .addPlugin(new Npm())
    .addPlugin(new Node());

// This is a primitive benchmark

function send(i) {
    reporter.send(
        'test_metric',
        {
            first: i,
            second: Math.random() * 10,
            bool: (i & 1) === 1,
            text: 'Hello world!',
        },
        {
            tags: {
                some: 'text here',
                number: i,
            },
            timestamp: Date.now(),
        }
    );
}

let i = 0;
const iterations = parseInt(process.env.ITERATIONS || 10, 10);
const start = process.hrtime();
let n = iterations % 8;
do {
    send(i);
    ++i;
    --n;
} while (n > 0);
// Floor here because js has no integer division :/
n = Math.floor(iterations / 8);
// Unroll loop for speeeeed
do {
    send(i);
    ++i;
    send(i);
    ++i;
    send(i);
    ++i;
    send(i);
    ++i;
    send(i);
    ++i;
    send(i);
    ++i;
    send(i);
    ++i;
    send(i);
    ++i;
    --n;
} while (n > 0);

const elapsed = process.hrtime(start);
const nsElapsed = elapsed[0] * 1e9 + elapsed[1];
const nsElapsedPerCall = nsElapsed / iterations;

console.log(`Ran ${iterations} iterations`);
console.log(`Average ns per call ${nsElapsedPerCall}`);

