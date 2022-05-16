import { ITranslations } from "../types";
import { handlebarsParser, handlebarsExtractor } from "./handlebars";

/**
 * Parse nunjucks files into a translations object
 */
export async function nunjucksParser(
    filepaths: string[] = [],
    options: Record<string, any> = {},
): Promise<ITranslations> {
    if (!filepaths.length) return {};

    const po = await handlebarsExtractor(filepaths, {
        ...options,
        language: "Nunjucks",
    });

    const translationList = po?.translations?.[""] || {};

    const entries = [...Object.entries(translationList)];
    const object = entries
        .map(([_k, v]) => !!v?.msgid && [v?.msgid, ""])
        .filter(Boolean);

    const translations = Object.fromEntries(object);

    console.log(
        "Success extracting *.nunjucks: ",
        `${filepaths?.length} files`,
        `${object.length} entries`,
    );

    return translations || {};
}
