function gettext(...args) { return gettext; }
function pgettext(...args) { return pgettext; }

gettext(`<div>{{_ "handlebars hello world"}}</div>`);
gettext(`<div>{{_ 'handlebars It is <a href="#here"></a>. Check it out!'}}</div>`);

gettext("function");
pgettext("plural function");
// gettext("function");
// gettext("function");

/**
 * pgettext("plural function");
 * pgettext("plural function");
 */

gettext(`
    function when multiline invalid
    \`\);
`);

gettext(
    "function when multiline"
);

gettext(
    'function when multiline single quote'
);

gettext(
    'function when multiline {{ single }} quote'
);

pgettext(gettext('singular'), gettext("plural"), 2);

gettext('function single quote');
gettext(`function tick`);
gettext(
    `function tick`
);
gettext(
    `this is on`
) + gettext(
    `two lines`
);

`this is a string
    ${gettext("inside template literal")}
rest of template literal )"
`;