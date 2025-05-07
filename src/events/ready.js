const { Events, REST, Routes } = require('discord.js');
const { clientId, token } = require('../constants.js');

const rest = new REST().setToken(token);

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        const guildIds = client.guilds.cache.map((guild) => guild.id);
        const commands = client.commands.map((cmd) => cmd.data.toJSON());
        for (const guildId of guildIds) {
            await rest
                .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
                .then(() => console.log(`Added commands to guild_id: ${guildId}`))
                .catch((err) => console.log(`Failed to add commands to guild_id: ${guildId} with err: ${err}`));
        }
        // for (const [_, guild] of client.guilds.cache) {
        //     const fullGuild = await guild.fetch();
        //     const pesniZaBotaChannel = fullGuild.channels.cache.find((ch) => ch.id === '1064580073551831131');
        //     if (pesniZaBotaChannel && pesniZaBotaChannel?.isTextBased()) {
        //         await pesniZaBotaChannel.send('Ready to work ⛏️⛏️');
        //     }
        // }
    },
};
