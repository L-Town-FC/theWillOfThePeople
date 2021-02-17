module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message, bot){
        message.channel.send('pong');
        //Test()
    }
}


function Test(){
    const fs = require('fs')
    type = "bait"
    var test = JSON.parse(fs.readFileSync(`./JSON/fish/${type}_fish.json`, 'utf-8'))
    for(var i in test){
        test[i].size = "Bait"
    }
    fs.writeFileSync (`./JSON/fish/${type}_fish.json`, JSON.stringify(test, null, 2), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}
