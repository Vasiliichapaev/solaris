const config = require("../config.json");

const tmi = require('tmi.js');
const handler = require("./handler.js");
const fetch = require("node-fetch");


class TwitchBot{
    constructor(bot){
        this.bot = bot;
        this.id = config.twitch_bot_id;
        this.secret = config.twitch_bot_secret;
        this.access_token = undefined;
        this.connect();
    }

    async get_access_token(){
        const url = `https://id.twitch.tv/oauth2/authorize?client_id=${this.id}&response_type=token&scope=chat:edit+chat:read`
        const options = {method: "GET"};
        let response = await fetch(url, options);
        console.log(response)
        if (response.ok) {
            let url = response.body
            console.log(url)
            //this.access_token = body.access_token;
        }
    }

    async connect(){
        //await this.get_access_token();
        this.twitch_bot = new tmi.Client({
                options: { debug: true },
                identity: {
                    username: config.twitch_bot_name,
                    password: "oauth:rarmtdx0t8als559zhq5u3ospz9yfw"
                },
                channels: config.channels,
                connection:{reconnect: true}
            });

        this.twitch_bot.connect().catch((e) => console.log(e));
        this.twitch_bot.on('message', (channel, tags, message, self) => setTimeout(() => {this.handler(channel, tags, message, self)} , 1500));

        
    }



    async handler(channel, tags, message, self){
        if(self) return;
        let answer;

        if (/^!love /.test(message)) {
            let name = message.match(/^!love (.*)/)[1];
            if (!name) return;
            let love = Math.floor(Math.random() * 101);

            if (name == "@tettas0" && tags.username == "timoremus") love = 100;

            answer = `Между @${tags.username} и ${name} ${love}% любви!`
            this.twitch_bot.say(channel, answer);
        }

        if (message == "!ммр" || message == "!mmr"){
            answer = "ноль... вообще ноль. серьзно LUL"
            this.twitch_bot.say(channel, answer);
        }

        if (message == "!дискорд" || message == "!discord"){
            answer = `@${tags.username}, Держи конечно, но только потом не пугайся Kappa  мы там вольны в высказываниях Kappa https://discord.gg/3GWDHxhV3K ` 
            this.twitch_bot.say(channel, answer);
        }
    }

}

exports = module.exports = TwitchBot;
