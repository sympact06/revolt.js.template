module.exports = {
    name: 'messageUpdate',
    execute: async (bot, oldMessage, newMessage) => {
      if (!oldMessage || !newMessage || oldMessage.content === newMessage.content) {
        return;
      }
  
      bot.logger.info(`Message updated in ${newMessage.channel.id}: ${oldMessage.content} -> ${newMessage.content}`);
    }
  }
  