function unlock(user, achievement_num, message, master){
    //used to unlock achivements
    try{
        const fs = require ('fs')
        var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
        //loops through users to find user that just messaged
        //check if the achievement that is trying to be unlocked has already been unlocked
        //if it hasnt been unlocked yet, it unlocked it and sends a congratulatory message
        if(master[user].achievements.includes(achievement_num) == false){
            master[user].achievements.push(achievement_num)
            message.channel.send(`${master[user].name} Achievement Unlock: ${achievements[achievement_num].name} \nDescription: ${achievements[achievement_num].description}`)
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

    if(master[user].achievements.includes(achievement_num) == false){
        master[user].achievements.push(achievement_num)
        channel.send(`${master[user].name} Achievement Unlock: ${achievements[achievement_num].name}`)
    }
    
}

module.exports.index_unlock = index_unlock

//this isnt used and cant be deleted
// function index_tracker(user, achievement_num, increment, channel, master, tracker){
//     const fs = require('fs')
//     var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
//     try{
//         threshold = achievements[achievement_num].threshold
//         tracker[user][achievement_num] = tracker[user][achievement_num] + increment;
//         if(tracker[user][achievement_num] >= threshold){
//             index_unlock(user, achievement_num, channel, master)
//         }
//     }catch(err){
//         console.log(err)
//         channel.send('Error occurred in Achievement Tracker1')
//         channel.send(`Achievement number: ${achievement_num}`)
//     }
// }
//
//module.exports.index_tracker = index_tracker

function reset1(user, achievement_num, tracker, message){
    //used to reset tracking on achievements that only use a single number to track. ex. lose 5 games of black jack in a row
    try{
        tracker[user][achievement_num] = 0
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in Achievement Reset1')
        message.channel.send(`Achievement number: ${achievement_num}`)
    }
}
module.exports.reset1 = reset1

function reset2(user, achievement_num, index, tracker, message){
    //used to reset tracking on achievements that use an array of numbers
    try{
        for(var i in tracker){
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
        var threshold = achievements[achievement_num].threshold
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
    try{
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
    //achievmenets that track multiple numbers in an array
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    try{
        var threshold = achievements[achievement_num].threshold
        tracker[user][achievement_num][index] = tracker[user][achievement_num][index] + parseFloat(increment)
        
        var counter = 0
        
        for(var i = 0;i < tracker[user][achievement_num].length; i++){
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