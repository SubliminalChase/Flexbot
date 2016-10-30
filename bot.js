var Eris = require("eris");
var config = require("./config.json");
var bot = new Eris(config.token);

var prefix = "flexbot.";
var emoji = require("node-emoji");

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

var cmds = [
	{
		name:"help",
		desc:"Lists commands",
		func: function(msg,args){
			bot.createMessage(msg.channel.id,emoji.get(":envelope_with_arrow:")+" Sending via DM.")
			
			var res = "**UNDERGOING REWRITE SO EXPECT COMMANDS SOON™**\n\n__**Avaliable Commands**__"
			
			for(i=0;i<cmds.length;i++){
				var c = cmds[i]
				res += "\n\t\u2022 **"+c.name+"** - "+c.desc
			}
			
			bot.getDMChannel(msg.author.id).then((c)=>{
				bot.createMessage(c.id,res)
			})
		}
	},
	{
		name:"ping",
		desc:"Pong.",
		func: function(msg,args){
			bot.createMessage(msg.channel.id,"Pong.").then((m)=>{
				bot.editMessage(msg.channel.id,m.id,"Pong, took "+Math.floor(m.timestamp-msg.timestamp)+"ms.")
			})
		}
	},
	{
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
	{
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
	}
];

bot.on("messageCreate",(msg) => {
	if(!msg.author.bot){
		var c = msg.content.split(" ")
		var args = c.splice(1,c.length).join(" ")
		var cmd = c[0]
		
		for(i=0;i<cmds.length;i++){
			if(cmd == prefix+cmds[i].name){
				cmds[i].func(msg,args)
			}
		}
	}
});

bot.connect();