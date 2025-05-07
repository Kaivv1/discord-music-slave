const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { client } = require('../client');
const { YoutubeiExtractor } = require('discord-player-youtubei');

const player = new Player(client);
(async function () {
    await player.extractors.loadMulti(DefaultExtractors);
    await player.extractors.register(YoutubeiExtractor, {});
})();
module.exports = { player };
