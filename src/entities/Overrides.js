/**
 * @typedef {Object} Override
 */
class Override {
    constructor(properties) {
        /* @TODO: Check with a JSON Schema */
        this.name = properties.name || null;
        this.values = properties.values || {};
    }
}

module.exports = Override;