class Cooldown {
    constructor(cooldownTime) {
      this.cooldownTime = cooldownTime;
      this.cooldowns = new Map();
    }
  
    check(user) {
      const lastExecutionTime = this.cooldowns.get(user);
      const currentTime = Date.now();
  
      if (!lastExecutionTime || currentTime - lastExecutionTime >= this.cooldownTime) {
        this.cooldowns.set(user, currentTime);
        return true;
      } else {
        return false;
      }
    }
  
    clear(user) {
      this.cooldowns.delete(user);
    }
  }
  
  module.exports = { Cooldown };
  