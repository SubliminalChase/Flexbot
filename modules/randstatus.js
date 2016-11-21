var flexbot = global.flexbot
var emoji = require("node-emoji")
var path = require("path")
var dbotsapi = require(path.join(__dirname,"..","config.json")).dbotsapi

function randStatus(){
	let cmds = 0;
	for(c in flexbot.cmds){cmds++};
	var slist = [
		"on "+flexbot.bot.guilds.size+" servers.",
		"f!$help",
		"flexbox.xyz",
		"with "+cmds+" commands.",
		"with "+flexbot.bot.users.size+" users."
	]

	let rand = Math.floor(Math.random()*slist.length)
	let s = slist[rand]
	flexbot.bot.editStatus("online",{name:s})
}

function updateDBots(){
	var request = require('request').defaults({encoding:null});
	request.post("https://bots.discord.pw/api/bots/"+flexbot.bot.user.id+"/stats",{headers:{"Authorization":dbotsapi},form:{server_count:flexbot.bot.guilds.size}})
}

if(flexbot.stimer) clearInterval(flexbot.stimer);
flexbot.stimer = setInterval(randStatus,60000);

if(flexbot.scount) clearInterval(flexbot.scount);
flexbot.scount = setInterval(updateDBots,3600000);