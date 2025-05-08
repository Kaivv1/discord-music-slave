const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { client } = require('../client');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { cleanQueueMessage } = require('../utils/playerUtils');

const player = new Player(client);
(async function () {
    await player.extractors.loadMulti(DefaultExtractors);
    await player.extractors.register(YoutubeiExtractor, {});
})();

player.events.on('playerStart', async (queue, track) => {
    const channel = queue.metadata.channel;
    if (!channel) return;

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('resume').setLabel('Resume').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('pause').setLabel('Pause').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('skip').setLabel('Skip').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('stop').setLabel('Stop').setStyle(ButtonStyle.Primary)
    );
    const embed = new EmbedBuilder()
        .setTitle(`💿 Currently playing ${track?.title}`)
        .setURL(track?.url)
        .setAuthor({ name: `Added by milord ${queue.metadata.requestedBy}` })
        .setThumbnail(track.thumbnail || '')
        .addFields(
            { name: 'Duration', value: track?.duration, inline: true },
            { name: 'Artist', value: track?.author, inline: true }
        )
        .setTimestamp();

    if (queue.metadata.nowPlayingMessage) cleanQueueMessage(queue);

    let nowPlayingMessage;
    nowPlayingMessage = await channel.send({ embeds: [embed], components: [buttons] });
    queue.metadata.nowPlayingMessage = nowPlayingMessage;
});

player.events.on('emptyQueue', async (queue) => {
    const channel = queue.metadata.channel;
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle('Empty queue, milords')
        .setDescription('Keep the party going nig ..ahhh ..umm milords give me some work work ⛏️⛏️.');

    if (queue.metadata.nowPlayingMessage) cleanQueueMessage(queue);

    queue.channel.send({ embeds: [embed] });
});

player.events.on('', () => {});
player.events.on('', () => {});

module.exports = { player };
