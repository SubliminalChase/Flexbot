var flexbot = global.flexbot
var emoji = require("node-emoji")
var request = require('request')
var xml2js = require("xml2js")

flexbot.addCommand("e621","[NSFW] Gets an image from e621.",function(msg,args){
	if(!msg.guild || msg.channel.name.search("nsfw") > -1 || msg.channel.topic.indexOf("[nsfw]") > -1){
		let tags = [];
		if(args) tags = JSON.parse(JSON.stringify(args.split(" ")));
		
		let tagss = "";
		for(t in tags){
			tagss+=tags[t]+"%20"
		}
		request.get("https://e621.net/post/index.json?limit=75&tags="+tagss,{headers:{"User-Agent":"FlexBot/8.0 (Flex)"}},function(e,res,body){
			if(!e && res.statusCode == 200){
				let data = JSON.parse(body)
				if(data.length>0){
				let post = data[Math.floor(Math.random()*data.length)]
				
				msg.channel.createMessage({embed:{
					color:0x000080,
					description:"**Author**: "+post.author+"\n**Score**: "+post.score+"\n**Rating**: "+post.rating+"\n**Tags**: \n```"+post.tags+"```",
					fields:[
						{name:"Image",value:"[Full Sized]("+encodeURI(post.file_url)+")"}
					],
					image:{
						url:post.sample_url
					}
				}})
				}else{
					msg.channel.createMessage("Nothing found.")
				}
			}
		})
	}else{
		msg.channel.createMessage("Channel name does not contain `nsfw` and topic does not contain `[nsfw]`.")
	}
})

flexbot.addCommand("gelbooru","[NSFW] Gets an image from Gelbooru.",function(msg,args){
	if(!msg.guild || msg.channel.name.search("nsfw") > -1 || msg.channel.topic.toLowerCase().indexOf("[nsfw]") > -1){
		let tags = [];
		if(args) tags = JSON.parse(JSON.stringify(args.split(" ")));
		
		let tagss = "";
		for(t in tags){
			tagss+=tags[t]+"%20"
		}
		request.get("http://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=75&tags="+tagss,{headers:{"User-Agent":"FlexBot/8.0 (Flex)"}},function(e,res,body){
			if(!e && res.statusCode == 200){
				let data;
				xml2js.parseString(body,(err,d)=>{data=d})
				if(data.posts.post){
					let post = data.posts.post[Math.floor(Math.random()*data.posts.post.length)].$
					msg.channel.createMessage({embed:{
						color:0x0080FF,
						description:"**Score**: "+post.score+"\n**Rating**: "+post.rating+"\n**Tags**: \n```"+post.tags+"```",
						fields:[
							{name:"Image",value:"[Full Sized]("+encodeURI(post.file_url)+")"}
						],
						image:{
							url:post.sample_url
						}
					}})
				}else{
					msg.channel.createMessage("Nothing found.")
				}
			}
		})
	}else{
		msg.channel.createMessage("Channel name does not contain `nsfw` and topic does not contain `[nsfw]`.")
	}
},["gb","gel"])

flexbot.addCommand("rule34","[NSFW] Gets an image from Rule 34.",function(msg,args){
	if(!msg.guild || msg.channel.name.search("nsfw") > -1 || msg.channel.topic.toLowerCase().indexOf("[nsfw]") > -1){
		let tags = [];
		if(args) tags = JSON.parse(JSON.stringify(args.split(" ")));
		
		let tagss = "";
		for(t in tags){
			tagss+=tags[t]+"%20"
		}
		request.get("http://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=75&tags="+tagss,{headers:{"User-Agent":"FlexBot/8.0 (Flex)"}},function(e,res,body){
			if(!e && res.statusCode == 200){
				let data;
				xml2js.parseString(body,(err,d)=>{data=d})
				if(data.posts.post){
				let post = data.posts.post[Math.floor(Math.random()*data.posts.post.length)].$
				msg.channel.createMessage({embed:{
					color:0xAAE5A3,
					description:"**Score**: "+post.score+"\n**Rating**: "+post.rating+"\n**Tags**: \n```"+post.tags+"```",
					fields:[
						{name:"Image",value:"[Full Sized]("+encodeURI(post.file_url)+")"}
					],
					image:{
						url:"http:"+post.sample_url
					}
				}})
				}else{
					msg.channel.createMessage("Nothing found.")
				}
			}
		})
	}else{
		msg.channel.createMessage("Channel name does not contain `nsfw` and topic does not contain `[nsfw]`.")
	}
},["r34"])