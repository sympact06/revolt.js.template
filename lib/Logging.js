class Logger {
    constructor(enabled) {
      this.enabled = enabled;
    }
  
    log(message) {
      if (this.enabled) {
        console.log(`\x1b[37m[SYMPACT]\x1b[0m ${message}`);
      }
    }
  
    warn(message) {
      if (this.enabled) {
        console.warn(`\x1b[33m[WARNING]\x1b[0m ${message}`);
      }
    }
  
    error(message) {
      if (this.enabled) {
        console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
      }
    }
  
    info(message) {
      if (this.enabled) {
        console.info(`\x1b[34m[INFO]\x1b[0m ${message}`);
      }
    }
  }
  
  module.exports = { Logger };
  