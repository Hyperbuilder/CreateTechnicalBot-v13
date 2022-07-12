require('console-stamp')(console, 'mm/dd HH:MM:ss.l');
const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
const { token } = require("./Structures/config.json");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

client.commands = new Collection();

["Events", "Commands"].forEach(handler => {
    require(`./Structures/Handlers/${handler}`)(client, PG, Ascii)
});


client.login(token);