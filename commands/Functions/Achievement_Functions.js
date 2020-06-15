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

function tracker1(user, achievement_num, increment, message, master){
    
}