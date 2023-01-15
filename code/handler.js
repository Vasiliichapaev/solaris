
exports.twitch_msg = async (twitch_bot, channel, tags, message, self) => {
	if(self) return;
    setTimeout(() => {
        let answer;

        if (/^!love /.test(message)) {
            let name = message.match(/^!love (.*)/)[1];
            if (!name) return;
            let love = Math.floor(Math.random() * 101);
            if (name == "@tettas0" && tags.username == "timoremus") love = 100;
            answer = `Между @${tags.username} и ${name} ${love}% любви!`
            twitch_bot.say(channel, answer);
        }
    } , 1500);
}

exports.discord_message = async (msg, content, bot) => {

    if (/^!love /.test(content)) {
        let name = content.match(/^!love (.*)/)[1];
        let love = Math.floor(Math.random() * 101);
        msg.channel.send(`Между ${msg.author} и ${name} ${love}% любви!`);
        return;
    }

    if (content === "!анонс" ) {
        let channel_id = msg.channel.id;
        let answer = await bot.streamers.shedule(channel_id);
        msg.channel.send(answer);
    }

    if (content === "id" ) {
        msg.channel.send(msg.author.id);
        return;
    }


    //if (content === "leave") {
//        bot.guilds.forEach(guild => guild.leave());
    //}

//    if (content === "clear") {
//        try{
//            let messages = await msg.channel.messages.fetch();
//            messages.forEach(message => message.delete());
//        } catch {}
//        return;
//    }
//



}
