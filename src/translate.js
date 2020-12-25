const { TranslationServiceClient } = require('@google-cloud/translate');
const translateClient = new TranslationServiceClient();

async function doTranslateRequest(sourceLanguageCode, targetLanguageCode, str, dryrun) {
    const request = {
        parent: 'projects/echonovum/locations/global',
        contents: [str],
        mimeType: 'text/plain',
        sourceLanguageCode,
        targetLanguageCode,
    };

    if (dryrun) {
        return Promise.resolve(`#translation dry run for ${targetLanguageCode}# ${str}`);
    }

    const translated = await translateClient.translateText(request);
    return translated[0].translations[0].translatedText;
}

async function translate(sourceLang, locale, input, dryrun) {
    if (Array.isArray(input)) {
        return input.map(async(val) => await translate(sourceLang, locale, val, dryrun));
    }

    if (typeof input === 'object') {
        const keys = Object.keys(input);

        const initial = {};
        for (let key of keys) {
            initial[key] = await translate(sourceLang, locale, input[key], dryrun);
        }

        return initial;
    }

    if (typeof input === 'string') {
        return input === ''
            ? input
            : doTranslateRequest(sourceLang, locale, input, dryrun);
    }
}

async function translateFromTo(sourceLanguageCode, targetLanguageCode, toBeTranslated, dryrun) {
    if (!(targetLanguageCode && sourceLanguageCode)) {
        throw new Error('The targetLanguageCode and the sourceLanguageCode need to be provided.');
    }

    if (!(typeof toBeTranslated === 'object')) {
        throw new Error('An object with stuff for translation must be provided.');
    }

    if (sourceLanguageCode === targetLanguageCode) {
        throw new Error('No translation needed if your sourceLanguageCode is the same as your targetLanguageCode.')
    }

    return translate(sourceLanguageCode, targetLanguageCode, toBeTranslated, dryrun);
}

module.exports = translateFromTo;