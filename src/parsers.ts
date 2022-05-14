import { AVAILABLE_PARSERS } from "./parser";
import { ITranslations } from "./types";
import path from "path";

export function chooseParser(
    files: string[] = [],
    options?: Record<string, any>,
): Record<string, string[]> {
    const availableParsersEntries = [...Object.keys(AVAILABLE_PARSERS)];

    const filesToParseByParsers = availableParsersEntries
        ?.map((parserName) => {
            const parserOptions = options?.[parserName] || {};
            const parserExtensions = parserOptions?.extensions || [];
            const parserFiles = files.filter((file) => {
                const fileExtension = path.extname(file);
                return (
                    parserExtensions.includes(fileExtension) ||
                    parserExtensions.includes(fileExtension.slice(1))
                );
            });

            return [parserName, parserFiles];
        })
        .filter(([, files]) => files.length);

    return Object.fromEntries(filesToParseByParsers);
}

export async function parse(files: string[], options?): Promise<ITranslations> {
    const filesToParseByParser = chooseParser(files, options);

    const parsing = Object.entries(filesToParseByParser).map(
        ([name, files]) => {
            if (name in AVAILABLE_PARSERS) {
                return AVAILABLE_PARSERS[name](files, options?.[name]);
            } else {
                return Promise.reject('Parser not found for "' + name + '"');
            }
        },
    );

    const results = await Promise.allSettled(parsing);

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
