const { handlebarsParser } = require( './handlebars.parser');
const { javascriptParser } = require( './javascript.parser');

function chooseParser(files = []) {
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

async function parse(files) {
    const { handlebars, javascript } = chooseParser(files);
    const results = await Promise.allSettled([
        await handlebarsParser(handlebars),
        await javascriptParser(javascript),
    ]);

    const [
        _handlebars,
        _javascript
    ] = results.map((result) => result?.value);

    const translations = {
        ..._handlebars,
        ..._javascript,
    };

    return translations;
}

module.exports = {
    chooseParser,
    parse,
}