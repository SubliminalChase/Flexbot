var flexbot = global.flexbot;
var emoji = require("node-emoji");
flexbot.userdata = flexbot.userdata ? flexbot.userdata : require(__dirname+"/../data/udata.json");

let udata = flexbot.userdata;

let updateData = function(msg){
	if(msg.author.bot) return;

	let ud = udata[msg.author.id] ? udata[msg.author.id] : {credits:0,xp:0,totalxp:0,level:1,color:"0xFFFFFF"};

	let rand = Math.floor(Math.random()*15)+1;

	ud.credits++;
	ud.xp = ud.xp+rand;
	ud.totalxp = ud.totalxp+rand;

	if(ud.xp >= ud.level*128){
		ud.xp = ud.xp - ud.level*128;
		ud.level++;
	}

	udata[msg.author.id] = ud;
}

let saveData = function(){
	require("fs").writeFileSync(__dirname+"/../data/udata.json",JSON.stringify(udata));
	flexbot.bot.createMessage(flexbot.logid,emoji.get("floppy_disk")+" Saved userdata.");
}

if(flexbot.hook_udata) flexbot.bot.removeListener("messageCreate",flexbot.hook_udata);

flexbot.hook_udata = updateData;
flexbot.bot.on("messageCreate",flexbot.hook_udata);

if(flexbot.udata_timer) clearInterval(flexbot.udata_timer);
flexbot.udata_timer = setInterval(saveData,3600000);

flexbot.addCommand("profile","See your level and credits", async function(msg,args){
	let u = msg.author;
	if(args){
		u = await flexbot.lookupUser(msg,args);
	}

	let ud = udata[u.id] ? udata[u.id] : {credits:0,xp:0,totalxp:0,level:1,color:"0xFFFFFF"};

	ud.color = ud.color ? ud.color : "0xFFFFFF";
	udata[u.id].color = ud.color ? ud.color : "0xFFFFFF";

	msg.channel.createMessage({embed:{
		url:"https://discordapp.com/channels/@me/"+u.id,
		title:"Profile for: "+u.username+"#"+u.discriminator,
		thumbnail:{
			url:u.avatarURL
		},
		color:parseInt(ud.color ? ud.color : "0xFFFFFF"),
		fields:[
			{name:"Credits",value:"$"+ud.credits,inline:true},
			{name:"Level",value:""+ud.level,inline:true},
			{name:"XP",value:ud.xp+"/"+ud.level*128,inline:true},
			{name:"Total XP",value:""+ud.totalxp,inline:true}
		],
		footer:{
			text:ud.color == "0xFFFFFF" ? "You can set the side color with f!pcolor." : ""
		}
	}});
});

flexbot.addCommand("pcolor","Set your profile color",function(msg,args){
	if(!args){
		msg.channel.createMessage("Your current color is **#"+udata[msg.author.id].color.replace("0x","")+"**")
	}else{
		args = args.replace("#","");
		if(/[0-9a-zA-Z]{6}/.test(args)){
			let col = args.match(/[0-9a-zA-Z]{6}/)[0];
			udata[msg.author.id].color = "0x"+col;
			msg.channel.createMessage(emoji.get("pencil2")+" Your profile color is now #"+col);
		}else{
			msg.channel.createMessage("Arguments did not match hex format. Example: `#xxxxxx`");
		}
	}
});