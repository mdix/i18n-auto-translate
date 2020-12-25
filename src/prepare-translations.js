const jsoc = require('js-object-compare');
const { merge } = require('merge-anything');
const translateFromTo = require('./translate');
const Language = require('./entities/Language');

/**
 *
 * @param {Language} masterLanguage
 * @param {Array<Language>} otherLanguages
 * @param {Override} overrideDefinition
 * @param {Boolean} isDryRun just pretend translation, don't call the translation endpoint
 * @param {Boolean} isReSortOnly Only resort the translations, don't call the translation endpoint
 * @returns {Array<Promise<Language>>|Array}
 */
function prepareTranslations(masterLanguage, otherLanguages, overrideDefinition, isDryRun = false, isReSortOnly = false) {
    return otherLanguages.map((lang) => {
        // get the diff to the master file and also take care of overrides provided via --update
        const diff = jsoc.in_A_ButNotIn_B(masterLanguage.initialContent, lang.initialContent);
        const diffAndOverrides = merge(diff, overrideDefinition.values);
        return new Language(merge(lang.serialize(), { toBeTranslated: diffAndOverrides, diff, override: overrideDefinition }));
    }).map(async(lang) => {
        let translated = {};
        if (!isReSortOnly) {
            translated = await translateFromTo(masterLanguage.locale, lang.locale, lang.toBeTranslated, isDryRun);
        }
        // prepare the translation stuff and merge it back into the language file
        return new Language(merge(lang.serialize(), { translatedContent: translated, mergedContent: merge(lang.initialContent, translated) }));
    });
}

module.exports = prepareTranslations;