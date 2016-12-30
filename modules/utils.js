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

let unicode = []

let fetchUnicode = function(){
if(unicode.length == 0){
request.get("http://unicode.org/Public/UNIDATA/Index.txt",function(e,res,body){
	if(!e && res.statusCode == 200){
		let u1 = body.toString("utf-8").split("\n");
		for(let i=0;i<u1.length;i++){
			let ch = u1[i].split("\t");
			unicode[ch[1]] = ch[0];
		}
	}
})

return unicode.length
}
}

flexbot.addCommand("emoji","Get an image of an emoji/custom emote.",async function(msg,args){
	if(/[0-9]{17,21}/.test(args)){
		let eid = args.match(/[0-9]{17,21}/)
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
	}else if(emoji.which(args) || emoji.get(args)){
			let e = emoji.which(args);
			if(!emoji.which(args)){
				e = emoji.which(emoji.get(args.replace(" ","_")))
			}
			if(e){
			let twemoji = require("twemoji")
			let ehex = twemoji.convert.toCodePoint(emoji.get(e))
			let baseurl = "https://raw.githubusercontent.com/twitter/twemoji/gh-pages"

			msg.channel.createMessage({embed:{
				title:e,
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
	}else{
		msg.channel.createMessage("Emoji not found.")
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

flexbot.addCommand("uinfo","Get info about a user",function(msg,args){
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
			fields:[
					{name:"ID",value:u.id,inline:true},
					{name:"Nickname",value:u.nick ? u.nick : "None",inline:true},
					{name:"Status",value:statusIcons[u.status]+" "+u.status,inline:true},
					{name:"Playing",value:u.game ? u.game.name : "Nothing",inline:true},
					{name:"Roles",value:u.guild ? (roles.length > 0 ? roles.join(", ") : "No roles") : "No roles",inline:true},
					{name:"Created At",value:new Date(u.createdAt).toUTCString(),inline:true},
					{name:"Joined At",value:new Date(u.joinedAt).toUTCString(),inline:true},
					{name:"Avatar",value:"[Full Size]("+u.avatarURL.replace("jpg","gif")+")",inline:true}
				],
			thumbnail:{
				url:u.avatarURL.replace("jpg","gif")
			}
		}})
	});
})

flexbot.addCommand("sinfo","Info on current server",async function(msg,args){
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
		emojis.push("<:a:"+e.id+">")
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
})

flexbot.addCommand("binfo","Get info on a bot",function(msg,args){
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
						icon_url:"https://cdn.discordapp.com/icons/110373943822540800/"+flexbot.bot.guilds.get("110373943822540800").icon+".jpg"
					},
					thumbnail:{
						url:"https://cdn.discordapp.com/avatars/"+u.id+"/"+u.avatar
					}
				}})
			}else{
				let data = JSON.parse(body);
				if(data.error == "Bot user ID not found"){
					msg.channel.createMessage("No bot info found, bot might not be on Discord Bots or hacked the mainframe.")
				}else{
					msg.channel.createMessage("An error occured with bot list. Blame abal.\n```"+body+"```")
				}
			}
		});
	});
})

flexbot.addCommand("bots","Get bots of a user",function(msg,args){
	flexbot.lookupUser(msg,args ? args : msg.author.mention)
	.then(u=>{
		request.get("https://bots.discord.pw/api/users/"+u.id,{headers:{"Authorization":flexbot.dbotsapi}},(err,res,body)=>{
			if(!err && res.statusCode == 200){
				let data = JSON.parse(body);
				let bots = [];
				data.bots.forEach(b=>{
					let a = flexbot.bot.users.get(b.user_id);
					bots.push("**"+a.username+"#"+a.discriminator+"**")
				})
				msg.channel.createMessage("**"+u.username+"#"+u.discriminator+"** created "+bots.join(", "))
			}else{
				let data = JSON.parse(body);
				if(data.error == "User ID not found"){
					msg.channel.createMessage("**"+u.username+"#"+u.discriminator+"** has no bots on Discord Bots.")
				}else{
					msg.channel.createMessage("An error occured with bot list. Blame abal.\n```"+body+"```")
				}
			}
		});
	});
})

let lookupRole = function(msg,str){
	return new Promise((resolve,reject)=>{
		if(/[0-9]{17,21}/.test(str)){
			resolve( msg.guild.roles.get(str.match(/[0-9]{17,21}/)[0]) )
		}

		let userpool = [];
		msg.guild.roles.forEach(r=>{
			if(r.name.toLowerCase().indexOf(str.toLowerCase()) > -1){
				userpool.push(r);
			}
		});

		if(userpool.length > 0){
			if(userpool.length > 1){
				let a = [];
				let u = 0;
				for(let i=0;i<(userpool.length > 50 ? 50 : userpool.length);i++){
					a.push(i+". "+userpool[i].name)
				}
				flexbot.awaitForMessage(msg,"Multiple roles found. Please pick from this list. \n```md\n"+a.join("\n")+"\n# Type `c` to cancel```",(m)=>{
					let value = parseInt(m.content)
					if(m.content == "c"){
						msg.channel.createMessage("Canceled.")
						reject("Canceled.")
					}else if(m.content == value){
						resolve(userpool[value])
					}
					clearTimeout(flexbot.awaitMsgs[msg.channel.id][msg.author.id].timer);
				},30000).then(r=>{
					resolve(r)
				});
			}else{
				resolve(userpool[0])
			}
		}else{
			if(!/[0-9]{17,21}/.test(str)){
				msg.channel.createMessage("No roles found.")
				reject("No results.")
			}
		}
	});
}

flexbot.addCommand("rinfo","Get info on a guild role.",function(msg,args){
	if(!msg.guild){
		msg.channel.createMessage("Can only be used in a guild.")
	}else{
		lookupRole(msg,args ? args : "")
		.then(r=>{
			let users = 0;
			let bots = 0;
			msg.guild.members.forEach(m=>{
				if(m.roles.indexOf(r.id) > -1){
					if(m.bot) bots++;
					users++;
				}
			});

			let perms = [];
			Object.keys(r.permissions.json).forEach(k=>{
				perms.push(k+" - "+(r.permissions.json[k] == true ? emoji.get(":white_check_mark:") : emoji.get(":x:") ))
			})

			if(perms.length == 0){
				perms.push("None")
			}

			msg.channel.createMessage({embed:{
				color:r.color,
				author:{
					name:"Role Info: "+r.name,
					icon_url:"https://twemoji.maxcdn.com/36x36/2139.png"
				},
				fields:[
					{name:"ID",value:r.id,inline:true},
					{name:"Color",value:r.color ? "#"+(r.color.toString(16).length < 6 ? "0".repeat(6-r.color.toString(16).length) : "")+r.color.toString(16).toUpperCase() : "None",inline:true},
					{name:"Users in role",value:users,inline:true},
					{name:"Bots in role",value:bots,inline:true},
					{name:"Mentionable",value:r.mentionable ? r.mentionable : "false",inline:true},
					{name:"Managed",value:r.managed ? r.managed : "false",inline:true},
					{name:"Position",value:r.position,inline:true},
					{name:"Permissions",value:perms.join("\n")}
				],
			}})
		});
	}
})