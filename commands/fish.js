module.exports = {
    name: 'fish',
    description: 'lets you catch and track fish',
    execute(message, args, master, stats, tracker){
        const fs = require('fs')
        var command = String(args[1]).toLowerCase() || 'none'
        const random = require('random')
        fishes = JSON.parse(fs.readFileSync("./JSON/fishes.json"))

        switch(command){
            case 'cast':
                var dist = random.normal(15,5)(0)
                var index = Object.keys(fishes).length
                var fish = Object.keys(fishes)[Math.floor(Math.random() * index)]
                if(['a','e','i','o','u'].includes(fish[0].toLowerCase()) == true){
                    article = 'an'
                }else{
                    article = 'a'
                }

                message.channel.send(`You caught ${article} ${fish} weighing ${dist.toFixed(2)} lbs`)
                
            break
            case 'upgrade':

            break;
            case 'stats':

            break;
            case 'help':

            break;
            default:
                message.channel.send('Use "!fish help" for a list of commands')
        }
    }
}