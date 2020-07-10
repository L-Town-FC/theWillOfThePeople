function tracker(user, stat, increment, stats_list){
    //stats_list = JSON.parse(fs.readFileSync("./JSON/stats.json", "utf-8"))
    switch(stat){
        case 1:
            stats_list[user].lottery_tickets = stats_list[user].lottery_tickets + increment
        break;
        case 2:
            stats_list[user].bj_wins = stats_list[user].bj_wins + increment
        break;
        case 3: 
            stats_list[user].bj_pushes = stats_list[user].bj_pushes + increment
        break;
        case 4:
            stats_list[user].bj_losses = stats_list[user].bj_losses + increment
        break;
        case 5:
            stats_list[user].gg_wins = stats_list[user].gg_wins + increment
        break;
        case 6:
            stats_list[user].gg_losses = stats_list[user].gg_losses + increment
        break;
        case 7:
            stats_list[user].total_msgs = stats_list[user].total_msgs + increment
        break;
        case 8:
            stats_list[user].total_commands = stats_list[user].total_commands + increment
        break;
        case 9:
            stats_list[user].farm_messages = stats_list[user].farm_messages + increment
        break;
        case 10:
            stats_list[user].non_farm_messages = stats_list[user].non_farm_messages + increment
        break;
    }
}

module.exports.tracker = tracker