var flexbot = global.flexbot;
var emoji = require("node-emoji");

flexbot.addCommand("modlog","[Manage Server] (Un)Set modlog channel",function(msg,args){
	if(msg.channel.permissionsOf(msg.member.id).has("manageGuild")){
		if(args == "unset"){
			flexbot.sql.query("UPDATE serverconfig SET modlogid=0 WHERE id="+msg.guild.id);
			msg.channel.createMessage(":ok_hand: Unset Modlog Channel");
		}else{
			flexbot.sql.query("UPDATE serverconfig SET modlogid="+msg.channel.id+" WHERE id="+msg.guild.id);
			msg.channel.createMessage(":ok_hand: Modlog Channel Set");
		}
	}else{
		msg.channel.createMessage("No permission, need `Manage Server`")
	}
});

let rchars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");

let genstring = function(){
	let s = "";
	for(let i = 0;i<8;i++){
		s+=rchars[Math.floor(Math.random()*rchars.length)];
	}
	
	return s;
};

flexbot.addCommand("kick","[Kick Members] Kick a member.",function(msg,args){
	let a = args.split(",");
	let user = a[0];
	let reason = a.slice(1,a.length).join(",");
	if(msg.channel.permissionsOf(msg.member.id).has("kickMembers") && msg.channel.permissionsOf(flexbot.bot.user.id).has("kickMembers")){
		if(/[0-9]{17,21}/.test(user) && reason){
			let u = msg.guild.members.get(user.match(/[0-9]{17,21}/)[0]);
			msg.guild.kickMember(u.id);
			msg.channel.createMessage(":ok_hand: Kicked.");
			flexbot.sql.query("SELECT modlogid FROM serverconfig WHERE id="+msg.guild.id,(e,d)=>{
				if(!e){
					if(!d[0].modlogid == "0"){
						let c = genstring();
						flexbot.bot.createMessage(d[0].modlogid,{
							content:"Case "+c+":",
							embed:{
								author:{
									name:"Kick - "+u.username+"#"+u.discriminator,
									icon_url:"https://twemoji.maxcdn.com/36x36/1f462.png"
								},
								color:0xdfdf00,
								fields:[
									{
										name:"Reason",
										value:reason
									}
								],
								footer:{
									text:msg.author.username+"#"+msg.author.discriminator,
									icon_url:msg.author.avatarURL
								},
								timestamp:new Date()
							}
						});
					}else{
						msg.channel.createMessage("No modlog channel found, please do `f!$modlog` in a channel to set it.");
					}
				}
			});
		}else if(!reason){
			msg.channel.createMessage("Please add a reason.");
		}else{
			msg.channel.createMessage("User not found, use mention or ID.");
		}
	}else{
		msg.channel.createMessage("No permission, need `Kick Members`");
	}
});

flexbot.addCommand("ban","[Ban Members] Ban a member.",function(msg,args){
	let a = args.split(",");
	let user = a[0];
	let reason = a.slice(1,a.length).join(",");
	if(msg.channel.permissionsOf(msg.member.id).has("banMembers") && msg.channel.permissionsOf(flexbot.bot.user.id).has("banMembers")){
		if(/[0-9]{17,21}/.test(user) && reason){
			let u = msg.guild.members.get(user.match(/[0-9]{17,21}/)[0]);
			msg.guild.banMember(u.id);
			msg.channel.createMessage(":ok_hand: Banned.");
			flexbot.sql.query("SELECT modlogid FROM serverconfig WHERE id="+msg.guild.id,(e,d)=>{
				if(!e){
					if(!d[0].modlogid == "0"){
						let c = genstring();
						flexbot.bot.createMessage(d[0].modlogid,{
							content:"Case "+c+":",
							embed:{
								author:{
									name:"Ban - "+u.username+"#"+u.discriminator,
									icon_url:"https://twemoji.maxcdn.com/36x36/1f528.png"
								},
								color:0xdf0000,
								fields:[
									{
										name:"Reason",
										value:reason
									}
								],
								footer:{
									text:msg.author.username+"#"+msg.author.discriminator,
									icon_url:msg.author.avatarURL
								},
								timestamp:new Date()
							}
						});
					}else{
						msg.channel.createMessage("No modlog channel found, please do `f!$modlog` in a channel to set it.");
					}
				}
			});
		}else if(!reason){
			msg.channel.createMessage("Please add a reason.");
		}else{
			msg.channel.createMessage("User not found, use mention or ID.");
		}
	}else{
		msg.channel.createMessage("No permission, need `Ban Members`");
	}
});