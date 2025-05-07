const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { player } = require('../player/player.js');
const { cleanQueueMessage } = require('../utils/playerUtils.js');
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
        let queue;
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
                    metadata: {
                        interaction,
                        requestedBy: interaction.member.displayName,
                        channel,
                    },
                    leaveOnEnd: false,
                    leaveOnStop: false,
                    leaveOnEmptyCooldown: 5 * 60 * 1000,
                },
            });
            queue = player.nodes.get(interaction.guildId);
            const embed = new EmbedBuilder()
                .setTitle(`🎵 ${track.title || track.cleanTitle} added to the queue`)
                .setURL(track.url)
                .addFields({
                    name: 'Currently in queue',
                    value: `${queue.tracks.size}`,
                })
                .setFooter({
                    text: `Requested by milord ${queue.metadata.requestedBy}`,
                });
            return interaction.followUp({ embeds: [embed] });
        } catch (e) {
            if (e?.code === 'ERR_NO_RESULT') {
                return interaction.followUp('No results found 🕵🏿');
            }
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    },
};
