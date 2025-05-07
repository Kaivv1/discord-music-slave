require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./constants.js');
const { client } = require('./client.js');
require('./player/player.js');

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
const cmds = [];
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command?.data && 'execute' in command) {
        client.commands.set(command.data.name, command);
        cmds.push(command.data.toJSON());
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const eventPath = path.join(eventsPath, file);
    const event = require(eventPath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);
