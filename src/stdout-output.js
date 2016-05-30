const Output = require('./output.js');

class Stdout extends Output {
    send(data, callback) {
        process.stdout.write(data);
        if (typeof callback === 'function') {
            callback();
        }
    }
}

module.exports = Stdout;
