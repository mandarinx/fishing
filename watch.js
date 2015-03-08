var exec = require('child_process').exec;
var chokidar = require('chokidar');

var ready = false;

var script = process.argv[2];
if (typeof script === 'undefined') {
    console.log('watch.js is missing an npm script to run. Pass a script as '+
                'paramter to watch.js, like this: \'node watch.js build\'');
}

var watcher = chokidar.watch('./src/', {
    ignored: /[\/\\]\./,
    persistent: true
});

watcher
    .on('add', run)
    .on('addDir', run)
    .on('unlink', run)
    .on('unlinkDir', run)
    .on('change', run)
    .on('ready', function() {
        ready = true;
        run();
    });

function run(path, stats) {
    if (!ready) { return; }

    exec('npm run ' + script, function (error, stdout, stderr) {
        console.log(typeof path === 'undefined' ? 'Watch init' : 'Changed ' + path);
        if (error) {
            console.log(error);
        }
    });
}
