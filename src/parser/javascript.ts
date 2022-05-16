import fs from "fs/promises";
import { Parser } from "i18next-scanner";
import type { ITranslations } from "../types";

export async function javascriptParser(
    files: string[] = [],
    options: Record<string, any> = {},
): Promise<ITranslations> {
    if (!files.length) return {};

    const parser = new Parser({
        debug: false,
        removeUnusedKeys: false,
        sort: true,
        func: {
            list: options?.func ?? ["gettext"],
            extensions: options?.extensions ?? [".js", ".jsx", ".ts", ".tsx"],
        },
        trans: false,
        defaultValue: options?.defaultValue ?? "",
        nsSeparator: false,
        keySeparator: false,
        pluralSeparator: false,
        contextSeparator: false,
        contextDefaultValues: [],
        interpolation: {
            prefix: options?.prefix ?? "{{",
            suffix: options?.suffix ?? "}}",
        },
    });

    for await (const filepath of files) {
        console.log("Extracting translations from file:", filepath);
        const file = await fs.readFile(filepath, "utf8");
        parser.parseFuncFromString(file, { list: ["gettext"] });
    }

    const translationsList = await parser.get();
    const translations = translationsList?.en?.translation || {};

    console.log(
        "Success extracting translations from *.js, *.jsx, *.ts, *.tsx",
        `${Object.keys(translations).length} entries`,
    );

    return translations as ITranslations;
}
