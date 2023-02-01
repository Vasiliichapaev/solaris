//const config = require("../config.json");
//const index_url = config.index_url;

//const fetch = require("node-fetch");
//const TwitchBot = require("./twitch_bot.js");
const DiscordBot = require("./discord_bot.js");
const server = require("./server");

class Bot {
    constructor(){
        this.server = server(this);
        this.discord_bot = new DiscordBot(this);
        this.twitch_bot = new TwitchBot(this);
 //       this.wake_up();
    }

    wake_up() {
        fetch(index_url);
        setTimeout(() => this.wake_up(), 1000 * 60 * 20);
    }

};

exports = module.exports = Bot;
