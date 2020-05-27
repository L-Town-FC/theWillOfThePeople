module.exports = {
    name: 'reserves',
    description: 'allows the supreme leader to access the federal reserve',
    execute(message,args){

        const fs = require('fs')
        const reserves = fs.readFileSync('./text_files/reserves.txt','utf8')
        var command = args[1];
        
        message.channel.send(`The Federal Reserve is currently at ${reserves} gbp`)
    }

}