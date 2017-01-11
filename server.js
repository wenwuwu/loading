
var express = require('express')
var compression = require('compression')
var path = require('path')
var port = process.env.PORT || 3000
var app = express()
var nodeEnv = process.env.NODE_ENV || 'development'
var isPro = nodeEnv === 'production'

app.use(compression({filter: shouldCompress}))

function shouldCompress (req, res) {
    if (   req.headers['x-no-compression']
        || (/\.(png|jpg|gif|pdf)$/.test(req.path)) ) {
        return false;
    }
    return compression.filter(req, res);
};

function serveIndexPage (res) {
    res.sendFile(path.resolve(__dirname, '/component', 'index.html'));    // Make sure don't cache it.
};

app.use(express.static(__dirname + '/component'));

app.get('/', function (req, res) {
    serveIndexPage(res);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('error', { error: err });
});
console.log(`Server is running in ${nodeEnv} mode on port ${port}`);

app.listen(port)
