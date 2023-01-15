const DataBase = require("./db.js");
const Twitch = require("./twitch.js");


class Streamers {
    constructor(){
        this.db = new DataBase();
        this.data = {};
        this.get_data();
        this.twitch = new Twitch();
    }
    async shedule(channel_id){
        let notice = "\`\`\`\n"
        let data =  await this.twitch.get_shedule("154942268");
        if (!data) return false;
        let segments = data.segments;
        if (!segments) return false;
        for (let segment of segments){
            let date = new Date(segment.start_time);
            let title = segment.title;
            notice += `${date.toLocaleString("ru", {timeZone: 'Europe/Moscow' })} ${title}\n`
        }
        notice += "\`\`\`"
        return notice;
    };

    async get_data() {
        this.data = await this.db.get_streamers();
    }

    async save_data() {
        await this.db.update_streamers(this.data);
    }

    last_stream_id_update(streamer_id, last_stream_id){
        let streamer = this.data[streamer_id];
        streamer["last_stream_id"] = last_stream_id;
        this.save_data();
    }

    async add(streamer_name, discord_channel) {
        let streamer_id = await this.twitch.get_id_by_name(streamer_name);
        if (!streamer_id) return `Twitch ${streamer_name} не знает`;
        let streamer = this.data[streamer_id];
        if (streamer) {
            let channels = streamer["channels"];
            let index = channels.indexOf(discord_channel);
            if (index != -1) return `${streamer_name} уже в списке`;
            channels.push(discord_channel);
        } else {
            let subscribe_id = await this.twitch.subscribe(streamer_id);
            if (!subscribe_id) return `подписаться не удалось`;
            streamer = {
                channels: [discord_channel],
                name: streamer_name,
                subscribe_id: subscribe_id,
                last_stream_id: 0
            }
            this.data[streamer_id] = streamer;
        }
        await this.save_data();
        return `${streamer_name} добавлен в список`;
    }

    async remove(streamer_name, discord_channel) {
        let streamer_id = await this.twitch.get_id_by_name(streamer_name);
        if (!streamer_id) return `Twitch ${streamer_name} не знает`;
        let streamer = this.data[streamer_id];
        if (!streamer) return `${streamer_name} не в списке`;
        let channels = streamer["channels"];
        let index = channels.indexOf(discord_channel);
        if (index == -1) return `${streamer_name} не в списке`;
        channels.splice(index, 1);
        if (channels.length == 0) {
            await this.twitch.unsubscribe(streamer["subscribe_id"]);
            delete this.data[streamer_id];
        }
        await this.save_data();
        return `${streamer_name} удалён из списка`;
    }

    on_channel(discord_channel) {
        let streamer_names = [];
        for (let streamer_id in this.data) {
            let streamer = this.data[streamer_id];
            let channels = streamer["channels"];
            let index = channels.indexOf(discord_channel);
            if (index == -1) continue;
            streamer_names.push(streamer["name"]);
        }
        return streamer_names;
    }

    channels(streamer_id) {
        let streamer = this.data[streamer_id];
        if (!streamer) return [];
        return streamer["channels"];
    }

    name(streamer_id) {
        let streamer = this.data[streamer_id];
        return streamer["name"];
    }

    last_stream_id(streamer_id) {
        let streamer = this.data[streamer_id];
        return streamer["last_stream_id"];
    }
};

exports = module.exports = Streamers;

