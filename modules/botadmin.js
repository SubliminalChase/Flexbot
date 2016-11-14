var flexbot = global.flexbot
var emoji = require("node-emoji")

flexbot.addCommand("suggestion","Leave a suggestion",function(msg,args){
	msg.channel.createMessage("Suggestion submitted. A reply back will be left depending on the status of the suggestion.")
	flexbot.bot.createMessage("240844206262845441","<:Thonkang:224495947051171840> Suggestion:\n**"+msg.author.username+"#"+msg.author.discriminator+"**: "+args)
},["suggest","idea"])

flexbot.addCommand("complaint","Leave a complaint",function(msg,args){
	msg.channel.createMessage("Left complaint.")
	flexbot.bot.createMessage("240844206262845441",emoji.get(":warning:")+" Complaint:\n**"+msg.author.username+"#"+msg.author.discriminator+"**: "+args)
},["complain"])