const Language = require('./entities/Language');
const Override = require('./entities/Overrides');
const compileOverrides = require('./overrides');

describe('Overrides', () => {
    const usedNamespace = 'some_namespace';
    const initialContent = { existing_key: 'a value' };
    const masterLanguage = new Language(
        { name: usedNamespace, isMaster: true, locale: 'en', path: '/tmp/does/not/exist', initialContent });

    it.each(['', null, undefined, [], {}])('should return empty override if no overrides were provided %s', (overrides) => {
        const actual = compileOverrides(overrides, masterLanguage);

        expect(actual).toEqual(new Override({ name: usedNamespace }));
    });

    it('should return empty override if overrides for wrong namespace are provided', () => {
        const overrides = ['some_other_namespace:existing_key', 'and_another_namespace:existing_key'];

        const actual = compileOverrides(overrides, masterLanguage);

        expect(actual).toEqual(new Override({ name: usedNamespace }));
    });

    it('should only return override if it was part of the master language', () => {
        const overrides = [`${usedNamespace}:should.not.see.me,existing_key`];

        const actual = compileOverrides(overrides, masterLanguage);

        expect(actual).toEqual(new Override({ name: usedNamespace, values: initialContent }));
    });
});
