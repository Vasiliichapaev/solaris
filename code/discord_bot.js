const discord_token = process.env.discord_token;

const Discord = require("discord.js");
//const Streamers = require("./streamers.js");


class DiscordBot{
    constructor(bot){
        this.bot = bot;
 //       this.streamers = new Streamers();
        this.discord_bot = new Discord.Client();
        this.discord_bot.on("ready", () => console.log("Solaris online!"));
        this.discord_bot.on("message", msg => this.handler(msg));
        this.discord_bot.login(discord_token);
    }

    async handler(msg) {
        if (msg.author == this.discord_bot) return;

        const content = msg.content.toLowerCase();
        let channel = msg.channel;

        if (/^add streamer /.test(content)) {
            let name = content.match(/^add streamer (.*)/)[1];
            let answer = await this.streamers.add(name, channel.id);
            msg.channel.send(answer);
            return;
        }

        if (/^remove streamer /.test(content)) {
            let name = content.match(/^remove streamer (.*)/)[1];
            let answer = await this.streamers.remove(name, channel.id);
            msg.channel.send(answer);
            return;
        }

        if (content === "streamers") {
            let streamers_list = "Стримеры в списке: ";
            let streamers = this.streamers.on_channel(channel.id);
            if (streamers) {
                if (streamers.length == 0) {
                    msg.channel.send("список пуст");
                    return;
                }
                streamers_list += streamers.join(" ");
                msg.channel.send(streamers_list);
            }           
            return;
        }

        if (/^!love /.test(content)) {
            let name = content.match(/^!love (.*)/)[1];
            let love = Math.floor(Math.random() * 101);
            msg.channel.send(`Между ${msg.author} и ${name} ${love}% любви!`);
            return;
        }

        if (content === "!анонс" ) {
            let channel_id = msg.channel.id;
            let answer = await this.streamers.shedule(channel_id);
            if (!answer) answer = "Расписания нет"
            msg.channel.send(answer);
        }

        if (content === "!id" ) {
            msg.channel.send(msg.author.id);
            return;
        }

    }

     async stream_start(data) {
        let streamer_id = data.broadcaster_user_id;
        let stream_id = data.id;
        let channels = this.streamers.channels(streamer_id);
        let name = this.streamers.name(streamer_id);
        let last_stream_id = this.streamers.last_stream_id(streamer_id);
        if (last_stream_id == stream_id) return;
        this.streamers.last_stream_id_update(streamer_id, stream_id);
        let msg = `@everyone \nhttps://www.twitch.tv/${name}`
        for (let channel of channels) {
            this.discord_bot.channels
                .fetch(channel, true)
                .then(chnl => chnl.send(msg))
                .catch(err => console.log(err));
        }
    }

}

exports = module.exports = DiscordBot;
