const Formatter = require('./formatter.js');

class InfluxDBLineProtocol extends Formatter {
    escapeComma(string) {
        return string.replace(/,/g, '\\,');
    }

    escapeSpace(string) {
        return string.replace(/ /g, '\\ ');
    }

    escapeDoublequote(string) {
        return string.replace(/"/g, '\\"');
    }

    escapeTag(string) {
        return this.escapeSpace(this.escapeComma(string));
    }

    escapeValue(string) {
        return this.escapeDoublequote(string);
    }

    formatTag(tag) {
        let returnValue;
        switch (typeof tag) {
        case 'string':
            returnValue = this.escapeTag(tag);
            break;
        default:
            returnValue = tag;
        }

        return returnValue;
    }

    formatTags(tags) {
        let returnValue = '';
        if (tags) {
            const tagKeys = Object.keys(tags);
            // According to the influxdb documentation keys should be sorted
            // for best performance
            tagKeys.sort();
            const tagString = tagKeys.map((key) => {
                return `${this.escapeTag(key)}=${this.formatTag(tags[key])}`;
            }).join(',');
            returnValue = `,${tagString}`;
        }

        return returnValue;
    }

    formatValue(value) {
        let returnValue;
        switch (typeof value) {
        case 'string':
            returnValue = `"${this.escapeValue(value)}"`;
            break;
        case 'number':
            if (Number.isInteger(value)) {
                returnValue = `${value}i`;
            } else {
                returnValue = value.toString(10);
            }
            break;
        default:
            returnValue = `${value}`;
            break;
        }

        return returnValue;
    }

    formatValues(values) {
        const valueKeys = Object.keys(values);
        const valueString = valueKeys.map((key) => {
            return `${key}=${this.formatValue(values[key])}`;
        }).join(',');

        return valueString;
    }

    formatTimestamp(timestamp) {
        const timestampString = timestamp ? timestamp.toString(10) : '';
        return timestampString;
    }

    format(measurement, values, optionals = {}) {
        const { tags, timestamp } = optionals;
        let line = `${this.escapeTag(measurement)}${this.formatTags(tags)} ` +
            `${this.formatValues(values)} ${this.formatTimestamp(timestamp)}`;
        line = line.trim();
        return `${line}\n`;
    }
}

module.exports = InfluxDBLineProtocol;
