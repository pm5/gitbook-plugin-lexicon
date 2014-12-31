var fs = require('fs');
var lexicon;

function scanner(lexicon) {
    return new RegExp('(' + lexicon.map(function (t) { return t["#title"] }).join('|') + ')', "g");
};

function rewriter(lexicon) {
    return function (match, p1) {
        console.log(p1);
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
                lexicon = JSON.parse(content);
            });
        },
        "page:after": function(page) {
            page.content = page.content.replace(scanner(lexicon), rewriter(lexicon));
            return page;
        }
    }
};
