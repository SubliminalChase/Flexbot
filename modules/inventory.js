var flexbot = global.flexbot;
var emoji = require("node-emoji");

flexbot.addCommand("inventory","See and manage your inventory",function(msg,args){
	flexbot.awaitForMessage(msg,"Inventory Menu\n```ini\n[1] View Inventory\n[2] View a person's inventory\n\n[c] Cancel\n```",(m)=>{
		if(m.content == "c"){
			msg.channel.createMessage("Canceled.")
		}else if(m.content == 1){
			msg.channel.createMessage("[DEBUG/WIP] User selected option 1")
		}else if(m.content == 2){
			msg.channel.createMessage("[DEBUG/WIP] User selected option 2")
		}
	});
},["inv"]);