module.exports = function replyEmbed(message, embed) {
    message.reply({ embeds: [embed] });
  }
  