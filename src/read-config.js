const path = require('path');

function readConfig(cwd) {
    try {
        return require(path.join(cwd, 'i18n-auto-translate.config'));
    } catch(e) {
        console.error('You forgot to place the config file? Or is it malformed?');
        console.error(e);
        process.exit(1);
    }
}

module.exports = readConfig;
