var flexbot = global.flexbot
var emoji = require("node-emoji")
var request = require('request')

flexbot.addCommand("echo","Echo, echo, echo",function(msg,args){
	msg.channel.createMessage("\u200b"+args)
},["say"],"[string]")

flexbot.addCommand("status","Sets bots status",function(msg,args){
	flexbot.bot.editStatus("online",{name:args})
	msg.channel.createMessage("Set status.")
},[],"[string]")

flexbot.addCommand("avatar","Get an avatar of someone",function(msg,args){
	flexbot.lookupUser(msg,args ? args : msg.author.mention)
	.then(u=>{
		let av = "https://cdn.discordapp.com/avatars/"+u.id+"/"+u.avatar+"."+(u.avatar.startsWith("a_") ? "gif" : "png")+"?size=1024";
		msg.channel.createMessage({
			content:"Avatar for **"+u.username+"#"+u.discriminator+"**:",
			embed:{
				image:{
					url:av
				}
			}
		})
	})
},[],"[user]")

flexbot.addCommand("roll","Roll dice",function(msg,args){
	msg.channel.createMessage("Rolling...")
	.then((m)=>{
		var w = "\u2B1C"
		var b = "\uD83D\uDD33"

		var dice = [
			w+w+w+"\n"+w+b+w+"\n"+w+w+w,
			b+w+w+"\n"+w+w+w+"\n"+w+w+b,
			b+w+w+"\n"+w+b+w+"\n"+w+w+b,
			b+w+b+"\n"+w+w+w+"\n"+b+w+b,
			b+w+b+"\n"+w+b+w+"\n"+b+w+b,
			b+w+b+"\n"+b+w+b+"\n"+b+w+b
		]

		var rng = Math.floor(Math.random()*(dice.length))

		setTimeout(()=>{
			flexbot.bot.editMessage(msg.channel.id,m.id,"You rolled: "+(rng+1)+"\n"+dice[rng])
		},2500)
	})
},["dice"])

flexbot.addCommand("info","It's like a business card in a message",function(msg,args){
	msg.channel.createMessage({embed:{
		color:0xEB0763,
		title:"FlexBot v8",
		url:"https://flexbox.xyz/flexbot",
		author:{
			name:"A bot written by Flex#5917",
			icon_url:"https://flexbox.xyz/assets/img/Avatar9.png"
		},
		description:"**Language**: Javascript\n**Library**: Eris\n\n[GitHub](https://github.com/LUModder/FlexBot) | [Invite](https://discordapp.com/oauth2/authorize?client_id=173441062243663872&scope=bot&permissions=0) | [Server](https://discord.gg/ZcXh4ek)"
	}})
},["about"])

flexbot.addCommand("stats","Oooh, numbers",function(msg,args){
	let uptime = flexbot.bot.uptime
	let s = uptime/1000
	let h = parseInt(s/3600)
	s=s%3600
	let m = parseInt(s/60)
	s=s%60
	s=parseInt(s)

	let tstr = (h < 10 ? "0"+h : h)+":"+(m < 10 ? "0"+m : m)+":"+(s < 10 ? "0"+s : s)

	let cmdcount = 0
	for(c in flexbot.cmds){cmdcount++}

	msg.channel.createMessage("```ini\n; FlexBot Stats\nservers = "+flexbot.bot.guilds.size+"\ncommands = "+cmdcount+"\n[Uptime: "+tstr+"]\n```")
})

flexbot.addCommand("invite","Invite FlexBot to your server!",function(msg,args){
	msg.channel.createMessage("Invite me with this link: https://discordapp.com/oauth2/authorize?client_id=173441062243663872&scope=bot&permissions=0")
})

flexbot.addCommand("calc","Do maths",function(msg,args){
	let math = require("mathjs");
	msg.channel.createMessage("Result: "+math.eval(args));
},["math"],"[math stuffs]")

flexbot.addCommand("ship","Ship two users.",async function(msg,args){
	let a = args.split(" ");
	let u1 = {};
	let u2 = {};
	if(!a[1]){
		let u = await flexbot.lookupUser(msg,a[0])
		
		if(u.id == msg.author.id){
			msg.channel.createMessage(emoji.get(":heart:")+" **"+msg.author.username+"** ships themself with... themself... Sure are lonely, aren't ya... That's okay, you have me. *hugs*")
		}else{
			msg.channel.createMessage(emoji.get(":heart:")+" **"+msg.author.username+"** ships themself with **"+u.username+"** ("+(Math.floor(Math.random()*100)+1)+"% compatibility)")
		}
	}else if(a[1]){
		u1 = await flexbot.lookupUser(msg,a[0])
		u2 = await flexbot.lookupUser(msg,a[1])
		msg.channel.createMessage(emoji.get(":heart:")+" **"+msg.author.username+"** ships **"+u1.username+"** with **"+u2.username+"** ("+(Math.floor(Math.random()*100)+1)+"% compatibility)")
	}else{
		msg.channel.createMessage("Not enough arguments.")
	}
},[],"[user1],<user2>")

flexbot.addCommand("cat","The typical picture of a cat command",function(msg,args){
	let request = require("request");
	request.get("http://random.cat/meow",function(e,res,body){
		let img = JSON.parse(body).file;
		msg.channel.createMessage({
			content:"meow, have a cat",
			embed:{
				color:Math.floor(Math.random()*16777216),
				image:{
					url:img
				},
				footer:{
					text:"Image provided by random.cat"
				}
			}
		});
	});
})

flexbot.addCommand("dog","The typical picture of a dog command",function(msg,args){
	let request = require("request");
	request.get("http://random.dog/woof",function(e,res,body){
		if(!e && res.statusCode == 200){
			let img = "http://random.dog/"+body;
			msg.channel.createMessage({
				content:"borf, have a mutt",
				embed:{
					color:Math.floor(Math.random()*16777216),
					image:{
						url:img
					},
					footer:{
						text:"Image provided by random.dog"
					}
				}
			});
		}else{
			msg.channel.createMessage("An error occured, try again later.\n\n```\n"+e+"```")
		}
	});
})

flexbot.addCommand("currency","Convert one form of currency to another",function(msg,args){
	let a = args.split(" ")
	let request = require("request");
	request.get("https://www.google.com/finance/converter?a=1&from="+a[0]+"&to="+a[1],function(e,res,body){
		if(!e && res.statusCode == 200){
			let amt = body.match(/<span class=bld>(.+)<\/span>/)[1];
			msg.channel.createMessage("**1 "+a[0].toUpperCase()+"** is equal to **"+amt+"**");
		}else{
			msg.channel.createMessage("An error occured, try again later.\n\n```\n"+e+"```")
		}
	});
});

flexbot.addCommand("meirl","Pull a random post from r/me_irl",function(msg,args){
	let request = require("request");
	request.get("http://www.reddit.com/r/me_irl/new.json?sort=default&count=50",function(e,r,b){
		if(!e && r.statusCode == 200){
			let data = JSON.parse(b).data.children;
			let post = data[Math.floor(Math.random()*data.length)].data;
			post.url = post.url.replace(/http(s)?:\/\/(m\.)?imgur\.com/g,"https://i.imgur.com");
			post.url = post.url.replace(new RegExp('&amp;','g'),"&");
			post.url = post.url.replace("/gallery","");
			post.url = post.url.replace("?r","");
			
			if(post.url.indexOf("imgur") > -1 && post.url.substring(post.url.length-4,post.url.length-3) != "."){
				post.url+=".png";
			}
			
			msg.channel.createMessage({embed:{
				title:post.title,
				url:"https://reddit.com"+post.permalink,
				author:{
					name:"u/"+post.author
				},
				description:"[Image/Video]("+post.url+")",
				image:{
					url:encodeURI(post.url)
				},
				footer:{
					text:"Powered by r/me_irl"
				}
			}});
		}else{
			msg.channel.createMessage("An error occured, try again later.\n\n```\n"+e+"```")
		}
	});
});

flexbot.addCommand("shitpost","You might loose braincells.",function(msg,args){
	let request = require("request");
	request.get("http://www.reddit.com/r/memes/new.json?sort=default&count=50",function(e,r,b){
		if(!e && r.statusCode == 200){
			let data = JSON.parse(b).data.children;
			let post = data[Math.floor(Math.random()*data.length)].data;
			post.url = post.url.replace(/http(s)?:\/\/(m\.)?imgur\.com/g,"https://i.imgur.com");
			post.url = post.url.replace(new RegExp('&amp;','g'),"&");
			post.url = post.url.replace("/gallery","");
			post.url = post.url.replace("?r","");
			
			if(post.url.indexOf("imgur") > -1 && post.url.substring(post.url.length-4,post.url.length-3) != "."){
				post.url+=".png";
			}
			
			msg.channel.createMessage({embed:{
				title:post.title,
				url:"https://reddit.com"+post.permalink,
				author:{
					name:"u/"+post.author
				},
				description:"[Image/Video]("+post.url+")",
				image:{
					url:encodeURI(post.url)
				},
				footer:{
					text:"Powered by r/memes"
				}
			}});
		}else{
			msg.channel.createMessage("An error occured, try again later.\n\n```\n"+e+"```")
		}
	});
});

flexbot.addCommand("copypasta","Stuff to copypaste",function(msg,args){
	let request = require("request");
	request.get("http://www.reddit.com/r/copypasta/new.json?sort=default&count=50",function(e,r,b){
		if(!e && r.statusCode == 200){
			let data = JSON.parse(b).data.children;
			let post = data[Math.floor(Math.random()*data.length)].data;
			
			msg.channel.createMessage(post.selftext.substring(0,1996-18-post.permalink.length)+(post.selftext.length > (1996-18-post.permalink.length) ? "...\nhttps://reddit.com"+post.permalink : ""));
		}else{
			msg.channel.createMessage("An error occured, try again later.\n\n```\n"+e+"```")
		}
	});
});

let blacklist = ["-comic","-cleavage","-bikini","-naked","-naked_towel","-underwear","-briefs","-blood","-fat","-animatronic"]

flexbot.addCommand("foxgirl","Gets a random image of a foxgirl",function(msg,args){
	request.get("https://ibsear.ch/api/v1/images.json?q=foxgirl%20"+blacklist.join("%20")+"&limit=75&shuffle=20",function(err,res,body){
		if(!err && res.statusCode == 200){
			let data = JSON.parse(body);
			let img = data[Math.floor(Math.random()*data.length)]
			
			msg.channel.createMessage({content:"awuuuu~",embed:{
				description:"```"+img.tags+"```",
				image:{
					url:"https://im1.ibsear.ch/"+img.path
				}
			}})
		}else{
			msg.channel.createMessage("An error occured, try again later.")
		}
	});
},["awuuuu"]);