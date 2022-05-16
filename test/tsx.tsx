function gettext(any: string, ...args) { return gettext as unknown as any; }
function pgettext(any: string, ...args) { return pgettext as unknown as any; }

if (gettext('tsx test') === 'test') {
    gettext(`tsx hello world`);
    gettext(`tsx It is <a href="#here"></a>. Check it out!`);
}