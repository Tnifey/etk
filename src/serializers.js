const gettextParser = require("gettext-parser");

/**
 * JSON Serializer
 */
function jsonSerialize(translations, minify = false) {
    return JSON.stringify(translations, null, minify ? null : 2);
}

/**
 * Python Serializer
 */
function pySerialize(
    translations,
    pragma = `from django.utils.translation import gettext_lazy as _\n\n`,
) {
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
function poSerialize(translations) {
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

async function serialize(type, content) {
    switch (type) {
        case "po":
            return poSerialize(content);

        case "py":
            return pySerialize(content);

        default:
            return jsonSerialize(content);
    }
}

module.exports = {
    serialize,
    poSerialize,
    pySerialize,
    jsonSerialize,
};
