var flexbot = global.flexbot
var emoji = require("node-emoji")
var fs = require("fs")
var gm = require("gm")
var request = require("request")

flexbot.addCommand("magik","Warp an image",function(msg,args){
	
},["magic","imagik","imagic"])

flexbot.addCommand("needsmorejpeg","Compress an image with JPEG",function(msg,args){
	if(args && args.indexOf("http")>-1){
		gm(request(args))
		.quality(1)
		.toBuffer("JPEG",(e,b)=>{
			if(!e){
				msg.channel.createMessage("",{name:"needsmorejpeg.jpg",file:b})
			}
		})
	}else if(msg.attachments.length>0){
		gm(request(msg.attachments[0].url))
		.quality(1)
		.toBuffer("JPEG",(e,b)=>{
			if(!e){
				msg.channel.createMessage("",{name:"needsmorejpeg.jpg",file:b})
			}
		})
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
},["nmjpeg"])

let haah = function(msg,img){
	gm(request(img)).size((e,v)=>{
	if(!e){
	let w=v.width
	let h=v.height
	
	gm(request(img)).crop(w/2,h,0,0)
	.toBuffer("PNG",(e,b)=>{
		if(!e){
			gm(b).flop()
			.toBuffer("PNG",(e,b2)=>{
				if(!e){
					fs.writeFileSync(__dirname+"/../imgtmp/haah.png",b2)
					gm(b).append(__dirname+"/../imgtmp/haah.png",true)
					.toBuffer("PNG",(e,out)=>{
						if(!e){
							msg.channel.createMessage("",{
								name:"haah.png",
								file:out
							})
						}
					})
				}
			})
		}
	})
	}
	})
}

flexbot.addCommand("haah","Mirror left to right side",function(msg,args){
	if(args && args.indexOf("http")>-1){
		haah(msg,args)
	}else if(msg.attachments.length>0){
		haah(msg,msg.attachments[0].url)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
})

let waaw = function(msg,img){
	gm(request(img)).size((e,v)=>{
	if(!e){
	let w=v.width
	let h=v.height
	
	gm(request(img)).crop(w/2,h,w/2,0)
	.toBuffer("PNG",(e,b)=>{
		if(!e){
			gm(b).flop()
			.toBuffer("PNG",(e,b2)=>{
				if(!e){
					fs.writeFileSync(__dirname+"/../imgtmp/waaw.png",b)
					gm(b2).append(__dirname+"/../imgtmp/waaw.png",true)
					.toBuffer("PNG",(e,out)=>{
						if(!e){
							msg.channel.createMessage("",{
								name:"waaw.png",
								file:out
							})
						}
					})
				}
			})
		}
	})
	}
	})
}

flexbot.addCommand("waaw","Mirror right to left side",function(msg,args){
	if(args && args.indexOf("http")>-1){
		waaw(msg,args)
	}else if(msg.attachments.length>0){
		waaw(msg,msg.attachments[0].url)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
})

let hooh = function(msg,img){
	gm(request(img)).size((e,v)=>{
	if(!e){
	let w=v.width
	let h=v.height
	
	gm(request(img)).crop(w,h/2,0,0)
	.toBuffer("PNG",(e,b)=>{
		if(!e){
			gm(b).flip()
			.toBuffer("PNG",(e,b2)=>{
				if(!e){
					fs.writeFileSync(__dirname+"/../imgtmp/hooh.png",b2)
					gm(b).append(__dirname+"/../imgtmp/hooh.png",false)
					.toBuffer("PNG",(e,out)=>{
						if(!e){
							msg.channel.createMessage("",{
								name:"hooh.png",
								file:out
							})
						}
					})
				}
			})
		}
	})
	}
	})
}

flexbot.addCommand("hooh","Mirror top to bottom side",function(msg,args){
	if(args && args.indexOf("http")>-1){
		hooh(msg,args)
	}else if(msg.attachments.length>0){
		hooh(msg,msg.attachments[0].url)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
})

let woow = function(msg,img){
	gm(request(img)).size((e,v)=>{
	if(!e){
	let w=v.width
	let h=v.height
	
	gm(request(img)).crop(w,h/2,0,h/2)
	.toBuffer("PNG",(e,b)=>{
		if(!e){
			gm(b).flip()
			.toBuffer("PNG",(e,b2)=>{
				if(!e){
					fs.writeFileSync(__dirname+"/../imgtmp/woow.png",b)
					gm(b2).append(__dirname+"/../imgtmp/woow.png",false)
					.toBuffer("PNG",(e,out)=>{
						if(!e){
							msg.channel.createMessage("",{
								name:"woow.png",
								file:out
							})
						}
					})
				}
			})
		}
	})
	}
	})
}

flexbot.addCommand("woow","Mirror bottom to top side",function(msg,args){
	if(args && args.indexOf("http")>-1){
		woow(msg,args)
	}else if(msg.attachments.length>0){
		woow(msg,msg.attachments[0].url)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
})

let triggered = function(msg,img){
	gm(request(img)).size((e,v)=>{
	if(!e){
	let w=v.width
	let h=v.height
	
	gm(request(img))
	.toBuffer("PNG",(e,i)=>{
		if(!e){
			gm(w,32,"#ff800000")
			.font("Tahoma")
			.fontSize(20)
			.drawText(0,0,"TRIGGERED","center")
			.toBuffer("PNG",(e,t)=>{
				if(!e){
					fs.writeFileSync(__dirname+"/../imgtmp/triggered.png",t)
					gm(i).append(__dirname+"/../imgtmp/triggered.png",false)
					.toBuffer("PNG",(e,out)=>{
						if(!e){
							msg.channel.createMessage("",{
								name:"triggered.png",
								file:out
							})
						}
					})
				}
			})
		}
	})
	}
	})
}

flexbot.addCommand("triggered","Add the orange trigger bar to an image",function(msg,args){
	if(args && args.indexOf("http")>-1){
		triggered(msg,args)
	}else if(msg.attachments.length>0){
		triggered(msg,msg.attachments[0].url)
	}else if(/\D/.test(args)){
		let u = flexbot.bot.users.get(args.replace(/\D/g,""))
		triggered(msg,u.avatarURL)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
})