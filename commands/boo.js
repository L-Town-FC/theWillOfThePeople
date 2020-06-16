module.exports = {
    name: 'boo',
    description: 'custom emoji test',
    execute(message,args,money){
        const fs = require('fs')
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        const unlock = require("./Functions/Achievement_Functions")
        var boo = fs.readFileSync('./text_files/boo.txt', "utf-8")
        var price = 250;
        var name = args[1];
        var success = false

        try{
            if(typeof(name) == 'undefined'){
                message.channel.send(`${master[boo].name} is currently being booed`)
            }else if(parseFloat(money) < price){
                message.channel.send(`You must have atelast ${price} gbp to use this command`)
            }else{
                for(i in master){
                    if(name.toLowerCase() == master[i].name.toLowerCase()){
                        var id = i
                        fs.writeFileSync('./text_files/boo.txt', id)
                        purchase(price, message.author.id, message)
                        //Professional Asshole Achievement Tracker
                        unlock.tracker1(message.author.id, 13, 1, 3, message, master)

                        //Toxic Achievement Tracker
                        unlock.reset2(id, 20, 0)
                        unlock.tracker2(id, 20, 0, message, master)

                        var success = true
                        message.channel.send(`${master[id].name} is now being booed`)
                        if(message.author.id == id){
                            //Masochist Achievement
                            unlock.unlock(message.author.id, 22, message, master)
                        }
                    }
                }
                if(success == false){
                    message.channel.send("Please give a valid name")
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occrued in Boo.js")
        }
    }
}

function purchase(bet_value, player, message) {
    try{
        const fs = require('fs');
        var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))

        for(i in master){
            if(player == i){
                master[i].gbp = parseFloat(master[i].gbp) - parseFloat(bet_value)
            }
        }
        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );

    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Boo.js Purchase");
    }
}