function rpg_players(message, players){
    const Discord = require('discord.js')
    const embed = require('../embed_functions')

    var player_list = []
    for(var i in players){
        player_list.push(players[i].name)
    }

    var players_embed = new Discord.MessageEmbed()
    .setTitle('Player list')
    .setDescription(player_list)
    .setColor(embed.Color(message))
    message.channel.send(players_embed)
}
module.exports.rpg_players = rpg_players