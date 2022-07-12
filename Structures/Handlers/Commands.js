const { Perms } = require("../Validation/Permissions.js");
const { Client } = require("discord.js");


/**
 * @param {Client} client
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Command loaded");

    CommandsArray = [];

    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name)
            return Table.addRow(file.split("/")[7], "❗ FAILED", "Missing a name. ");
        if (!command.context && !command.description)
            return Table.addRow(command.name, "❗ FAILED", "Missing a description. ");

        if (command.permission) {
            if (Perms.includes(command.permission))
                command.defaultPermission = false;
            else
                return Table.addRow(command.name, "❗ FAILED", "Permission is invalid. ");
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, command.description, "Succesful");
    });

    console.log(`\n${Table.toString()}`)
}
