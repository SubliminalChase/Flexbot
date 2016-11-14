var flexbot = global.flexbot
var emoji = require("node-emoji")

var slist = [
	"on "+flexbot.bot.guilds.size+" servers.",
	emoji.get(":hammer:")+".gq",
	emoji.get(":floppy_disk:")+".cf",
	"flexbox.xyz",
	"with "+flexbot.cmds.size+" commands."
]

function randStatus(){
	let rand = Math.floor(Math.random()*slist.length)
	let s = slist[rand]
	flexbot.bot.editStatus("online",{name:s})
}

if(flexbot.stimer) clearInterval(flexbot.stimer);
flexbot.stimer = setInterval(randStatus,60000);