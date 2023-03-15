"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");
class Uploader {
  constructor(client, forceReady = false) {
    this.client = client;
    this.ready = forceReady;
    if (forceReady) {
      this.url = client.configuration.features.autumn.url;
      return this;
    }
    this.client.on("ready", () => {
      this.url = client.configuration.features.autumn.url;
      this.ready = true;
    });
    return this;
  }
  uploadFile(fileName, tag = "attachments") {
    if (!this.ready) throw new Error("Client is not ready yet. Login it with client.login() first.");
    return new Promise((res, rej) => {
      if (!fileName) rej("Filename can't be empty");
      const stats = fs.statSync(fileName);
      let stream = fs.createReadStream(fileName);
      const formData = new FormData();
      formData.append("file", stream);
      fetch(this.url + "/" + tag, {
        method: "POST",
        headers: {
          "Content-Length": stats.size,
          "x-session-token": this.client.api.auth.headers["X-Session-Token"]
        },
        body: formData
      }).then(response => response.json()).then(json => {
        res(json.id);
      });
    });
  }
  upload(file, fileName, tag = "attachments") {
    if (!this.ready) throw new Error("Client is not ready yet. Login it with client.login() first.");
    return new Promise(res => {
      const form = new FormData();
      form.append("file", file, {
        filename: fileName,
        name: "file"
      });
      fetch(this.url + "/" + tag, {
        method: "POST",
        body: form
      }).then(response => response.json()).then(json => {
        res(json.id);
      });
    });
  }
}
class SympactEmbedBuilder {
  constructor(client) {
    this.client = client;
    this.embed = {
      title: null,
      description: null,
      color: null,
      thumbnail: null,
      image: null,
      author: null,
      footer: null,
      fields: []
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
  async setThumbnail(thumbnailUrl) {
    const uploader = new Uploader(this.client);
    const fileName = thumbnailUrl.split("/").pop();
    const thumbnailId = await uploader.upload(thumbnailUrl, fileName);
    this.embed.thumbnail = {
      url: thumbnailId
    };
    return this;
  }
  setImage(image) {
    this.embed.image = image;
    return this;
  }
  setAuthor(name, icon_url, url) {
    this.embed.author = {
      name,
      icon_url,
      url
    };
    return this;
  }
  setFooter(text, icon_url) {
    this.embed.footer = {
      text,
      icon_url
    };
    return this;
  }
  addField(name, value, inline = false) {
    this.embed.fields.push({
      name,
      value,
      inline
    });
    return this;
  }
  build() {
    return this.embed;
  }
}
exports.SympactEmbedBuilder = SympactEmbedBuilder;
