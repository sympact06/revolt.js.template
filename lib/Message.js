const https = require("https");

class Message {
  constructor(version) {
    this.version = version;
    this.githubUrl = "https://raw.githubusercontent.com/sympact06/revolt.js.template/main/lib/version.json";
  }

  async start() {
    console.log(`\x1b[32m[READY]\x1b[0m Version ${this.version} ready!`);
    console.log(`\x1b[33m[DEPENDENCIES]\x1b[0m Using Node.js version ${process.version}`);
    const { version } = require("revolt.js/package.json");
    console.log(`\x1b[33m[DEPENDENCIES]\x1b[0m Using Revolt.js version ${version}`);
    
    const config = require("../config.js");
    if (config.token === "") {
      console.warn(`\x1b[31m[ERROR]\x1b[0m You have not set your token in config.js. Please set it before running the bot.`);
      process.exit(1);
    }
    
    const options = {
      headers: {
        "User-Agent": "node.js"
      }
    };
    const url = `${this.githubUrl}`;
    https.get(url, options, res => {
      let data = "";
      res.on("data", chunk => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const latestVersion = JSON.parse(data).version;
          if (this.version !== latestVersion) {
            console.warn(`\x1b[33m[WARNING]\x1b[0m The Template version is outdated. Latest version: ${latestVersion}. You are using version ${this.version}.`);
          }
          console.log(`Follow us on GitHub: \x1b[36m${this.githubUrl}\x1b[0m`);
        } catch (error) {
          console.error(`\x1b[31m[ERROR]\x1b[0m Cannot fetch the latest version from GitHub.`);
        }
      });
    }).on('error', (error) => {
      console.error(`\x1b[31m[ERROR]\x1b[0m Cannot fetch the latest version from GitHub. Try again later. If this error persists, please contact the developer.`);
    });
  }
}

module.exports = { Message };
