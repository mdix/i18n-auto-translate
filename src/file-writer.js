const fs = require('fs');
const sortKeysRecursive = require('sort-keys-recursive')

function buildSortedFileContent(content) {
    const sortedContent = sortKeysRecursive(content);
    return 'module.exports = ' + JSON.stringify(sortedContent, null, 4).replace(new RegExp(/\"([A-Za-z_-]+)\":/g), (match, replacer) => `${replacer}:`);
}

function writeFileContent(path, content, isDryRun) {
    if (!isDryRun) fs.writeFileSync(path, content);
}

function writeSorted(languages, isDryRun) {
    languages.forEach((lang) => {
        const content = lang.isMaster ? lang.initialContent : lang.mergedContent;
        try {
            writeFileContent(lang.path, buildSortedFileContent(content), isDryRun);
            lang.written = !isDryRun;
        } catch(e) {
            lang.written = false;
            lang.error = e;
        }
    });
}

module.exports = writeSorted;