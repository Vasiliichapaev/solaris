const config = require("../config.json");
const twitch_id = config.twitch_id;
const twitch_secret = config.twitch_secret;
const index_url = config.index_url;
const fetch = require("node-fetch");


exports.get_access_token = async () => {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${twitch_id}&client_secret=${twitch_secret}&grant_type=client_credentials`;
    const options = { method: "POST" };
    let response = await fetch(url, options);
    if (response.ok) {
        let body = await response.json(); 
        process.env.TWITCH_ACCESS_TOKEN = body.access_token;
        return true;
    }
    return false;
}

exports.get_id_by_name = async name => {
    name = name.toLowerCase();
    const url = `https://api.twitch.tv/helix/users?login=${name}`;
    const options = { method: "GET",
                      headers: { "Client-ID": `${twitch_id}`, 
                                  "Authorization": `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
                              },
                    };
    let response = await fetch(url, options);
    if (response.ok) {
        let body = await response.json(); 
        let data = body.data;
        if (data.length == 0) return false;
        return data[0].id;
    }
    return false;
}

exports.get_name_by_id = async id => {
    const url = `https://api.twitch.tv/helix/users?id=${id}`;
    const options = { method: "GET",
                      headers: { "Client-ID": `${twitch_id}`, 
                                  "Authorization": `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
                              },
                    };
    let response = await fetch(url, options);
    if (response.ok) {
        let body = await response.json(); 
        let data = body.data;
        if (data.length == 0) return false;
        return data[0].login;
    }
    return false;
}

exports.subscribe_event = async (event, streamer_id) =>  {
    const url = `https://api.twitch.tv/helix/webhooks/hub` +
                `?hub.callback=${index_url}/hook` +
                `&hub.mode=${event}` +
                `&hub.topic=https://api.twitch.tv/helix/streams?user_id=${streamer_id}` +
                `&hub.lease_seconds=864000`;
    const options = { method: "POST",
                      headers: { "Client-ID": `${twitch_id}`, 
                                  "Authorization": `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
                              },
                    };
    let response = await fetch(url, options);
    if (response.ok) return true; 
    return false;
}
