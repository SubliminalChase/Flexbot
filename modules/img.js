var flexbot = global.flexbot;
let fs = require("fs");

flexbot.addCommand("pout","",function(msg,args){
	msg.channel.createMessage("",{file:fs.readFileSync(__dirname+"/../img/starPout.png"),name:"starPout.png"})
})

flexbot.addCommand("lewd","",function(msg,args){
	msg.channel.createMessage("",{file:fs.readFileSync(__dirname+"/../img/starLewd.png"),name:"starLewd.png"})
})