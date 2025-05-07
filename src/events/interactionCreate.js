const { Events, MessageFlags } = require('discord.js');
const { player } = require('../player/player');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isCommand()) {
            const client = interaction.client;
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({
                    content: "I don't understand milord.",
                    flags: MessageFlags.Ephemeral,
                });
            }
            try {
                await command.execute(interaction);
            } catch (error) {
                console.log(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: 'There was an error while executing this command!',
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    await interaction.reply({
                        content: 'There was an error while executing this command!',
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
        } else if (interaction.isButton()) {
            const queue = player.nodes.get(interaction.guild.id);
            if (!queue) return;
            switch (interaction.customId) {
                case 'pause':
                    if (!queue || !queue.isPlaying()) return interaction.reply('No music is playing, milord.');
                    if (queue.node.isPaused()) return interaction.reply('Music is already paused, milord.');
                    queue.node.pause();
                    return interaction.reply('Music is now paused nig ..uhh ..ohh i mean milord. ⏸');
                case 'resume':
                    if (!queue) return interaction.reply('There are no tracks to resume, milord.');
                    if (queue.node.isPlaying()) return interaction.reply('Music is currently playing, milord.');
                    if (queue.node.isPaused()) {
                        queue.node.resume();
                        return interaction.reply('Music has been resumed, milord. ▶');
                    }
                case 'stop':
                    if (!queue || !queue.isPlaying()) return interaction.reply('No music is playing, sir.');
                    queue.node.stop(true);
                    return interaction.reply("Why you do this, milord. Remember Riri please don't stop the music");
                case 'skip':
                    if (!queue || !queue.isPlaying()) return interaction.reply('No music is playing, milord.');
                    if (queue.node.queue.isEmpty())
                        return interaction.reply('There are no left tracks in the queue, milord');
                    queue.node.skip();
                    return interaction.reply('Skipped to next track ⏭');
                default:
                    return interaction.reply('Unknown action');
            }
        }
    },
};
