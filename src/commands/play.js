const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../player/player.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song, milord.')
        .addSubcommand((subcmd) =>
            subcmd
                .setName('song')
                .setDescription('Plays a single song with a URL, milord.')
                .addStringOption((option) =>
                    option.setName('url').setDescription("The song's URL, milord.").setRequired(true)
                )
        ),
    async execute(interaction) {
        let textChannel;
        const channel = interaction.member.voice.channel;
        for (const [_, guild] of interaction.client.guilds.cache) {
            const fullGuild = await guild.fetch();
            textChannel = fullGuild.channels.cache.find(
                (ch) => ch.id === interaction.channelId && ch.guildId === interaction.guildId
            );
        }
        if (!channel)
            return interaction.reply(
                `You are not connected to a voice channel, milord ${interaction.member?.user.username}`
            );
        const url = interaction.options.getString('url', true);
        await interaction.deferReply();
        try {
            const { track } = await player.play(channel, url, {
                nodeOptions: {
                    metadata: interaction,
                },
            });

            console.log(track);
            return interaction.followUp(`**${track.cleanTitle}** enqueued!`);
        } catch (e) {
            console.log(e);
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    },
};
