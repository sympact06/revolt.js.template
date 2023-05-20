const { Client } = require("revolt.js");
const fs = require("fs");
const { token, prefix, logging } = require("./config.js");
const { Logger } = require("./lib/Logging");
const SympactEmbedBuilder = require("./lib/EmbedBuilder");

class Command {
  constructor(name, description, execute, category = 'General') {
    this.name = name;
    this.description = description;
    this.execute = execute;
    this.category = category;
  }
}

class Event {
  constructor(name, execute) {
    this.name = name;
    this.execute = execute;
  }
}

class MyRevoltBot {
  constructor() {
    this.logger = new Logger(logging);
    this.client = new Client();
    this.commands = new Map();
    this.setupListeners();
    this.loadCommands();
    this.loadEvents();
  }

  setupListeners() {
    this.client.on("ready", () =>
      this.logger.info(`Logged in as ${this.client.user.username}!`, "MyRevoltBot")
    );
    this.client.on("message", this.handleMessage.bind(this));
  }

  async handleMessage(message) {
    try {
      if (
        !message ||
        !message.content ||
        !message.content.startsWith(prefix) ||
        message.author.bot
      )
        return;

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = this.commands.get(commandName);
      if (!command) {
        this.logger.warn(
          `Command ${commandName} executed but not found in the commands folder.`,
          "MyRevoltBot"
        );
        return;
      }
      command.execute(message, args);
      this.logger.info(`Command ${commandName} executed.`, "MyRevoltBot");
    } catch (err) {
      this.logger.error("Error handling message:", err, "MyRevoltBot");
    }
  }

  loadCommands() {
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const { name, description, execute, category } = require(`./commands/${file}`);
      const command = new Command(name, description, execute, category);
      this.commands.set(name, command);
      this.logger.info(`Command loaded: ${command.name}`);
    }
  }

  async login() {
    try {
      await this.client.loginBot(token);
    } catch (err) {
      this.logger.error("Error logging in:", err, "MyRevoltBot");
    }
  }

  loadEvents() {
    const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
      const event = require(`./events/${file}`);
      this.client.on(event.name, event.execute.bind(null, this));
      this.logger.info(`Event loaded: ${event.name}`);
    }
  }

  async help(message) {
    const commandList = Array.from(this.commands.values()).reduce(
      (categories, command) => {
        const category = command.category || "General";
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(
          `\`${prefix}${command.name}\`: ${command.description}`
        );
        return categories;
      },
      {}
    );
    const embedBuilder = new SympactEmbedBuilder()
      .setTitle("Available Commands")
      .setColor("#0099ff");
    for (const [category, commands] of Object.entries(commandList)) {
      const categoryString = `**${category}**`;
      const commandsString = commands.join("\n");
      embedBuilder.setDescription(
        `${
          embedBuilder.embed.description
            ? `${embedBuilder.embed.description}\n\n`
            : ""
        }${categoryString}\n${commandsString}`
      );
    }
    await message.reply({ embeds: [embedBuilder.build()] });
  }
}

const myBot = new MyRevoltBot();
myBot.login();

myBot.commands.set(
  "help",
  new Command(
    "help",
    "Displays a list of available commands.",
    myBot.help.bind(myBot)
  )
);
