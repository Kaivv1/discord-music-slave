const cleanQueueMessage = async (queue) => {
    await queue.metadata.nowPlayingMessage.delete().catch(() => {});
    queue.metadata.nowPlayingMessage = null;
};

module.exports = { cleanQueueMessage };
