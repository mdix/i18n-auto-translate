const consoleReporter = require('./console-reporter');
const writeSorted = require('./file-writer');
const compileLanguagesConf = require('./compile-config');
const prepareTranslations = require('./prepare-translations');
const compileOverrides = require('./overrides');

function main({ config, overridesRaw = [], isDryRun, isReSortOnly, cwd }) {
    if (!(config && Array.isArray(config.files))) {
        console.error('Missing configuration for files.');
        return;
    }

    config.files.forEach(async(configFile) => {
        const languagesConf = compileLanguagesConf(cwd, configFile);
        const masterLanguage = languagesConf.find(language => language.isMaster);
        const otherLanguages = languagesConf.filter(language => !language.isMaster);

        const overrideDefinition = compileOverrides(overridesRaw, masterLanguage);

        const translatedLanguages = await Promise.all(
            prepareTranslations(masterLanguage, otherLanguages, overrideDefinition, isDryRun, isReSortOnly)
        );

        // sort and write the master file (to have the same order as the translated languages) and the translated languages
        writeSorted([masterLanguage, ...translatedLanguages], isDryRun);

        consoleReporter(translatedLanguages);
    });
}

module.exports = main;