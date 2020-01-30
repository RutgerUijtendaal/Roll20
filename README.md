# Roll20

## Introduction

[Roll20](https://www.roll20.net) allows for hooking into their API with scripts to enhance the player experience. Scripts are loaded inside a Javascript Sandbox that hooks into the Campaigns events. More info on the API can be found on the [wiki](https://wiki.roll20.net/API:Introduction).

This repo consists of work done on modules to enhance the DnD campaign I'm currently a part of.

## Modules

### Stress

The Stress module enables characters to get an increasing amount of stress for being in high pressure situations. Stress can give different types of character debuffs or, if you're lucky, buffs.

#### Commands

A chat command exists to register a Character as part of the stress module: `!stress`.

This registers a character and creates a stress Ability on the character with which the player can control its stress.

This command also creates a note for the registering player displays information about his/her current stress level.

#### Debuffs

Debuffs are gained or lost on 5 stress breakpoints. On every multiple of 5 a stress is lost or gained depending on if stress is going down or up.

Each stress is associated with an addition and removal effect which get automatically called whenever they are added or removed respectively.

#### Perseverence

At any point when a normal stress item is added a chance exists that instead a Perseverence is added. Contrary to debuffs these provide benefits to a player character and have to be manually removed (when the DM deems its effect over).

## Typescript

While the Sandbox runs inside a Javascript Sandbox where everything is put into single file scripts, this project uses Typescript to gain some of the benefits of typechecking and classes.

In the current state in order to get the files onto Roll20s sandbox enviroment 2 steps are taken:

* Webpack with [ts-loader](https://github.com/TypeStrong/ts-loader) is used to bundle all the seperate ts files into a single bundle.js file.
* [heward](https://github.com/primarilysnark/heward) is used to deploy the bundle.js file to Roll20.
