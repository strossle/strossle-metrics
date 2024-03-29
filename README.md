# Metrics

## How do I use this?
```javascript
const Metrics = require('metrics');
const { LogstashJSON } = Metrics.Formatter;
const { Udp } = Metrics.Output;
const { ApplicationVersion, Node, Rancher } = Metrics.Plugin;

const metrics = new Metrics({ formatter: new Metrics.Formatter.InfluxdbLineProtocol(), output: new Metrics.Output.Stdout() });

metrics.send('measurement_name', { a: 1, b: true, c: 'Hello' });
metrics.send('measurement_2', { a: 10.0 }, { tags: { host: 'aaaaa' }, timestamp: Date.now() * 1e6 });

const metricsWithPlugins = new Metrics()
	.setFormatter(new Metrics.Formatter.LogstashJSON())
	.setOutput(new Metrics.Output.Stdout())
	.addPlugin(new Metrics.Plugin.ApplicationVersion())
	.addPlugin(new Metrics.Plugin.Node());

metricsWithPlugins.send('measurement_3', { a: 1 });
// {"measurement":"measurement_3","a":1,"node_version":"v6.3.0","npm_version":"0.0.1"}

// Example of setup in production
const metrics2 = new Metrics()
	.setFormatter(new LogstashJSON())
	.setOutput(new Udp('udp4://wherever.you.send.your.metrics.org:12345'))
	.addPlugin(new ApplicationVersion())
	.addPlugin(new Node())
	.addPlugin(new Rancher({
		metadata: [
			Rancher.CONTAINER,
			Rancher.SERVICE,
			Rancher.STACK,
		],
	}));
```

# Plugins
## Application Version
Adds the `version` found in the `package.json` file of the current working directory to metrics.

## Node Version
Adds the `node` version as reported by `process.version` to metrics.

## Rancher
Uses the Rancher [metadata service](http://docs.rancher.com/rancher/latest/en/rancher-services/metadata-service/)
to add stack, service, container and host information to metrics.

# Changelog

| Version     | Description                 |
| ----------- | --------------------------- |
| 0.2.1 | Remove unused dependency |
| 0.2.0 | Rename `Npm` plugin to `ApplicationVersion` |
| 0.1.4 | Make it easier to configure Rancher metadata. Use `request` instead of `fetch` since fetch caused issues in some test frameworks because of global variables |
| 0.1.3 | Get envrionment from rancher metadata service |
| 0.1.2 | Add basic logging |
| 0.1.1 | Fix timestamps for logstash json, update readme |
| 0.1.0 | Add basic plugin support, for Rancher, Node and Npm information |
| 0.0.2 | Add support for JSON formatter |
| 0.0.1 | Support for InfluxdbLineProtocol and TCP/UDP output |
