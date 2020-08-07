#!/usr/bin/env node

const make = require("./cli/make");
const seed = require("./cli/seed");
require("./database");

const [, , ...args] = process.argv;

const [commandName, ...rest] = args;

if (commandName.startsWith("make")) {
  make({
    command: commandName,
    args: rest,
  });
}

if (commandName.startsWith("seed")) {
  seed({
    command: commandName,
    args: rest,
  });
}
