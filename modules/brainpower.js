var flexbot = global.flexbot
var emoji = require("node-emoji")

flexbot.do_brainpower = function(msg){
	let lyrics = "Are you ready|Adrenaline is pumping|Adrenaline is pumping|Generator| Automatic Lover|Atomic|Atomic|Overdrive|Blockbuster|Brain power|Call me a leader|Cocaine|Dont you try it|Dont you try it|Innovator|Killer machine| Theres no fate|Take control|Brain power|Let the bass kick".toUpperCase().split("|");
	let meme = "O-oooooooooo AAAAE-A-A-I-A-U- JO-oooooooooooo AAE-O-A-A-U-U-A- E-eee-ee-eee AAAAE-A-E-I-E-A- JO-ooo-oo-oo-oo EEEEO-A-AAA-AAAA O-oooooooooo AAAAE-A-A-I-A-U- JO-oooooooooooo AAE-O-A-A-U-U-A- E-eee-ee-eee AAAAE-A-E-I-E-A- JO-ooo-oo-oo-oo EEEEO-A-AAA-AAAA O-oooooooooo AAAAE-A-A-I-A-U- JO-oooooooooooo AAE-O-A-A-U-U-A- E-eee-ee-eee AAAAE-A-E-I-E-A- JO-ooo-oo-oo-oo EEEEO-A-AAA-AAAA- O--------------------";
	
	for(i=0;i<lyrics.length;i++){
		setTimeout(()=>{
			msg.channel.createMessage(lyrics[i])
			if(i == lyrics.length-1){
				msg.channel.createMessage(meme)
			}
		},3000*i)
	}
}