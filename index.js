require('console-stamp')(console, 'mm/dd HH:MM:ss.l');
process.setMaxListeners(20);
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    Partials: [User, Message, GuildMember, ThreadMember]
});

const { loadEvents } = require("./Handlers/eventHandler")
const { loadCommands } = require("./Handlers/commandHandler")

client.commands = new Collection()
client.config = require("./Structures/config.json");



client.login(client.config.token)
    .then(() => {
        loadEvents(client);
        loadCommands(client);
    })
    .catch((err) => console.error(err))