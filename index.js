const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
const { token } = require("./config.json");

client.commands = new Collection()

require("./Handlers/Events.js")(client);
require("./Handlers/Commands.js")(client);

client.login(token);