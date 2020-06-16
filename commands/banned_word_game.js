module.exports = {
    name: 'bwg',
    description: 'bet on if a person will say a certain word',
    execute(message, args, money){
        const fs = require("fs")
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        var command = String(args[1]).toLowerCase()
        var name = args[2]
        var bet = args[3]
        var word = args[4]

        switch(command){
            case 'bet':
                //starts game

            break;
            case 'stats':
                //Checks your personal record (wins/losses/words used against)

            break;
            case 'status':
                //shows who is being targeted

            break;
            case 'reset':
                //resets the game in case of a glitch or if you want to switch your target

            break;
            case 'help':
                //shows list of commands

            break;
            default:
                message.channel.send('Use "!bwg help" for a list of commands')
        }
    }

}