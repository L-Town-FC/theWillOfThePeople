function tracker(user, stat, increment){
    const fs = require('fs')
    stats = JSON.parse(fs.readFileSync("./JSON/stats.json", "utf-8"))
    switch(stat){
        case 1:
            stats[user].lottery_tickets = stats[user].lottery_tickets + increment
        break;
        case 2:
            stats[user].bj_wins = stats[user].bj_wins + increment
        break;
        case 3: 
            stats[user].bj_pushes = stats[user].bj_pushes + increment
        break;
        case 4:
            stats[user].bj_losses = stats[user].bj_losses + increment
        break;
        case 5:
            stats[user].gg_wins = stats[user].gg_wins + increment
        break;
        case 6:
            stats[user].gg_losses = stats[user].gg_losses + increment
        break;
        case 7:
            stats[user].total_msgs = stats[user].total_msgs + increment
        break;
        case 8:
            stats[user].total_commands = stats[user].total_commands + increment
        break;
        case 9:
            stats[user].farm_messages = stats[user].farm_messages + increment
        break;
        case 10:
            stats[user].non_farm_messages = stats[user].non_farm_messages + increment
        break;
    }
    fs.writeFileSync ("./JSON/stats.json", JSON.stringify(stats, null, 2), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );

}

module.exports.tracker = tracker