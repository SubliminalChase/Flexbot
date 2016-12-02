var flexbot = global.flexbot
var emoji = require("node-emoji")

flexbot.addCommand("profile","See level and credits",function(msg,args){
	let u;
	if(/[0-9]{17,21}/.test(args)){
		u = flexbot.bot.users.get(args.match(/[0-9]{17,21}/g)[0])
	}else{
		u = msg.author
	}
	
	let data;
	
	flexbot.sql.query("SELECT * FROM userdata WHERE userid="+u.id,(e,d)=>{
		if(!e){
			if(!d[0]){
				flexbot.sql.query("INSERT INTO userdata (userid,level,xp,totalxp) VALUES ("+msg.author.id+",1,0,0)")
				data = d[0];
			}else{
				data = d[0];
			}
		}
	})
	
	let col = 0x7289DA;
	if(msg.guild && msg.guild.members.get(u.id).roles[0]){
		col = msg.guild.roles.get(msg.guild.members.get(u.id).roles[0]).color;
	}
	
	setTimeout(function(){
		msg.channel.createMessage({
			embed:{
				author:{
					name:"Profile for "+u.username+"#"+u.discriminator,
					icon_url:u.avatarURL
				},
				color:col,
				fields:[
					{
						name:"FlexBot Global",
						value:"**Level**: "+data.level+"\n**XP**: "+data.xp+"/"+(data.level*32)+"\n\tTotal: "+data.totalxp+"\n\n**Credits**: "+data.credits,
						inline:true
					},
					{
						name:"FlexBox",
						value:"**Steam ID**: soon™\n**Playtime**: soon™\n\n**Rank**: soon™\n**Money**: $soon™",
						inline:true
					}
				]
			}
		})
	},1000)
})

flexbot.bot.on("messageCreate",(msg)=>{
	let xp = Math.floor(Math.random()*5)+1
	if(!msg.author.bot){
		flexbot.sql.query("SELECT * FROM userdata WHERE userid="+msg.author.id,(e,d)=>{
			if(!e){
				if(!d[0]){
					flexbot.sql.query("SELECT * FROM userdata WHERE userid="+msg.author.id,(e,d)=>{
						if(!e){
							if(!d[0]){
								flexbot.sql.query("INSERT INTO userdata (userid,level,xp,totalxp) VALUES ("+msg.author.id+",1,0,0)")
							}
							flexbot.sql.query("UPDATE userdata SET xp = xp+"+xp+",totalxp = totalxp+"+xp+" WHERE userid="+msg.author.id)
						}
					})
				}else{
					if(d[0].xp >= d[0].level*32){
						flexbot.sql.query("UPDATE userdata SET xp = xp-"+(d[0].level*32)+",level = level+1 WHERE userid="+msg.author.id)
					}
					flexbot.sql.query("UPDATE userdata SET xp = xp+"+xp+",totalxp = totalxp+"+xp+" WHERE userid="+msg.author.id)
				}
			}
		})
	}
});