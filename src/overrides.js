const createMapper = require('map-factory');
const Override = require('./entities/Overrides');

/**
 *
 * @param {String|Array} overridesRaw
 * @param {Language} masterLanguage
 * @returns {Override}
 */
function compileOverrides(overridesRaw, masterLanguage) {
    let overrides = [];

    if (typeof overridesRaw === 'string' && overridesRaw !== '') {
        overrides.push(overridesRaw);
    }

    if (Array.isArray(overridesRaw) && overridesRaw.length > 0) {
        overrides = overridesRaw;
    }

    const maybeOverridesForMasterLanguage = overrides
        .map(commandValue => separateNameAndValues(commandValue))
        .find(({ name }) => findMatchingOverridesForMaster(name, masterLanguage));

    return mapOverridesOnMasterLanguageContent(maybeOverridesForMasterLanguage, masterLanguage);
}

/**
 * @param {String} commandValue
 * @returns {{values: *, name: *}}
 */
function separateNameAndValues(commandValue) {
    const [name, valueString] = commandValue.split(':');
    const values = valueString.split(',');

    return { name, values };
}

/**
 *
 * @param {String} name
 * @param {Language} masterLanguage
 * @returns {boolean}
 */
function findMatchingOverridesForMaster(name, masterLanguage) {
    return name === masterLanguage.name;
}

/**
 *
 * @param {object} maybeOverrides
 * @param {Language} masterLanguage
 * @returns {Override}
 */
function mapOverridesOnMasterLanguageContent(maybeOverrides, masterLanguage) {
    const override = new Override({ name: masterLanguage.name });

    if (!maybeOverrides) {
        return override;
    }

    const mapper = createMapper();
    maybeOverrides.values.forEach((value) => {
        mapper.map(value).to(value);
    });

    override.values = mapper.execute(masterLanguage.initialContent);
    return override;
}

module.exports = compileOverrides;