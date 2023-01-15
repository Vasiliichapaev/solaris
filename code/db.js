const { MongoClient } = require("mongodb");
const config = require("../config.json");


class DataBase {
    constructor(){
        this.url = config.mongo_url;
        this.client = undefined;
    }

    async connect() {
        try {
            this.client = await MongoClient.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true});
        } catch(e) {
            console.log(e)
        };
    }

    async get_streamers() {
        await this.connect();
        if (!this.client) return {};
        const streamers = this.client.db("solaris").collection("streamers");
        const result = await streamers.find().toArray();
        this.client.close();
        if (result.length == 0) return {};
        if (result) return result[0].data;
    }

    async update_streamers(data) {
        await this.connect();
        if (!this.client) return;
        const streamers = this.client.db("solaris").collection("streamers");
        await streamers.deleteOne({id: 1});
        await streamers.insertOne({id: 1, data: data});
        this.client.close();
    } 


}

exports = module.exports = DataBase;
