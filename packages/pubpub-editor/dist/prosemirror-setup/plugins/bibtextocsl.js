'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var varRegex = {
  url: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})|localhost)(\:\d+)?(\/[-a-z\d%_.~+:]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i,
  bibtex: [/^(?:\s*@\s*[^@]+?\s*\{\s*[^@]+?\s*,\s*[^@]+\})+\s*$/, /^\s$/, /^[@{}"=,\\]$/],
  wikidata: [/(?:\/|^)(Q\d+)$/, /(Q\d+)/, /^(?:Q\d+(?:\s+|,))*(?:Q\d+)(?:\s+|,)?$/],
  json: [[/((?:\[|:|,)\s*)'((?:\\'|[^'])*?[^\\])?'(?=\s*(?:\]|}|,))/g, '$1"$2"'], [/((?:(?:"|]|}|\/[gmi]|\.|(?:\d|\.|-)*\d)\s*,|{)\s*)(?:"([^":\n]+?)"|'([^":\n]+?)'|([^":\n]+?))(\s*):/g, '$1"$2$3$4"$5:']],
  name: / (?=(?:[a-z]+ )*(?:[A-Z][a-z]*[-])*(?:[A-Z][a-z]*)$)/
};

var varBibTeXSyntaxTokens = {
  "|": "{\\textbar}",
  "<": "{\\textless}",
  ">": "{\\textgreater}",
  "~": "{\\textasciitilde}",
  "^": "{\\textasciicircum}",
  "\\": "{\\textbackslash}",
  // See http://tex.stackexchange.com/questions/230750/open-brace-in-bibtex-fields/230754
  "{": "\\{\\vphantom{\\}}",
  "}": "\\vphantom{\\{}\\}"
};

/**
 * Mapping of BibTeX Escaped Chars to Unicode.
 *
 * From [Zotero's reversed mapping table](https://github.com/zotero/translators/blob/master/BibTeX.js#L2353)
 * [REPO](https://github.com/zotero/translators)
 *
 * Accesed 11/09/2016
 *
 * @access private
 * @constant varBibTeXTokens
 * @default
 */
var varBibTeXTokens = {
  '\\url': "", "\\href": "", "{\\textexclamdown}": '\xA1', "{\\textcent}": '\xA2',
  "{\\textsterling}": '\xA3', "{\\textyen}": '\xA5', "{\\textbrokenbar}": '\xA6', "{\\textsection}": '\xA7',
  "{\\textasciidieresis}": '\xA8', "{\\textcopyright}": '\xA9', "{\\textordfeminine}": '\xAA', "{\\guillemotleft}": '\xAB',
  "{\\textlnot}": '\xAC', "{\\textregistered}": '\xAE', "{\\textasciimacron}": '\xAF', "{\\textdegree}": '\xB0',
  "{\\textpm}": '\xB1', "{\\texttwosuperior}": '\xB2', "{\\textthreesuperior}": '\xB3', "{\\textasciiacute}": '\xB4',
  "{\\textmu}": '\xB5', "{\\textparagraph}": '\xB6', "{\\textperiodcentered}": '\xB7', "{\\c\\ }": '\xB8',
  "{\\textonesuperior}": '\xB9', "{\\textordmasculine}": '\xBA', "{\\guillemotright}": '\xBB', "{\\textonequarter}": '\xBC',
  "{\\textonehalf}": '\xBD', "{\\textthreequarters}": '\xBE', "{\\textquestiondown}": '\xBF', "{\\AE}": '\xC6',
  "{\\DH}": '\xD0', "{\\texttimes}": '\xD7', "{\\O}": '\xD8', "{\\TH}": '\xDE',
  "{\\ss}": '\xDF', "{\\ae}": '\xE6', "{\\dh}": '\xF0', "{\\textdiv}": '\xF7',
  "{\\o}": '\xF8', "{\\th}": '\xFE', "{\\i}": '\u0131', "{\\NG}": '\u014A',
  "{\\ng}": '\u014B', "{\\OE}": '\u0152', "{\\oe}": '\u0153', "{\\textasciicircum}": '\u02C6',
  "{\\textacutedbl}": '\u02DD', "$\\Gamma$": '\u0393', "$\\Delta$": '\u0394', "$\\Theta$": '\u0398',
  "$\\Lambda$": '\u039B', "$\\Xi$": '\u039E', "$\\Pi$": '\u03A0', "$\\Sigma$": '\u03A3',
  "$\\Phi$": '\u03A6', "$\\Psi$": '\u03A8', "$\\Omega$": '\u03A9', "$\\alpha$": '\u03B1',
  "$\\beta$": '\u03B2', "$\\gamma$": '\u03B3', "$\\delta$": '\u03B4', "$\\varepsilon$": '\u03B5',
  "$\\zeta$": '\u03B6', "$\\eta$": '\u03B7', "$\\theta$": '\u03B8', "$\\iota$": '\u03B9',
  "$\\kappa$": '\u03BA', "$\\lambda$": '\u03BB', "$\\mu$": '\u03BC', "$\\nu$": '\u03BD',
  "$\\xi$": '\u03BE', "$\\pi$": '\u03C0', "$\\rho$": '\u03C1', "$\\varsigma$": '\u03C2',
  "$\\sigma$": '\u03C3', "$\\tau$": '\u03C4', '$\\upsilon$': '\u03C5', "$\\varphi$": '\u03C6',
  "$\\chi$": '\u03C7', "$\\psi$": '\u03C8', "$\\omega$": '\u03C9', "$\\vartheta$": '\u03D1',
  '$\\Upsilon$': '\u03D2', "$\\phi$": '\u03D5', "$\\varpi$": '\u03D6', "$\\varrho$": '\u03F1',
  "$\\epsilon$": '\u03F5', "{\\textendash}": '\u2013', "{\\textemdash}": '\u2014', "---": '\u2014',
  "--": '\u2013', "{\\textbardbl}": '\u2016', "{\\textunderscore}": '\u2017', "{\\textquoteleft}": '\u2018',
  "{\\textquoteright}": '\u2019', "{\\quotesinglbase}": '\u201A', "{\\textquotedblleft}": '\u201C', "{\\textquotedblright}": '\u201D',
  "{\\quotedblbase}": '\u201E', "{\\textdagger}": '\u2020', "{\\textdaggerdbl}": '\u2021', "{\\textbullet}": '\u2022',
  "{\\textellipsis}": '\u2026', "{\\textperthousand}": '\u2030', "'''": '\u2034', "''": '\u201D',
  "``": '\u201C', "```": '\u2037', "{\\guilsinglleft}": '\u2039', "{\\guilsinglright}": '\u203A',
  "!!": '\u203C', "{\\textfractionsolidus}": '\u2044', "?!": '\u2048', "!?": '\u2049',
  "$^{0}$": '\u2070', "$^{4}$": '\u2074', "$^{5}$": '\u2075', "$^{6}$": '\u2076',
  "$^{7}$": '\u2077', "$^{8}$": '\u2078', "$^{9}$": '\u2079', "$^{+}$": '\u207A',
  "$^{-}$": '\u207B', "$^{=}$": '\u207C', "$^{(}$": '\u207D', "$^{)}$": '\u207E',
  "$^{n}$": '\u207F', "$_{0}$": '\u2080', "$_{1}$": '\u2081', "$_{2}$": '\u2082',
  "$_{3}$": '\u2083', "$_{4}$": '\u2084', "$_{5}$": '\u2085', "$_{6}$": '\u2086',
  "$_{7}$": '\u2087', "$_{8}$": '\u2088', "$_{9}$": '\u2089', "$_{+}$": '\u208A',
  "$_{-}$": '\u208B', "$_{=}$": '\u208C', "$_{(}$": '\u208D', "$_{)}$": '\u208E',
  "{\\texteuro}": '\u20AC', "{\\textcelsius}": '\u2103', "{\\textnumero}": '\u2116', "{\\textcircledP}": '\u2117',
  "{\\textservicemark}": '\u2120', "{TEL}": '\u2121', "{\\texttrademark}": '\u2122', "{\\textohm}": '\u2126',
  "{\\textestimated}": '\u212E', "{\\`A}": '\xC0', "{\\'A}": '\xC1', "{\\^A}": '\xC2',
  "{\\~A}": '\xC3', "{\\\"A}": '\xC4', "{\\r A}": '\xC5', "{\\c C}": '\xC7',
  "{\\`E}": '\xC8', "{\\'E}": '\xC9', "{\\^E}": '\xCA', "{\\\"E}": '\xCB',
  "{\\`I}": '\xCC', "{\\'I}": '\xCD', "{\\^I}": '\xCE', "{\\\"I}": '\xCF',
  "{\\~N}": '\xD1', "{\\`O}": '\xD2', "{\\'O}": '\xD3', "{\\^O}": '\xD4',
  "{\\~O}": '\xD5', "{\\\"O}": '\xD6', "{\\`U}": '\xD9', "{\\'U}": '\xDA',
  "{\\^U}": '\xDB', "{\\\"U}": '\xDC', "{\\'Y}": '\xDD', "{\\`a}": '\xE0',
  "{\\'a}": '\xE1', "{\\^a}": '\xE2', "{\\~a}": '\xE3', "{\\\"a}": '\xE4',
  "{\\r a}": '\xE5', "{\\c c}": '\xE7', "{\\`e}": '\xE8', "{\\'e}": '\xE9',
  "{\\^e}": '\xEA', "{\\\"e}": '\xEB', "{\\`i}": '\xEC', "{\\'i}": '\xED',
  "{\\^i}": '\xEE', "{\\\"i}": '\xEF', "{\\~n}": '\xF1', "{\\`o}": '\xF2',
  "{\\'o}": '\xF3', "{\\^o}": '\xF4', "{\\~o}": '\xF5', "{\\\"o}": '\xF6',
  "{\\`u}": '\xF9', "{\\'u}": '\xFA', "{\\^u}": '\xFB', "{\\\"u}": '\xFC',
  "{\\'y}": '\xFD', "{\\\"y}": '\xFF', "{\\=A}": '\u0100', "{\\=a}": '\u0101',
  '{\\u A}': '\u0102', '{\\u a}': '\u0103', "{\\k A}": '\u0104', "{\\k a}": '\u0105',
  "{\\'C}": '\u0106', "{\\'c}": '\u0107', "{\\^C}": '\u0108', "{\\^c}": '\u0109',
  "{\\.C}": '\u010A', "{\\.c}": '\u010B', "{\\v C}": '\u010C', "{\\v c}": '\u010D',
  "{\\v D}": '\u010E', "{\\v d}": '\u010F', "{\\=E}": '\u0112', "{\\=e}": '\u0113',
  '{\\u E}': '\u0114', '{\\u e}': '\u0115', "{\\.E}": '\u0116', "{\\.e}": '\u0117',
  "{\\k E}": '\u0118', "{\\k e}": '\u0119', "{\\v E}": '\u011A', "{\\v e}": '\u011B',
  "{\\^G}": '\u011C', "{\\^g}": '\u011D', '{\\u G}': '\u011E', '{\\u g}': '\u011F',
  "{\\.G}": '\u0120', "{\\.g}": '\u0121', "{\\c G}": '\u0122', "{\\c g}": '\u0123',
  "{\\^H}": '\u0124', "{\\^h}": '\u0125', "{\\~I}": '\u0128', "{\\~i}": '\u0129',
  "{\\=I}": '\u012A', "{\\=i}": '\u012B', "{\\=\\i}": '\u012B', '{\\u I}': '\u012C',
  '{\\u i}': '\u012D', "{\\k I}": '\u012E', "{\\k i}": '\u012F', "{\\.I}": '\u0130',
  "{\\^J}": '\u0134', "{\\^j}": '\u0135', "{\\c K}": '\u0136', "{\\c k}": '\u0137',
  "{\\'L}": '\u0139', "{\\'l}": '\u013A', "{\\c L}": '\u013B', "{\\c l}": '\u013C',
  "{\\v L}": '\u013D', "{\\v l}": '\u013E', "{\\L }": '\u0141', "{\\l }": '\u0142',
  "{\\'N}": '\u0143', "{\\'n}": '\u0144', "{\\c N}": '\u0145', "{\\c n}": '\u0146',
  "{\\v N}": '\u0147', "{\\v n}": '\u0148', "{\\=O}": '\u014C', "{\\=o}": '\u014D',
  '{\\u O}': '\u014E', '{\\u o}': '\u014F', "{\\H O}": '\u0150', "{\\H o}": '\u0151',
  "{\\'R}": '\u0154', "{\\'r}": '\u0155', "{\\c R}": '\u0156', "{\\c r}": '\u0157',
  "{\\v R}": '\u0158', "{\\v r}": '\u0159', "{\\'S}": '\u015A', "{\\'s}": '\u015B',
  "{\\^S}": '\u015C', "{\\^s}": '\u015D', "{\\c S}": '\u015E', "{\\c s}": '\u015F',
  "{\\v S}": '\u0160', "{\\v s}": '\u0161', "{\\c T}": '\u0162', "{\\c t}": '\u0163',
  "{\\v T}": '\u0164', "{\\v t}": '\u0165', "{\\~U}": '\u0168', "{\\~u}": '\u0169',
  "{\\=U}": '\u016A', "{\\=u}": '\u016B', '{\\u U}': '\u016C', '{\\u u}': '\u016D',
  "{\\r U}": '\u016E', "{\\r u}": '\u016F', "{\\H U}": '\u0170', "{\\H u}": '\u0171',
  "{\\k U}": '\u0172', "{\\k u}": '\u0173', "{\\^W}": '\u0174', "{\\^w}": '\u0175',
  "{\\^Y}": '\u0176', "{\\^y}": '\u0177', "{\\\"Y}": '\u0178', "{\\'Z}": '\u0179',
  "{\\'z}": '\u017A', "{\\.Z}": '\u017B', "{\\.z}": '\u017C', "{\\v Z}": '\u017D',
  "{\\v z}": '\u017E', "{\\v A}": '\u01CD', "{\\v a}": '\u01CE', "{\\v I}": '\u01CF',
  "{\\v i}": '\u01D0', "{\\v O}": '\u01D1', "{\\v o}": '\u01D2', "{\\v U}": '\u01D3',
  "{\\v u}": '\u01D4', "{\\v G}": '\u01E6', "{\\v g}": '\u01E7', "{\\v K}": '\u01E8',
  "{\\v k}": '\u01E9', "{\\k O}": '\u01EA', "{\\k o}": '\u01EB', "{\\v j}": '\u01F0',
  "{\\'G}": '\u01F4', "{\\'g}": '\u01F5', "{\\.B}": '\u1E02', "{\\.b}": '\u1E03',
  "{\\d B}": '\u1E04', "{\\d b}": '\u1E05', "{\\b B}": '\u1E06', "{\\b b}": '\u1E07',
  "{\\.D}": '\u1E0A', "{\\.d}": '\u1E0B', "{\\d D}": '\u1E0C', "{\\d d}": '\u1E0D',
  "{\\b D}": '\u1E0E', "{\\b d}": '\u1E0F', "{\\c D}": '\u1E10', "{\\c d}": '\u1E11',
  "{\\.F}": '\u1E1E', "{\\.f}": '\u1E1F', "{\\=G}": '\u1E20', "{\\=g}": '\u1E21',
  "{\\.H}": '\u1E22', "{\\.h}": '\u1E23', "{\\d H}": '\u1E24', "{\\d h}": '\u1E25',
  "{\\\"H}": '\u1E26', "{\\\"h}": '\u1E27', "{\\c H}": '\u1E28', "{\\c h}": '\u1E29',
  "{\\'K}": '\u1E30', "{\\'k}": '\u1E31', "{\\d K}": '\u1E32', "{\\d k}": '\u1E33',
  "{\\b K}": '\u1E34', "{\\b k}": '\u1E35', "{\\d L}": '\u1E36', "{\\d l}": '\u1E37',
  "{\\b L}": '\u1E3A', "{\\b l}": '\u1E3B', "{\\'M}": '\u1E3E', "{\\'m}": '\u1E3F',
  "{\\.M}": '\u1E40', "{\\.m}": '\u1E41', "{\\d M}": '\u1E42', "{\\d m}": '\u1E43',
  "{\\.N}": '\u1E44', "{\\.n}": '\u1E45', "{\\d N}": '\u1E46', "{\\d n}": '\u1E47',
  "{\\b N}": '\u1E48', "{\\b n}": '\u1E49', "{\\'P}": '\u1E54', "{\\'p}": '\u1E55',
  "{\\.P}": '\u1E56', "{\\.p}": '\u1E57', "{\\.R}": '\u1E58', "{\\.r}": '\u1E59',
  "{\\d R}": '\u1E5A', "{\\d r}": '\u1E5B', "{\\b R}": '\u1E5E', "{\\b r}": '\u1E5F',
  "{\\.S}": '\u1E60', "{\\.s}": '\u1E61', "{\\d S}": '\u1E62', "{\\d s}": '\u1E63',
  "{\\.T}": '\u1E6A', "{\\.t}": '\u1E6B', "{\\d T}": '\u1E6C', "{\\d t}": '\u1E6D',
  "{\\b T}": '\u1E6E', "{\\b t}": '\u1E6F', "{\\~V}": '\u1E7C', "{\\~v}": '\u1E7D',
  "{\\d V}": '\u1E7E', "{\\d v}": '\u1E7F', "{\\`W}": '\u1E80', "{\\`w}": '\u1E81',
  "{\\'W}": '\u1E82', "{\\'w}": '\u1E83', "{\\\"W}": '\u1E84', "{\\\"w}": '\u1E85',
  "{\\.W}": '\u1E86', "{\\.w}": '\u1E87', "{\\d W}": '\u1E88', "{\\d w}": '\u1E89',
  "{\\.X}": '\u1E8A', "{\\.x}": '\u1E8B', "{\\\"X}": '\u1E8C', "{\\\"x}": '\u1E8D',
  "{\\.Y}": '\u1E8E', "{\\.y}": '\u1E8F', "{\\^Z}": '\u1E90', "{\\^z}": '\u1E91',
  "{\\d Z}": '\u1E92', "{\\d z}": '\u1E93', "{\\b Z}": '\u1E94', "{\\b z}": '\u1E95',
  "{\\b h}": '\u1E96', "{\\\"t}": '\u1E97', "{\\r w}": '\u1E98', "{\\r y}": '\u1E99',
  "{\\d A}": '\u1EA0', "{\\d a}": '\u1EA1', "{\\d E}": '\u1EB8', "{\\d e}": '\u1EB9',
  "{\\~E}": '\u1EBC', "{\\~e}": '\u1EBD', "{\\d I}": '\u1ECA', "{\\d i}": '\u1ECB',
  "{\\d O}": '\u1ECC', "{\\d o}": '\u1ECD', "{\\d U}": '\u1EE4', "{\\d u}": '\u1EE5',
  "{\\`Y}": '\u1EF2', "{\\`y}": '\u1EF3', "{\\d Y}": '\u1EF4', "{\\d y}": '\u1EF5',
  "{\\~Y}": '\u1EF8', "{\\~y}": '\u1EF9', "{\\~}": '\u223C', "~": '\xA0'
};

var parseBibTeX = function parseBibTeX(str) {

  var entries;

  try {
    entries = [];

    var stack = str
    // Clean weird commands
    .replace(/{?(\\[`"'^~=]){?\\?([A-Za-z])}/g, '{$1$2}').replace(/{?(\\[a-z]){?\\?([A-Za-z])}/g, '{$1 $2}')
    // Tokenize, with escaped characters in mind
    .split(new RegExp('(?!^)(' +
    // Escaped chars
    '\\\\([#$%&~_^\\\\{}])|' +
    // Regular commands
    '\\{\\\\(?:' +
    // Accented chars
    // Vowel regular
    '[`\'^~"=][AEIOUYaeiouy]|' +
    // Consonant regular
    '(?:[cv] |[\'])[CcDdGgKkLlNnRrSs]|' +
    // A-E
    '(?:[dkruv] )[Aa]|(?:[db] |\\.)[Bb]|[.^][Cc]|(?:[bd] |\\.)[Dd]|(?:[dkuv] |[.])[Ee]|' +
    // F-J
    '\\.[Ff]|(?:u |[=.^\'])[Gg]|(?:[cd] |[.^"])[Hh]|b h|[dv] [Ii]|=\\\\i|\\.I|(?:v |\\^)[Jj]|' +
    // K-O
    '(?:[bd] |\')[Kk]|[bd] [Ll]|[Ll] |(?:d |[.\'])[Mm]|(?:[bd] |[~.])[Nn]|[dHkuv] [Oo]|' +
    // P-U
    '[.\'][Pp]|(?:[bd] |[.])[Rr]|(?:d |[.^])[Ss]|(?:[bcdv] |[.])[Tt]|" t|[dHkruv] [Uu]|' +
    // V-Z
    '(?:d |[~])[Vv]|(?:d |[`".\'^])[Ww]|r w|[."][Xx]|(?:d |[.])[Yy]|r y|(?:[bdv] |[\'.^])[Zz]|' +
    // No break space
    '~|' +
    // Commands
    '\\w+' + ')\\}|' +
    // Greek letters and other symbols
    '\$\\\\(?:[A-Z]?[a-z]+|\\#|%<)\\\\$|' +
    // Subscript and superscript
    '\\$[^_]\\{[0-9+-=()n]\\}\\$|' +
    // --, ---, '', ''', ``, ```
    '---|--|\'\'\'|\'\'|```|``|' +
    // ?!, !!, !?
    '\\?!|' + '!!|' + '!\\?\'|' +
    // \url and \href
    '\\\\(?:url|href)|' + '[\\s\\S]' + ')', 'g')).filter(function (v) {
      return !!v;
    }),
        whitespace = varRegex.bibtex[1],
        syntax = varRegex.bibtex[2],
        dels = {
      '"': '"',
      '{': '}',
      '"{': '}"',
      '{{': '}}',
      '': ''
    },
        index = 0,
        curs = stack[index],
        obj;

    while (curs) {

      while (whitespace.test(curs)) {
        curs = stack[++index];
      }if (!curs) break;

      entries.push({ type: '', label: '', properties: {} });
      obj = entries[entries.length - 1];

      if (curs === '@') curs = stack[++index];else throw new SyntaxError('Unexpected token at index ' + index + '. Expected "@", got "' + curs + '".');

      while (whitespace.test(curs)) {
        curs = stack[++index];
      }while (!whitespace.test(curs) && !syntax.test(curs) || curs.length > 1) {
        obj.type += curs, curs = stack[++index];
      }obj.type = obj.type.toLowerCase();

      while (whitespace.test(curs)) {
        curs = stack[++index];
      }if (curs === '{') curs = stack[++index];else throw new SyntaxError('Unexpected token at index ' + index + '. Expected "{", got "' + curs + '".');

      while (whitespace.test(curs)) {
        curs = stack[++index];
      }while (!whitespace.test(curs) && !syntax.test(curs) || curs.length > 1) {
        obj.label += curs;
        curs = stack[++index];
      }

      while (whitespace.test(curs)) {
        curs = stack[++index];
      }if (curs === ',') curs = stack[++index];else throw new SyntaxError('Unexpected token at index ' + index + '. Expected ",", got "' + curs + '".');

      while (whitespace.test(curs)) {
        curs = stack[++index];
      }var key, val, start_del, end_del, nexs;

      while (curs !== '}') {

        key = '', val = '', start_del = '';

        while (curs && !whitespace.test(curs) && curs !== '=') {
          key += curs, curs = stack[++index];
        }while (whitespace.test(curs)) {
          curs = stack[++index];
        }if (curs === '=') curs = stack[++index];else throw new SyntaxError('Unexpected token at index ' + index + '. Expected "=", got "' + curs + '".');

        while (whitespace.test(curs)) {
          curs = stack[++index];
        }while (syntax.test(curs)) {
          start_del += curs, curs = stack[++index];
        }if (!dels.hasOwnProperty(start_del)) throw new SyntaxError('Unexpected field delimiter at index ' + index + '. Expected ' + (Object.keys(dels).map(function (v) {
          return '"' + v + '"';
        }).join(', ') + ', got "' + start_del + '".'));

        end_del = dels[start_del], nexs = stack.slice(index + 1, index + (end_del.length ? end_del.length : 1)).reverse().join('');

        while (curs && (end_del === '' ? curs !== ',' : curs + nexs !== end_del)) {

          if (varBibTeXTokens.hasOwnProperty(curs)) val += varBibTeXTokens[curs];else if (curs.match(/^\\([#$%&~_^\\{}])$/)) val += curs.slice(1);else if (curs.length > 1)
            // "Soft", non-breaking error for now
            //throw new SyntaxError( 'Escape sequence not recognized: ' + curs )
            console.error('Escape sequence not recognized: ' + curs);else val += curs;

          curs = stack[++index];
          nexs = stack.slice(index + 1, index + (end_del.length ? end_del.length : 1)).reverse().join('');
        }

        key = key.trim().replace(/\s+/g, ' ').toLowerCase();

        val = val.replace(/[{}]/g, '').trim().replace(/\s+/g, ' ');

        obj.properties[key] = val;

        end_del = end_del.split('');

        while (end_del.pop()) {
          curs = stack[++index];
        }while (whitespace.test(curs)) {
          curs = stack[++index];
        }if (curs === '}') break;else if (curs === ',') curs = stack[++index];else throw new SyntaxError('Unexpected token at index ' + index + '. Expected ",", "}", got "' + curs + '".');

        while (whitespace.test(curs)) {
          curs = stack[++index];
        }
      }

      if (curs === '}') curs = stack[++index];else throw new SyntaxError('Unexpected token at index ' + index + '. Expected "}", got "' + curs + '".');
    }

    return entries;
  } catch (e) {
    console.error('Uncaught SyntaxError: ' + e.message + ' Returning completed entries.');

    // Remove last, incomplete entry
    entries.pop();

    return entries;
  }
};

var parseName = function parseName(str) {

  if (str.indexOf(', ') > -1) var arr = str.split(', ').reverse();else var arr = str.split(varRegex.name);

  var obj = {
    given: arr[0],
    family: arr[1]
  };

  return obj;
};

var parseBibTeXProp = function parseBibTeXProp(prop, value) {

  var rProp = prop,
      rValue = value;

  switch (prop) {

    // Author
    case 'author':
      rValue = value.split(' and ').map(parseName);
      break;

    // DOI
    case 'doi':
      rProp = 'DOI';
      break;

    // Edition/print
    case 'edition':
      //rValue = parseOrdinal( value )
      break;

    // Editor
    case 'editor':
      rValue = value.split(' and ').map(parseName);
      break;

    // ISBN
    case 'isbn':
      rProp = 'ISBN';
      break;

    // ISSN
    case 'issn':
      rProp = 'ISBN';
      break;

    // Issue
    case 'issue':
    case 'number':
      rProp = 'issue';
      rValue = value.toString();
      break;

    // Journal
    case 'journal':
      rProp = 'container-title';
      break;

    // Location
    case 'location':
      rProp = 'publisher-place';
      break;

    // Pages
    case 'pages':
      rProp = 'page';
      rValue = value.replace(/[—–]/, '-');
      break;

    // Pubate
    case 'date':
      rProp = 'issued';
      rValue = parseDate(value);
      break;

    case 'year':
      // Ignore for now
      //rProp = 'issued-year'
      break;

    case 'month':
      // Ignore for now
      //rProp = 'issued-month'
      break;

    // Publisher
    case 'publisher':
      // Nothing necessary, as far as I know
      break;

    // Title
    case 'title':
      rProp = 'title';
      rValue = value.replace(/\.$/g, '');
      break;

    // Volume
    case 'volume':
      rValue = value.toString();
      break;

    case 'crossref': // Crossref
    case 'keywords': // Keywords
    case 'language': // Language
    case 'note': // Note
    case 'pmid': // PMID
    case 'url':
      // URL
      // Property ignored
      rProp = rValue = undefined;
      break;

    default:
      console.debug('[set]', 'Unknown property:', prop);
      rProp = rValue = undefined;
      break;
  }

  if (rProp !== undefined && rValue !== undefined) return [rProp, rValue];else return undefined;
};

var parseBibTeXJSON = function parseBibTeXJSON(data) {
  var output = [];

  for (var entryIndex = 0; entryIndex < data.length; entryIndex++) {
    var entry = data[entryIndex];

    for (var prop in entry.properties) {
      var val = parseBibTeXProp(prop, entry.properties[prop]);

      if (val !== undefined) entry[val[0]] = val[1];
    }

    entry.type = parseBibTeXType(entry.type);
    entry.id = entry.label;

    delete entry.label;
    delete entry.properties;

    output[entryIndex] = entry;
  }

  return output;
};

var parseBibTeXType = function parseBibTeXType(pubType) {
  switch (pubType) {

    case 'article':
      return 'article-journal';
      break;

    case 'book':
    case 'booklet':
    case 'manual':
    case 'misc':
    case 'proceedings':
      return 'book';
      break;

    case 'inbook':
    case 'incollection':
      return 'chapter';
      break;

    case 'conference':
    case 'inproceedings':
      return 'paper-conference';
      break;

    case 'online':
      return 'webpage';
      break;

    case 'patent':
      return 'patent';
      break;

    case 'phdthesis':
    case 'mastersthesis':
      return 'thesis';
      break;

    case 'techreport':
      return 'report';
      break;

    case 'unpublished':
      return 'manuscript';
      break;

    default:
      console.warn('BibTeX publication type not recognized: ' + pubType + '. Interpreting as "book".');
      return 'book';
      break;
  }
};

var bibtexToCSL = function bibtexToCSL(bibtexStr) {
  return parseBibTeXJSON(parseBibTeX(bibtexStr));
};

exports.default = bibtexToCSL;