const { CommandInteraction, MessageEmbed, Client } = require("discord.js")
const { execute } = require("../../../Events/Client/ready")

module.exports = {
    name: "music",
    description: "Complete music command",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "play",
            description: "play a song",
            type: "SUB_COMMAND",
            options: [{ name: "query", description: "Provide a name or URL for the song", type: "STRING", required: true }]
        },
        // {
        //     name: "mixer",
        //     description: "Open the Mixer!",
        //     type: "CHANNEL"
        // },
        {
            name: "volume",
            description: "change volume",
            type: "SUB_COMMAND",
            options: [{ name: "percentage", description: "10 = 10%", type: "NUMBER", required: true }]
        },
        {
            name: "loop",
            description: "change loop mode",
            type: "SUB_COMMAND",
            options: [{
                name: "mode", description: "select a loop mode", type: "STRING", required: true,
                choices: [
                    { name: "none", value: "none" },
                    { name: "song", value: "song" },
                    { name: "queue", value: "queue" },
                ]
            }]
        },
        {
            name: "settings",
            description: "change settings",
            type: "SUB_COMMAND",
            options: [{
                name: "options", description: "select an option", type: "STRING", required: true,
                choices: [
                    { name: "queue", value: "queue" },
                    { name: "skip", value: "skip" },
                    { name: "pause", value: "pause" },
                    { name: "resume", value: "resume" },
                    { name: "stop", value: "stop" }
                ]
            }]
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction
        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel) return interaction.reply({ content: "You must be in a voice channel", ephemeral: true })
        if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) return interaction.reply({ content: `I am already playing music in <#${guild.me.voice.channelId}>`, ephemeral: true })
        try {
            switch (options.getSubcommand()) {
                case "play": {
                    client.distube.playVoiceChannel(VoiceChannel, options.getString("query"), { textChannel: channel, member: member })
                    return interaction.reply({ content: "Request recieved." })
                }
                case "volume": {
                    const Volume = options.getNumber("percent")
                    if (Volume > 100 || Volume < 1) return interaction.reply({ content: "Please specify a number between 1 and 100", ephemeral: true })
                    client.distube.setVolume(VoiceChannel, Volume);
                }
                case "settings": {
                    const queue = await client.distube.getQueue(VoiceChannel);

                    if (!queue) return interaction.reply({ content: "Queue is mt" })

                    switch (options.getString("options")) {
                        case "skip": {
                            await queue.skip(VoiceChannel);
                            return interaction.reply({ content: "song skipped" })
                        }
                        case "stop": {
                            await queue.stop(VoiceChannel);
                            return interaction.reply({ content: "song stopped" })
                        }
                        case "pause": {
                            await queue.pause(VoiceChannel);
                            return interaction.reply({ content: "song paused" })
                        }
                        case "resume": {
                            await queue.resume(VoiceChannel);
                            return interaction.reply({ content: "song resumed" })
                        }
                        case "queue": {
                            interaction.reply({
                                embeds: [new MessageEmbed()
                                    .setColor("ORANGE")
                                    .setDescription(`${queue.songs.map((song, id) => `\n${id + 1} - ${song.name} -- ${song.formattedDuration}`)}`)]
                            })
                        }

                    }
                }
                case "loop": {
                    const queue = await client.distube.getQueue(VoiceChannel);

                    if (!queue) return interaction.reply({ content: "Nothing is playing at the moment. Use \`/music play\` to play a song" })

                    switch (options.getString("mode")) {
                        case "none": {
                            await queue.setRepeatMode(0);
                            return interaction.reply({ content: "Loop has been disabled" })
                        }
                        case "song": {
                            await queue.setRepeatMode(1);
                            return interaction.reply({ content: "The currently playing song will now be repeated indefinetly " })
                        }
                        case "queue": {
                            await queue.setRepeatMode(2);
                            return interaction.reply({ content: "The queue will now be repeated infdefinetly" })
                        }
                    }
                }
                case "mixer": {

                }
            }
        } catch (e) {
            const errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription("Error:" + e)
            interaction.reply({ embeds: [errorEmbed] })
        }
    }
}