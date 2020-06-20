module.exports = {
    name: 'test',
    description: 'custom emoji test',
    execute(message,args){
        const fs = require('fs')
        var tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
        var bwg = JSON.parse(fs.readFileSync("./JSON/default_json.json", "utf-8"))
        var stats = JSON.parse(fs.readFileSync("./JSON/default_json.json", "utf-8"))
        if(message.author.id == '450001712305143869' && message.channel.id == '611276436145438769'){
            for(i in tracker){
                tracker[i][4] = 0
                tracker[i][5] = 0
                tracker[i][7] = 0
                tracker[i][8] = 0
                tracker[i][9] = 0
                tracker[i][13] = 0
                tracker[i][14] = 0
                tracker[i][15] = [false, false]
                tracker[i][17] = 0
                tracker[i][18] = 0
                tracker[i][20] = [false, false]
                tracker[i][21] = 0
                tracker[i][23] = 0
                tracker[i][25] = 0
                tracker[i][26] = 0
                tracker[i][27] = 0
                tracker[i][28] = 0
                tracker[i][29] = 0
            }
            

            for(i in bwg){
                bwg[i].target = ""
                bwg[i].current_word = ""
                bwg[i].bet = 0
                bwg[i].remaining_msgs = ""
                bwg[i].used_words = []
                bwg[i].gamestatus = 0
            }


            for(i in stats){
                stats[i].lottery_tickets = 0
                stats[i].bj_wins = 0
                stats[i].bj_pushes = 0
                stats[i].bj_losses = 0
                stats[i].gg_wins = 0
                stats[i].gg_losses = 0
                stats[i].total_msgs = 0
                stats[i].total_commands = 0
                stats[i].achievements = 0
            }

            fs.writeFileSync ("./JSON/stats.json", JSON.stringify(stats, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
            fs.writeFileSync ("./JSON/banned_word_game.json", JSON.stringify(bwg, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
            fs.writeFileSync ("./JSON/achievements_tracker.json", JSON.stringify(tracker, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
        }
    }

}