var flexbot = global.flexbot
var emoji = require("node-emoji")

flexbot.addCommand("echo","Echo, echo, echo",function(msg,args){
	msg.channel.createMessage("\u200b"+args)
},["say"],"[string]")

flexbot.addCommand("status","Sets bots status",function(msg,args){
	flexbot.bot.editStatus("online",{name:args})
	msg.channel.createMessage("Set status.")
},[],"[string]")

flexbot.addCommand("avatar","Get an avatar of someone",async function(msg,args){
	var request = require('request').defaults({encoding:null});
		let u;
		if(/[0-9]{17,21}/.test(args)){
			u = (await flexbot.bot.requestHandler.request("GET","/users/"+args.match(/[0-9]{17,21}/)[0],true))
		}else{
			u = msg.author
		}
		request.get("https://cdn.discordapp.com/avatars/"+u.id+"/"+u.avatar+".jpg",function(e,res,body){
			if(!e && res.statusCode == 200){
				msg.channel.createMessage(`Avatar for **${u.username}#${u.discriminator}**:`,{name:"avatar.png",file:new Buffer(body)})
			}
		})
},[],"[user]")

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
		description:"**Language**: Javascript\n**Library**: Eris\n\n[GitHub](https://github.com/LUModder/FlexBot) | [Invite](https://discordapp.com/oauth2/authorize?client_id=173441062243663872&scope=bot&permissions=0) | [Server](https://discord.gg/ZcXh4ek)"
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
	msg.channel.createMessage("Invite me with this link: https://discordapp.com/oauth2/authorize?client_id=173441062243663872&scope=bot&permissions=0")
})

flexbot.addCommand("calc","Do maths",function(msg,args){
	let math = require("mathjs");
	msg.channel.createMessage("Result: "+math.eval(args));
},["math"],"[math stuffs]")

flexbot.addCommand("ship","Ship two users.",function(msg,args){
	let a = args.split(",")
	if(/[0-9]{17,21}/.test(a[0]) && !a[1]){
		let u = flexbot.bot.users.get(args.match(/[0-9]{17,21}/g)[0])
		msg.channel.createMessage(emoji.get(":heart:")+" **"+msg.author.username+"** ships themself with **"+u.username+"** ("+(Math.floor(Math.random()*100)+1)+"% compatibility)")
	}else if(/[0-9]{17,21}/.test(a[0]) && /[0-9]{17,21}/.test(a[1])){
		let u1 = flexbot.bot.users.get(args.match(/[0-9]{17,21}/g)[0])
		let u2 = flexbot.bot.users.get(args.match(/[0-9]{17,21}/g)[1])
		
		msg.channel.createMessage(emoji.get(":heart:")+" **"+msg.author.username+"** ships **"+u1.username+"** with **"+u2.username+"** ("+(Math.floor(Math.random()*100)+1)+"% compatibility)")
	}else{
		msg.channel.createMessage("User not found.")
	}
},[],"[user1],<user2>")

flexbot.addCommand("cat","The typical picture of a cat command",function(msg,args){
	let request = require("request");
	request.get("http://random.cat/meow",function(e,res,body){
		let img = JSON.parse(body).file;
		msg.channel.createMessage({
			content:"meow, have a cat",
			embed:{
				color:Math.floor(Math.random()*16777216),
				image:{
					url:img
				},
				footer:{
					text:"Image provided by random.cat"
				}
			}
		});
	});
})

flexbot.addCommand("dog","The typical picture of a dog command",function(msg,args){
	let request = require("request");
	request.get("http://random.dog/woof",function(e,res,body){
		if(!e && res.statusCode == 200){
			let img = "http://random.dog/"+body;
			msg.channel.createMessage({
				content:"borf, have a mutt",
				embed:{
					color:Math.floor(Math.random()*16777216),
					image:{
						url:img
					},
					footer:{
						text:"Image provided by random.dog"
					}
				}
			});
		}else{
			msg.channel.createMessage("An error occured, try again later.\n\n```\n"+e+"```")
		}
	});
})