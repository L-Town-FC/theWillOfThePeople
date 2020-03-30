module.exports = {
    name: 'alex_insults',
    description: 'insults alex',
    execute(message){
        var fs = require('fs');
        const Discord = require('discord.js');
        const bot = new Discord.Client();
        
        if (message.author === bot.user){
            //Screens out bot's messages
        }else{
            var counter = fs.readFileSync('./text_files/insult_counter.txt','utf8');
            name_count = parseInt(counter);
            if (message.author.discriminator == 4682 ){
                //checks if author or message mathces the intended target
                if (parseInt(name_count) <= 3){
                    name_count = name_count + 1;
                }else{
                    var insults = ['Fuck You', 'You Fucking Troglodyte', 'Fuckin Doo Doo Brains',"You are so repulsive that even Zaid won't suck your toes",
                                    'You dumb fucking cretin, you fucking fool, absolute fucking buffoon, you bumbling idiot. Fuck you', 'Go Fuck Yourself', 'Fucking Pussy Nerd Virgin',
                                    'Read a book', 'Ok bud, bud Ok', "You're fucking 10-ply bud", "You're just spare parts aren't yah bud", 'See you next Tuesday',
                                    'You fat cheeky wanker', "You're a fucking retard", 'Suck my dick', 'You pasty twat', "If I was stuck in a room with you, Hitler, and Stalin, I would shoot you twice",
                                    "How's the Futa bud?", "How are you still talking with that butt plug in your mouth?", "It looks to me like the best part of you ran down the crack of your mama's ass and ended up as a brown stain on the mattress.",
                                    "I bet you're the kind of guy that would fuck a person in the ass and not even have the goddamn common courtesy to give him a reach-around",
                                    "Were you born a fat, slimy, scumbag puke piece o' shit, or did you have to work on it?","What are you looking at you fucking smooth skin", 
                                    "Hey you, yeah you. I see posting with your dry ass lips. Ah ah ah, don't go lick'em now. Dry ass lips having ass", "You're just a retard, aren't you",
                                    "Eat my twat","I bet you do pour the milk before the cereal", "Bet you put your pants on before your socks", "I bet you own three belts", "You suck eggs",
                                    "Have a nice trip, see you next fall", "I bet you can't even climb a B1", "I bet you read the articles in magazines","You're just the worst","I bet you have a hard time haggling at yard sales",
                                    "Suck a fatty", "I bet you don't even rip the tags off clothes at Savers","You're dogshit bro", "I'll make you eat my ass","You're trash", "You fucking Belieber",
                                    "Raccoon looking ass", "You guys listen to that new Tom A", "Flat-ass-havin-ass-bitch","I bet you listened to the last episode of Delivering opinions", "Get that dick out of your mouth you cheeky cunt",
                                    "Simmer down", "I wouldn't fuck your feet if you begged me to", "You're proof that god is dead", "You aren't the sharpest tool in the shed, are ya?", "Komi-san doesn't like you",
                                    "Gamers don't stand with you", "You're a fucking cocksucka", "Justin Ratte beat you in a fight", "I can't stand to look at you", "This loser failed No Nut November on day 1",
                                    "Give your balls a tug ya titfucker", "I'd like to slap the shit out of you"]
                    message.channel.send(insults[Math.floor(Math.random()*insults.length)]);
                    name_count = 1;
                }
                //Checks when the last time the command was ran and runs command if its been too long since last execution
            }
        }
        fs.writeFileSync('./text_files/insult_counter.txt', name_count);
    }

}

/*
var insults = ['Fuck You', 'You Fucking Troglodyte', 'Fuckin Doo Doo Brains','You are so repulsive that even Zaid wont suck your toes',
        'You dumb fucking cretin, you fucking fool, absolute fucking buffoon, you bumbling idiot. Fuck you', 'Go Fuck Yourself', 'Fucking Pussy Nerd Virgin',
        'Read a book', 'Ok bud, bud Ok', "You're fucking 10-ply bud", "You're just spare parts aren't yah bud", 'See you next Tuesday',
        'You fat cheeky wanker', "You're a fucking retard", 'Suck my dick', 'You pasty twat', "If I was stuck in a room with you, Hitler, and Stalin, I would shoot you twice",
        "How's the Futa bud?", "How are you still talking with that butt plug in your mouth?", "It looks to me like the best part of you ran down the crack of your mama's ass and ended up as a brown stain on the mattress.",
        "I bet you're the kind of guy that would fuck a person in the ass and not even have the goddamn common courtesy to give him a reach-around",
        "Were you born a fat, slimy, scumbag puke piece o' shit, or did you have to work on it?","What are you looking at you fucking smooth skin", 
        "Hey you, yeah you. I see posting with your dry ass lips. Ah ah ah, don't go like'em now. Dry ass lips having ass","I feel bad for your mom","Wow, that's so interesting did you read that in the economist?",
        "I'd bet you prefer orange juice without pulp","You probably think the moon landing was real","Dum dum","I heard through the the grapevine you played resident evil 2 remake on the easy mode",
        "I bet you could suck a golf ball through a garden hose", 'Did you just blow in from stupid town?', "Don't you have to be stupid somewhere else?"]
        "Hey you, yeah you. I see posting with your dry ass lips. Ah ah ah, don't go like'em now. Dry ass lips having ass", "You're just a retard, aren't you",
        "Eat my twat","I bet you do pour the milk before the cereal", "Bet you put your pants on before your socks", "I bet you own three belts", "You suck eggs",
        "Have a nice trip, see you next fall", "I bet you can't even climb a B1", "I bet you read the articles in magazines","You're just the worst","I bet you have a hard time haggling at yard sales",
        "Suck a fatty", "I bet you don't even rip the tags off clothes at Savers","You're dogshit bro", "I'll make you eat my ass","You're trash", "You fucking Belieber",
        "Raccoon looking ass", "You guys listen to that new Tom A", "Flat-ass-havin-ass-bitch","I bet you listened to the last episode of Delivering opinions", "Get that dick out of your mouth you cheeky cunt",
        "Simmer down", "I wouldn't fuck your feet if you begged me to", "You're proof that god is dead", "You aren't the sharpest tool in the shed, are ya?", "Komi-san doesn't like you",
        "Gamers don't stand with you", "You're a fucking cocksucka", "Justin Ratte beat you in a fight", "I can't stand to look at you", "This loser failed No Nut November on day 1",
        "Give your balls a tug ya titfucker", "I'd like to slap the shit out of you"]


        message.channel.send(insults[Math.floor(Math.random()*insults.length)]);
        */