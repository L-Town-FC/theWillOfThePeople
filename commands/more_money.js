module.exports = {
    name: 'more_money',
    description: 'gives 1 gbp every message',
    execute(message, master, stats_list, tracker){
        
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        const stats = require('./Functions/stats_functions')
        var person = message.author.id
         
        try{
            if(!master[person]){
                addPerson(message, master, tracker, stats_list)
            }
            for(i in master){
                if(isNaN(master[i].gbp) == true){
                    master[i].gbp = 0;
                }
            }
        
            if(message.author.discriminator !== '9509' && message.author.discriminator !== '0250'){
                if(message.content.startsWith("!") == false){
                    if(message.channel.type !== 'dm'){
                        if(message.member.roles.cache.find(r => r.name === "Junior Representative Assistant") || message.member.roles.cache.find(r => r.name === "Senior Representative Assistant") || message.member.roles.cache.find(r => r.name === "The People's Representative") ||message.member.roles.cache.find(r => r.name === "Dogcatcher") || message.member.roles.cache.find(r => r.name === "Soupmaker") || message.member.roles.cache.find(r => r.name === "Viceroy!")){
                            unlock.unlock(message.author.id, 24, message, master)
                        }
                    }
                    if(['590585423202484227','712755269863473252', '672846614410428416'].includes(message.channel.id) == true || message.channel.type === 'dm'){
                        stats.tracker(person, 9, 1, stats_list)
                    }else{
                        stats.tracker(person, 10, 1, stats_list)
                    }
                   
                    var total_assets = master[person].gbp + master[person].account
                    var scaling_modifier = -0.1 * master[person].gbp + 175
                    Achievement_Switch(person, message.channel.id, message, master)
                    Random_Achievements(person, message, master)
                    var amount = 1

                    
                    if(total_assets < -10000){
                        var amount = 50
                    }else if(total_assets < -2500){
                        var amount = 20
                    }else if(total_assets < -1000){
                        var amount = 10
                    }else if(total_assets < 0){
                        var amount = 5
                        unlock.unlock(person, 3, message, master)
                    }else if(total_assets < 250){
                        var amount = 3
                    }else if(total_assets < 500){
                        var amount = 2
                    }else if(total_assets < 750){
                        var amount = 1
                    }else if(total_assets < 1500){
                        var chance = Math.random() * 100
                        if(chance > scaling_modifier){
                            var amount = 0
                        }
                    }else{
                        var chance = Math.random() * 100
                        if(chance > 25){
                            var amount = 0
                        }
                    }
                    if(amount == 0 && ['712755269863473252', '590585423202484227', '611276436145438769'].includes(message.channel.id) == false){
                        if(message.channel.type === 'dm'){

                        }else{
                            amount = 1
                        }
                    }
                    master[person].gbp = Math.round((parseFloat(master[person].gbp) + amount) * 100)/100
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in More_money.js");
        }
        
    }

}

function Achievement_Switch(user, channel, message, master){
    const unlock = require('./Functions/Achievement_Functions')

    switch(channel){
        case '590583268961812500':
            //politics
            unlock.tracker1(user, 17, 1, message, master, tracker)
        break;
        case '590583073595457547':
            //gaming
            unlock.tracker1(user, 28, 1, message, master, tracker)
        break;
        case '590585423202484227':
            //pugilism
            unlock.tracker1(user, 9, 1, message, master, tracker)
        break;
        case '712755269863473252':
            //blackjack
            unlock.tracker1(user, 9, 1, message, master, tracker)
        break;
        case '590583125445181469':
            //anime
            unlock.tracker1(user, 29, 1, message, master, tracker)
        break;
        case '664241953973731328':
            //feet 664241953973731328
            unlock.tracker1(user, 27, 1, message, master, tracker)
            unlock.tracker2(user, 15, 0, message, master, tracker)
        break;
        case '606515956826636288':
            //dobans 606515956826636288
            unlock.tracker1(user, 26, 1, message, master, tracker)
            unlock.tracker2(user, 15, 1, message, master, tracker)
        break;
    }
}

function Random_Achievements(user, message, master){
    const unlock = require('./Functions/Achievement_Functions')
    if(master[user].gbp <= -250){
        unlock.unlock(user, 34, message, master)
    }else if(master[user].gbp == 69){
        unlock.unlock(user, 41, message, master)
    }else if(master[user].gbp >= 10000){
        unlock.unlock(user, 6, message, master)
    }
    if(message.content.toLowerCase().includes('twitch.tv/') == true){
        unlock.unlock(user, 43, message, master)
    }
}

function addPerson(message, master, tracker, stats_list){
    master[message.author.id] =  {
        name: "Default",
        gbp: 250,
        achievements: [],
        simmerdown: 0,
        account: 0,
        loans: {
          target: "",
          remaining: 0,
          collection: 0,
          rate: 0
        },
        bwg: {
          target: "",
          current_word: "",
          bet: 0,
          remaining_msgs: "",
          gamestatus: 0,
          used_word: []
        },
        insulted: false,
        steal: {
          insurance: 0,
          attempts: 0,
          caught: false
        }
    }
    tracker[message.author.id] = {
        name: "Default",
        [4]: 0,
        [5]: 0,
        [7]: 0,
        [8]: 0,
        [9]: 0,
        [13]: 0,
        [14]: 0,
        [15]: [false, false],
        [17]: 0,
        [18]: 0,
        [20]: [false, false],
        [21]: 0,
        [23]: 0,
        [25]: 0,
        [26]: 0,
        [27]: 0,
        [28]: 0,
        [29]: 0,
        [31]: 0,
        [32]: 0,
        [33]: 0,
        [36]: 0,
        [37]: 0,
        [40]: 0,
        [39]: [0,0,0],
        [42]: [false, false, false, false, false, false, false, false],
        [44]: 0,
        [45]: 0,
        [46]: 0,
        [47]: 0,
        [48]: 0,
        [51]: 0,
        [52]: 0,
        [53]: 0,
        [54]: 0,
        [55]: 0
    }
    stats_list[message.author.id] = {
        name:"Default",
        lottery_tickets : 0,
        bj_wins : 0,
        bj_pushes : 0,
        bj_losses : 0,
        gg_wins : 0,
        gg_losses : 0,
        total_msgs : 0,
        total_commands : 0,
        farm_messages : 0,
        non_farm_messages : 0,
        achievements : 0,
        button_presses : 0,
        button_losses : 0,
        roulette_bets : 0,
        roulette_wins : 0
    }
}