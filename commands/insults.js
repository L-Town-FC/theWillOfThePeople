module.exports = {
    name: 'insults',
    description: 'shows who is being insulted and lets you change who it is',
    execute(message,args,money){
        const fs = require('fs');
        var insultee_and_count = fs.readFileSync('./text_files/insult_counter.txt','utf8').split(",");
        var master = JSON.parse(fs.readFileSync("master.json", "utf-8"))
        var price = 2500;
        var name = args[1];
        var success = false;
        var buyer = message.author.id;

        try{
            if (typeof(name) == 'undefined' ){
                for(i in master){
                    if(insultee_and_count[0] == i){
                        message.channel.send(`${master[i].name} is currently being insulted`)
                    }
                }
                //If no name is given, it returns who is being insulted
            }else{
                if(parseFloat(money) >= price){
                    for(i in master){
                        if(master[i].name.toLowerCase() == name.toLowerCase()){
                            insultee_and_count[0] = i;
                            insultee_and_count[1] = 0;
                            message.channel.send(`${master[insultee_and_count[0]].name} is now being insulted`)
                            purchase(price, buyer)
                            fs.writeFileSync("./text_files/insult_counter.txt", insultee_and_count);
                            success = true
                        }
                    }
                    if(success == false){
                        message.channel.send("Please use a valid name")
                    }
                }else{
                    message.channel.send(`You must have atleast ${price} gbp for this command`)
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Insults.js");
        }

    }
}

function purchase(bet_value, player) {
    try{
        const fs = require('fs');
        var master = JSON.parse(fs.readFileSync("master.json", "utf-8"))

        for(i in master){
            if(i == player){
                master[i].gbp = parseFloat(master[i].gbp) - parseFloat(bet_value);
            }
        }
        fs.writeFileSync ("master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Insults.js Purchase");
    }
}