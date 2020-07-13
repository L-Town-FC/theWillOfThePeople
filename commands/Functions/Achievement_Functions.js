function unlock(user, achievement_num, message, master){
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
}
module.exports.unlock = unlock

function index_unlock(user, achievement_num, channel, master){
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

function reset1(user, achievement_num, tracker){
    const fs = require('fs')
    if(tracker == 'undefined'){
        tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
    }
    tracker[user][achievement_num] = 0
}
module.exports.reset1 = reset1

function reset2(user, achievement_num, index, tracker){
    const fs = require("fs");
    if(tracker == 'undefined'){
        tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
    }
    for(i in tracker){
        if(user !== i){
            tracker[i][achievement_num][index] = false
        }
    }
}
module.exports.reset2 = reset2

function tracker1(user, achievement_num, increment, message, master, tracker){
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    if(tracker == 'undefined'){
        tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
    }

    threshold = achievements[achievement_num].threshold
    tracker[user][achievement_num] = tracker[user][achievement_num] + increment;
    if(tracker[user][achievement_num] >= threshold){
        unlock(user, achievement_num, message, master)
    }
}
module.exports.tracker1 = tracker1

function tracker2(user, achievement_num, index, message, master, tracker){
    const fs = require('fs')
    if(tracker == 'undefined'){
        tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
    }

    tracker[user][achievement_num][index] = true

    if(tracker[user][achievement_num].includes(false) == false){
        unlock(user, achievement_num, message, master)
    }
}
module.exports.tracker2 = tracker2

function tracker3(user, achievement_num, index, increment, message, master, tracker){
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    if(tracker == 'undefined'){
        tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
    }
    threshold = achievements[achievement_num].threshold
    tracker[user][achievement_num][index] = tracker[user][achievement_num][index] + parseFloat(increment)
    
    var counter = 0
    for(i in tracker[user][achievement_num]){
        if(parseFloat(i) >= threshold){
            counter++
        }
    }
    if(tracker[user][achievement_num].length == (counter)){
        unlock(user, achievement_num, message, master)
    }
}
module.exports.tracker3 = tracker3