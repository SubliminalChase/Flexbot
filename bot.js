var Eris = require("eris");
var config = require("./config.json");
global.flexbot = {};
const flexbot = global.flexbot
flexbot.bot = new Eris(config.token);
flexbot.prefix = "flexbot.";
flexbot.prefix2 = "f!";
flexbot.oid = config.ownerid;
flexbot.dbotsapi = config.dbotsapi;
flexbot.carbonkey = config.carbonkey;

var request = require('request')
var util = require("util");
var fs = require("fs");
var path = require("path");
var emoji = require("node-emoji");
var reload = require("require-reload")(require);

var bot = flexbot.bot
bot.on("ready", () => {
	console.log("Loaded FlexBot");

	request.post("https://bots.discord.pw/api/bots/"+bot.user.id+"/stats",{headers:{"Authorization":config.dbotsapi},json:{server_count:bot.guilds.size}});
	request.post("https://www.carbonitex.net/discord/data/botdata.php",{headers:{"Content-Type":"application/json"},json:{key:config.carbonkey,servercount:bot.guilds.size}});

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
	bot.createMessage(logid,{embed:{
		author:{
			name:msg.author.username+"#"+msg.author.discriminator,
			icon_url:msg.author.avatarURL
		},
		color:0xdf8000,
		fields:[
			{name:"Command",value:cmd,inline:true},
			{name:"Arguments",value:args ? args : "none",inline:true},
			{name:"User ID",value:""+msg.author.id,inline:true},
			{name:msg.guild ? msg.guild.name : "Private Message",value:msg.guild ? ""+msg.guild.id : ""+msg.author.id,inline:true},
			{name:msg.channel.name ? "#"+msg.channel.name : msg.author.username,value:""+msg.channel.id,inline:true}
		],
		footer:{
			text:"Time",
			icon_url:"https://raw.githubusercontent.com/twitter/twemoji/gh-pages/36x36/1f552.png"
		},
		thumbnail:{
			url:msg.guild ? "https://cdn.discordapp.com/icons/"+msg.guild.id+"/"+msg.guild.icon+".jpg" : "https://cdnjs.cloudflare.com/ajax/libs/twemoji/2.2.3/2/72x72/1f5e8.png"
		},
		timestamp:new Date()
	}})
}

function logError(cmd,msg,args,error){
	bot.createMessage(logid,{embed:{
		author:{
			name:"Command Error",
			icon_url:"http://www.famfamfam.com/lab/icons/silk/icons/error.png"
		},
		color:0xdfdf00,
		fields:[
			{name:"Command",value:cmd,inline:true},
			{name:"Arguments",value:args ? args : "none",inline:true},
			{name:"User ID",value:""+msg.author.id,inline:true},
			{name:msg.guild ? msg.guild.name : "Private Message",value:msg.guild ? ""+msg.guild.id : ""+msg.author.id,inline:true},
			{name:msg.channel.name ? "#"+msg.channel.name : msg.author.username,value:""+msg.channel.id,inline:true},
			{name:"Error",value:"```\n"+e+"```",inline:true}
		],
		footer:{
			text:"Time",
			icon_url:"https://raw.githubusercontent.com/twitter/twemoji/gh-pages/36x36/1f552.png"
		},
		thumbnail:{
			url:msg.guild ? "https://cdn.discordapp.com/icons/"+msg.guild.id+"/"+msg.guild.icon+".jpg" : "https://cdnjs.cloudflare.com/ajax/libs/twemoji/2.2.3/2/72x72/1f5e8.png"
		},
		timestamp:new Date()
	}})
}


var cmds = {
	help:{
		name:"help",
		desc:"Lists commands.",
		args:"",
		func: function(msg,args){
			var sorted = {}
			Object.keys(cmds).sort().forEach(k => { sorted[k] = cmds[k] })

			let co = 0
			let res = []
			for(item in sorted){
				var c = cmds[item]
				co++
				res.push("> "+c.name+" - "+c.desc)
			}

			if(msg.guild) msg.channel.createMessage(emoji.get("envelope_with_arrow")+" Sending help via DM.");
			bot.getDMChannel(msg.author.id)
			.then((c)=>{
			bot.createMessage(c.id,"```md\n# FlexBot Commands\n"+res.join("\n")+"\n\n# Total commands: "+co+"\n```")
			});
		},
		aliases:[]
	},
	ping:{
		name:"ping",
		desc:"Pong.",
		args:"",
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
		args:"",
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
		args:"[string]",
		func: function(msg,args){
			if(isOwner(msg)){
				let output;
				let col = 0x00C000;
				let errored = false;
				try{
					output = eval(args);
				}catch(e){
					output = e;
					errored = true;
					col = 0xC00000;
				}

				msg.channel.createMessage({embed:{
					title:"JS Eval",
					fields:[
						{name:emoji.get("arrow_right")+" Input:",value:"```js\n"+args+"```"},
						{name:emoji.get(errored ? "warning" : "arrow_down")+" Output:"+(errored ? " (errored)" : ""),value:"```js\n"+output+"```"}
					],
					color:col
				}})
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		},
		aliases:["js"]
	},
	unload:{
		name:"unload",
		desc:"Unloads commands",
		args:"[name]",
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
		args:"[name]",
		func: function(msg,args){
			if(isOwner(msg)){
				if(fs.existsSync(path.join(__dirname,"modules",args))){
	try{				reload(path.join(__dirname,"modules",args))
						bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
	}catch(e){
		bot.createMessage(msg.channel.id,emoji.get(":warning:")+" Error:\n```js\n"+e+"```")
	}
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

function addCommand(name,desc,func,aliases=[],args=""){
	flexbot.cmds[name] = {name:name,desc:desc,func:func,aliases:aliases,args:args}
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

flexbot.lookupUser = function(msg,str){
	return new Promise((resolve,reject)=>{
		if(/[0-9]{17,21}/.test(str)){
			resolve(bot.requestHandler.request("GET","/users/"+str.match(/[0-9]{17,21}/)[0],true))
		}

		let userpool = [];
		if(msg.guild){
			msg.guild.members.forEach(m=>{
				if(m.username.toLowerCase().indexOf(str.toLowerCase()) > -1 || m.nick && m.nick.toLowerCase().indexOf(str.toLowerCase()) > -1){
					if(m.username.toLowerCase() == str.toLowerCase() || m.nick && m.nick.toLowerCase() == str.toLowerCase()){
						userpool = [m];
					}else{
						userpool.push(m);
					}
				}
			});
		}else{
			bot.members.forEach(m=>{
				if(m.username.toLowerCase().indexOf(str.toLowerCase()) > -1){
					if(m.username.toLowerCase() == str.toLowerCase()){
						userpool = [m];
					}else{
						userpool.push(m);
					}
				}
			});
		}

		if(userpool.length > 0){
			if(userpool.length > 1){
				let a = [];
				let u = 0;
				for(let i=0;i<(userpool.length > 20 ? 20 : userpool.length);i++){
					a.push("["+(i+1)+"] "+userpool[i].username+"#"+userpool[i].discriminator+(msg.guild ? (userpool[i].nick ? " ("+userpool[i].nick+")" : "") : ""))
				}
				flexbot.awaitForMessage(msg,"Multiple users found. Please pick from this list. \n```ini\n"+a.join("\n")+"\n\n[c] Cancel```",(m)=>{
					let value = parseInt(m.content)
					if(m.content == "c"){
						msg.channel.createMessage("Canceled.")
						reject("Canceled.")
					}else if(m.content == value){
						resolve(userpool[value-1])
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
				msg.channel.createMessage("No users found.")
				reject("No results.")
			}
		}
	});
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
		
		let hasRan = false;

		for(item in cmds){
			if(cmds[item].aliases.length > 0){
				for(n in cmds[item].aliases){
					if(cmd == prefix+cmds[item].aliases[n] || cmd == prefix2+cmds[item].aliases[n] || cmd == prefix3+" "+cmds[item].aliases[n] || cmd == prefix+cmds[item].name || cmd == prefix2+cmds[item].name || cmd == prefix3+" "+cmds[item].name){
						if(hasRan == true) return;
						try{
							logCommand(cmd,msg,args)
							cmds[item].func(msg,args)
						}catch(e){
							logCommand(cmd,msg,args)
							logError(cmd,msg,args,e)
							msg.channel.createMessage(emoji.get("warning")+" An error occured:\n```\n"+e+"\n```")
						}
						hasRan = true
					}
				}
			}else if(cmd == prefix+cmds[item].name || cmd == prefix2+cmds[item].name || cmd == prefix3+" "+cmds[item].name){
					if(hasRan == true) return;
					try{
						logCommand(cmd,msg,args)
						cmds[item].func(msg,args)
					}catch(e){
						logCommand(cmd,msg,args)
						logError(cmd,msg,args,e)
						msg.channel.createMessage(emoji.get("warning")+" An error occured:\n```\n"+e+"\n```")
					}
					hasRan = true
				}
		}

		if(isOwner(msg) && msg.content == prefix+"incaseofemergency"){
			bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
			setTimeout(process.exit,1000)
		}
	}
});

bot.on("guildCreate",async function(s){
		let bots = 0;
		let inv = (await s.defaultChannel.createInvite()).code
		s.members.forEach(m=>{if(m.bot) ++bots;})
			bot.createMessage(logid,{embed:{
				author:{
					name:"Joined Server: "+s.name,
					icon_url:"http://www.famfamfam.com/lab/icons/silk/icons/server_add.png"
				},
				color:0x42B581,
				fields:[
					{name:"Owner",value:s.members.get(s.ownerID).username+"#"+s.members.get(s.ownerID).discriminator,inline:true},
					{name:"Members",value:s.memberCount,inline:true},
					{name:"Bots",value:bots+" ("+Math.floor((bots/s.memberCount)*100)+"%)",inline:true},
					{name:"Invite",value:"["+emoji.get(":inbox_tray:")+"](https://discord.gg/"+inv+")",inline:true}
				],
				footer:{
					text:"Time",
					icon_url:"http://www.famfamfam.com/lab/icons/silk/icons/time.png"
				},
				timestamp:new Date()
			}})

	request.post("https://bots.discord.pw/api/bots/"+bot.user.id+"/stats",{headers:{"Authorization":config.dbotsapi},json:{server_count:bot.guilds.size}});
	request.post("https://www.carbonitex.net/discord/data/botdata.php",{headers:{"Content-Type":"application/json"},json:{key:config.carbonkey,servercount:bot.guilds.size}});
})

bot.on("guildDelete",s=>{
	bot.createMessage(logid,{embed:{
		author:{
			name:"Left Server:",
			icon_url:"http://www.famfamfam.com/lab/icons/silk/icons/server_delete.png"
		},
		description:s.name,
		footer:{
			text:"Time",
			icon_url:"http://www.famfamfam.com/lab/icons/silk/icons/time.png"
		},
		timestamp:new Date(),
		color:0xF04946
	}})

	request.post("https://bots.discord.pw/api/bots/"+bot.user.id+"/stats",{headers:{"Authorization":config.dbotsapi},json:{server_count:bot.guilds.size}});
	request.post("https://www.carbonitex.net/discord/data/botdata.php",{headers:{"Content-Type":"application/json"},json:{key:config.carbonkey,servercount:bot.guilds.size}});
})

bot.connect();