const fs = require('fs');
const path = require('path');
const Language = require('./entities/Language');

function compileLanguagesConf(cwd, configFile) {
    const localizationDirectory = path.join(cwd, configFile.path);

    return fs.readdirSync(localizationDirectory).map(filename => {
        const localizationFilePath = path.join(cwd, configFile.path, filename);
        const locale = filename.replace('.js', '');
        return new Language({
            name: configFile.name,
            isMaster: configFile.master === locale,
            locale,
            path: localizationFilePath,
            initialContent: require(localizationFilePath),
        });
    });
}

module.exports = compileLanguagesConf;