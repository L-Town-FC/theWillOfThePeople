module.exports = {
    name: 'test',
    description: 'custom emoji test',
    execute(message,master, stats, tracker){
        const fs = require('fs')
        //var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        //var tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
        var bwg = JSON.parse(fs.readFileSync("./JSON/default_json.json", "utf-8"))
        //var stats = JSON.parse(fs.readFileSync("./JSON/default_json.json", "utf-8"))
        var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
        //var roulette = JSON.parse(fs.readFileSync("./JSON/roulette.json", "utf-8"))
        var classes = JSON.parse(fs.readFileSync('./JSON/RPG/classes.json'))
        if(message.author.id == '450001712305143869' && message.channel.id == '611276436145438769'){
            for(var i in classes){
                //delete classes[i].sub_stats.accurracy
                //classes[i].sub_stats.accuracy = ""
            }
            
            for(i in tracker){
                /*
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
                
                tracker[i][31] = 0
                tracker[i][32] = 0
                tracker[i][33] = 0
                tracker[i][36] = 0
                tracker[i][37] = 0
                tracker[i][40] = 0
                tracker[i][39] = [0,0,0]
                tracker[i][42] = [false, false, false, false, false, false, false, false]
                tracker[i][44] = 0
                tracker[i][45] = 0
                
               tracker[i][46] = 0
               tracker[i][47] = 0
               tracker[i][48] = 0
               tracker[i][51] = 0
               tracker[i][52] = 0
               tracker[i][53] = 0
               tracker[i][54] = 0
               tracker[i][55] = 0
               */
            }
            /*
            for(var i in achievements){
                delete achievements[i].Tracker_Number
                achievements[i].tracker = 1
            }
            */
           var day_list = []
           var week_list = []
           for(var i = 0; i < 24; i++){
               day_list.push(0)
           }
           for(var i = 0; i < 7; i++){
               week_list.push(0)
           }
            
            for(i in master){
                master[i].historical_gbp = {
                    day: day_list,
                    week: week_list
                }
                /*
                master[i].account = 0

                master[i].loans = {}
                master[i].loans.target = ''
                master[i].loans.remaining = 0
                master[i].loans.collection = 0
                master[i].loans.rate = 0

                master[i].bwg = {
                    "target": "",
                    "current_word": "",
                    "bet": 0,
                    "remaining_msgs": "",
                    "gamestatus": 0,
                    "used_word": []
                }
               
                master[i].insulted = false
                master[i].steal = {
                    "insurance": 0,
                    "attempts": 0,
                    "caught": false
                }
                */
            }
            

            /*
            for(i in bwg){
                bwg[i].target = ""
                bwg[i].current_word = ""
                bwg[i].bet = 0
                bwg[i].remaining_msgs = ""
                bwg[i].used_words = []
                bwg[i].gamestatus = 0
            }
            */


            for(i in stats){
                //stats[i].lottery_tickets = 0
                //stats[i].bj_wins = 0
                //stats[i].bj_pushes = 0
                //stats[i].bj_losses = 0
                //stats[i].gg_wins = 0
                //stats[i].gg_losses = 0
                //stats[i].total_msgs = 0
                //stats[i].total_commands = 0
                //stats[i].farm_messages = 0
                //stats[i].non_farm_messages = 0
                //stats[i].achievements = 0
                //stats[i].button_presses = 0
                //stats[i].button_losses = 0
                //stats[i].roulette_bets = 0
                //stats[i].roulette_wins = 0
                //stats[i].taxes = 0
                //stats[i].interest = 0
            }


            fs.writeFileSync ("./JSON/RPG/classes.json", JSON.stringify(classes, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
            fs.writeFileSync ("./JSON/master.json", JSON.stringify(master, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
            fs.writeFileSync ("./JSON/stats.json", JSON.stringify(stats, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
            fs.writeFileSync ("./JSON/achievements_tracker.json", JSON.stringify(tracker, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
            fs.writeFileSync ("./JSON/achievements.json", JSON.stringify(achievements, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
        }
    }

}