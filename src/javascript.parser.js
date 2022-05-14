const fs = require("fs/promises");
const { Parser } = require("i18next-scanner");

async function javascriptParser(files = []) {
    if (!files.length) return { javascript: {} };

    const parser = new Parser({
        debug: false,
        removeUnusedKeys: false,
        sort: true,
        func: {
            list: ["gettext"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        defaultValue: "",
        nsSeparator: false,
        keySeparator: false,
        pluralSeparator: false,
        contextSeparator: false,
        contextDefaultValues: [],
        interpolation: {
            prefix: "{{",
            suffix: "}}",
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

    return translations;
}

module.exports = {
    javascriptParser,
};
