module.exports = {
    name: 'test',
    description: 'custom emoji test',
    execute(message,args){
        const fs = require('fs')
        var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))

        fs.writeFileSync ("./JSON/achievements.json", JSON.stringify(achievements, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }

}