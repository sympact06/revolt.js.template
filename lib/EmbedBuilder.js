class SympactEmbedBuilder {
    constructor() {
      this.embed = {
        title: null,
        description: null,
        color: null,
        thumbnail: null,
        image: null,
        author: null,
        footer: null,
        fields: [],
      };
    }
  
    setTitle(title) {
      this.embed.title = title;
      return this;
    }
  
    setDescription(description) {
      this.embed.description = description;
      return this;
    }
  
    setColor(color) {
      this.embed.color = color;
      return this;
    }
  
    // Thumbnail is currently not supported and deprecated!!!
    setThumbnail(thumbnail) {
      this.embed.thumbnail = thumbnail;
      return this;
    }
  
    // setImage is currently not supported and deprecated!!!
    setImage(image) {
      this.embed.image = image;
      return this;
    }
  
    setAuthor(name, icon_url, url) {
      this.embed.author = { name, icon_url, url };
      return this;
    }
  
    setFooter(text, icon_url) {
      this.embed.footer = { text, icon_url };
      return this;
    }
  
    addField(name, value, inline = false) {
      this.embed.fields.push({ name, value, inline });
      return this;
    }
  
    build() {
      return this.embed;
    }
  
    /**
     * Return the embed object when converted to string
     */
    toString() {
      return JSON.stringify(this.embed);
    }
  
    /**
     * Return the embed object when coerced to JSON
     */
    toJSON() {
      return this.embed;
    }
  }
  
  module.exports = SympactEmbedBuilder;
  