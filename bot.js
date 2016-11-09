var Eris = require("eris");
var config = require("./config.json");
global.flexbot = {};
const flexbot = global.flexbot
flexbot.bot = new Eris(config.token);
flexbot.prefix = "flexbot.";
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
});

function isOwner(msg){
	return msg.author.id == config.ownerid
}

flexbot.isOwner = isOwner;

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
			}
			
			bot.getDMChannel(msg.author.id).then((c)=>{
				bot.createMessage(c.id,res)
			})
		}
	},
	ping:{
		name:"ping",
		desc:"Pong.",
		func: function(msg,args){
			bot.createMessage(msg.channel.id,"Pong.").then((m)=>{
				bot.editMessage(msg.channel.id,m.id,"Pong, took "+Math.floor(m.timestamp-msg.timestamp)+"ms. ("+((m.timestamp-msg.timestamp)/1000).toString().substring(0,3)+" NotSoSuper Units™)")
			})
		}
	},
	restart:{
		name:"restart",
		desc:"Restarts the bot, duh",
		func: function(msg,args){
			if(isOwner(msg)){
				bot.createMessage(msg.channel.id,emoji.get(":arrows_counterclockwise:")+" Restarting FlexBot.")
				setTimeout(process.exit,1000)
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		}
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
		}
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
		}
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
		}
	}
};
flexbot.cmds = cmds;

function addCommand(name,desc,func){
	flexbot.cmds[name] = {name:name,desc:desc,func:func}
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
bot.on("messageCreate",(msg) => {
	if(!msg.author.bot){
		var c = msg.content.split(" ")
		var args = c.splice(1,c.length).join(" ")
		var cmd = c[0]
		
		for(item in cmds){
			if(cmd == prefix+cmds[item].name){
				try{
					cmds[item].func(msg,args)
				}catch(e){
					bot.getDMChannel(config.ownerid)
						.then((c)=>{
								bot.createMessage(c.id,emoji.get(":warning:")+" Error in command: "+cmd+"\n```\n"+e+"\n```")
						})
				}
			}
		}
		
		if(isOwner(msg) && msg.content == prefix+"incaseofemergency"){	
			bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
			setTimeout(process.exit,1000)
		}
	}
});

bot.connect();