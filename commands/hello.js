const SympactEmbedBuilder = require("../lib/embedBuilder");

module.exports = {
  name: "hello",
  description: "Say hello!",
  category: "Example Category!",
  async execute(message, args) {
    const embed = new SympactEmbedBuilder()
      .setTitle("Hello, world!")
      .setColor("#f200ff")
      .setDescription("Nice to meet you.");

    message.reply({ embeds: [embed] });
  },
};
