#!/usr/bin/env node

/* eslint-disable */
const path = require('path');
const fs = require( 'fs/promises');
const { getFilePaths } = require( "./src/utils");
const { determinateOutputs } = require("./src/utils");

const { serialize } = require( "./src/serializers");
const { parse } = require("./src/parsers");

const argv = require('minimist')(process.argv.slice(2));

console.log('Extracting frontend translations...');
console.log('cwd', process.cwd());

// files relative to the current working directory
const files = getFilePaths(argv);

if (!files.length) {
    console.error('No files specified');
    process.exit(1);
}

async function extract(files, output) {
    const translations = await parse(files);

    const outputs = determinateOutputs(output, process.cwd());

    if (!outputs.length) {
        const content = await serialize('json', translations);
        throw new Error(`No output file specified.\n${content}`);
    }

    for await (const output of outputs) {
        const type = path.extname(output).slice(1);
        console.log('Writing to file:', output);
        await fs.writeFile(
            output,
            await serialize(type, translations),
        );
    }

    return translations;
}

(async () => {
    // run extract on files
    await extract(files, argv.o)
        .then((translations) => {
            console.log(
                `done! ${Object.keys(translations).length
                } translations extracted from ${files.length} files`,
            );
            process.exit(0);
        })
        .catch((reason) => void console.log(reason) || process.exit(-1));

})()