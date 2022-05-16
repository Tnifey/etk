#!/usr/bin/env node

import path from "path";
import fs from "fs";
import minimist from "minimist";
import { getFilePaths } from "./utils";
import { extract, ExtractResult } from "./extract";
import { stripIndents } from "common-tags";
import JSON5 from "json5";
import { helpMessage } from "./messages";
import packagejson from "../package.json";

console.log(`etk -- extract translations keys\n`);

let argv = minimist(process.argv.slice(2));

if (argv.version || argv.v) {
    console.log(`version v${packagejson.version}\n`);
    process.exit(0);
}

if (argv.help || argv.h) {
    console.log();
    console.log(helpMessage);
    process.exit(0);
}

let config = {
    silent: !!argv.silent,
    input: getFilePaths(argv._),
    output: getFilePaths(argv.o, { noGlob: true }),
    parsers: {
        handlebars: {
            extensions: ["handlebars", "hbs"],
        },
        nunjucks: {
            extensions: ["nunjucks", "njk"],
        },
        javascript: {
            parser: "javascript",
            extensions: ["js", "ts", "jsx", "tsx"],
            func: ["gettext"],
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
