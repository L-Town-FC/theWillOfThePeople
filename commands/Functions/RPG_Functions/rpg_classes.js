function create(message, args, master, players){
    const fs = require('fs')
    const Discord = require('discord.js')
    var classes = JSON.parse(fs.readFileSync('./JSON/RPG/classes.json', 'utf-8'))

    var created = false

    for(var i in players){
        if(i == message.author.id){
            message.channel.send('You have already created a character')
            var created = true
        }
    }

    if(created == false){
        var player_list = []
        for(var i in players){
            player_list.push(players[i].name.toLowerCase())
        }
        if(parseInt(args[2]) >= 1 && parseInt(args[2]) <= Object.keys(classes).length){
            if(!args[3]){
                message.channel.send('You must choose a name')
            }else if(player_list.includes(String(message.content.substring(14)).toLowerCase()) == true){
                message.channel.send('That name is already taken')
            }else{
                players[message.author.id] = classes[Object.keys(classes)[args[2] - 1]]
                players[message.author.id].name = message.content.substring(14)
                delete players[message.author.id].Description
                fs.writeFileSync ("./JSON/RPG/players.json", JSON.stringify(players, null, 2), function(err) {
                    if (err) throw err;
                    console.log('complete');
                    }
                );
            }
        }else{
            message.channel.send('You must choose one of the preset classes')
        }
    }


}
module.exports.create = create

function classes(message, args, master, players){
    const fs = require('fs')
    const rpg_classes = JSON.parse(fs.readFileSync('./JSON/RPG/classes.json', 'utf-8'))
    if(typeof(args[2]) == 'undefined'){
        Classes_All(message, args, master, players)
    }else if(parseInt(args[2]) > 0 && parseInt(args[2]) <= Object.keys(rpg_classes).length){
        Classes_Specific(message, parseInt(args[2] - 1), master, players)
    }else{
        Classes_All(message, args, master, players)
    }
}

function Classes_All(message, args, master, players){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('../embed_functions')
    const rpg_classes = JSON.parse(fs.readFileSync('./JSON/RPG/classes.json', 'utf-8'))
    const classes_embed = new Discord.RichEmbed()
    .setTitle('**List of Classes**')
    .setColor(embed.Color(message))
    var class_list = []
    var counter = 1
    for(var i in rpg_classes){
        classes_embed.addField(`${counter}. ${i}`, rpg_classes[i].Description)
        //class_list.push(`${counter}. ${i}`)
        counter++
    }
    classes_embed.addField('**Extra Info**', 'Use "!rpg classes [class number]" for more info about the class')
    classes_embed.setDescription(class_list)
    message.channel.send(classes_embed)
}

function Classes_Specific(message, index, master, players){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('../embed_functions')
    const rpg_classes = JSON.parse(fs.readFileSync('./JSON/RPG/classes.json', 'utf-8'))
    var class_name = Object.keys(rpg_classes)[index]
    var _class = rpg_classes[class_name].changeable_stats
    var _class2 = rpg_classes[class_name].sub_stats
    const class_embed = new Discord.RichEmbed()
    .setTitle(`**${class_name}**`)
    .setColor(embed.Color(message))
    .setDescription(
    [
        `Health: ${rpg_classes[class_name].battle_stats.m_hp}`,
        `MP: ${rpg_classes[class_name].battle_stats.m_mp}`
    ])
    .addField('**Main Stats:**',
    [
        `Vitality: ${_class.vitality}`,
        `Strength: ${_class.strength} `,
        `Dexterity: ${_class.dexterity}`, 
        `Intelligence: ${_class.intelligence}`, 
        `Speech: ${_class.speech}`,
        `Agility: ${_class.agility}`,
        `Tolerance: ${_class.tolerance}`,
        `Luck: ${_class.luck}`
    ])
    .addField(`**Secondary Stats:**`,
    [
        `Unarmed: ${_class2.unarmed}`,
        `Melee: ${_class2.melee}`,
        `Ranged: ${_class2.ranged}`,
        `Defense: ${_class2.defense}`,
        `Accuracy: ${_class2.accuracy}`,
        `Special Attack: ${_class2.special_attack}`,
        `Special Defense: ${_class2.special_defense}`,
        `Status Resistance: ${_class2.status_resistance}`
    ])
    .addField('**Starting Inventory:**',"FILL IN LATER")
    message.channel.send(class_embed)

}
module.exports.classes = classes