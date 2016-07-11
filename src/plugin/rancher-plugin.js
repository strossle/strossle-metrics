require('isomorphic-fetch');
const Plugin = require('./plugin.js');
const { deepFreeze } = require('deepfreezer');
const log = require('../log.js');

const RANCHER_METADATA = 'http://rancher-metadata';
const RANCHER_API_VERSION = '2015-12-19';

const DEFAULT_PROPERTIES = [
    'container',
    'host',
    'service',
    'stack',
];

class Rancher extends Plugin {
    constructor(options = { properties: DEFAULT_PROPERTIES }) {
        super();
        const { properties } = options;
        log.debug({ properties, RANCHER_API_VERSION, RANCHER_METADATA }, 'Initializing Rancher plugin');

        if (!properties) {
            this.properties = DEFAULT_PROPERTIES;
        } else {
            // Handle properties if not array then throw error?
            this.properties = properties;
        }

        this.data = {};

        const numberOfProps = this.properties.length;
        let currentProp = 0;

        this.properties.forEach((prop) => {
            const url = `${RANCHER_METADATA}/${RANCHER_API_VERSION}/self/${prop}/name`;
            log.debug({ url }, `Fetching ${prop} from Rancher metadata service`);
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    }
                    // Log warning about stuff here
                    log.error(`Rancher metadata service returned ${response.status}. Are you running in Rancher?`);
                    return Promise.resolve(null);
                })
                .then((body) => {
                    if (body) {
                        log.info(`Rancher ${prop} ${body}`);
                        this.data[prop] = body;
                    }
                    currentProp += 1;
                    if (currentProp === numberOfProps) {
                        // Don't allow this object to be edited, just to make sure
                        this.data = deepFreeze(this.data);
                    }
                });
        });
    }

    getData() {
        return this.data;
    }
}

module.exports = Rancher;

