const languageProperties = [
    'name',
    'isMaster',
    'locale',
    'path',
    'initialContent',
    'toBeTranslated',
    'diff',
    'override',
    'translatedContent',
    'mergedContent',
];

/**
 * @typedef {Object} Language
 * @param properties
 */
class Language {
    constructor(properties) {
        languageProperties.forEach(prop => {
            this[prop] = properties[prop] || null;
        });
    }

    serialize() {
        return languageProperties.reduce((acc, key) => {
            acc[key] = this[key];
            return acc;
        }, {});
    }
}

module.exports = Language;