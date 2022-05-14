import { handlebarsParser } from "./handlebars-parser";
import { javascriptParser } from "./javascript-parser";
import { ITranslations } from "./types";

export function chooseParser(files: string[] = []): Record<string, string[]> {
    return files.reduce(
        (prev, file) => {
            if (/\.(handlebars|hbs)$/.test(file)) {
                return { ...prev, handlebars: [...prev.handlebars, file] };
            }

            if (/\.(j|t)sx?$/.test(file)) {
                return { ...prev, javascript: [...prev.javascript, file] };
            }

            return prev;
        },
        { handlebars: [], javascript: [] },
    );
}

export async function parse(files: string[]): Promise<ITranslations> {
    const { handlebars, javascript } = chooseParser(files);
    const results = await Promise.allSettled([
        await handlebarsParser(handlebars),
        await javascriptParser(javascript),
    ]);

    const translationsFromParsers = results.map((result) => {
        if (result.status === "rejected") {
            throw result.reason;
        }

        return result.value;
    });

    const translations = translationsFromParsers
        //  join the translations from the parsers
        .reduce((prev, curr) => ({ ...prev, ...curr }), {});

    return translations;
}
