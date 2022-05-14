// https://www.npmjs.com/package/fast-glob
const glob = require("fast-glob");
const path = require("path");

function getFilePaths(argv) {
    const files = argv._ || [];

    if (files?.length === 1) {
        return glob.sync(files?.[0], { dot: true });
    }

    return Array.isArray(files) ? files : [];
}

function ensureString(str) {
    return str && typeof str === "string" ? str : "";
}

function toArray(input) {
    if (typeof input === "string") return [input];
    if (Array.isArray(input)) return input;
    return [];
}

function determinateOutputs(output, cwd = process.cwd()) {
    const outputs = toArray(output);
    const relative = outputs.map((file) => path.join(cwd, file));
    return relative;
}

module.exports = {
    getFilePaths,
    ensureString,
    toArray,
    determinateOutputs,
};
