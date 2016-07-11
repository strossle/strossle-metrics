# Metrics

## How do I use this?
```javascript
const Metrics = require('metrics');

const metrics = new Metrics({ formatter: new Metrics.Formatter.InfluxdbLineProtocol(), output: new Metrics.Output.Stdout() });

metrics.send('measurement_name', { a: 1, b: true, c: 'Hello' });
metrics.send('measurement_2', { a: 10.0 }, { tags: { host: 'aaaaa' }, timestamp: Date.now() * 1e6 });
```
# ID Versions

| Version     | Description                 |
| ----------- | --------------------------- |
| 0.1.0 | Add basic plugin support, for Rancher, Node and Npm information |
| 0.0.2 | Add support for JSON formatter |
| 0.0.1 | Support for InfluxdbLineProtocol and TCP/UDP output |
