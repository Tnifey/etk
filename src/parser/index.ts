import { javascriptParser } from "./javascript";
import { handlebarsParser } from "./handlebars";

export const AVAILABLE_PARSERS = {
    javascript: javascriptParser,
    handlebars: handlebarsParser,
};
