const prepareTranslations = require('./prepare-translations');
const Language = require('./entities/Language');
const Override = require('./entities/Overrides');

describe('prepareTranslations', () => {
    it('should create language objects with translated key/values from the master, but not override existing', async () => {
        const path = '/some/path';
        const name = 'survey';
        const override = new Override({ name });
        const masterLanguage = new Language({ name, locale: 'en', initialContent: { master_key: 'master value' }, path });
        const otherLanguages = [
            new Language({ name, locale: 'de', initialContent: { other_lang_key: 'de_blah' }, path }),
            new Language({ name, locale: 'fr', initialContent: { master_key: 'fr should not override' }, path })
        ];

        const translationPromises = prepareTranslations(masterLanguage, otherLanguages, override, true);
        return expect(Promise.all(translationPromises)).resolves.toEqual([
            new Language({
                name: otherLanguages[0].name,
                diff: masterLanguage.initialContent,
                initialContent: otherLanguages[0].initialContent,
                locale: otherLanguages[0].locale,
                mergedContent: {
                    ...otherLanguages[0].initialContent,
                    'master_key': getTranslated(otherLanguages[0].locale, masterLanguage.initialContent['master_key']),
                },
                override,
                path: otherLanguages[0].path,
                toBeTranslated: masterLanguage.initialContent,
                translatedContent: {
                    'master_key': getTranslated(otherLanguages[0].locale, masterLanguage.initialContent['master_key']),
                },
            }),
            new Language({
                name: otherLanguages[1].name,
                diff: {},
                initialContent: otherLanguages[1].initialContent,
                locale: otherLanguages[1].locale,
                mergedContent: {
                    ...otherLanguages[1].initialContent,
                },
                override,
                path: otherLanguages[1].path,
                toBeTranslated: {},
                translatedContent: {},
            }),
        ]);
    });
});

function getTranslated(locale, value) {
    return `#translation dry run for ${locale}# ${value}`
}