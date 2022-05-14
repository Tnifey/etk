Extract translation keys from handlebars, javascript or typescript into key:value pairs, po, or py gettext.
Can extract from: .js .jsx .ts. .tsx .handlebars .hbs

output types can be: .json .py .po

output type is determined by the extension of the output file,
if i have no parser for the extension, it will be `json`.

can output multiple files, pass multiple -o arguments.
`-o output-file.json -o output-file.po`

### Usage

run as command:
```sh
npx etk -o output.json "path-as-glob/**/*.(handlebars|js|ts)"
npx etk -o output.py "path-as-glob/**/*.(handlebars|js|ts)"
npx etk -o output.po "path-as-glob/**/*.(handlebars|js|ts)"
```

in package.json as script:
```json
{
    "scripts": {
        "trans": "npx etk -o .translations.json \"src/**/*.(js|ts|handlebars)\"",
        "trans:py": "npx etk -o .translations.py \"src/**/*.(js|ts|handlebars)\"",
        "trans:po": "npx etk -o .translations.po \"src/**/*.(js|ts|handlebars)\"",
        "trans:ext": "npx etk -o .translations.po -o .translations.json \"src/**/*.(js|ts|handlebars)\"",
    }
}
```

### Internally using:

- https://www.npmjs.com/package/gettext-parser
- https://www.npmjs.com/package/xgettext-template
- https://www.npmjs.com/package/i18next-scanner

## License
MIT