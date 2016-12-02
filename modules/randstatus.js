var flexbot = global.flexbot
var emoji = require("node-emoji")

function randStatus(){
	let cmds = 0;
	for(c in flexbot.cmds){cmds++};
	var slist = [
		"on "+flexbot.bot.guilds.size+" servers.",
		flexbot.prefix2+"help",
		"flexbox.xyz",
		"with "+cmds+" commands.",
		"with "+flexbot.bot.users.size+" users."
	]

	let rand = Math.floor(Math.random()*slist.length)
	let s = slist[rand]
	flexbot.bot.editStatus("online",{name:s})
}

if(flexbot.stimer) clearInterval(flexbot.stimer);
flexbot.stimer = setInterval(randStatus,60000);