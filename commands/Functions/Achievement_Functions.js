function unlock(user, achievement_num, message, master){
    const fs = require ('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var success = false
    for(i in master){
        if(user == i){
            if(master[i].achievements.includes(achievement_num) == false){
                master[i].achievements.push(achievement_num)
                message.channel.send(`${master[i].name} Achievement Unlock: ${achievements[achievement_num].name}`)
                success = true
            }
        }
    }
    if(success == true){
        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }
}
module.exports.unlock = unlock

function reset1(user, achievement_num){
    const fs = require('fs')
    tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
    tracker[user][achievement_num] = 0
    fs.writeFileSync ("./JSON/achievements_tracker.json", JSON.stringify(tracker, null, 2), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}
module.exports.reset1 = reset1

function reset2(user, achievement_num, index){
    const fs = require("fs");
    tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
    for(i in tracker){
        if(user !== i){
            tracker[i][achievement_num][index] = false
        }
    }
    fs.writeFileSync ("./JSON/achievements_tracker.json", JSON.stringify(tracker, null, 2), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}
module.exports.reset2 = reset2

function tracker1(user, achievement_num, increment, threshold, message, master){
    const fs = require('fs')
    tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))

    tracker[user][achievement_num] = tracker[user][achievement_num] + increment;

    if(tracker[user][achievement_num] >= threshold){
        unlock(user, achievement_num, message, master)
    }
}
module.exports.tracker1 = tracker1

function tracker2(user, achievement_num, index, message, master){
    const fs = require('fs')
    tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))

    tracker[user][achievement_num][index] = true

    if(tracker[user][achievement_num].includes(false) == false){
        unlock(user, achievement_num, message, master)
    }
    fs.writeFileSync ("./JSON/achievements_tracker.json", JSON.stringify(tracker, null, 2), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}
module.exports.tracker2 = tracker2