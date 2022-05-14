#!/usr/bin/env node

import path from "path";
import fs from "fs";
import minimist from "minimist";
import { getFilePaths } from "./utils";
import { extract, ExtractResult } from "./extract";
import { stripIndents } from "common-tags";
import JSON5 from "json5";

console.log(`etk -- extract translations keys\n\n`);

let argv = minimist(process.argv.slice(2));

if (argv.help || argv.h) {
    const message = `
Usage:
  $ etk [options] [files-to-extract]

Example:
  $ etk -o translations.json "resources/**/*.js"
  $ etk -o translations.json -o translations.py -o translations.po "resources/**/*.(js|handlebars)"

Options:
  -o <path>            Output file path. Can be specified multiple times.
  --help, -h           Show this help.
  --silent true        Do not print anything to the console.
  -c <path>            Path to the config file.
  `;
    console.log(message);
    process.exit(0);
}

let config = {
    silent: !!argv.silent,
    input: getFilePaths(argv._),
    output: getFilePaths(argv.o, { noGlob: true }),
    parsers: {
        handlebars: {
            parser: "handlebars",
            extensions: ["handlebars", "hbs"],
        },
        nunjucks: {
            parser: "handlebars",
            extensions: ["nunjucks", "njk"],
        },
        javascript: {
            parser: "javascript",
            extensions: ["js", "ts", "jsx", "tsx"],
            func: ["gettext"],
            plural: "p",
        },
    },
};

// config file is more important
if (argv?.c && typeof argv?.c === "string") {
    const configFilepath = path.relative(process.cwd(), argv.c);

    if (!fs.existsSync(configFilepath)) {
        error(`Config file not found: ${configFilepath}`);
    }

    const configFileContent = fs.readFileSync(configFilepath, "utf8");

    try {
        config = JSON5.parse(configFileContent);

        if (!config || typeof config !== "object") {
            error(`Invalid config file: ${configFilepath}`);
        }

        config.input = getFilePaths(config?.input || []);
        config.output = getFilePaths(config?.output || [], { noGlob: true });
    } catch (e) {
        error(`Invalid config file: ${configFilepath}`);
    }
}

if (config?.silent) {
    globalThis.console.log = () => {};
}

if (!config.input.length) {
    success({
        count: 0,
        inputs: [],
        outputs: [],
        translations: {},
    });
    process.exit(0);
}

if (!config.output.length) {
    error("No output files specified");
}

const message = stripIndents`
    Extracting translations...
    CWD: ${process.cwd()}
`;
console.log(message, "\n");

function success(translations: ExtractResult) {
    const fileList =
        translations?.outputs?.length > 0
            ? `\n- ${translations.outputs.join("\n- ")}`
            : "";
    const message = stripIndents`
        Successfully extracted ${translations.count} translations.
        Checked ${translations.inputs.length} files.
        Outputs to ${translations.outputs.length} files.
        ${fileList}
    `;
    console.log(message, "\n");
    process.exit(0);
}

function error(err) {
    console.error(err);
    process.exit(1);
}

extract(config).then(success).catch(error);
