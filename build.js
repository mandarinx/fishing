// NOTE: Should this be a Yeoman plugin/task? Yeoman creates stuff, and
// in a way, the build script creates a build. I might benefit from using
// Yeoman as it already has a lot of handy functions for working with files,
// and they're all tested on multiple platforms. Besides, this build script
// is tightly coupled with the directory structure I used, which in turn is
// created by the Yeoman generator.

// NOTE: How can I make this dynamically enough that it can be used for other
// projects with a different folder structure? Use a config file? The config
// file should be the same used for setting up the project.

// mkdirp can recursively create dirs https://github.com/substack/node-mkdirp

// For next version:
// - display a short description of how the build script works at beginning
//   of script.
// - create gh-pages branch if it doesn't exist
    // > switch to gh-pages
    // > delete stuff we don't need
    // > push the delete commit
    // > create an index.html (use Yeoman?)
    // > switch back
// - update yo-phaser-simple
    // > ask for a gh-pages url
    // > create a gh-pages branch after scaffolding the project
// - tag the latest commit in master with the new build number. Get the commits,
//   including descriptions for all commits between current and previous tag.
//   Use the commit messages to compose a changelog for the current build.
//   Include it in the build's html so it is visible when playing.

// ------------------

// ! check if there are tracked and uncomitted changes. Report back to user and
//   abort.
// ! switch to master branch
// ! create 'build' directory
// ! copy contents of public to build
// ! get gh-pages url from package.json
// ! prepare phaser lib
// ! switch to gh-pages branch
// ! get name of build folder with the highest number
// ! pad the number
// ! append build number to document title
// ! rename ./build to build_x+1
// ! move new build folder to builds
// ! add new build folder to index.html
// - add new build folder and index.html to git commit
// - set commit message to build number
// - commit
// - push
// - switch back to previous branch
// - output the URL to the new build in console

var chalk = require('chalk');
var cheerio = require('cheerio');
var fs = require('fs-extra');
var path = require('path');
var wrench = require('wrench');
var gift = require('gift');
var dateFormat = require('dateformat');
var repo = gift('./');

var libs_json;
var package_json;
var gh_pages_url;
var current_build_url;

var error = function() {
    var args = Array.prototype.slice.call(arguments);
    console.log(chalk.white.bgRed(args.join(' ')));
};

check_status(function(err) {
    if (err) {
        return error('You have uncomitted changes. '+
                    'Commit or stash before building.');
    }

    checkout('master', function() {

        libs_json = require('./libs.json');
        package_json = require('./package.json');
        gh_pages_url = package_json.ghpages.url;

        fs.mkdir('./builds/', 0777, function(err) {});

        wrench.copyDirSyncRecursive('./public', './build', {
            forceDelete: true
        });

        fs.mkdir('./build/lib/', 0777, function(err) {
            if (err) {
                return error(err);
            }

            copy_lib(libs_json['phaser.min.js'], './build/lib/phaser.min.js');
        });

    });
});

function checkout(branch, cb) {
    repo.checkout(branch, function(err) {
        if (err) {
            error('Could not checkout '+branch, err);
            return;
        }
        if (typeof cb !== 'undefined') {
            cb();
        }
    });
}

function check_status(cb) {
    repo.status(function(err, status) {
        if (err) {
            error('Could not get status', err);
            return;
        }

        if (typeof status.files === 'undefined') {
            return cb(false);
        }

        var err = false;

        Object.keys(status.files).forEach(function(file) {
            var file_status = status.files[file];
            if (file_status.tracked &&
                typeof file_status.type !== 'undefined') {
                err = true;
            }
        });

        return cb(err);
    });
}

function add(file, build_num) {
    var is_array = file instanceof Array;
    if (!is_array) {
        file = [file];
    }
    repo.add(file, function(err) {
        if (err) {
            console.log('could not add', file, err);
            return;
        }
        commit('Build '+build_num);
    });
}

function get_subdirs(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        var file_abs = path.resolve(__dirname, path.join(srcpath, file));
        return fs.statSync(file_abs).isDirectory();
    });
}

function copy_lib(from, to) {
    fs.copy(from, to, function(err) {
        if (err) {
            return error('Could not copy '+ from+' to '+ to + ': '+ err);
        }

        checkout('gh-pages', function() {

            var next_build = get_next_build();
            update_title(next_build);

            fs.renameSync('./build', './build_'+next_build);

            wrench.copyDirSyncRecursive('./build_'+next_build,
                                        './builds/build_'+next_build, {
                forceDelete: true
            });

            wrench.rmdirSyncRecursive('./build_'+next_build, false);

            update_index(next_build);

            current_build_url = gh_pages_url + 'builds/build_' + build_num;

            add(['./index.html', './builds/build_'+next_build], next_build);
        });
    })
}

function update_index(build_num) {
    var index_loc = './index.html';
    var index_html = fs.readFileSync(index_loc, {
        encoding: 'utf8'
    });

    var $ = cheerio.load(index_html);
    var clone = false;

    var li = $('li').last();

    if (li.find('h3').attr('id') !== '') {
        li = li.clone();
        clone = true;
    }

    li.find('h3').attr('id', build_num);
    li.find('a').attr('href',
                      gh_pages_url + 'builds/build_' + build_num);

    var now = new Date();
    li.find('a').text(build_num + ' ' +
                        dateFormat(now, 'dddd, mmmm dS, yyyy'));

    if (clone) {
        $('ul').append(li);
    } else {
        $('li').last().replaceWith(li);
    }

    fs.writeFileSync(index_loc, $.html(), {
        encoding: 'utf8'
    });
}

function update_title(build_num) {
    var index_loc = './build/index.html';
    var index_html = fs.readFileSync(index_loc, {
        encoding: 'utf8'
    });

    var $ = cheerio.load(index_html);
    var title = $('title');
    title.text(title.text() + ' : Build '+build_num);

    fs.writeFileSync(index_loc, $.html(), {
        encoding: 'utf8'
    });
}

function get_next_build() {
    var builds = get_subdirs('./builds');
    var last_build = 0;
    builds.forEach(function(build_name) {
        if (build_name.substr(0, 6) === 'build_') {
            var num = parseInt(build_name.substr(6));
            if (num > last_build) {
                last_build = num;
            }
        }
    });
    return pad(last_build + 1, 4);
}

// Add a number of zeros to the beginning of the value. Padding dictates the
// total number of digits the results will have. When value is larger than
// padding, no padding is applied.
function pad(value, padding) {
    var values = (value + '').split('');
    var zeros = padding - values.length;
    for (var i=0; i<zeros; i++) {
        values.unshift('0');
    }
    return values.join('');
}

function commit(msg) {
    repo.commit(msg, {
        all:        true,
        amend:      false,
        author:     'Thomas Viktil'
    }, function(err) {
        if (err) {
            console.log('could not commit', err);
            return;
        }
        push();
    });
}

function push() {
    repo.remote_push('origin', 'gh-pages', function(err) {
        if (err) {
            console.log('could not push', err);
            return;
        }

        console.log('');
        console.log(current_build_url);
        console.log('');
        checkout('master');
    });
}
