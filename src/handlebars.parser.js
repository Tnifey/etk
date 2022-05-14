// handlebars parsers
const xgettext = require('xgettext-template');
const gettextParser = require('gettext-parser');

async function handlebarsParser(files = []) {
    if (!files.length) return {};

    async function extractor(files) {
        return new Promise((resolve) => {
            console.log('Trying to extract from *.handlebars');
            xgettext(
                files,
                {
                    output: '-',
                    language: 'Handlebars',
                    'force-po': true,
                    'sort-output': true,
                },
                (data) => {
                    console.log('Trying to parse from *.handlebars');
                    resolve(gettextParser.po.parse(data, 'utf8'));
                },
            );
        });
    }

    const po = await extractor(files);
    const translationList = po?.translations?.[''] || {};

    const entries = [...Object.entries(translationList)];
    const object = entries
        .map(([_key, { msgid }]) => {
            if (!msgid) return false;
            return [msgid, ''];
        })
        .filter(Boolean);

    console.log('Success extracting *.handlebars', `${object.length} entries`);
    const translations = Object.fromEntries(object);

    return translations || {};
}

module.exports = {
    handlebarsParser,
};