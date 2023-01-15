const config = require("../config.json");
const index_url = config.index_url;
const fetch = require("node-fetch");

class Twitch {
    constructor(){
        this.id = config.twitch_id;
        this.secret = config.twitch_secret;
        this.access_token = undefined;
        this.get_access_token();
    }

    async get_access_token() {
        const url = `https://id.twitch.tv/oauth2/token?client_id=${this.id}&client_secret=${this.secret}&grant_type=client_credentials`;
        const options = {method: "POST"};
        let response = await fetch(url, options);
        if (response.ok) {
            let body = await response.json(); 
            this.access_token = body.access_token;
        }
    }

    async get_id_by_name(name) {
        if (!this.access_token) await this.get_access_token();
        name = name.toLowerCase();
        const url = `https://api.twitch.tv/helix/users?login=${name}`;
        const options = {
              method: "GET",
              headers: { "Client-ID": `${this.id}`, 
                          "Authorization": `Bearer ${this.access_token}`
                      }
            };
        let response = await fetch(url, options);
        if (response.ok) {
            let body = await response.json(); 
            let data = body.data;
            if (data.length == 0) return false;
            let streamer_id = data[0].id;
            return streamer_id;
        }
        return false;
    }


    async subscribe(streamer_id) {
        if (!this.access_token) await this.get_access_token();
        const url = `https://api.twitch.tv/helix/eventsub/subscriptions`
        const body = {
                "type": "stream.online",
                "version": "1",
                "condition": {"broadcaster_user_id": `${streamer_id}`},
                "transport": {
                    "method": "webhook",
                    "callback": `${index_url}/hook`,
                    "secret": `${this.secret}`
                }
            }
        const options = {
            method: "POST",
            headers: {"Client-ID": `${this.id}`, 
                    "Authorization": `Bearer ${this.access_token}`,
                    "Content-Type": `application/json`
                  },
            body: JSON.stringify(body),
            }

        let response = await fetch(url, options);
        if (response.ok) {
            let body = await response.json(); 
            let subscribe_id = body.data[0].id;
            return subscribe_id;
        }
        return false;
    }

    async unsubscribe(subscribe_id) {
        
     if (!this.access_token) await this.get_access_token();
        const url = `https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscribe_id}`;
        const options = {
            method: "DELETE",
            headers: {"Client-ID": `${this.id}`, 
                    "Authorization": `Bearer ${this.access_token}`,
                  }
            }
        await fetch(url, options);
    }

    async all() {
        if (!this.access_token) await this.get_access_token();
        const url = `https://api.twitch.tv/helix/eventsub/subscriptions`
        const options = {
            method: "GET",
            headers: {"Client-ID": `${this.id}`, 
                    "Authorization": `Bearer ${this.access_token}`,
                  }
            }
        let response = await fetch(url, options);
        if (response.ok) {
            let body = await response.json(); 
            let data = body.data;
            return data;
        }
        return false;
    }

    async unsubscribe_all() {
        let data = await this.all();
        if (!data) return;
        for (let subscribe of data){
            this.unsubscribe(subscribe.id);
        }
    }

    async get_shedule(streamer_id){

        const url = `https://api.twitch.tv/helix/schedule?broadcaster_id=${streamer_id}`
        const options = {
            method: "GET",
            headers: {"Client-ID": `${this.id}`, 
                    "Authorization": `Bearer ${this.access_token}`,
                  }
            }
        let response = await fetch(url, options);
        if (response.ok) {
            let body = await response.json(); 
            let data =  body.data;
            return data;
        }
        return false;
        }

}

exports = module.exports = Twitch;




