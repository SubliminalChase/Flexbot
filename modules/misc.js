var flexbot = global.flexbot
var emoji = require("node-emoji")

flexbot.addCommand("echo","Echo, echo, echo",function(msg,args){
	msg.channel.createMessage("\u200b"+args)
},["say"])

flexbot.addCommand("status","Sets bots status",function(msg,args){
	flexbot.bot.editStatus("online",{name:args})
	msg.channel.createMessage("Set status.")
})

flexbot.addCommand("avatar","Get an avatar of someone",function(msg,args){
	var request = require('request').defaults({encoding:null});
		let u;
		if(/[0-9]{17,21}/.test(args)){
			u = flexbot.bot.users.get(args.match(/[0-9]{17,21}/g)[0])
		}else{
			u = msg.author
		}
		request.get(u.avatarURL,function(e,res,body){
			if(!e && res.statusCode == 200){
				msg.channel.createMessage(`Avatar for **${u.username}#${u.discriminator}**:`,{name:"avatar.png",file:new Buffer(body)})
			}
		})
})

flexbot.addCommand("roll","Roll dice",function(msg,args){
	msg.channel.createMessage("Rolling...")
	.then((m)=>{
		var w = "\u2B1C"
		var b = "\uD83D\uDD33"

		var dice = [
			w+w+w+"\n"+w+b+w+"\n"+w+w+w,
			b+w+w+"\n"+w+w+w+"\n"+w+w+b, 
			b+w+w+"\n"+w+b+w+"\n"+w+w+b, 
			b+w+b+"\n"+w+w+w+"\n"+b+w+b, 
			b+w+b+"\n"+w+b+w+"\n"+b+w+b, 
			b+w+b+"\n"+b+w+b+"\n"+b+w+b
		]
		
		var rng = Math.floor(Math.random()*(dice.length))
		
		setTimeout(()=>{
			flexbot.bot.editMessage(msg.channel.id,m.id,"You rolled: "+(rng+1)+"\n"+dice[rng])
		},2500)
	})
},["dice"])

flexbot.addCommand("info","It's like a business card in a message",function(msg,args){
	msg.channel.createMessage({embed:{
		color:0xEB0763,
		title:"FlexBot v8",
		url:"https://flexbox.xyz/flexbot",
		author:{
			name:"A bot written by Flex#5917",
			icon_url:"https://flexbox.xyz/assets/img/Avatar9.png"
		},
		description:"**Language**: Javascript\n**Library**: Eris\n\n[GitHub](https://github.com/LUModder/FlexBot) | [Invite](https://flexbox.xyz/flexbot/invite) | [Server](https://flexbox.xyz/discord)"
	}})
},["about"])

flexbot.addCommand("stats","Oooh, numbers",function(msg,args){
	let uptime = flexbot.bot.uptime
	let s = uptime/1000
	let h = parseInt(s/3600)
	s=s%3600
	let m = parseInt(s/60)
	s=s%60
	s=parseInt(s)
	
	let tstr = (h < 10 ? "0"+h : h)+":"+(m < 10 ? "0"+m : m)+":"+(s < 10 ? "0"+s : s)
	
	let cmdcount = 0
	for(c in flexbot.cmds){cmdcount++}

	msg.channel.createMessage({embed:{
		color:0x009682,
		author:{
			name:"FlexBot Stats",
			icon_url:flexbot.bot.user.avatarURL
		},
		description:"**Servers**: "+flexbot.bot.guilds.size+"\n**Users Seen**: "+flexbot.bot.users.size+"\n**Commands**: "+cmdcount+"\n**Uptime**: "+tstr
	}})
})

flexbot.addCommand("invite","Invite FlexBot to your server!",function(msg,args){
	msg.channel.createMessage({embed:{
		color:0xEB0763,
		author:{
			name:"Thank You!",
			icon_url:"https://twemoji.maxcdn.com/36x36/1f49a.png"
		},
		description:"Thank you for being interested in me and I hope you enjoy using me!\n\n(Please note, if you're planning to invite me to a bot collection server, I will leave)\n\n[Invite Link](https://flexbox.xyz/flexbot)"
	}})
})

flexbot.addCommand("calc","Do maths",function(msg,args){
	let math = require("mathjs");
	msg.channel.createMessage("Result: "+math.eval(args));
},["math"])