import { javascriptParser } from "./javascript";
import { handlebarsParser } from "./handlebars";
import { nunjucksParser } from "./nunjucks";

export const AVAILABLE_PARSERS = {
    javascript: javascriptParser,
    handlebars: handlebarsParser,
    nunjucks: nunjucksParser,
};
