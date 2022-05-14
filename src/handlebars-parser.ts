import xgettext from "xgettext-template";
import gettextParser from "gettext-parser";
import type { ITranslations } from "./types";

/**
 * Parse handlebars files into a translations object
 */
export async function handlebarsParser(
    filepaths: string[] = [],
): Promise<ITranslations> {
    if (!filepaths.length) return {};

    const po = await handlebarsExtractor(filepaths);
    const translationList = po?.translations?.[""] || {};
    const entries = [...Object.entries(translationList)];
    const object = entries
        .map(([_k, v]) => !v?.msgid && [v?.msgid, ""])
        .filter(Boolean);

    const translations = Object.fromEntries(object);

    console.log(
        "Success extracting *.handlebars",
        `${filepaths?.length}`,
        `${object.length} entries`,
    );

    return translations || {};
}

/**
 * Extract translations as a PO file buffer
 */
export async function handlebarsExtractor(
    filepaths: string[],
): Promise<HandlebarsExtractorResult> {
    return new Promise((resolve) => {
        console.log("Trying to extract from *.handlebars");
        xgettext(
            filepaths,
            {
                output: "-",
                language: "Handlebars",
                "force-po": true,
                "sort-output": true,
            },
            (data: Buffer) => {
                console.log("Trying to parse from *.handlebars");
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
