var flexbot = global.flexbot
var bot = flexbot.bot
var emoji = require("node-emoji")
var async = require("async")
var request = require('request').defaults({encoding:null});

flexbot.addCommand("setavatar","Changes bots avatar to a url.",function(msg,args){
	if(flexbot.isOwner(msg)){
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
	msg.channel.createMessage({embed:{
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
	}})
},["guilds"])

var scolors = {
	online:0x42B581,
	idle:0xFAA619,
	dnd:0xF24145,
	offline:0x747F8D
}

flexbot.addCommand("userinfo","Get info about a user",function(msg,args){
	let u;
	if(/[0-9]{17,21}/.test(args)){
		u = msg.guild ? msg.guild.members.get(args.match(/[0-9]{17,21}/g)[0]) : flexbot.bot.users.get(args.match(/[0-9]{17,21}/g)[0]);
	}else{
		u = msg.guild ? msg.member : msg.author
	}
	
	let uroles = [];
	if(msg.guild){
		msg.guild.members.get(u.id).roles.forEach(r=>{
			uroles.push(msg.guild.roles.get(r))
		})
	}
	uroles.sort((a,b)=>{
		if(a.position < b.position){
			return -1;
		}
		if(a.position > b.position){
			return 1;
		}
		return 0;
	});
	
	let roles = [];
	if(msg.guild){
		uroles.forEach(r=>{
			roles.push(r.name)
		})
	}
	
	let col = 0x7289DA;
	if(msg.guild && msg.guild.members.get(u.id).roles.length > 0){
		col = uroles[0].color;
	}
	
	msg.channel.createMessage({embed:{
		color:col,

		author:{
			name:"User Info: "+u.username+"#"+u.discriminator,
			icon_url:"https://twemoji.maxcdn.com/36x36/2139.png"
		},
		//description:"**ID**: "+u.id+"\n**Nick**: "+(u.nick ? u.nick : "")+"\n**Playing**: "+(u.game ? u.game.name : "")+"\n**Roles**: "+roles.join(", ")+"\n\n[Avatar]("+u.avatarURL+")",
		fields:[
				{name:"ID",value:u.id,inline:true},
				{name:"Nickname",value:u.nick ? u.nick : "None",inline:true},
				{name:"Status",value:statusIcons[u.status]+" "+u.status,inline:true},
				{name:"Playing",value:u.game ? u.game.name : "Nothing",inline:true},
				{name:"Roles",value:u.guild ? roles.join(", ") : "Command not used in server.",inline:true},
				{name:"Avatar",value:"[Full Size]("+u.avatarURL+")",inline:true}
			],
		thumbnail:{
			url:u.avatarURL
		}
	}})
},["uinfo","user"])

flexbot.addCommand("serverinfo","Info on current server",function(msg,args){
	if(msg.guild){
		let bots = 0;
		msg.guild.members.forEach(m=>{if(m.bot) ++bots;})
		
		let owner = msg.guild.members.get(msg.guild.ownerID)
		let emojis = [];
		msg.guild.emojis.forEach(e=>{
			emojis.push("<:"+e.name+":"+e.id+">")
		})

		msg.channel.createMessage({embed:{
			color:0x7289DA,

			author:{
				name:"Server Info: "+msg.guild.name,
				icon_url:"https://twemoji.maxcdn.com/36x36/2139.png"
			},
			description:"**Emojis**\n"+emojis.join(","),
			fields:[
				{name:"ID",value:msg.guild.id,inline:true},
				{name:"Owner",value:owner.username+"#"+owner.discriminator,inline:true},
				{name:"Members",value:msg.guild.memberCount,inline:true},
				{name:"Bots",value:bots+" ("+Math.floor((bots/msg.guild.memberCount)*100)+"% of members)",inline:true},
				{name:"Channels",value:msg.guild.channels.size,inline:true},
				{name:"Roles",value:msg.guild.roles.size,inline:true},
				{name:"Emojis",value:msg.guild.emojis.length,inline:true},
				{name:"Icon",value:"[Full Size](https://cdn.discordapp.com/icons/"+msg.guild.id+"/"+msg.guild.icon+".jpg)",inline:true}
			],
			thumbnail:{
				url:"https://cdn.discordapp.com/icons/"+msg.guild.id+"/"+msg.guild.icon+".jpg"
			}
		}})
	}else{
		msg.channel.createMessage("Can't use in PM's")
	}
},["sinfo","ginfo","guildinfo"])

flexbot.addCommand("botinfo","Info on a bot",function(msg,args){
	if(/[0-9]{17,21}/.test(args)){
		let u = args.match(/[0-9]{17,21}/g)[0];
		
		let data;
	
		request.get("https://bots.discord.pw/api/bots/"+u,{headers:{"Authorization":flexbot.dbotsapi}},(err,res,body)=>{
			if(!err && res.statusCode == 200){
				data = JSON.parse(body);
		
		let owners = [];
		for(let i=0;i<data["owner_ids"].length;i++){
			let o = flexbot.bot.users.get(data["owner_ids"][i]);
			owners.push(o.username+"#"+o.discriminator);
		};
		
		let ubot = flexbot.bot.users.get(u);
		
		msg.channel.createMessage({embed:{
			color:0x7289DA,

			author:{
				name:"Bot Info: "+ubot.username+"#"+ubot.discriminator,
				icon_url:"https://twemoji.maxcdn.com/36x36/2139.png"
			},
			description:data.description,
			fields:[
				{name:"ID",value:u,inline:true},
				{name:"Owner(s)",value:owners.join(", "),inline:true},
				{name:"Library",value:data.library,inline:true},
				{name:"Prefix",value:"`"+data.prefix+"`",inline:true},
				{name:"Invite",value:"[Click For Invite]("+data.invite_url+")",inline:true}
			],
			footer:{
				text:"Info provided by Discord Bots API",
				icon_url:"https://cdn.discordapp.com/icons/110373943822540800/5b72add698c1fa9b51d01c43cdba9542.jpg"
			},
			thumbnail:{
				url:ubot.avatarURL
			}
		}})
	}
	});
	}else{
		msg.channel.createMessage("Bot not found, mention or use ID.")
	}
},["binfo"])