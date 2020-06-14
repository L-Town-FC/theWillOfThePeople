module.exports = {
    name: 'backup',
    description: 'backs up master.json',
    execute(message,args){
        const fs = require('fs')
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        fs.writeFileSync ("./JSON/backup.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
        message.channel.send("Backup Successful")
    }

}