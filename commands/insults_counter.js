module.exports = {
    name: 'insults_counter',
    description: 'insults you accordingly',
    execute(message, master, tracker){
        const fs = require('fs')
        if(message.author.bot == true){

        }else if (message.content.startsWith("!") == true){

        }else if(master[message.author.id].insulted == true){
            var counter = 0
            for(i in master){
                if(master[i].insulted == true){
                    counter++
                }
            }
            if(counter > 4){
                var chance = 10
            }else{
                var chance = 8
            }
            var chance_check = Math.ceil(Math.random() * chance)
            if(chance_check == 6){
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
                            "Give your balls a tug ya titfucker", "I'd like to slap the shit out of you", "You've got small tits and a flat ass", "You're actually pretty cool.... Sike, you suck", "I find your tastes shallow and pedantic",
                            "Lol. Try again", "Your hair is so yellow", "I've had enough of your tomfoolery", "Its time to put a stop to your malarkey", "Get a load of this guy", "You make Jacob look literate",
                            "I broke up with my ex girl. Here's the number.\nSIKE. Thats the wrong number", "You uncultured swine","Hahaha you stupid fuckin bitch", "You probably still pay for PornHub Premium", "You smell like asparagus pee", 
                            "Have at thee you wretched beast", "Fucking knob", "NEEEEEERRRRRDDDDDD", "You're worse than Ian with airpods", "ur gay lol", "Get a load of this simp","You're pound for pound a worse person than Andrew", 
                            "I'll lick Colin up and down", "Oooooooooohhhh, looks like we got a badass here", "Nice toes, mind if I suck'em", "I hate you as much as Zaid loves slice of life anime",
                            "Say one more thing and I'll come over there and kiss you right on the lips", "Your moves are weak", "Smooth moves exlax", "You're weaker than Andrew's immune system", "Zaid really needs to stop watching so much twitch. Don't you think?",
                            "I'm commin for that ass", "Alex is a fiend for filipino boipussi", "You're so 2000-late", "Derek is a chick", "Nice cock bro", "What are you doing stepbro", "It was not my penis, but my penis hole", "I did not have sexual relations with Derek Mollohans",
                            "Do you kiss your father with that mouth?", "Fucking Alexander", "God dang it Bobby", "I bet you still wear a training bra", "I have been dealing with depression for a while. So I'd like to thank you for your post because its finally given me the courage to kill myself",
                            "Get your ass over here and give me a smooch","1000101101100011011000110","Let me see those porkie piggies", "The thing is I don't care","You definitely still simp OK Boomer Girl",
                            "Don't you think you should quit while you are ahead","You're kinda thicc tho","Girl you're thicker than a bowl of oatmeal","Cause you're a wetard","Not gonna lie, thats kinda gay","UWU what's this *nuzzles you",
                            "You're not even worth my time",'Stop giving me those "Fuck me" eyes','RRRRRRREEEEEEEEEEEE', "The crazy part about that is that I don't care", "Get Nae-Naed","Please stop it Daddy","You're a fucking degenerate", "Look at this loser jerking off to 3D girls",
                            "This game will make you cum in 5 minutes","Me hoy me noy","You're the type of guy to always get picked last in kickball","Lick my butthole","OBAMAGATE","You are somehow managing to be more annoying than Kareem",
                            "You look better with the lights off","Wow that post was shit","The Chinese Fireball, Ooooooohhhh", "Your shoe is untied", "It would make everyone feel better if you just deleted this post","Beep Boop","Alex is better at games than you are at life","For that, you'll walk the plank",
                            "Hey you. Yeah you. Go fuck yourself", "Suck me, and fuck me", "Alright cockgobbler", 'Get your hinga dinga gurgen ass outta here',"I bet it's painful to talk to you in person","You look like a high quality stripper",
                            'Nice shoes, wanna fuck?', "Hey bby, wan sum fuk?", "Show me your bob and vagene", "C'mon. I know you're better than this", "I'm not angry. I'm disappointed",
                            'Wait til my father hears about this', 'сука шлюха', 'Filthy Mudblood', 'Bring my body back. Bring my body back to my father', "He doesn't like. I don't like you either! You just watch yourself! We're wanted men. I have a death sentence on twelve systems",
                            fs.readFileSync('./text_files/copypastas/navyseal.txt','utf-8'), fs.readFileSync('./text_files/copypastas/helicopter.txt','utf-8'), "You chattering hog monkey", "I have information that will lead to Hillary Clinton's arrest",
                            "You ever just shut up", "Take a big step and literally FUCK YOUR OWN FACE", "Patrolling the Mojave almost makes you wish for a nuclear winter", `You should really stop talking ${master[message.author.id].name}`, "Your mother was a hamster and your father smelt of elderberries",
                            "I fart in your general direction", "If I wanted a joke, I'd follow you into the John and watch you take a leak", "I don't give a tuppery fuck about your moral conundrum, you meat-headed shit sack",
                            "You are a sad strange little man, and you have my pity", "I don't like your jerk-off name. I don't like your jerk-off face. I don't like your jerk-off behavior, and I don't like you, jerk-off. Do I make myself clear?",
                            "Nice going Ron", "What the fuck Richard","I can't believe you've done this", `You've sent ${stats_list[message.author.id].total_msgs} messages and they have all been awful`, `Smooth Brain`, `Math sucks and so do you`,
                            "Achievement Unlock: You Suck Ass", "Cockass pee pee sucka"]
                var insult = insults[Math.ceil(Math.random() * insults.length)]
            message.channel.send(insult)
            }
        }
    }
}

