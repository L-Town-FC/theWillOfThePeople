function Color(message){
    var roles = message.member.roles.array()
    var position_array = []
    for(i in roles){
        position_array.push(roles[i].position)
    }
    var max_position = Math.max(...position_array)
    var position_of_max = position_array.indexOf(max_position)
    return roles[position_of_max].color
}

module.exports.Color = Color