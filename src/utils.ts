// https://www.npmjs.com/package/fast-glob
import glob from "fast-glob";
import path from "path";

export function getFilePaths(argv) {
    const files = argv._ || [];

    if (files?.length === 1) {
        return glob.sync(files?.[0], { dot: true });
    }

    return Array.isArray(files) ? files : [];
}

export function ensureString(str): string {
    return str && typeof str === "string" ? str : "";
}

export function toArray(input): string[] {
    if (typeof input === "string") return [input];
    if (Array.isArray(input)) return input;
    return [];
}

export function determinateOutputs(output, cwd = process.cwd()): string[] {
    const outputs = toArray(output);
    const relative = outputs.map((file) => path.join(cwd, file));
    return relative;
}
