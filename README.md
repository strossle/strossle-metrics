# Metrics

## How do I use this?
```javascript
const Metrics = require('metrics');

const metrics = new Metrics({ formatter: new Metrics.Formatter.InfluxdbLineProtocol(), output: new Metrics.Output.Stdout() });

metrics.send('measurement_name', { a: 1, b: true, c: 'Hello' });
metrics.send('measurement_2', { a: 10.0 }, { tags: { host: 'aaaaa' }, timestamp: Date.now() * 1e6 });
```
