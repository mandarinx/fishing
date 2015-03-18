
!! In order to not create massive builds, create a custom build of Phaser.
   I don't need P2, and probably lots of other things.

:: DEPLOYMENT

use gift, fs, some kind of html tokenizer

- create gh-pages branch
in gh-pages:
- create directory structure
    * index at root
    * builds directory
        > one directory for each build
- add index.html and a style.css
    * base the list on li's or dt
        > name/number of the build
        > description

deployment script
- get current branch
- create 'build' directory
- add file called DESCRIPTION with the description
- copy contents of public to build
- in build/index.html: change localhost to githubpages-something
    * get the gihub pages url from package.json
    * update yo-phaser-simple
        > ask for a gh-pages url
        > create a gh-pages branch after scaffolding the project
- switch to gh-pages branch
- find the build folder with the highest number
- rename build to build_x+1
- move new build folder to builds
- add new build folder to index.html
- read DESCRIPTION and add the contents to index.html
- add new build folder and index.html to git commit
- commit with message set to build number
- push
- switch back to previous branch
- output the URL to the new build in console
