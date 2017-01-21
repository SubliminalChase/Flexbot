var flexbot = global.flexbot
var emoji = require("node-emoji")
var fs = require("fs")
var jimp = require("jimp")
var request = require("request")

let nmj = function(url){
	jimp.read(url)
	.then(im=>{
		im.quality(Math.floor(Math.random()*5)+1);
		im.getBuffer(jimp.MIME_JPEG,(e,f)=>{
			msg.channel.createMessage("",{name:"needsmorejpeg.jpg",file:f});
		});
	});
}

flexbot.addCommand("needsmorejpeg","Compress an image with JPEG",function(msg,args){
	if(args && args.indexOf("http")>-1){
		nmj(args)
	}else if(msg.attachments.length>0){
		nmj(msg.attachments[0].url)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
},["nmjpeg"])

let mirror = function(url,lr,ud){
	if(lr && lr == true){ //haah
	
	}else if(lr && lr == false){ //waaw
	
	}else if(ud && ud == true){ //woow
	
	}else if(ud && ud == false){ //hooh
	
	}
}

flexbot.addCommand("haah","Mirror left half of an image to the right",function(msg,args){
	if(args && args.indexOf("http")>-1){
		mirror(args,true)
	}else if(msg.attachments.length>0){
		mirror(msg.attachments[0].url,true)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
})