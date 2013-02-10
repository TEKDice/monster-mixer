

function rollDice(str) {
	var result;
	try {
		var rolls = $.parseJSON(str);
		result = [];
		$.each(rolls, function(i, e) {
			if(typeof e == 'string' && e.indexOf('d') != -1) 
				result[i] = parseInt(rollExpression(e));
			else
				result[i] = parseInt(e);
		});

	} catch(e) {
		result = rollExpression(str);
	}
	if(result === undefined) {
		bootbox.alert("The roll '"+str+"'' is invalid.");
		return null;
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

function bodyBinding() {
	$("body").on('click', '.modify-hp', function() {
		var uid = $(this).attr('data-uid');
		var modHp = parseInt($("#"+uid+"_hp_mod").val());
		modifyHp(uid, modHp);
	});

	$("body").on('click', '.reroll-hp', function() {
		var uid = $(this).attr('data-uid');
		var $rootNode = $(this).closest("span[data-attr='hit_dice']");
		var newHp = rollExpression($rootNode.attr('data-base-value'));
		rollHp(uid, $rootNode, newHp);
	});

	$("body").on('click', '.left', function() {
		var $cur = $("#monsterList").children(".active");
		var $newtab;
		if($cur.is($("#monsterList").children().first())) {
			$newtab = $("#monsterList").children().last();
		} else {
			$newtab = $("#monsterList").children(".active").prev();
		}
		$newtab.children("a").tab('show');
	});

	$("body").on('click', '.right', function() {
		var $cur = $("#monsterList").children(".active");
		var $newtab;
		if($cur.is($("#monsterList").children().last())) {
			$newtab = $("#monsterList").children().first();
		} else {
			$newtab = $("#monsterList").children(".active").next();
		}
		$newtab.children("a").tab('show');
	});
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
		var ret = {};
		ret["Base"] = obj.hitdc;
		if(obj.dmgname != null) 
			ret[obj.dmgname] = obj.dmgred_hd;
		return JSON.stringify(ret);
	},
	mskill: function(obj) {
		var ret = {};
		ret["Base"] = "1d20";
		ret["Bonus"] = obj.skill_level;
		return JSON.stringify(ret);
	},
	mweapon: function(obj) {
		var ret = {};
		ret["Base"] = obj.hitdc;
		if(obj.dmgname != null) 
			ret[obj.dmgname] = obj.dmgred_hd;
		return JSON.stringify(ret);
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