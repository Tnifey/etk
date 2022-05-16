export const helpMessage = `
Usage:
  $ etk [options] [files-to-extract]

Example:
  $ etk -o translations.json "resources/**/*.js"
  $ etk -o translations.json -o translations.py -o translations.po "resources/**/*.(js|handlebars)"

Options:
  -o <path>            Output file path. Can be specified multiple times.
  --help, -h           Show this help.
  --silent true        Do not print anything to the console.
  -c <path>            Path to the config file.
`;
