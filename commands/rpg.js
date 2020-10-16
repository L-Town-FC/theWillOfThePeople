module.exports = {
    name: 'rpg',
    description: 'lets you play the rpg',
    execute(message, args, master, stats_list, tracker, players){
        const fs = require('fs')
        const rpg_classes = require('./Functions/RPG_Functions/rpg_classes')
        const rpg_general = require('./Functions/RPG_Functions/rpg_general')
        var command = String(args[1]).toLowerCase() || 'none'

        switch(command){
            case 'create':
                //lets you make your character
                //adds your name to players.json if not already there
                try{
                    rpg_classes.create(message, args, master, players)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error Occurred in rpg.js create')
                }
            break;
            case 'delete':
                //lets you delete your character
            break;
            case 'players':
                rpg_general.rpg_players(message, players)
            break;
            case 'classes':
                //lets you check the different stats and classes
                try{
                    rpg_classes.classes(message, args, master, players)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error Occurred in rpg.js classes')
                }
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
                //will move using this
            break;
            case 'battle':

            break;
        }
    }
}