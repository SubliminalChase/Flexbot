var flexbot = global.flexbot
var emoji = require("node-emoji")

var steam = {
	key:"45A277C175FB5267A80617957670BB2D",
	url:"https://api.steampowered.com/",
	sidbase:0x0110000100000000
}

flexbot.addCommand("steam","All in one Steam command. do `steam help` for arguments.",function(msg,args){
	let sargs = args.split(" ")
	let request = require("request").defaults({encoding:null});
	if(!args || args == "help" || sargs[0] == "help"){
		msg.channel.createMessage("**__Steam Help__**\n\t\u2022 help - This command\n\t\u2022 lookup - Looks up a profile")
	}else if(args == "lookup" || sargs[0] == "lookup"){
		if(sargs[1]){
			msg.channel.createMessage("Searching...")
			.then(m=>{
			request.get(steam.url+"ISteamUser/ResolveVanityURL/v1/?key="+steam.key+"&vanityurl="+sargs[1]+"&format=json",(e,res,body)=>{
					if(!e && res.statusCode == 200){
						let data = JSON.parse(body).response
						if(data.success != 1){
							flexbot.bot.editMessage(msg.channel.id,m.id,"User not found.")
						}else{
							var output = "```prolog\nUser data for: \""+sargs[1]+"\"\n"
							request.get(steam.url+"ISteamUser/GetPlayerSummaries/v2/?key="+steam.key+"&steamids="+data.steamid+"&format=json",(e,res2,body2)=>{
								let data2 = JSON.parse(body2).response.players[0];
								let odd = parseInt(data.steamid)%2 == 1 ? 1 : 0;
								let sid16 = parseInt(((parseInt(data.steamid)-steam.sidbase)-odd)/2,10)
								request.get(steam.url+"IPlayerService/GetSteamLevel/v1/?key="+steam.key+"&steamid="+data.steamid+"&format=json",function(e,lres,lbody){
			if(!e && lres.statusCode == 200){
				let ldata = JSON.parse(lbody).response
				output+="\tName: "+data2.personaname+"\n\tLevel: "+ldata.player_level+"\n\tSteamID64: "+data2.steamid+"\n\tSteamID16: STEAM_0:"+odd+":"+sid16+"\n\tAvatar URL: "+data2.avatarfull+"\n```"
				flexbot.bot.editMessage(msg.channel.id,m.id,output)
								request.get(data2.avatarfull,function(e,ares,abody){
			if(!e && ares.statusCode == 200){
				msg.channel.createMessage("",{name:"steam_avatar.png",file:new Buffer(abody)})
			}
		})
		}
		})
							})
						}
					}else{
						flexbot.bot.editMessage(msg.channel.id,m.id,"Error in request: "+e)
					}
				})
			})
		}else{
			msg.channel.createMessage("No arguments given.")
		}
	}
})