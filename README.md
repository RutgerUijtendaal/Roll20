# Roll20

## Introduction

[Roll20](https://www.roll20.net) allows for hooking into their API with scripts to enhance the player experience. Scripts are loaded inside a Javascript Sandbox that hooks into the Campaigns events. More info on the API can be found on the [wiki](https://wiki.roll20.net/API:Introduction).

This repo consists of work done on modules to enhance the DnD campaign I'm currently a part of.

## Modules

### Stress

A Stress module exists that allows for characters to get an increasing amount of stress for being in high pressure situations. Stress can give different types of character debuffs.

#### Commands

3 commands exist for a player character to control its stress level. What player is handled is determined by the character typing in the chat:

* !stress - registers a new StressCharacter.
* !+stress [number] - Adds [number] amount of stress to the character
* !-stress [number] - Removes [number] amount of stress to the character

#### Debuffs

Debuffs are gained or lost on 5 stress breakpoints. On every multiple of 5 a stress is lost or gained depending on if stress is going down or up.

Each stress is associated with an addition and removal effect which get automatically called whenever they are added or removed respectively.

## Typescript

While the Sandbox runs inside a Javascript Sandbox where everything is put into single file scripts, this project uses Typescript to gain some of the benefits of typechecking and classes.

In the current state in order to get the files onto Roll20s sandbox enviroment 3 steps are taken:

* First all files are transpiled into seperate js files using regular tsc command.
* Next webpack is used to bundle all the seperate js files into a single bundle.js file.
* Lastly [heward](https://github.com/primarilysnark/heward) is used to deploy the bundle.js file to Roll20.
