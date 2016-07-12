const Plugin = require('./plugin.js');
const { deepFreeze } = require('deepfreezer');
const log = require('../log.js');
const request = require('request');

const RANCHER_METADATA = 'http://rancher-metadata';
const RANCHER_API_VERSION = '2015-12-19';

const DEFAULT_PROPERTIES = [];

class Rancher extends Plugin {
    constructor(options = { metadata: DEFAULT_PROPERTIES }) {
        super();
        const { metadata } = options;
        log.debug(
            {
                metadata,
                RANCHER_API_VERSION,
                RANCHER_METADATA,
            },
            'Initializing Rancher plugin'
        );

        if (!metadata || !Array.isArray(metadata)) {
            this.metadata = DEFAULT_PROPERTIES;
        } else {
            // Handle properties if not array then throw error?
            this.metadata = metadata;
        }

        this.data = {};

        const numberOfProps = this.metadata.length + 1;
        let currentProp = 0;

        // Should this be configurable as well?
        const envUrl = `${RANCHER_METADATA}/${RANCHER_API_VERSION}/self/stack/environment_name`;
        request.get(envUrl, (err, response, body) => {
            if (err) {
                log.error(
                    {
                        url: envUrl,
                        error: err.message,
                        stack: err.stack,
                    },
                    'Failed to access Rancher metadata service, are you running in Rancher?'
                );
            } else if (response.statusCode >= 400) {
                log.error(
                    {
                        url: envUrl,
                    },
                    `Rancher metadata service returned ${response.statusCode}. ` +
                    'Are you running in Rancher?'
                );
            } else if (body) {
                log.info(`Rancher environment ${body}`);
                this.data.environment = body.toString('utf8').toLowerCase();
            }

            currentProp += 1;
            if (currentProp === numberOfProps) {
                this.data = deepFreeze(this.data);
            }
        });

        this.metadata.forEach((prop) => {
            const url = `${RANCHER_METADATA}/${RANCHER_API_VERSION}/self/${prop}/name`;
            log.debug(`Fetching ${prop} from Rancher metadata service`);
            request.get(url, (err, response, body) => {
                if (err) {
                    log.error(
                        {
                            url,
                            error: err.message,
                            stack: err.stack,
                        },
                        'Failed to access Rancher metadata service, are you running in Rancher?'
                    );
                } else if (response.statusCode >= 400) {
                    log.error(
                        {
                            url,
                        },
                        `Rancher metadata service returned ${response.statusCode}. ` +
                        'Are you running in Rancher?'
                    );
                } else if (body) {
                    log.info(`Rancher environment ${body}`);
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

// Constants
Rancher.CONTAINER = 'container';
Rancher.HOST = 'host';
Rancher.SERVICE = 'service';
Rancher.STACK = 'stack';

DEFAULT_PROPERTIES.push(
    Rancher.CONTAINER,
    Rancher.HOST,
    Rancher.SERVICE,
    Rancher.STACK
);

module.exports = Rancher;

