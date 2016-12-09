var flexbot = global.flexbot
var emoji = require("node-emoji")

var semoji = [
	":cherries:",
	":spades:",
	":lemon:",
	":diamonds:",
	":seven:",
	":clubs:",
	":apple:",
	":eyes:",
	":hearts:",
	":money_with_wings:"
]

flexbot.addCommand("slots","A slot machine with no reward.",function(msg,args){
	var res = ":regional_indicator_s:\u200b:regional_indicator_l::regional_indicator_o::regional_indicator_t::regional_indicator_s:\n:black_large_square::white_large_square::black_large_square::white_large_square::black_large_square:"

	var s = [
		[],
		[],
		[]
	]
	for(i=0;i<3;i++){
		var rnd = Math.floor(Math.random()*semoji.length)
		s[i] = []
		s[i][0] = rnd==0 ? semoji[semoji.length-1] : semoji[rnd-1]
		s[i][1] = semoji[rnd]
		s[i][2] = rnd==semoji.length-1 ? semoji[0] : semoji[rnd+1]
	}
	res+="\n:white_large_square:"+s[0][0]+s[1][0]+s[2][0]+":white_large_square:"
	res+="\n:arrow_forward:"+s[0][1]+s[1][1]+s[2][1]+":arrow_backward:"
	res+="\n:white_large_square:"+s[0][2]+s[1][2]+s[2][2]+":white_large_square:"
	res+="\n:black_large_square::white_large_square::black_large_square::white_large_square::black_large_square:"
	res=res.replace("\ufe0f","")
	if(s[0][1] == s[1][1] && s[1][1] == s[2][1]){
		res+="\n\nYou won!"
	}else{
		res+="\n\nSorry, you lost."
	}
	msg.channel.createMessage(emoji.emojify(res))
})

flexbot.addCommand("blackjack","Play a hand of Blackjack with the bot",function(msg,args){
	let suits = [
		"\u2665",
		"\u2666",
		"\u2660",
		"\u2663"
	];

	let face = ["J","Q","K"]

	let dealer = [];
	let player = [];

	let d_num = [];
	let p_num = [];

	let suit;
	let rng;
	let card1 = "";
	let card2 = "";
	let d_total;
	let p_total;

	suit = Math.floor(Math.random() * 4);
	rng = Math.floor(Math.random() * 10)+1;
	d_num.push(rng);
	card1 = suits[suit]+""+(rng == 1 ? "A" : rng == 10 ? face[Math.floor(Math.random() * 3)] : parseInt(rng));

	suit = Math.floor(Math.random() * 4);
	rng = Math.floor(Math.random() * 10)+1;
	p_num.push(rng);
	card2 = suits[suit]+""+(rng == 1 ? "A" : rng == 10 ? face[Math.floor(Math.random() * 3)] : parseInt(rng));

	dealer.push(card1);
	player.push(card2);

	msg.channel.createMessage({
		content:"Dealer deals a card to each of you.",
		embed:{
			author:{
				name:"Dealer: "+dealer.join(", "),
				icon_url:flexbot.bot.user.avatarURL
			},
			footer:{
				text:"Player: "+player.join(", "),
				icon_url:msg.author.avatarURL
			},
			color:0xdf0000
		}
	});
	flexbot.awaitForMessage(msg,"`hit` or `fold`? (do not prefix with command, just say the word)")
	.then(m=>{
		if(m.content.toLowerCase() == "hit"){
			suit = Math.floor(Math.random() * 4);
			rng = Math.floor(Math.random() * 10)+1;
			d_num.push(rng);
			card1 = suits[suit]+""+(rng == 1 ? "A" : rng == 10 ? face[Math.floor(Math.random() * 3)] : parseInt(rng));

			suit = Math.floor(Math.random() * 4);
			rng = Math.floor(Math.random() * 10)+1;
			p_num.push(rng);
			card2 = suits[suit]+""+(rng == 1 ? "A" : rng == 10 ? face[Math.floor(Math.random() * 3)] : parseInt(rng));

			dealer.push(card1);
			player.push(card2);

			d_total = 0;
			p_total = 0;

			for(let i = 0;i<d_num.length;i++){
				d_total += d_num[i];
			};

			for(let i = 0;i<p_num.length;i++){
				p_total += p_num[i];
			};

			msg.channel.createMessage({
				content:"Dealer deals a card to each of you.",
				embed:{
					author:{
						name:"Dealer: "+dealer.join(", "),
						icon_url:flexbot.bot.user.avatarURL
					},
					footer:{
						text:"Player: "+player.join(", "),
						icon_url:msg.author.avatarURL
					},
					color:0xdf0000
				}
			})
			.then(m=>{
				let out = "";
				if(d_total>p_total){
					out = "Dealer wins!";
				}else if(d_total<p_total){
					out = "Player wins!";
				}else if(d_total>21 && !p_total>21){
					out = "Dealer busts, player wins!";
				}else if(p_total>21 && !d_total>21){
					out = "Player busts, dealer wins!";
				}else{
					out = "Draw!";
				}
				msg.channel.createMessage(out);
			});

		}else if(m.content.toLowerCase() == "fold"){
			suit = Math.floor(Math.random() * 4);
			rng = Math.floor(Math.random() * 10)+1;
			d_num.push(rng);
			card1 = suits[suit]+""+(rng == 1 ? "A" : rng == 10 ? face[Math.floor(Math.random() * 3)] : parseInt(rng));

			dealer.push(card1);

			d_total = 0;
			p_total = 0;

			for(let i = 0;i<d_num.length;i++){
				d_total += d_num[i];
			};

			for(let i = 0;i<p_num.length;i++){
				p_total += p_num[i];
			};

			msg.channel.createMessage({
				content:"Player folds, dealer draws a card for themself.",
				embed:{
					author:{
						name:"Dealer: "+dealer.join(", "),
						icon_url:flexbot.bot.user.avatarURL
					},
					footer:{
						text:"Player: "+player.join(", "),
						icon_url:msg.author.avatarURL
					},
					color:0xdf0000
				}
			})
			.then(m=>{
				let out = "";
				if(d_total>p_total){
					out = "Dealer wins!";
				}else if(d_total<p_total){
					out = "Player wins!";
				}else if(d_total>21 && !p_total>21){
					out = "Dealer busts, player wins!";
				}else if(p_total>21 && !d_total>21){
					out = "Player busts, dealer wins!";
				}else{
					out = "Draw!";
				}
				msg.channel.createMessage(out);
			});
		}
	});
});