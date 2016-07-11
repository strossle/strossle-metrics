const {
    InvalidFormatterError,
    InvalidOutputError,
    InvalidPluginError,
} = require('./error.js');
const Formatter = require('./formatter/formatter.js');
const Output = require('./output/output.js');
const Plugin = require('./plugin/plugin.js');
const Stdout = require('./output/stdout-output.js');
const InfluxDBLineProtocol = require('./formatter/influxdb-line-protocol-formatter.js');

class Metrics {
    constructor(options = { formatter: new InfluxDBLineProtocol(), output: new Stdout() }) {
        const { formatter, output } = options;

        if (!formatter instanceof Formatter) {
            throw new InvalidFormatterError('formatter must be an instance of Formatter');
        }
        this.formatter = formatter;

        if (!output instanceof Output) {
            throw new InvalidOutputError('output must be an instance of Output');
        }
        this.output = output;

        this.plugins = (() => {
            const internals = {
                plugins: [],
            };

            return {
                addPlugin: (p) => {
                    internals.plugins.push(p);
                },
                getPluginData: () => {
                    let data = {};
                    for (let i = 0; i < internals.plugins.length; i += 1) {
                        data = Object.assign(
                            data,
                            internals.plugins[i].getData()
                        );
                    }
                    return data;
                },
            };
        })();
    }

    setOutput(output) {
        if (!output instanceof Output) {
            throw new InvalidOutputError('output must be an instance of Output');
        }

        this.output = output;

        return this;
    }

    setFormatter(formatter) {
        if (!formatter instanceof Formatter) {
            throw new InvalidFormatterError('formatter must be an instance of Formatter');
        }

        this.formatter = formatter;

        return this;
    }

    addPlugin(plugin) {
        if (plugin instanceof Plugin) {
            this.plugins.addPlugin(plugin);
        } else if (Array.isArray(plugin)) {
            plugin.forEach((p) => {
                this.addPlugin(p);
            });
        } else {
            throw new InvalidPluginError('p must be an instance of Plugin');
        }

        return this;
    }

    send(measurement, values, optionals = {}, callback) {
        const { tags, timestamp } = optionals;
        let callbackFunc = callback;
        if (callback === undefined && typeof optionals === 'function') {
            callbackFunc = optionals;
        }

        const pluginData = this.plugins.getPluginData();

        const data = this.formatter.format(
            measurement,
            values,
            {
                tags,
                timestamp,
                pluginData,
            });

        this.output.send(data, callbackFunc);
    }
}

module.exports = Metrics;
