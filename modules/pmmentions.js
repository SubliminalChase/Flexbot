var flexbot = global.flexbot
var emoji = require("node-emoji")

flexbot.addCommand("pmmentions","Toggle PMing of mentions",function(msg,args){
	if(!args){
		msg.channel.createMessage("Please specify either `true` or `false`")
	}else{
		if(args == "true" || args == "1"){
			flexbot.sql.query("SELECT pmmentions FROM userdata WHERE userid="+msg.author.id,(e,d)=>{
				if(!e){
					if(!d[0]){
						flexbot.sql.query("INSERT INTO userdata VALUES ("+msg.author.id+",0,0,0)")
						flexbot.sql.query("UPDATE userdata SET pmmentions=1 WHERE userid="+msg.author.id)
					}else{
						flexbot.sql.query("UPDATE userdata SET pmmentions=1 WHERE userid="+msg.author.id)
					}
				}
			})
			msg.channel.createMessage("PM mentions set to `true`")
		}else{
			flexbot.sql.query("SELECT pmmentions FROM userdata WHERE userid="+msg.author.id,(e,d)=>{
				if(!e){
					if(!d[0]){
						flexbot.sql.query("INSERT INTO userdata VALUES ("+msg.author.id+",0,0,0)")
						flexbot.sql.query("UPDATE userdata SET pmmentions=0 WHERE userid="+msg.author.id)
					}else{
						flexbot.sql.query("UPDATE userdata SET pmmentions=0 WHERE userid="+msg.author.id)
					}
				}
			})
			msg.channel.createMessage("PM mentions set to `false`")
		}
	}
})

flexbot.bot.on("messageCreate",(msg)=>{
	if(!msg.author.bot && msg.mentions.length>-1){
		for(i in msg.mentions){
			flexbot.sql.query("SELECT pmmentions FROM userdata WHERE userid="+msg.mentions[i].id,(e,d)=>{
				if(!e){
					if(d[0] && d[0].pmmentions==1){
							flexbot.bot.getDMChannel(msg.mentions[i].id)
						.then((c)=>{
								flexbot.bot.createMessage(c.id,"Mentioned in message in <#"+msg.channel.id+"> ("+msg.guild.name+"):\n**"+msg.author.username+"#"+msg.author.discriminator+"**: "+msg.cleanContent)
						})
					}
				}
			})
		}
	}
})