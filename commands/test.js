module.exports = {
    name: 'test',
    description: 'custom emoji test',
    execute(message,args){
        const fs = require('fs')
        var tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
        
        for(i in tracker){
            tracker[i][4] = 0
            tracker[i][5] = 0
            tracker[i][7] = 0
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


        fs.writeFileSync ("./JSON/achievements_tracker.json", JSON.stringify(tracker, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }

}