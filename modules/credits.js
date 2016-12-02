var flexbot = global.flexbot
var emoji = require("node-emoji")

flexbot.addCommand("credits","Check your credit balanace",function(msg,args){
	if(!args){
		flexbot.sql.query("SELECT credits FROM userdata WHERE userid="+msg.author.id,(e,d)=>{
			if(!e){
				if(!d[0]){
					flexbot.sql.query("INSERT INTO userdata (userid,credits) VALUES ("+msg.author.id+",0)")
					flexbot.bot.createMessage(msg.channel.id,emoji.get(":credit_card:")+" "+msg.author.mention+", you have 0 credits.")
				}else{	flexbot.bot.createMessage(msg.channel.id,emoji.get(":credit_card:")+" "+msg.author.mention+", you have "+d[0].credits+" credits.")
				}
			}
		})
	}else if(msg.mentions[0]){
		var u = msg.mentions[0]
		var ustr = `**${u.username}#${u.discriminator}**`
		var id = u.id
			
		flexbot.sql.query("SELECT credits FROM userdata WHERE userid="+id,(e,d)=>{
			if(!e){
				if(!d[0]){
					flexbot.sql.query("INSERT INTO userdata (userid,credits) VALUES ("+msg.author.id+",0)")
					msg.channel.createMessage(emoji.get(":credit_card:")+" "+ustr+" has 0 credits.")
				}else{	msg.channel.createMessage(emoji.get(":credit_card:")+" "+ustr+" has "+d[0].credits+" credits.")
				}
			}
		})
	}else{
		msg.channel.createMessage("User not found. Make sure it's a mention.")
	}
});

flexbot.bot.on("messageCreate",(msg)=>{
	if(!msg.author.bot){
		flexbot.sql.query("SELECT credits FROM userdata WHERE userid="+msg.author.id,(e,d)=>{
			if(!e){
				if(!d[0]){
					flexbot.sql.query("INSERT INTO userdata (userid,credits) VALUES ("+msg.author.id+",0)",(e)=>{
			if(e){
			flexbot.bot.createMessage(flexbot.logid,{embed:{
				author:{
					name:"CREDITS PLS (╯°□°）╯︵ ┻━┻",
					icon_url:"http://www.famfamfam.com/lab/icons/silk/icons/error.png"
				},
				color:0xdf0000,
				description:"```\n"+e+"\n```",
				timestamp:new Date()
			}})
			}
		})
					flexbot.sql.query("UPDATE userdata SET credits = credits+1 WHERE userid="+msg.author.id)
				}else{
					flexbot.sql.query("UPDATE userdata SET credits = credits+1 WHERE userid="+msg.author.id)
				}
			}
		})
	}
});