import xgettext from "xgettext-template";
import gettextParser from "gettext-parser";
import type { ITranslations } from "../types";

/**
 * Parse handlebars files into a translations object
 */
export async function handlebarsParser(
    filepaths: string[] = [],
    options: Record<string, any> = {},
): Promise<ITranslations> {
    if (!filepaths.length) return {};

    const po = await handlebarsExtractor(filepaths, options);
    const translationList = po?.translations?.[""] || {};
    const entries = [...Object.entries(translationList)];
    const object = entries
        .map(([_k, v]) => !v?.msgid && [v?.msgid, ""])
        .filter(Boolean);

    const translations = Object.fromEntries(object);

    console.log(
        "Success extracting *.handlebars: ",
        `${filepaths?.length} files`,
        `${object.length} entries`,
    );

    return translations || {};
}

/**
 * Extract translations as a PO file buffer
 */
export async function handlebarsExtractor(
    filepaths: string[],
    options?: Record<string, any>,
): Promise<HandlebarsExtractorResult> {
    return new Promise((resolve) => {
        console.log("Extracting handlebars files...");
        xgettext(
            filepaths,
            {
                output: "-",
                language: options?.language || "Handlebars",
                "force-po": true,
                "sort-output": true,
            },
            (data: Buffer) => {
                resolve(gettextParser.po.parse(data, "utf8"));
            },
        );
    });
}

export type HandlebarsExtractorResult = {
    translations?: {
        [key: string]: Record<string, { msgid: string; msgstr: string }>;
    };
};
