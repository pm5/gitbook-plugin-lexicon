var fs = require('fs');
var lexicon, lexIndex;

function scanner(lexicon) {
    return new RegExp('(' + lexicon.map(function (t) { return t["#title"] }).join('|') + ')', "g");
};

function rewriter(lexicon) {
    return function (match, p1) {
        return '<abbr title="' + lexIndex[p1]["#definition"] + '">' + p1 + '</abbr>';
    };
};

module.exports = {
    book: {
        //assets: "./book",
        //js: [],
        //css: [],
        html: {
            "html:start": function() {
                return "<!-- Start book "+this.options.title+" -->"
            },
            "html:end": function() {
                return "<!-- End of book "+this.options.title+" -->"
            },

            "head:start": "<!-- head:start -->",
            "head:end": "<!-- head:end -->",

            "body:start": "<!-- body:start -->",
            "body:end": "<!-- body:end -->"
        }
    },
    hooks: {
        "init": function () {
            fs.readFile('lexicon.json', {encoding: 'utf-8'}, function (err, content) {
                if (content === undefined) {
                    return;
                }
                lexicon = JSON.parse(content);
                lexIndex = {};
                lexicon.forEach(function (t) {
                    lexIndex[t["#title"]] = t;
                });
            });
        },
        "page:after": function(page) {
            if (lexicon === undefined) {
                return page;
            }
            var start = page.content.indexOf('<div class="book-body">');
            page.content = page.content.substr(0, start) + page.content.substr(start).replace(scanner(lexicon), rewriter(lexicon));
            return page;
        }
    }
};
