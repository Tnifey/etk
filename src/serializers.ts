import gettextParser from "gettext-parser";
import type { ITranslations } from "./types";

/**
 * JSON Serializer
 */
export async function jsonSerialize(
    translations: ITranslations,
    minify = false,
): Promise<string> {
    return JSON.stringify(translations, null, minify ? null : 2);
}

/**
 * Python Serializer
 */
export async function pySerialize(
    translations: ITranslations,
    pragma = `from django.utils.translation import gettext_lazy as _\n\n`,
): Promise<string> {
    let output = `${pragma}\n`;

    const entries = Object.entries(translations);

    for (let [key] of entries) {
        output += `_(${JSON.stringify(key)})\n\n`;
    }

    return output;
}

/**
 * PO Serializer
 */
export async function poSerialize(
    translations: ITranslations,
): Promise<string> {
    function poentry([msgid, msgstr]) {
        return [msgid, { msgid: msgid, msgstr: msgstr }];
    }

    function povalues(content) {
        const entries = Object.entries(content);
        const map = entries.map(poentry);
        return Object.fromEntries(map);
    }

    let output = {
        charset: "utf-8",
        headers: {
            "content-type": "text/plain; charset=utf-8",
            "plural-forms": "nplurals=2; plural=(n!=1);",
        },
        translations: {
            "": {
                "": {
                    msgid: "",
                    msgstr: [
                        "Content-Type: text/plain; charset=utf-8\n",
                        "Plural-Forms: nplurals=2; plural=(n!=1);\n\n",
                    ],
                },
                ...povalues(translations),
            },
        },
    };

    return gettextParser.po.compile(output);
}

/**
 * Serialize as given type format
 */
export async function serialize(
    type: string,
    content: ITranslations,
): Promise<string> {
    switch (type) {
        case "po":
            return poSerialize(content);

        case "py":
            return pySerialize(content);

        default:
            return jsonSerialize(content);
    }
}
