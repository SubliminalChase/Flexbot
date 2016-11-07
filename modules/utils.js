var flexbot = global.flexbot
var emoji = require("node-emoji")

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
	if(msg.channel.permissionsOf(msg.author.id).has("manageMessages")){
	if(msg.channel.permissionsOf(flexbot.bot.user.id).has("manageMessages")){
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
			msg.channel.createMessage("I do not have Manage Messsges permission.")
		}
	}else{
		msg.channel.createMessage(emoji.get(":no_entry_sign:")+" Lacking permissions, need Manage Messages.")
	}
})

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
		var ehex = ((args.charCodeAt(0)+args.charCodeAt(1))+16323).toString(16)
		var baseurl = "https://raw.githubusercontent.com/twitter/twemoji/gh-pages/svg/"
		
		request.get(baseurl+ehex+".svg",function(e,res,body){
			if(!e && res.statusCode == 200){
				s2p(new Buffer(body),{width:1024,height:1024})
				.then((b)=>{
					msg.channel.createMessage("Emoji Hex: "+ehex+"\nEmoji code: "+emoji.which(args).replace(":","\\:"),{name:"emoji.png",file:b})
				})
			}
		})
		}else{
			msg.channel.createMessage("Emoji not found.")
		}
	}
})