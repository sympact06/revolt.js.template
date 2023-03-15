"use strict";

const {
  Client
} = require("revolt.js");
const fs = require("fs");
const {
  token,
  prefix
} = require("./config.js");
class MyRevoltBot {
  constructor() {
    this.client = new Client();
    this.commands = new Map();
    this.setupListeners();
    this.loadCommands();
  }
  setupListeners() {
    this.client.on("ready", () => console.info(`Logged in as ${this.client.user.username}!`));
    this.client.on("message", this.handleMessage.bind(this));
  }
  async handleMessage(message) {
    try {
      if (!message || !message.content || !message.content.startsWith(prefix) || message.author.bot) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = this.commands.get(commandName);
      if (!command) return;
      command.execute(message, args);
    } catch (err) {
      console.error("Error handling message:", err);
    }
  }
  loadCommands() {
    const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      this.commands.set(command.name, command);
    }
  }
  async login() {
    try {
      await this.client.loginBot(token);
    } catch (err) {
      console.error("Error logging in:", err);
    }
  }
  async help(message) {
    const commandList = Array.from(this.commands.values()).map(command => `\`${prefix}${command.name}\`: ${command.description}`).join("\n");
    await message.channel.sendMessage(`Available commands:\n${commandList}`);
  }
}
const myBot = new MyRevoltBot();
myBot.login();
myBot.commands.set("help", {
  name: "help",
  description: "Displays a list of available commands.",
  execute: myBot.help.bind(myBot)
});

// Revolt Template by @Sympact06 // index.js
