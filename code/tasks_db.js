const { MongoClient } = require("mongodb");
const url = require("../config.json").mongo_url;

let db, client;

const connect = async () => {
    client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});
    db = client.db("solaris").collection("tasks");
}

exports.add_task = async (author_id, task_text) => {
    await connect();
    let result = await db.findOne({ author_id: author_id });
    let tasks = [task_text];
    if (result) {
        tasks = result.tasks;
        tasks.push(task_text);
        await db.updateOne( { author_id: author_id }, { $set: { tasks: tasks } });
    } else {
        const note = {
            author_id: author_id,
            tasks: tasks
        };
        await db.insertOne(note);
    }
    client.close();
    return tasks;
}

exports.remove_task = async (author_id, number) => {
    await connect();
    let result = await db.findOne({ author_id: author_id });
    let tasks = [];
    if (result) {
        tasks = result.tasks;
        tasks.splice(number - 1, 1);
        await db.updateOne( { author_id: author_id }, { $set: { tasks: tasks } });
    }
    client.close();
    return tasks;
}


exports.all_tasks = async (author_id) => {
    await connect();
    let result = await db.findOne({ author_id: author_id });
    let tasks = [];
    if (result) {
        tasks = result.tasks;
    }
    client.close();
    return tasks;
}



