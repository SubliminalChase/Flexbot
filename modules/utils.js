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
	if(/\d+/.test(args)){
		let eid = args.match(/\d+/g)[0]
		let ecode = args.replace("<","\\<").replace(">","\\>")

		msg.channel.createMessage({embed:{
			title:args.replace("<","").replace(">","").replace(eid,""),
			color:0x7289DA,
			fields:[
				{name:"ID",value:""+eid,inline:true},
				{name:"Code",value:ecode,inline:true},
				{name:"Image",value:"[Full Size](https://cdn.discordapp.com/emojis/"+eid+".png)"}
			],
			thumbnail:{
				url:"https://cdn.discordapp.com/emojis/"+eid+".png"
			}
		}})
	}else if(args){
		if(emoji.which(args)){
			let twemoji = require("twemoji")
			let ehex = twemoji.convert.toCodePoint(args)
			let baseurl = "https://raw.githubusercontent.com/twitter/twemoji/gh-pages"

			msg.channel.createMessage({embed:{
				title:emoji.which(args),
				fields:[
					{name:"Hex Code",value:ehex},
					{name:"Image",value:"[SVG]("+baseurl+"/svg/"+ehex+".svg) | [36x36]("+baseurl+"/36x36/"+ehex+".png) | [72x72]("+baseurl+"/72x72/"+ehex+".png)"}
				],
				thumbnail:{
					url:baseurl+"/72x72/"+ehex+".png"
				}
			}})
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
	flexbot.lookupUser(msg,args ? args : msg.author.mention)
	.then(u=>{
		let uroles = [];
		if(msg.guild && msg.guild.members.get(u.id)){
			u = msg.guild.members.get(u.id);
			msg.guild.members.get(u.id).roles.forEach(r=>{
				uroles.push(msg.guild.roles.get(r))
			})
		}
		uroles.sort((a,b)=>{
			if(a.position < b.position){
				return 1;
			}
			if(a.position > b.position){
				return -1;
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
		if(msg.guild && msg.guild.members.get(u.id) && msg.guild.members.get(u.id).roles.length > 0){
			col = uroles[0].color ? uroles[0].color : (uroles[1].color ? uroles[1].color : 0x7289DA);
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
					{name:"Roles",value:u.guild ? (roles.length > 0 ? roles.join(", ") : "No roles") : "No roles",inline:true},
					{name:"Avatar",value:"[Full Size]("+u.avatarURL+")",inline:true}
				],
			thumbnail:{
				url:u.avatarURL
			}
		}})
	});
},["uinfo","user"])

flexbot.addCommand("serverinfo","Info on current server",async function(msg,args){
	let g = msg.guild;
	let a = "";
	if(args){
		if(/[0-9]{17,21}/.test(args)){
			if(flexbot.bot.guilds.get(args.match(/[0-9]{17,21}/g)[0])){
				g = flexbot.bot.guilds.get(args.match(/[0-9]{17,21}/g)[0]);
			}else{
				a = "Could not get guild found, defaulting to current (possibly not in guild)";
				g = msg.guild;
			}
		}else if(!msg.guild){
			msg.channel.createMessage("Cannot use in PMs.")
			return;
		}
	}
	let bots = 0;
	g.members.forEach(m=>{if(m.bot) ++bots;})

	let owner = (await bot.requestHandler.request("GET","/users/"+g.ownerID,true))
	let emojis = [];
	g.emojis.forEach(e=>{
		emojis.push("<:"+e.name+":"+e.id+">")
	})

	msg.channel.createMessage({content:a,embed:{
		color:0x7289DA,

		author:{
			name:"Server Info: "+g.name,
			icon_url:"https://twemoji.maxcdn.com/36x36/2139.png"
		},
		description:"**Emojis**\n"+emojis.join(","),
		fields:[
			{name:"ID",value:g.id,inline:true},
			{name:"Owner",value:owner.username+"#"+owner.discriminator,inline:true},
			{name:"Members",value:g.memberCount,inline:true},
			{name:"Bots",value:bots+" ("+Math.floor((bots/msg.guild.memberCount)*100)+"% of members)",inline:true},
			{name:"Channels",value:g.channels.size,inline:true},
			{name:"Roles",value:g.roles.size,inline:true},
			{name:"Emojis",value:g.emojis.length,inline:true},
			{name:"Icon",value:"[Full Size](https://cdn.discordapp.com/icons/"+g.id+"/"+g.icon+".jpg)",inline:true}
		],
		thumbnail:{
			url:"https://cdn.discordapp.com/icons/"+g.id+"/"+g.icon+".jpg"
		}
	}})
},["sinfo","ginfo","guildinfo"])

flexbot.addCommand("botinfo","Info on a bot",function(msg,args){
	flexbot.lookupUser(msg,args ? args : msg.author.mention)
	.then(u=>{

		if(!u.bot){ msg.channel.createMessage("User is not a bot!"); return }
		request.get("https://bots.discord.pw/api/bots/"+u.id,{headers:{"Authorization":flexbot.dbotsapi}},(err,res,body)=>{
			if(!err && res.statusCode == 200){
				let data = JSON.parse(body);

				let owners = [];
				for(let i=0;i<data["owner_ids"].length;i++){
					let o = flexbot.bot.users.get(data["owner_ids"][i]);
					owners.push(o.username+"#"+o.discriminator);
				};

				msg.channel.createMessage({embed:{
					color:0x7289DA,

					author:{
						name:"Bot Info: "+u.username+"#"+u.discriminator,
						icon_url:"https://twemoji.maxcdn.com/36x36/2139.png"
					},
					description:data.description,
					fields:[
						{name:"ID",value:u.id,inline:true},
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
						url:u.avatarURL
					}
				}})
			}
		});
	});
},["binfo"])