var express = require('express');
var app = express();
var fs = require('fs');
var chokidar = require('chokidar');



// Initialize watcher.
var watcher = chokidar.watch('.\\TestWatch\\', {
  persistent: true,

  ignored: '*.txt',
  ignoreInitial: false,
  followSymlinks: true,
  cwd: '.',

  usePolling: true,
  interval: 100,
  binaryInterval: 300,
  alwaysStat: false,
  depth: 99,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  },

  ignorePermissionErrors: false,
  atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// Something to use when events are received.
var log = console.log.bind(console);
// Add event listeners.
watcher
  .on('add', path => log(`File ${path} has been added`))
  .on('change', path => log(`File ${path} has been changed`))
  .on('unlink', path => log(`File ${path} has been removed`));

// More possible events.
watcher
  .on('addDir', path => log(`Directory ${path} has been added`))
  .on('unlinkDir', path => log(`Directory ${path} has been removed`))
  .on('error', error => log(`Watcher error: ${error}`))
  .on('ready', () => log('Initial scan complete. Ready for changes'))
  .on('raw', (event, path, details) => {
    log('Raw event info:', event, path, details);
  });

// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', (path, stats) => {
  if (stats) console.log(`File ${path} changed size to ${stats.size}`);
});

var watchedPaths = watcher.getWatched();



/*
fs.watch('.', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
*/

app.get('/mockdata', function (req, res) {
   fs.readFile( __dirname + "/" + "mockdata.json", 'utf8', function (err, data) {
      //console.log( data );
      res.end( data );
   });
})


var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})