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
		if(/\D/.test(args)){
			u = flexbot.bot.users.get(args.replace(/\D/g,""))
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

var semoji = [
	":cherries:",
	":spades:",
	":lemon:",
	":diamonds:",
	":seven:",
	":clubs:",
	":apple:",
	":eyes:",
	":hearts:",
	":money_with_wings:"
]

flexbot.addCommand("slots","A place to spend your credits.",function(msg,args){
	args = args ? args : "10"
	if(parseInt(args) < 10){
		msg.channel.createMessage("You can only bet above 10 credits.")
	}else{
	flexbot.sql.query("SELECT credits FROM userdata WHERE userid="+msg.author.id,(e,d)=>{
		if(!e){
			if(!d[0]){
				flexbot.sql.query("INSERT INTO userdata VALUES ("+msg.author.id+",0,0,0)")	
				msg.channel.createMessage("You don't have enough credits.")
			}else{
				if(d[0].credits >= parseInt(args)){
					flexbot.sql.query("UPDATE userdata SET credits = credits-"+args+" WHERE userid="+msg.author.id)
					var res = ":regional_indicator_s:\u200b:regional_indicator_l::regional_indicator_o::regional_indicator_t::regional_indicator_s:\n:black_large_square::white_large_square::black_large_square::white_large_square::black_large_square:"
					
					var s = [
						[],
						[],
						[]
					]
					for(i=0;i<3;i++){
						var rnd = Math.floor(Math.random()*semoji.length)
						s[i] = []
						s[i][0] = rnd==0 ? semoji[semoji.length-1] : semoji[rnd-1]
						s[i][1] = semoji[rnd]
						s[i][2] = rnd==semoji.length-1 ? semoji[0] : semoji[rnd+1]
					}		
					res+="\n:white_large_square:"+s[0][0]+s[1][0]+s[2][0]+":white_large_square:"
					res+="\n:arrow_forward:"+s[0][1]+s[1][1]+s[2][1]+":arrow_backward:"
					res+="\n:white_large_square:"+s[0][2]+s[1][2]+s[2][2]+":white_large_square:"
					res+="\n:black_large_square::white_large_square::black_large_square::white_large_square::black_large_square:"
					res=res.replace("\ufe0f","")
				if(s[0][1] == s[1][1] == s[2][1]){
					if(s[0][1] == semoji[4]){
						res+="\n\nYou have won: "+(500*parseInt(args))
						flexbot.sql.query("UPDATE userdata SET credits = credits+"+(500*parseInt(args))+" WHERE userid="+msg.author.id)
					}else if(s[0][1] == semoji[7]){
						res+="\n\nYou have won: "+(1000*parseInt(args))
						flexbot.sql.query("UPDATE userdata SET credits = credits+"+(1000*parseInt(args))+" WHERE userid="+msg.author.id)
					}else if(s[0][1] == semoji[9]){
						res+="\n\nJackpot! You have won: "+(100000*parseInt(args))
						flexbot.sql.query("UPDATE userdata SET credits = credits+"+(100000*parseInt(args))+" WHERE userid="+msg.author.id)
					}else{
						res+="\n\nYou have won: "+(100*parseInt(args))
						flexbot.sql.query("UPDATE userdata SET credits = credits+"+(100*parseInt(args))+" WHERE userid="+msg.author.id)
					}
				}else{
					res+="\n\nSorry, you won nothing."
				}
					msg.channel.createMessage(emoji.emojify(res))
				}else{
					msg.channel.createMessage("You don't have enough credits.")
				}
			}
		}
	})
	}
})

flexbot.addCommand("info","It's like a business card in a message",function(msg,args){
	msg.channel.createMessage("",{},{
		color:0xEB0763,
		title:"FlexBot v8",
		url:"https://flexbox.xyz/flexbot",
		author:{
			name:"A bot written by Flex#5917",
			icon_url:"https://flexbox.xyz/assets/img/Avatar9.png"
		},
		description:"**Language**: Javascript\n**Library**: Eris\n\n[GitHub](https://github.com/LUModder/FlexBot) | [Invite](https://flexbox.xyz/flexbot/invite) | [Server](https://flexbox.xyz/discord)"
	})
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

	msg.channel.createMessage("",{},{
		color:0x009682,
		author:{
			name:"FlexBot Stats",
			icon_url:flexbot.bot.user.avatarURL
		},
		description:"**Servers**: "+flexbot.bot.guilds.size+"\n**Users Seen**: "+flexbot.bot.users.size+"\n**Commands**: "+cmdcount+"\n**Uptime**: "+tstr
	})
})