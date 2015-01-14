fishing
===
A Phaser game, and an exploration in procedurally generated games.

Install:
```npm install```

Develop:
```npm run dev```
Open a browser and go to localhost:5000

Dev features:
- browserify
- remapify
- file/folder watching

I made a Yeoman generator for this project setup, but haven't published it yet.

Dev TODO:
- make a deployment script that pushes a self contained "build" of the game to e.g. GitHub pages, and gives the build a unique name. That way I can keep old builds and remind myself that I'm actually making progress.
- make more Yeoman scripts that simplify creating Phaser states, entities and whatnot

Game features:
- worldmap generation with Perlin noise
- tilemapping of map data
- island generation with cellular automata
- all settings are put in config.json to separate data from engine

Game TODO:
- generate towns
- generate fishes
- generate fish shops that will buy your fish
Plus a million other things.

Graphics by
buch415 <http://pixelresources.deviantart.com/art/Overworld-485086586>
