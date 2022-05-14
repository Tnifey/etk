Extract gettext translations from files.
Can extract from: .js .jsx .ts. .tsx .handlebars .hbs

output types can be: .json .py .po

output type is determined by the extension of the output file,
if i have no parser for the extension, it will be `json`.

can output multiple files, pass multiple -o arguments.
`-o output-file.json -o output-file.po`

### Usage

run as command:
```sh
node extract.js -o output.json path-as-glob/**/*.(handlebars|js|ts)
node extract.js path-as-glob/**/*.(handlebars|js|ts)
node extract.js path/to/file.js path/to/file.handlebars
```

in package.json as script:
```json
{
    "scripts": {
        "trans": "node extract -o .translations.json \"src/**/*.(js|ts|handlebars)\"",
        "trans:py": "node extract -o .translations.py \"src/**/*.(js|ts|handlebars)\"",
        "trans:po": "node extract -o .translations.po \"src/**/*.(js|ts|handlebars)\"",
        "trans:ext": "node extract -o .translations.po -o .translations.json \"src/**/*.(js|ts|handlebars)\"",
    }
}
```


### Internally using:

- https://www.npmjs.com/package/gettext-parser
- https://www.npmjs.com/package/xgettext-template
- https://www.npmjs.com/package/i18next-scanner

## License
MIT