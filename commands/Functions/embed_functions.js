function Color(message){
    if(message.member !== null){
        console.log(message.member.roles)
        var roles = message.member.roles.cache.array()
        var position_array = []
        for(i in roles){
            position_array.push(roles[i].position)
        }
        var max_position = Math.max(...position_array)
        var position_of_max = position_array.indexOf(max_position)
        return roles[position_of_max].color
    }else{
        console.log(message.member)
        return 000000
    }
}

module.exports.Color = Color