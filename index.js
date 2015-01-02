var fs = require('fs');
var Q = require('q');
var lexicon, lexIndex;
var config = {
  "localCopy": "lexicon.json"
};

function scanner(lexicon) {
    return new RegExp('(' + lexicon.map(function (t) { return t["#title"] }).join('|') + ')', "g");
};

function rewriter(lexicon) {
    return function (match, p1) {
        return '<abbr title="' + lexIndex[p1]["#definition"] + '">' + p1 + '</abbr>';
    };
};

function loadLexicon(localCopy, d) {
    fs.readFile(localCopy, {encoding: 'utf-8'}, function (err, content) {
        if (content === undefined) {
            d.resolve();
            return;
        }
        lexicon = JSON.parse(content);
        lexIndex = {};
        lexicon.forEach(function (t) {
            lexIndex[t["#title"]] = t;
        });
        d.resolve();
    });
};

module.exports = {
    hooks: {
        "init": function (done) {
            var userConfig = this.options.pluginsConfig.lexicon;
            for (c in userConfig) {
                config[c] = userConfig[c];
            }
            var d = Q.defer();
            loadLexicon(config["localCopy"], d);
            return d.promise;
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
