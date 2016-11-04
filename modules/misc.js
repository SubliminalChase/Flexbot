var flexbot = global.flexbot
var emoji = require("node-emoji")

flexbot.addCommand("hammer",emoji.get(":hammer:"),function(msg,args){
	msg.channel.createMessage(emoji.get(":hammer:")+" Get hammered! http://"+emoji.get(":hammer:")+".gq/")
})

flexbot.addCommand("echo","Echo, echo, echo",function(msg,args){
	msg.channel.createMessage("\u202f"+args)
})

flexbot.addCommand("status","Sets bots status",function(msg,args){
	flexbot.bot.editStatus("online",{name:args})
	msg.channel.createMessage("Set status.")
})

flexbot.addCommand("avatar","Get an avatar of someone",function(msg,args){
	var request = require('request').defaults({encoding:null});
	if(msg.mentions[0]){
		var u = msg.mentions[0]
		request.get(u.avatarURL,function(e,res,body){
			if(!e && res.statusCode == 200){
				msg.channel.createMessage(`Avatar for **${u.username}#${u.discriminator}**:`,{name:"avatar.png",file:new Buffer(body)})
			}
		})
	}else{
		var u = msg.author
		request.get(u.avatarURL,function(e,res,body){
			if(!e && res.statusCode == 200){
				msg.channel.createMessage(`Avatar for **${u.username}#${u.discriminator}**:`,{name:"avatar.png",file:new Buffer(body)})
			}
		})
	}
})

flexbot.addCommand("roll","Roll dice",function(msg,args){
	msg.channel.createMessage("Rolling...")
	.then((m)=>{
		var w = "\u2B1C"
		var b = "\uD83D\uDD33"

		var dice = [w+w+w+"\n"+w+b+w+"\n"+w+w+w, b+w+w+"\n"+w+w+w+"\n"+w+w+b, b+w+w+"\n"+w+b+w+"\n"+w+w+b, b+w+b+"\n"+w+w+w+"\n"+b+w+b, b+w+b+"\n"+w+b+w+"\n"+b+w+b, b+w+b+"\n"+b+w+b+"\n"+b+w+b]
		
		var rng = Math.floor(Math.random()*(dice.length))
		
		setTimeout(()=>{
			flexbot.bot.editMessage(msg.channel.id,m.id,"You rolled: "+(rng+1)+"\n"+dice[rng])
		},2500)
	})
})