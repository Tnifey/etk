#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import minimist from "minimist";
import { getFilePaths } from "../utils";
import { determinateOutputs } from "../utils";
import { serialize } from "../serializers";
import { parse } from "../parsers";
import { ITranslations } from "../types";

const argv = minimist(process.argv.slice(2));

console.log("Extracting frontend translations...");
console.log("cwd", process.cwd());

// files relative to the current working directory
const files = getFilePaths(argv);

if (!files.length) {
    console.error("No files specified");
    process.exit(1);
}

export type ExtractResult = {
    inputs: string[];
    outputs: string[];
    translations: ITranslations;
};

async function extract(
    files: string[],
    output: string[],
): Promise<ExtractResult> {
    const translations = await parse(files);

    const outputs = determinateOutputs(output, process.cwd());

    if (!outputs.length) {
        const content = await serialize("json", translations);
        throw new Error(`No output file specified.\n${content}`);
    }

    for await (const output of outputs) {
        const type = path.extname(output).slice(1);
        console.log("Writing to file:", output);
        await fs.writeFile(output, await serialize(type, translations));
    }

    return {
        inputs: files,
        outputs,
        translations,
    };
}

function success(translations: ExtractResult) {
    console.log(
        "Success extracting",
        `${files.length}`,
        `${Object.keys(translations).length} entries`,
    );
    process.exit(0);
}

function error(err) {
    console.error(err);
    process.exit(1);
}

extract(files, argv.o).then(success).catch(error);
