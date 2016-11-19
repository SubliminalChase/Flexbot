var flexbot = global.flexbot
var bot = flexbot.bot
var emoji = require("node-emoji")
var async = require("async")

flexbot.addCommand("setavatar","Changes bots avatar to a url.",function(msg,args){
	if(flexbot.isOwner(msg)){
		var request = require('request').defaults({encoding:null});
		if(args.length>0){
			request.get(args,function(e,res,body){
				if(!e && res.statusCode == 200){
					let data = "data:"+res.headers["content-type"]+";base64,"+new Buffer(body).toString("base64");
					var set = flexbot.bot.editSelf({avatar:data})
					set.then(()=>{
						msg.channel.createMessage(emoji.get(":white_check_mark:")+" Avatar set.")
					})
				}
			})
		}else{
			msg.channel.createMessage("No URL given.")
		}
	}else{
		msg.channel.createMessage(emoji.get(":no_entry_sign:")+" No permission.")
	}
})

var statusIcons = {
	online:"<:vpOnline:212789758110334977>",
	idle:"<:vpAway:212789859071426561>",
	dnd:"<:vpDnD:236744731088912384>",
	offline:"<:vpOffline:212790005943369728>"
}

flexbot.addCommand("mods","Moderator list",function(msg,args){
	if(!args){
		var res = "Moderators for **"+msg.guild.name+"**:"
		
		var a = {
			online:"",
			idle:"",
			dnd:"",
			offline:""
		}

		msg.guild.members.forEach((u)=>{
			if(msg.channel.permissionsOf(u.id).has("kickMembers") && !u.bot){
				a[u.status]+="\n"+statusIcons[u.status]+ u.username+"#"+u.discriminator
			}
		})
		
		for(s in a){
			res+=a[s]
		}
		msg.channel.createMessage(res)
	}else if(args == "online" || args == "o"){
		var res = "Online moderators for **"+msg.guild.name+"**:"

		msg.guild.members.forEach((u)=>{
			if(msg.channel.permissionsOf(u.id).has("kickMembers") && !u.bot && u.status != "offline"){
				res+="\n"+statusIcons[u.status]+ u.username+"#"+u.discriminator
			}
		})
		msg.channel.createMessage(res)
	}
})

flexbot.addCommand("purge","Purge/clean x messages from a channel",function(msg,args){
	if(msg.channel.permissionsOf(msg.author.id).has("administrator")||flexbot.isOwner(msg)){
	if(msg.channel.permissionsOf(flexbot.bot.user.id).has("administrator")){
			if(args && parseInt(args) > 0){
				flexbot.bot.purgeChannel(msg.channel.id,parseInt(args))
				msg.channel.createMessage("Successfully cleared "+args+" messages.")
				.then((m)=>{
					setTimeout(()=>{
						flexbot.bot.deleteMessage(m.id)
					},2500)
				})
			}else{
					msg.channel.createMessage("Amount not specified or lower than 1.")
			}
		}else{
			msg.channel.createMessage("I do not have Administrator permission.")
		}
	}else{
		msg.channel.createMessage(emoji.get(":no_entry_sign:")+" Lacking permissions, need Administrator.")
	}
},["prune"])

flexbot.addCommand("uptime","Contest of \"how long can we go without a restart\"",function(msg,args){
	var uptime = flexbot.bot.uptime
	var s = uptime/1000
	var h = parseInt(s/3600)
	s=s%3600
	var m = parseInt(s/60)
	s=s%60
	s=parseInt(s)
	
	var tstr = (h < 10 ? "0"+h : h)+":"+(m < 10 ? "0"+m : m)+":"+(s < 10 ? "0"+s : s)
	msg.channel.createMessage(emoji.get(":clock3:")+"**Uptime**: "+tstr)
})

flexbot.addCommand("emoji","Get an image of an emoji/custom emote.",function(msg,args){
	var request = require('request').defaults({encoding:null});
	if(args.match(/\d+/)){
		var eid = args.match(/\d+/)
		var ecode = args.replace("<","\\<").replace(">","\\>")
		request.get("https://cdn.discordapp.com/emojis/"+eid+".png",function(e,res,body){
			if(!e && res.statusCode == 200){
				msg.channel.createMessage("Emote code: "+ecode,{name:"emoji.png",file:new Buffer(body)})
			}
		})
	}else if(args){
		if(emoji.which(args)){
		var s2p = require("svg2png")
		var twemoji = require("twemoji")
		let a = args.split(",")
		let size = a[1] ? parseInt(a[1]) : 1024;
		let ehex = twemoji.convert.toCodePoint(a[0])
		let baseurl = "https://raw.githubusercontent.com/twitter/twemoji/gh-pages/svg/"
		
		request.get(baseurl+ehex+".svg",function(e,res,body){
			if(!e && res.statusCode == 200){
				s2p(new Buffer(body),{width:size,height:size})
				.then((b)=>{
					msg.channel.createMessage("Emoji Hex: "+ehex+"\nEmoji code: "+emoji.which(args).replace("_","\\_"),{name:"emoji.png",file:b})
				})
			}
		})
		}else{
			msg.channel.createMessage("Emoji not found.")
		}
	}
},["emote","e"])

flexbot.addCommand("transfer","Send credits to people.",function(msg,args){
	if(!args){
		msg.channel.createMessage("No arguments given.")
	}else if(/\D/.test(args)){
		let a = args.split(",")
		let u = flexbot.bot.users.get(a[0].replace(/\D/g,""))
		let amt = a[1]
		if(!amt){
			msg.channel.createMessage("Missing amount.")
		}else{
			if(u.bot){
				msg.channel.createMessage("Bots cannot use credits.")
			}else if(u.id == msg.author.id){
				msg.channel.createMessage("It's useless to send money to yourself.")
			}else{
				let hasFunds;
	flexbot.sql.query("SELECT credits FROM userdata WHERE userid="+msg.author.id,(e,d)=>{
		if(!e){
			if(!d[0]){
				flexbot.sql.query("INSERT INTO userdata VALUES ("+msg.author.id+",0,0,0)")	
				hasFunds = false;
			}else{
				hasFunds = d[0].credits >= parseInt(amt);
			}
		}
	})
		setTimeout(()=>{
			if(hasFunds == true){
				let pin = Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10);

				flexbot.awaitForMessage(msg,"You're about to send **"+parseInt(amt)+" credits** to **"+u.username+"#"+u.discriminator+"**.\n\nTo confirm, please type `"+pin+"` or `cancel` to cancel.")
				.then(m=>{
					if(m.content==pin){
						let res = msg.channel.createMessage("Sending money...")
						flexbot.bot.getDMChannel(u.id)
		.then((c)=>{
			c.createMessage("**"+msg.author.username+"#"+msg.author.discriminator+"** has transfered you **"+amt+" credits**.")
			
		})
		flexbot.sql.query("SELECT credits FROM userdata WHERE userid="+u.id,(e,d)=>{
			if(!e){
				if(!d[0]){
					flexbot.sql.query("INSERT INTO userdata VALUES ("+u.id+",0,0,0)")
					flexbot.sql.query("UPDATE userdata SET credits = credits+"+parseInt(amt)+" WHERE userid="+msg.author.id)
					flexbot.sql.query("UPDATE userdata SET credits = credits-"+parseInt(amt)+" WHERE userid="+msg.author.id)
				}else{
					flexbot.sql.query("UPDATE userdata SET credits = credits+"+parseInt(amt)+" WHERE userid="+u.id)
					flexbot.sql.query("UPDATE userdata SET credits = credits-"+parseInt(amt)+" WHERE userid="+msg.author.id)
				}
			}
			res.then(m=>flexbot.bot.editMessage(msg.channel.id,m.id,"Money sent!\n```diff\n+ "+u.username+"#"+u.discriminator+": +"+parseInt(amt)+" credits\n- "+msg.author.username+"#"+msg.author.discriminator+": -"+parseInt(amt)+" credits\n```"))
		})
					}else{
						msg.channel.createMessage("Canceled transaction.")
					}
				})
			}else{
				msg.channel.createMessage("Insufficient funds.")
			}
			},2000)
			}
		}
	}else{
		msg.channel.createMessage("User not found. Make sure to use mentions.")
	}
})

flexbot.addCommand("servers","A pagenated server list",function(msg,args){
	let servers = []
	flexbot.bot.guilds.forEach(s=>{
		servers.push(s)
	})
	servers.sort((a,b)=>{
		if(a.memberCount>b.memberCount) return -1;
		if(a.memberCount<b.memberCount) return 1;
		if(a.memberCount==b.memberCount) return 0;
	})

	let index = 1
	if(args) index=parseInt(args);
	let list = ""
	let page = servers.slice((index-1)*10,(index*10))
	for(i=0;i<page.length;i++){
		let bots = 0;
		let s = page[i]
		s.members.forEach(m=>{if(m.bot) ++bots;})
		list+=((i+1)+((index-1)*10))+". **"+s.name+"**\n\t"+s.memberCount+" members | "+bots+" bots ("+Math.floor((bots/s.memberCount)*100)+"%)\n"
	}
	msg.channel.createMessage("",{},{
		color:0x7289DA,

		author:{
			name:"FlexBot Server List - Page "+index,
			icon_url:"https://twemoji.maxcdn.com/36x36/1f4d1.png"
		},
		footer:{
			text:"Total servers: "+flexbot.bot.guilds.size,
			icon_url:"https://twemoji.maxcdn.com/36x36/1f522.png"
		},
		description:list
	})
	
	//"```markdown\n# FlexBot Server List - Page "+(index)+"\n"+list+"# Total servers: "+flexbot.bot.guilds.size+"\n```"
},["guilds"])

var scolors = {
	online:0x42B581,
	idle:0xFAA619,
	dnd:0xF24145,
	offline:0x747F8D
}

flexbot.addCommand("userinfo","Get info about a user",function(msg,args){
	let u;
	if(/\D/.test(args)){
		u = msg.guild ? msg.guild.members.get(args.replace(/\D/g,"")) : flexbot.bot.users.get(args.replace(/\D/g,""));
	}else{
		u = msg.guild ? msg.member : msg.author
	}
	
	let roles = [];
	if(msg.guild){
		msg.guild.members.get(u.id).roles.forEach(r=>{
			roles.push(msg.guild.roles.get(r).name)
		})
	}
	
	msg.channel.createMessage("",{},{
		color:scolors[u.status],

		author:{
			name:u.username+"#"+u.discriminator,
			icon_url:u.avatarURL
		},
		description:"**ID**: "+u.id+"\n**Nick**: "+(u.nick ? u.nick : "")+"\n**Playing**: "+(u.game ? u.game.name : "")+"\n**Roles**: "+roles.join(", ")+"\n[Avatar]("+u.avatarURL+")"
	})
},["uinfo","user"])

flexbot.addCommand("serverinfo","Info on current server",function(msg,args){
	if(msg.guild){
		let bots = 0;
		msg.guild.members.forEach(m=>{if(m.bot) ++bots;})
		
		let owner = msg.guild.members.get(msg.guild.ownerID)

		msg.channel.createMessage("",{},{
			color:0x7289DA,

			author:{
				name:msg.guild.name,
				icon_url:"https://cdn.discordapp.com/icons/"+msg.guild.id+"/"+msg.guild.icon+".jpg"
			},
			description:"**ID**: "+msg.guild.id+"\n**Owner**: "+owner.username+"#"+owner.discriminator+"\n**Members**: "+msg.guild.memberCount+"\n**Bots**: "+bots+"\n\t"+Math.floor((bots/msg.guild.memberCount)*100)+"% of members\n**Channels**: "+msg.guild.channels.size+"\n**Roles**: "+msg.guild.roles.size+"\n**Emojis**: "+msg.guild.emojis.length+"\n[Icon](https://cdn.discordapp.com/icons/"+msg.guild.id+"/"+msg.guild.icon+".jpg)"
		})
	}else{
		msg.channel.createMessage("Can't use in PM's")
	}
},["sinfo","ginfo","guildinfo"])