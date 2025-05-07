const { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('user').setDescription('Provides data about the user'),
    async execute(interaction) {
        const member = interaction.member;
        await interaction.reply(
            `This command was runned by ${interaction.user.username}, who joined this shit on ${member.joinedAt}.`
        );
    },
};
