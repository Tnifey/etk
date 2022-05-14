import gettextParser from "gettext-parser";
import type { ITranslations } from "./types";

/**
 * JSON Serializer
 */
export async function jsonSerialize(
    translations: ITranslations,
    options?: Record<string, any>,
): Promise<string> {
    const removeEmpty = options?.removeEmpty ?? true;
    if (removeEmpty && "" in translations) {
        delete translations[""];
    }

    return JSON.stringify(
        translations,
        null,
        options?.minify ? null : options?.spaces || 4,
    );
}

/**
 * Python Serializer
 */
export async function pySerialize(
    translations: ITranslations,
    options?: Record<string, any>,
): Promise<string> {
    const removeEmpty = options?.removeEmpty ?? true;
    if (removeEmpty && "" in translations) {
        delete translations[""];
    }

    let pragma =
        options?.pragma ??
        `from django.utils.translation import gettext_lazy as _\n\n`;
    let output = `${pragma}\n`;
    let prefix = options?.prefix ?? "_(";
    let suffix = options?.suffix ?? ")\n\n";

    const entries = Object.entries(translations);

    for (let [key] of entries) {
        output += `${prefix}${JSON.stringify(key)}${suffix}`;
    }

    return output;
}

/**
 * PO Serializer
 */
export async function poSerialize(
    translations: ITranslations,
    options?: Record<string, any>,
): Promise<string> {
    const namespace = options?.namespace ?? "";
    const removeEmpty = options?.removeEmpty ?? true;
    if (removeEmpty && "" in translations) {
        delete translations[""];
    }

    function poentry([msgid, msgstr]) {
        return [
            msgid,
            {
                msgid: msgid,
                msgstr: msgstr,
                msgctxt: options?.context ?? undefined,
            },
        ];
    }

    function povalues(content) {
        const entries = Object.entries(content);
        const map = entries.map(poentry);
        return Object.fromEntries(map);
    }

    const charset = options?.charset ?? "utf-8";
    const headers = options?.headers ?? {
        "content-type": `text/plain; charset=${charset}`,
        "plural-forms": "nplurals=2; plural=(n!=1);",
    };

    let output = {
        charset,
        headers,
        translations: {
            [namespace]: {
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
    options?: Record<string, any>,
): Promise<string> {
    switch (type) {
        case "po":
            return poSerialize(content, options?.[type]);

        case "py":
            return pySerialize(content, options?.[type]);

        default:
            return jsonSerialize(content, options?.[type]);
    }
}
