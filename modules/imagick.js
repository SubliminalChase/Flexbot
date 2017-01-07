var flexbot = global.flexbot
var emoji = require("node-emoji")
var fs = require("fs")
var jimp = require("jimp")
var request = require("request")

flexbot.addCommand("needsmorejpeg","Compress an image with JPEG",function(msg,args){
	if(args && args.indexOf("http")>-1){
		jimp.read(args)
		.then(im=>{
			im.quality(5);
			im.getBuffer(jimp.MIME_JPEG,(e,f)=>{
				msg.channel.createMessage("",{name:"needsmorejpeg.jpg",file:f});
			});
		});
	}else if(msg.attachments.length>0){
		jimp.read(msg.attachments[0].url)
		.then(im=>{
			im.quality(5);
			im.getBuffer(jimp.MIME_JPEG,(e,f)=>{
				msg.channel.createMessage("",{name:"needsmorejpeg.jpg",file:f});
			});
		});
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
},["nmjpeg"])

flexbot.addCommand("haah","Mirror left half of an image to the right",function(msg,args){
	if(args && args.indexOf("http")>-1){
		jimp.read(args)
		.then(im=>{
			im.quality(5);
			im.getBuffer(jimp.MIME_JPEG,(e,f)=>{
				msg.channel.createMessage("",{name:"needsmorejpeg.jpg",file:f});
			});
		});
	}else if(msg.attachments.length>0){
		jimp.read(msg.attachments[0].url)
		.then(im=>{
			im.quality(5);
			im.getBuffer(jimp.MIME_JPEG,(e,f)=>{
				msg.channel.createMessage("",{name:"needsmorejpeg.jpg",file:f});
			});
		});
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
})