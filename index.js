#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const cwd = require('process').cwd();
const main = require('./src/main');
const isDryRun = argv.dryrun || false;
const isReSortOnly = argv['resort-only'] || false;

// check for google credentials and make them available to the script
if (!isDryRun || !isReSortOnly) require('./src/handle-google-credentials')(cwd);

// get the config
const config = require('./src/read-config')(cwd);

main({ config, overrides: argv.override, isDryRun, isReSortOnly, cwd });
