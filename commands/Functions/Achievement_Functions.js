function unlock(user, achievement_num, message, master){
    try{
        const fs = require ('fs')
        var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
        for(i in master){
            if(user == i){
                if(master[i].achievements.includes(achievement_num) == false){
                    master[i].achievements.push(achievement_num)
                    message.channel.send(`${master[i].name} Achievement Unlock: ${achievements[achievement_num].name}`)
                }
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in Achievement Unlock')
        message.channel.send(`Achievement number: ${achievement_num}`)
    }
}
module.exports.unlock = unlock

function index_unlock(user, achievement_num, channel, master){
    //unlocks stuff in index.js
    const fs = require ('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    for(i in master){
        if(user == i){
            if(master[i].achievements.includes(achievement_num) == false){
                master[i].achievements.push(achievement_num)
                channel.send(`${master[i].name} Achievement Unlock: ${achievements[achievement_num].name}`)
            }
        }
    }
}

module.exports.index_unlock = index_unlock

function index_tracker(user, achievement_num, increment, channel, master, tracker){
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    try{
        if(tracker == 'undefined'){
            tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
        }

        threshold = achievements[achievement_num].threshold
        tracker[user][achievement_num] = tracker[user][achievement_num] + increment;
        if(tracker[user][achievement_num] >= threshold){
            index_unlock(user, achievement_num, channel, master)
        }
    }catch(err){
        console.log(err)
        channel.send('Error occurred in Achievement Tracker1')
        channel.send(`Achievement number: ${achievement_num}`)
    }
}

module.exports.index_tracker = index_tracker

function reset1(user, achievement_num, tracker){
    const fs = require('fs')
    try{
        if(tracker == 'undefined'){
            tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
        }
        tracker[user][achievement_num] = 0
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in Achievement Reset1')
        message.channel.send(`Achievement number: ${achievement_num}`)
    }
}
module.exports.reset1 = reset1

function reset2(user, achievement_num, index, tracker){
    const fs = require("fs");
    try{
        if(tracker == 'undefined'){
            tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
        }
        for(i in tracker){
            if(user !== i){
                tracker[i][achievement_num][index] = false
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in Achievement Reset2')
        message.channel.send(`Achievement number: ${achievement_num}`)
    }
}
module.exports.reset2 = reset2

function tracker1(user, achievement_num, increment, message, master, tracker){
    //Used for tracking basic achievements that are a single number
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    try{
        if(tracker == 'undefined'){
            tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
        }

        threshold = achievements[achievement_num].threshold
        tracker[user][achievement_num] = tracker[user][achievement_num] + increment;
        if(tracker[user][achievement_num] >= threshold){
            unlock(user, achievement_num, message, master)
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in Achievement Tracker1')
        message.channel.send(`Achievement number: ${achievement_num}`)
    }
}
module.exports.tracker1 = tracker1

function tracker2(user, achievement_num, index, message, master, tracker){
    //achievements that track booleans
    const fs = require('fs')
    try{
        if(tracker == 'undefined'){
            tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
        }
        tracker[user][achievement_num][index] = true

        if(tracker[user][achievement_num].includes(false) == false){
            unlock(user, achievement_num, message, master)
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in Achievement Tracker2')
        message.channel.send(`Achievement number: ${achievement_num}`)
    }
}
module.exports.tracker2 = tracker2

function tracker3(user, achievement_num, index, increment, message, master, tracker){
    //achievmenets that track multiple numbers
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    try{
        if(tracker == 'undefined'){
            tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
        }
        threshold = achievements[achievement_num].threshold
        tracker[user][achievement_num][index] = tracker[user][achievement_num][index] + parseFloat(increment)
        
        var counter = 0
        
        for(i = 0;i < tracker[user][achievement_num].length; i++){
            if(parseFloat(tracker[user][achievement_num][i]) >= threshold){
                counter++
            }
        }
        
        if(tracker[user][achievement_num].length == (counter)){
            unlock(user, achievement_num, message, master)
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in Achievement Tracker3')
        message.channel.send(`Achievement number: ${achievement_num}`)
    }
}
module.exports.tracker3 = tracker3