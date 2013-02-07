

function rollDice(str) {
	var result = rollExpression(str);
	if(result === undefined) {
		bootbox.alert("The roll '"+str+"'' is invalid.");
		return 0;
	}
	return result;
}

function determineRoll($node) {
	if($node.hasClass('roll_me')) {
		var hp = rollExpression($node.attr('data-base-value'));
		$node.attr('data-initial-roll', hp);
	}
}

function get_bonus(num) {
	num=parseInt(num);
	if(num == 0 || isNaN(num)) return 0;
	return Math.floor(num/2)-5;
}

function _cleanName(str) {
	return str.split(' ').join('');
}

var defaultFunction = function() {
	return "THIS IS AN ERROR";
};

var formatting = {
	madvanc: 	defaultFunction,
	malign: 	defaultFunction,
	marmor: 	function(obj) {
		return obj.aname + (obj.enchantment_bonus != "0" ? " +"+obj.enchantment_bonus : "");
	},
	mattack:  	function(obj) {
		return obj.aname + "</td><td>"+obj.hitdc+"</td><td class='rightalign'>" + (obj.dmgname != null ? "+"+obj.dmgred_hd + " " + obj.dmgname : "");
	},
	mdmgred: 	function(obj) {
		return obj.name + "</td><td>" + (obj.reduction_amount=="0" ? "Immune" : obj.reduction_amount);
	},
	mfeat: 		function(obj) {
		return obj.name + (obj.feat_level > 1 ? " (x"+obj.feat_level+")" : "");
	},
	mfatk: 		defaultFunction,
	mlang: 		defaultFunction,
	mmove:    	function(obj) {
		return obj.movement_type + "</td><td>" + obj.movement_speed+"ft";
	},
	morgani: 	defaultFunction,
	mqualit:  	function(obj) {
		return obj.name + "</td><td>" + (obj.value != "0" ? obj.value+ (obj.name!="Spell Resistance" && obj.name!="Regeneration" && obj.name!="Turn Resistance" ? "ft" : "") : "");
	},
	mskill: 	function(obj) {
		return obj.name + (obj.sub_skill!="" ? " ("+obj.sub_skill+")" : "") + "</td><td>" + (parseInt(obj.skill_level)<0 ? obj.skill_level : "+"+obj.skill_level);
	},
	mspatk: 	function(obj) {
		return obj.name + "</td><td>" + (obj.range != "0" ? obj.range+"ft" : "") + "</td><td>" + (obj.hit_dice != "0" ? obj.hit_dice : "");
	},
	msubcat: 	defaultFunction,
	mterr: 		defaultFunction,
	mtype: 		defaultFunction,
	mweapon: 	function(obj) {
		return obj.extra_wsize + " " + obj.wname + (obj.enchantment_bonus != "0" ? " +"+obj.enchantment_bonus : "") + "</td><td>" + obj.hitdc + "</td><td class='rightalign'>" + (obj.dmgname != null ? "+"+obj.dmgred_hd + " " + obj.dmgname : "");
	}
};

var rollable = {
	mattack: function(obj) {
		return obj.hitdc + (obj.dmgname != null ? "+"+obj.dmgred_hd : "");
	},
	mskill: function(obj) {
		return "1d20"+(obj.skill_level<0 ? obj.skill_level : "+"+obj.skill_level);
	},
	mweapon: function(obj) {
		return obj.hitdc + (obj.dmgname != null ? "+"+obj.dmgred_hd : "");
	}

};

var mainStat = {
	mattack: function(obj) {
		return obj.aname;
	},
	mskill: function(obj) {
		return obj.name;
	},
	mweapon: function(obj) {
		return obj.wname;
	}
};