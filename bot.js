var Eris = require("eris");
var config = require("./config.json");
global.flexbot = {};
const flexbot = global.flexbot
flexbot.bot = new Eris(config.token);
flexbot.prefix = "flexbot.";
flexbot.prefix2 = "f!$";
flexbot.oid = config.ownerid;

var util = require("util");
var fs = require("fs");
var path = require("path");
var emoji = require("node-emoji");
var mysql = require("mysql");
var reload = require("require-reload")(require);
flexbot.sql =  mysql.createConnection(config.mysql);
flexbot.sql.connect();

var bot = flexbot.bot
bot.on("ready", () => {
	console.log("Loaded FlexBot");
	bot.getDMChannel(config.ownerid)
		.then((c)=>{
			bot.createMessage(c.id,emoji.get(":white_check_mark:")+" Loaded FlexBot")
		})
	bot.createMessage(logid,emoji.get(":white_check_mark:")+" Loaded FlexBot")
});

function isOwner(msg){
	return msg.author.id == config.ownerid
}

flexbot.isOwner = isOwner;

var logid = "246322719044403201"
flexbot.logid = logid;

function logCommand(cmd,msg,args){
	//let out = "```diff\n% Command Log:\n+ Command: "+cmd+"\n+ Args: "+args.substring(0,10)+"...\n- User: "+msg.author.username+"#"+msg.author.discriminator+"\n- Channel: "+(msg.channel.name ? msg.channel.name : "DM")+"\n- Server: "+(msg.guild ? msg.guild.name : "DM")+"\n```";
	bot.createMessage(logid,"",{},{
				author:{
					name:"Command Log",
					icon_url:"https://twemoji.maxcdn.com/36x36/1f4dc.png"
				},
				color:0xEA5F14,
				description:"Command: "+cmd+"\nArgs: "+args.substring(0,20)+"...\nUser: "+msg.author.username+"#"+msg.author.discriminator,
				footer:{
					text:msg.guild ? msg.channel.name+" on "+msg.guild.name : "Private Message",
					icon_url:msg.guild ? "https://cdn.discordapp.com/icons/"+msg.guild.id+"/"+msg.guild.icon+".jpg" : "https://twemoji.maxcdn.com/36x36/2709.png"
				}
			})
}

var cmds = {
	help:{
		name:"help",
		desc:"Lists commands",
		func: function(msg,args){
			bot.createMessage(msg.channel.id,emoji.get(":envelope_with_arrow:")+" Sending via DM.")
			
			var res = "__**Avaliable Commands**__"
			var sorted = {}
			Object.keys(cmds).sort().forEach(k => { sorted[k] = cmds[k] })
			
			for(item in sorted){
				var c = cmds[item]
				res += "\n\t\u2022 **"+c.name+"** - "+c.desc
				if(c.aliases.length>0){
					res+="\n\t\tAliases: "
					for(n in c.aliases){
						res+=c.aliases[n]+(n==c.aliases.length-1 ? "" : ", ")
					}
				}
			}
			
			bot.getDMChannel(msg.author.id).then((c)=>{
				bot.createMessage(c.id,res)
			})
		},
		aliases:["cmds","commands"]
	},
	ping:{
		name:"ping",
		desc:"Pong.",
		func: function(msg,args){
			bot.createMessage(msg.channel.id,"Pong.").then((m)=>{
				bot.editMessage(msg.channel.id,m.id,"Pong, took "+Math.floor(m.timestamp-msg.timestamp)+"ms.")
			})
		},
		aliases:[]
	},
	restart:{
		name:"restart",
		desc:"Restarts the bot, duh",
		func: function(msg,args){
			if(isOwner(msg)){
				bot.createMessage(msg.channel.id,emoji.get(":arrows_counterclockwise:")+" Restarting FlexBot.")
				bot.createMessage(logid,emoji.get(":arrows_counterclockwise:")+" Restarting FlexBot.")
				setTimeout(process.exit,1000)
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		},
		aliases:[]
	},
	eval:{
		name:"eval",
		desc:"Do I need to say?",
		func: function(msg,args){
			if(isOwner(msg)){
				try{
					bot.createMessage(msg.channel.id,"Result:\n```\n"+eval(args)+"```")
				}catch(e){
					bot.createMessage(msg.channel.id,"Error:\n```\n"+e+"```")
				}
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		},
		aliases:["js"]
	},
	unload:{
		name:"unload",
		desc:"Unloads commands",
		func: function(msg,args){
			if(isOwner(msg)){
				delete cmds[args]
					bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		},
		aliases:[]
	},
	load:{
		name:"load",
		desc:"Loads a command/module file.",
		func: function(msg,args){
			if(isOwner(msg)){
				if(fs.existsSync(path.join(__dirname,"modules",args))){
					reload(path.join(__dirname,"modules",args))
						bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
				}else if(fs.existsSync(path.join(__dirname,"modules",args+".js"))){
					reload(path.join(__dirname,"modules",args+".js"))
						bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
				}else{
					bot.createMessage(msg.channel.id,"Not found.")
				}
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		},
		aliases:[]
	}
};
flexbot.cmds = cmds;

function addCommand(name,desc,func,aliases=[]){
	flexbot.cmds[name] = {name:name,desc:desc,func:func,aliases:aliases}
}
flexbot.addCommand = addCommand;

flexbot.hooks = {};
function addHook(evt,name,func){
	flexbot.hooks[evt] = flexbot.hooks[evt] || {};
	flexbot.hooks[evt][name] = func
	bot.on(evt,func)
}
flexbot.addHook = addHook;

flexbot.awaitMsgs = {};

flexbot.awaitForMessage = function(msg,display,callback,timeout) {
	let dispMsg = msg.channel.createMessage(display);
	timeout = timeout ? timeout : 30000;
	if (!flexbot.awaitMsgs.hasOwnProperty(msg.channel.id)){
		flexbot.awaitMsgs[msg.channel.id] = {}
	}
	if (flexbot.awaitMsgs[msg.channel.id][msg.author.id]) {
		clearTimeout(flexbot.awaitMsgs[msg.channel.id][msg.author.id].timer);
	}
	flexbot.awaitMsgs[msg.channel.id][msg.author.id] = {
		time:msg.timestamp,
		botmsg:dispMsg
	}
	
	let func;
	
	function regEvent() {
		return new Promise((resolve,reject)=>{
			func = function(msg2){
				if (msg2.author.id == msg.author.id){
				let response;
				if(callback){
					response = callback(msg2);
				}else
					response = true;
				if(response){
					bot.removeListener("messageCreate",func);
					clearTimeout(flexbot.awaitMsgs[msg.channel.id][msg.author.id].timer);
					resolve(msg2);
				}
				}
			}
			bot.on("messageCreate",func);
			
			flexbot.awaitMsgs[msg.channel.id][msg.author.id].timer = setTimeout(()=>{
				bot.removeListener("messageCreate",func)
				msg.channel.createMessage("Query canceled.");
				reject("Request timed out.");
			},timeout);
		});
	}
	
	return regEvent();
}


var files = fs.readdirSync(path.join(__dirname,"modules"))
for(f of files){
	require(path.join(__dirname,"modules",f))
	console.log("Loaded Module: "+f)
};

var prefix = flexbot.prefix;
var prefix2 = flexbot.prefix2;
bot.on("messageCreate",(msg) => {
	if(!msg.author.bot){
		var prefix3 = flexbot.bot.user.mention;
		var c = msg.content.split(" ")
		var args = c.splice((msg.content.substring(0,prefix3.length) == prefix3 ? 2 : 1),c.length).join(" ")
		var cmd = c[0]
		if(msg.content.substring(0,prefix3.length) == prefix3) cmd=c.splice(0,2).join(" ");
		
		for(item in cmds){
			if(cmds[item].aliases.length > 0){
				for(n in cmds[item].aliases){
					if(cmd == prefix+cmds[item].aliases[n] || cmd == prefix2+cmds[item].aliases[n] || cmd == prefix3+" "+cmds[item].aliases[n] || cmd == prefix+cmds[item].name || cmd == prefix2+cmds[item].name || cmd == prefix3+" "+cmds[item].name){
						try{
							logCommand(cmd,msg,args)
							cmds[item].func(msg,args)
						}catch(e){
							logCommand(cmd,msg,args)
									bot.createMessage(logid,emoji.get(":warning:")+" Error in command: "+cmd+"\n```\n"+e+"\n```")
						}
					}
				}
			}else if(cmd == prefix+cmds[item].name || cmd == prefix2+cmds[item].name || cmd == prefix3+" "+cmds[item].name){
					try{
						logCommand(cmd,msg,args)
						cmds[item].func(msg,args)
					}catch(e){
						logCommand(cmd,msg,args)
								bot.createMessage(logid,emoji.get(":warning:")+" Error in command: "+cmd+"\n```\n"+e+"\n```")
					}
				}
		}
		
		if(isOwner(msg) && msg.content == prefix+"incaseofemergency"){	
			bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
			setTimeout(process.exit,1000)
		}
	}
});

bot.on("guildCreate",s=>{
	flexbot.sql.query("SELECT * FROM serverconfig WHERE id="+s.id,(e,d)=>{
			if(!e){
				if(!d[0]){
					flexbot.sql.query("INSERT INTO serverconfig VALUES ("+s.id+")")
		let bots = 0
		s.members.forEach(m=>{if(m.bot) ++bots;})
			bot.createMessage(logid,"",{},{
				author:{
					name:"Joined Server: "+s.name,
					icon_url:"https://cdn.discordapp.com/emojis/230092636835414026.png"
				},
				color:0x42B581,
				description:"**Owner**: "+s.members.get(s.ownerID).username+"#"+s.members.get(s.ownerID).discriminator+"\n**Members**: "+s.memberCount+"\n**Bots: "+bots+" ("+Math.floor((bots/s.memberCount)*100)+"%)"
			})
	}
	}
	})
})

bot.on("guildDelete",s=>{
	flexbot.sql.query("DELETE FROM serverconfig WHERE id="+s.id)

	bot.createMessage(logid,"",{},{
		author:{
			name:"Left Server: "+s.name,
			icon_url:"https://cdn.discordapp.com/emojis/230092636852191232.png"
		},
		color:0xF04946
	})
})

bot.connect();