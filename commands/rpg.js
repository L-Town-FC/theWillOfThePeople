module.exports = {
    name: 'rpg',
    description: 'lets you play the rpg',
    execute(message, args, master, stats_list, tracker, players){
        const fs = require('fs')
        const rpg = require('./Functions/rpg_functions')
        var command = String(args[1]).toLowerCase() || 'none'

        switch(command){
            case 'create':
                //lets you make your character
                //adds your name to players.json if not already there
                rpg.create(message, args, master, players)
            break;
            case 'delete':
                //lets you delete your character
            break;
            case 'classes':
                //lets you check the different stats and classes
                rpg.classes(message, args, master, players)
            break;
            case 'status':
                //brings up a menu for whatever you are currently doing
                //ex if in battle, it would bring up the battle screen, if in shop, it would bring up the shop
            break;
            case 'inventory':
                //shows you your inventory

            break;
            case 'map':
                //brings up a map
                //map defaults to small square where you are
                //"map world" shows world map
            break;
            case 'move':
                //lets you move in different direction

            break;
        }
    }
}