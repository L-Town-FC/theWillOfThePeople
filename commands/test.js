module.exports = {
    name: 'test',
    description: 'new blackjack',
    execute(message, args, master, blackJackHands){
        const general = require('./Functions/GeneralFunctions')
        const MINBET = 15
        const OUTCOMES = {Win: "win", Push: "push", Loss: "loss"}
        args = ['21', '20']
        
        if(args.length < 2){
            message.channel.send("You must specificy a bet amount")
            return
        }

        if(!general.CommandUsageValidator(message, master, args[1], MINBET, master[message.author.id].gbp, general.defaultRecipient)){
            return
        }
        
        if(blackJackHands[message.author.id] == undefined){
            CreateNewGame(message, blackJackHands, message.author.id, args[1], master, OUTCOMES)
            return
        }

        if(blackJackHands[message.author.id].currentMessageID != ""){
            SendGameDisplay(message, blackJackHands, message.author.id, master, OUTCOMES)
            return
        }

        CreateNewGame(message, blackJackHands, message.author.id, args[1], master, OUTCOMES)
        
        /*
        Start

        Player tries to start a game
        1. Player is already playing a game so it brings up embed of current game END
        2. Player isnt already playing a game

        Validate if player can start game
        1. if player bets/bank is invalid for game send explanation END
        2. If players bet/bank situation is valid start game

        Create game for player
        1. add player game to blackJackHands object

        Hands are created for player and dealer. 4 possible outcomes
        Player and Dealer dont have blackjack
            -Play begins
        Player has blackjack/ dealer doesnt
            -Hand Win
        Player doesnt have blackjack/ dealer does
            -Hand Loss
        Both player and dealer have blackjack
            -Hand Push

        Hand start. 5 Possible outcomes
        1. Player Hit
            -add card to players hand
            -only able to hit or stay now
            -if bust go to second hand if player split, else go to hand lost
        2. Player Stay
            -Dealer turn
        3. Player Doubledown
            -player gets 1 card and then stays
            -if bust, hand loss
            -if not dealer turn
        4. Player Split
            -can only be done when player hand is size 2 and hasnt split before
            -add two new cards to hand
        5. Can only be done when hand size is 2 and player hasnt split before
            -go Surrender
            
        Dealer turn. Take card. 3 outcomes.
        1. less than hard 17, take card and check again
        2. more than hard 17 less than 22, stay, go to comparison
        3. more than 21, Hand win

        Compare player and dealer hands and go to appropriate outcome

        4 Final outcomes
        Hand Win
        Hand Loss
        Hand Push
        Surrender

       End
       */
    }
}

function CreateNewGame(message, blackJackHands, userID, bet, master, OUTCOMES){
    AddPlayerToHandsArray(blackJackHands, userID, bet, OUTCOMES)
    CreateHands(blackJackHands, userID)
    SendGameDisplay(message, blackJackHands, userID, master, OUTCOMES)
}

function AddPlayerToHandsArray(blackJackHands, userID, bet, OUTCOMES){
    blackJackHands[userID] = {
        bet: bet,
        currentMessageID: "",
        dealerHand: [],
        dealerDummyHand: [],
        playerHand: [[],[]],
        playerDummyHand:[[],[]],
        playerSplit: false,
        playerStay: [false, false],
        playerBust: [false, false],
        dealerBust:false,
        playerHandOutcome: [OUTCOMES.push, OUTCOMES.push]
    }
}

async function SendGameDisplay(message, blackJackHands, userID, master, OUTCOMES){
    const {ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType} = require('discord.js')
    
    blackJackHands[userID].currentMessageID = message.id
    var maxSessionLengthInSeconds = 10
    var finalResult

    const hitButton = new ButtonBuilder()
    .setLabel('Hit')
    .setStyle(ButtonStyle.Primary)
    .setCustomId('hit')

    const stayButton = new ButtonBuilder()
    .setLabel('Stay')
    .setStyle(ButtonStyle.Success)
    .setCustomId('stay')

    const doubleDownButton = new ButtonBuilder()
    .setLabel('Double Down')
    .setStyle(ButtonStyle.Secondary)
    .setCustomId('doubleDown')

    const splitButton = new ButtonBuilder()
    .setLabel('Split')
    .setStyle(ButtonStyle.Secondary)
    .setCustomId('split')

    const surrenderButton = new ButtonBuilder()
    .setLabel('Surrender')
    .setStyle(ButtonStyle.Danger)
    .setCustomId('surrender')

    const buttonRow = new ActionRowBuilder().addComponents(hitButton, stayButton, doubleDownButton, splitButton, surrenderButton);

    const reply = await message.reply({embeds: [UpdatedEmbedMessage(message, blackJackHands, userID, master)], components: [buttonRow]})

    blackJackHands[userID].currentMessageID = reply.id //makes it so the user can only interact with the most recent game theyve created

    const filter = (i) => i.user.id === message.author.id

    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter,
        time: maxSessionLengthInSeconds * 1000
    })

    collector.on('collect', (interaction) =>{

        if(blackJackHands[userID].currentMessageID != interaction.message.id){
            return
        }

        if(interaction.customId === 'hit'){
            //console.log("hit")
            Hit(blackJackHands, userID, [splitButton, doubleDownButton, surrenderButton])
        }

        if(interaction.customId === 'stay'){
            console.log("stay")
            Stay(blackJackHands, userID, [surrenderButton], [hitButton, stayButton, doubleDownButton, splitButton, surrenderButton])
        }

        
        if(interaction.customId === 'split'){
            console.log("split")
            Split(blackJackHands, userID, [splitButton, surrenderButton])
        }

        
        if(interaction.customId === 'doubleDown'){
            console.log("doubleDown")
            DoubleDown(blackJackHands, userID, interaction)
        }

        
        if(interaction.customId === 'surrender'){
            console.log("surrender")
            Surrender(blackJackHands, userID, interaction)
        }

        if(DealerHandResolved(blackJackHands, userID, OUTCOMES)){
            const gameOverEmbed = GameEnd(blackJackHands, userID, [hitButton, stayButton, doubleDownButton, splitButton, surrenderButton], master, message)
            interaction.update({
                embeds: [gameOverEmbed],
                components: [buttonRow]
            })
            finalResult = gameOverEmbed.valueOf()
            AddPlayerToHandsArray(blackJackHands, userID, 0, OUTCOMES)
            return
        }

        interaction.update({
            embeds: [UpdatedEmbedMessage(reply, blackJackHands, userID, master)],
            components: [buttonRow]
        })
        
    })

    collector.on('end', () => {
        ChangeButtonState([hitButton, stayButton, splitButton, doubleDownButton, surrenderButton], true)

        if(finalResult != undefined){
            //const gameOverEmbed = GameEnd(blackJackHands, userID, [hitButton, stayButton, doubleDownButton, splitButton, surrenderButton], master, message)
            reply.edit({
                embeds: [finalResult],
                components: [buttonRow]
            })
            return
        }

        reply.edit({
            embeds: [UpdatedEmbedMessage(reply, blackJackHands, userID, master)],
            components: [buttonRow]
        })
    })
}

//creates hands for both player and dealer at the same time
function CreateHands(blackJackHands, userID){
    for (var i = 0; i < 2; i++) {
        var temp = AddCard()
        // blackJackHands[userID].playerHand[0].push(temp[0])
        // blackJackHands[userID].playerDummyHand[0].push(temp[1])

        //testing only
        blackJackHands[userID].playerHand[0].push(11)
        blackJackHands[userID].playerDummyHand[0].push('A:diamonds:')
        
        var temp2 = AddCard()
        blackJackHands[userID].dealerHand.push(temp2[0])
        blackJackHands[userID].dealerDummyHand.push(temp2[1])
    }
}

//creates a card to be used in a hand
//if the card is a 10 it is randomzied as a face card
//if the card is an 11 it becomes an ace
//also adds a random suit to each created card
function AddCard(){
    const CARDVALUES = [2,3,4,5,6,7,8,9,10,10,10,10,11]
    const TENS = ['10','J','Q','K']
    const SUITS = [':diamonds:',':hearts:',':spades:',':clubs:']

    var card = ""
    var dummyCard = ""
    card = dummyCard = CARDVALUES[Math.floor(Math.random()*CARDVALUES.length)];
    if(card == 11){
        dummyCard = "A"
    }

    if(card == 10){
        dummyCard = TENS[Math.floor(Math.random() * TENS.length)]
    }
    
    dummyCard += SUITS[Math.floor(Math.random()*SUITS.length)];
    return [card, dummyCard]
}

function Hit(blackJackHands, userID, buttonArray){
    var newCard = AddCard()
    var handIndex = 0

    //determines if player is hitting their first or second hand
    //player can only hit their second hand if they have stayed on their first hand
    if(blackJackHands[userID].playerStay[0]){
        index = 1
    }

    //adds numeric value to 'player hand' and card value plus suit to player dummy hand
    blackJackHands[userID].playerHand[handIndex].push(newCard[0])
    blackJackHands[userID].playerDummyHand[handIndex].push(newCard[1])


    //disables surrender, split, and double down because you arent allowed to do these actions after youve hit
    ChangeButtonState(buttonArray, true)

    //checks if players current active hand is over 21. sets them to bust if they are over
    if(PlayerHandValue(blackJackHands, userID, handIndex) > 21){
        blackJackHands[userID].playerStay[handIndex] = true
        blackJackHands[userID].playerBust[handIndex] = true
    }

}

function Stay(blackJackHands, userID, disableButtonArray,  enableButtonArray){
    if(!blackJackHands[userID].playerStay[0]){
        PlayerHandValue(blackJackHands,userID,0)
        blackJackHands[userID].playerStay[0] = true
        if(blackJackHands[userID].playerSplit){
            //enables all buttons and then disables surrender
            ChangeButtonState(enableButtonArray, false)
            ChangeButtonState(disableButtonArray, true)
            return
        }

        return
    }
    PlayerHandValue(blackJackHands,userID,1)
    blackJackHands[userID].playerStay[1] = true
}

function Split(blackJackHands, userID, disableButtonArray){
    blackJackHands[userID].playerSplit = true

    blackJackHands[userID].playerHand[1][0] = blackJackHands[userID].playerHand[0][1]
    blackJackHands[userID].playerDummyHand[1][0] = blackJackHands[userID].playerDummyHand[0][1]

    for (var i = 0; i < blackJackHands[userID].playerHand.length; i++) {
        var newCard = AddCard()
        blackJackHands[userID].playerHand[i][1] = newCard[0]
        blackJackHands[userID].playerDummyHand[i][1] = newCard[1]
    }
    ChangeButtonState(disableButtonArray, true)
}

//can probably consolidate PlayerHandValue and DealerHandValue easily
function PlayerHandValue(blackJackHands, userID, handIndex){
    var handValue = Sum(blackJackHands[userID].playerHand[handIndex])

    var elevenIndex = blackJackHands[userID].playerHand[handIndex].indexOf(11)

    if(handValue > 21 && elevenIndex != -1){
        blackJackHands[userID].playerHand[handIndex][elevenIndex] = 1
        handValue -= 10
    }

    elevenIndex = blackJackHands[userID].playerHand[handIndex].indexOf(11)

    //need to check a second time in case player is dealth 2 aces and decides to hit
    if(handValue > 21 && elevenIndex != -1){
        blackJackHands[userID].playerHand[handIndex][elevenIndex] = 1
        handValue -= 10
    }

    return handValue
}

function DealerHandValue(blackJackHands, userID){

    var handValue = Sum(blackJackHands[userID].dealerHand)

    var elevenIndex = blackJackHands[userID].dealerHand.indexOf(11)

    if(handValue > 21 && elevenIndex != -1){
        blackJackHands[userID].dealerHand[elevenIndex] = 1
        handValue -= 10
    }

    elevenIndex = blackJackHands[userID].playerHand.indexOf(11)

    //need to check a second time in case player is dealth 2 aces and decides to hit
    if(handValue > 21 && elevenIndex != -1){
        blackJackHands[userID].dealerHand[elevenIndex] = 1
        handValue -= 10
    }

    return handValue
}

function DealerHandResolved(blackJackHands, userID, OUTCOMES){
    if(!blackJackHands[userID].playerSplit){
        //player hasnt split and their only hand has busted. game over, no need to draw
        if(blackJackHands[userID].playerBust[0]){
            blackJackHands[userID].playerHandOutcome[0] = OUTCOMES.Loss
            return true
        }

        //if player stayed on second hand. add cards until hard 17
        if(blackJackHands[userID].playerStay[0]){
            
            if(ResolveDealerTurn(blackJackHands, userID)){
                blackJackHands[userID].playerHandOutcome[0] = OUTCOMES.Win
                return true
            }

            if(HandComparer(Sum(blackJackHands[userID].playerHand[0]), Sum(blackJackHands[userID].dealerHand)) == 1){
                blackJackHands[userID].playerHandOutcome[0] = OUTCOMES.Win
                return true
            }

            if(HandComparer(Sum(blackJackHands[userID].playerHand[0]), Sum(blackJackHands[userID].dealerHand)) == 0){
                blackJackHands[userID].playerHandOutcome[0] = OUTCOMES.Push
                return true
            }

            blackJackHands[userID].playerHandOutcome[0] = OUTCOMES.Loss

            return true
        }
    }

    //player has split. Only need to check status of second hand since it can only be reached after first hand has been resolved. if second has has busted.
    //need to check if first hand also busted to determine if dealer hand needs to be resolved
    if(blackJackHands[userID].playerBust[1]){
        blackJackHands[userID].playerHandOutcome[1] = OUTCOMES.Loss
        return true
    }

    //if player stayed on second hand. add cards until hard 17
    if(blackJackHands[userID].playerStay[1]){
        if(ResolveDealerTurn(blackJackHands, userID)){
            blackJackHands[userID].playerHandOutcome[1] = OUTCOMES.Win
            return true
        }

        if(HandComparer(Sum(blackJackHands[userID].playerHand[1]), Sum(blackJackHands[userID].dealerHand)) == 0){
            blackJackHands[userID].playerHandOutcome[1] = OUTCOMES.Push
        }

        blackJackHands[userID].playerHandOutcome[1] = OUTCOMES.Loss

        return true
    }

    return false
}

function ResolveDealerTurn(blackJackHands, userID){
    while(DealerHandValue(blackJackHands, userID) < 17){
        var newCard = AddCard()

        blackJackHands[userID].dealerHand.push(newCard[0])
        blackJackHands[userID].dealerDummyHand.push(newCard[1])

        DealerHandValue(blackJackHands, userID)
    }

    if(Sum(blackJackHands[userID].dealerHand) > 21){
        blackJackHands[userID].dealerBust = true
    }

    return blackJackHands[userID].dealerBust
}

function GameEnd(blackJackHands, userID, buttonArray, master, message){
    const embed = require('./Functions/embed_functions')
    var title = `${master[userID].name} Game Outcome`
    var description = ""
    for (var i = 0; i < blackJackHands[userID].dealerDummyHand.length; i++) {
        description += `${blackJackHands[userID].dealerDummyHand[i] }`
    }
    var fields = []

    for (var i = 0; i < blackJackHands[userID].playerHand.length; i++) {
        if(blackJackHands[userID].playerHand[i].length != 0){
            fields[i] = {name: `${master[userID].name} Hand 1`, value: `${blackJackHands[userID].playerDummyHand[0]} ${blackJackHands[userID].playerDummyHand[1]}`} 
        }        
    }

    var outcomeArray = []
    outcomeArray[0] = `Hand 1: ${blackJackHands[userID].playerHandOutcome[0]}`
    if(blackJackHands[userID].playerSplit){
        outcomeArray[1] = `Hand 2: ${blackJackHands[userID].playerHandOutcome[1]}`
    }

    fields[fields.length] = {name: 'Outcomes',value: outcomeArray}
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    ChangeButtonState(buttonArray, true)
    return embedMessage
}

function ChangeButtonState(buttonArray, isDisabled){
    for (var i = 0; i < buttonArray.length; i++) {
       buttonArray[i].setDisabled(isDisabled)
    }
}

function UpdatedEmbedMessage(message, blackJackHands, userID, master){
    const embed = require('./Functions/embed_functions')

    var title = `${master[userID].name} Game Status`
    var description = `${blackJackHands[userID].dealerDummyHand[0]} ${blackJackHands[userID].dealerDummyHand[1]}`

    var temp = blackJackHands[userID].playerDummyHand
    if(temp.length == 1){
        temp = blackJackHands[userID].playerDummyHand[0]
    }
    var fields = {name: "Player Hand", value: temp}
    return embed.EmbedCreator(message, title, description, fields)
}

function Sum(array){
    var sum = 0
    for (var i = 0; i < array.length; i++) {
        sum += array[i]
    }

    return sum
}

function HandComparer(playerHand, dealerHand){
    return Math.sign(playerHand - dealerHand)
}