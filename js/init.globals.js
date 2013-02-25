
function overlayLoadingGif() {
	$t = $("#monsterListCont");
	if(!$t.length) return;

	$("#overlay").css({
	  opacity : 0.8,
	  top     : $t.offset().top,
	  left	  : $t.offset().left,
	  width   : $t.outerWidth(),
	  height  : $t.outerHeight()
	});

	$("#img-load").css({
	  top  : ($t.height() / 2),
	  left : ($t.width() / 2)
	});
}

function rollDice(str) {
	var result;
	try {
		var rolls = $.parseJSON(str);
		result = [];
		$.each(rolls, function(i, e) {
			if(i == 'Base') i = 'Base ('+e+')';
			if(typeof e == 'string' && e.indexOf('d') != -1) 
				result[i] = parseInt(rollExpression(e));
			else
				result[i] = isNaN(parseInt(e)) ? 0 : parseInt(e);
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

	$(".loaded").livequery(function() {
		$(this).parent().find("tr[data-roll]:not(.unrollable)").each(function() {
			$(this).click(function() {
				$(this).siblings(".info").removeClass('info');
				if($(this).hasClass('info'))
					$(this).removeClass('info');
				else
					$(this).addClass('info');
			});
		});
	});

	$(".delete").livequery(function() {
		$(this).click(function() {
			var uid = $(this).attr('data-uid');
			var name = $("#"+uid+"_name").text();
			bootbox.confirm("Are you sure you want to remove "+name+" from the encounter?", function(result) {
				if(result)
					remove(uid, false);
			});
		});
	});
}

function collect() {
	var ret = {};
	var len = arguments.length;
	for (var i=0; i<len; i++) {
		for (p in arguments[i]) {
			if (arguments[i].hasOwnProperty(p)) {
				ret[p] = arguments[i][p];
			}
		}
	}
	return ret;
}

function clamp(min, max, num) {
	num = Math.max(min, num);
	num = Math.min(max, num);
	return num;
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
		return obj.aname + "</td><td>"+(obj.hitdc!='0' ? obj.hitdc : '')+"</td><td class='rightalign'>" + (obj.dmgname != null ? "+"+obj.dmgred_hd + " " + obj.dmgname : "");
	},
	mdmgred: 	function(obj) {
		return obj.name + "</td><td>" + (obj.reduction_amount=="0" ? "Immune" : obj.reduction_amount);
	},
	mfeat: 		function(obj) {
		return obj.name + (obj.feat_level > 1 ? " (x"+obj.feat_level+")" : "") +"</td><td>"+
		(obj.name == 'Power Attack' || obj.name == 'Combat Expertise' ? '<input class="input-mini-inline applyNum" type="number" placeholder="#"></input>' : '') + 
		(obj.name == 'Awesome Blow' || obj.name == 'Point Blank Shot' ? '<input class="inline-checkbox" type="checkbox"></input>' : '') + 
		"</td>";
	},
	mfatk: 		function(obj) {
		var name = [];
		$.each(obj, function(i, e) {
			if(e.wname) name.push(e.wname);
			if(e.atkname) name.push(e.atkname);
		});
		return name.join(", ");
	},
	mlang: 		defaultFunction,
	mmove:    	function(obj) {
		return obj.movement_type + "</td><td>" + obj.movement_speed+"ft";
	},
	morgani: 	defaultFunction,
	mqualit:  	function(obj) {
		return obj.name + "</td><td>" + (obj.value != "0" ? obj.value+ (obj.name!="Spell Resistance" && obj.name!="Regeneration" && obj.name!="Turn Resistance" ? "ft" : "") : "");
	},
	mskill: 	function(obj) {
		return obj.name + (obj.sub_skill!="" && obj.sub_skill!=null? " ("+obj.sub_skill+")" : "") + "</td><td>" + (parseInt(obj.skill_level)<0 ? obj.skill_level : "+"+obj.skill_level);
	},
	mspatk: 	function(obj) {
		return obj.name + "</td><td>" 
		+ (obj.range != "0" ? obj.range+"ft" : "") 
		+ "</td><td class='rightalign'>" 
		+ (obj.hit_dice != "0" ? obj.hit_dice : "")+" "
		+ (obj.dmgred_hd != "0" && obj.dmgred_hd != null? "+"+obj.dmgred_hd+" "+obj.dmgred_nm : "");
	},
	msubcat: 	defaultFunction,
	mterr: 		defaultFunction,
	mtype: 		defaultFunction,
	mweapon: 	function(obj) {
		return obj.extra_wsize + " " + obj.wname + (obj.enchantment_bonus != "0" ? " +"+obj.enchantment_bonus : "") + "</td><td>" + obj.hitdc + "</td><td class='rightalign'>" + (obj.dmgname != null ? "+"+obj.dmgred_hd + " " + obj.dmgname : "");
	}
};

function hasWeaponFocus(obj, uid) {
	if(hasFeat(uid, "Weapon Focus")) {
		var name = fullFeatName(uid, "Weapon Focus");
		var atk = name.substring(name.indexOf("(")+1, name.indexOf(")"));
		if(obj.aname != undefined) {
			if(atk.toLowerCase() == obj.aname.toLowerCase())
				return true;
		}
		if(obj.wname != undefined) {
			if(atk.toLowerCase() == obj.wname.toLowerCase())
				return true;
		}
	}
	return false;
}

//DAMAGE
var rollable = {
	mfatk: function(obj, uid) {
		var ret = [];

		$.each(obj, function(i, e) {
			var retO = {};

			//attack
			if(e.atkhd) {
				var json = rollable.mattack(e, uid);
				var parsed = $.parseJSON(json);
				retO = collect(retO, parsed);
			}

			//weapon
			if(e.wname) {
				e.mfa_strict = e.mfa_strict == "0" ? "1" : "0";
				var json = rollable.mweapon(e, uid, e.wir || e.mfa_range, e.mfa_strict);
				var parsed = $.parseJSON(json);
				retO = collect(retO, parsed);
			}

			ret.push(retO);
		});
		return JSON.stringify(ret);
	},
	mattack: function(obj, uid) {
		var ret = {};
		ret["Base"] = obj.hitdc;
		if(obj.dmgname != null) 
			ret[obj.dmgname] = obj.dmgred_hd;

		var strBonus = get_bonus(parseInt($("#"+uid+"_str").attr('data-base-value')));
		ret["STR Mod"] = Math.floor(strBonus*parseFloat(obj.max_str_mod));

		return JSON.stringify(ret);
	},
	mskill: function(obj, uid) {
		var ret = {};
		ret["Base"] = "1d20";
		ret["Bonus"] = obj.skill_level;
		return JSON.stringify(ret);
	},
	mweapon: function(obj, uid, range, melee) {
		var ret = {};
		ret["Base"] = obj.hitdc;
		if(obj.dmgname != null) 
			ret[obj.dmgname] = obj.dmgred_hd;
			
		var strBonus = get_bonus(parseInt($("#"+uid+"_str").attr('data-base-value')));
		var strMod = parseFloat(obj.max_str_mod) || 0;

		if(melee == "1") {

			if(obj.is_one_handed == "0") {
				ret["STR Mod (2h)"] = strBonus*1.5;
			} else {
				ret["STR Mod"] = strBonus;
			}

		} else {

			if(range!="0")
				ret["STR Mod"] = strBonus;
			else
				if(strBonus != 0)
					ret["STR Mod"] = strBonus > strMod && strMod != 0 ? strMod : strBonus;

		}

		console.log(obj.wname + " " + strBonus + " " + strMod);

		return JSON.stringify(ret);
	},
	mspatk: function(obj, uid) {
		var ret = {};
		if(obj.hit_dice!='0')
			ret["Base"] = obj.hit_dice;
		
		if(obj.dmgred_hd!='0') 
			ret[obj.dmgred_nm] = obj.dmgred_hd;

		var strBonus = get_bonus(parseInt($("#"+uid+"_str").attr('data-base-value'))) * parseFloat(obj.max_str_mod);
		if(strBonus!=0)	ret["STR Mod"] = strBonus;
		return JSON.stringify(ret);
	}

};

//TO HIT ROLLS
var attackRolls = {
	mfatk: function(obj, uid, range) {

		var ret = [];

		$.each(obj, function(i, e) {

			var retO = {};
			//attack
			if(e.atkhd) {
				var json = attackRolls.mattack(e, uid);
				var parsed = $.parseJSON(json);
				retO = collect(retO, parsed);
				if(parseFloat(e.mfa_class_mult) == 0.5) {
					if(hasFeat(uid, "Multiattack")) 
						retO["Secondary Penalty"] = -2;
					else
						retO["Secondary Penalty"] = -5;
				}
			}

			//weapon
			if(e.wname) {
				var json = attackRolls.mweapon(e, uid, e.mfa_range);
				var parsed = $.parseJSON(json);
				retO = collect(retO, parsed);
			}

			ret.push(retO);
		});

		/*
		}*/

		return JSON.stringify(ret);
	},
	mattack: function(obj, uid) {
		var ret = {};
		ret["Base"] = "1d20";

		if(hasWeaponFocus(obj, uid)) 
			ret["Weapon Focus"] = 1;

		var bab = parseInt($("#"+uid+"_bab").attr('data-base-value'));
		if(bab!=0)		ret["BAB"] = bab;

		var size = $("#"+uid+"_size").attr('data-base-value');
		var sizeNum = sizeModifier(size);
		if(sizeNum != 0) 
			ret["Size ("+size+")"] = sizeNum;

		if(obj.is_strictly_melee == "0") {
			if(hasFeat(uid, "Weapon Finesse")) {
				var dexBonus = get_bonus(parseInt($("#"+uid+"_dex").attr('data-base-value')));
				ret["DEX Mod"] = dexBonus;

			} else {
				var strBonus = get_bonus(parseInt($("#"+uid+"_str").attr('data-base-value')));
				if(strBonus!=0)	ret["STR Mod"] = strBonus;
			}

		} else {
			var dexBonus = get_bonus(parseInt($("#"+uid+"_dex").attr('data-base-value')));
			if(dexBonus!=0)	ret["DEX Mod"] = dexBonus;
		}

		return JSON.stringify(ret);
	},
	mweapon: function(obj, uid, range) {
		var ret = {};
		ret["Base"] = "1d20";

		if(hasWeaponFocus(obj, uid)) 
			ret["Weapon Focus"] = 1;

		var bab = parseInt($("#"+uid+"_bab").attr('data-base-value'));
		if(bab!=0)		ret["BAB"] = bab;

		var size = $("#"+uid+"_size").attr('data-base-value');
		var sizeNum = sizeModifier(size);
		if(sizeNum != 0) 
			ret["Size ("+size+")"] = sizeNum;

		if(range == "0") {

			if(hasFeat(uid, "Weapon Finesse")) {
				var dexBonus = get_bonus(parseInt($("#"+uid+"_dex").attr('data-base-value')));
				ret["DEX Mod"] = dexBonus;

			} else {
				var strBonus = get_bonus(parseInt($("#"+uid+"_str").attr('data-base-value')));
				if(strBonus!=0)	ret["STR Mod"] = strBonus;
			}

			if(obj.wname.indexOf('Javelin') != -1)
				ret["Javelin"] = -4;

		} else {
			var dexBonus = get_bonus(parseInt($("#"+uid+"_dex").attr('data-base-value')));
			if(dexBonus!=0)	ret["DEX Mod"] = dexBonus;
		}

		return JSON.stringify(ret);
	},
	mspatk: function(obj, uid, range) {
		var ret = {};
		ret["Base"] = "1d20";
		if(range == "0") {
			var strBonus = get_bonus(parseInt($("#"+uid+"_str").attr('data-base-value')));
			if(strBonus!=0)	ret["STR Mod"] = strBonus;

		} else {
			var dexBonus = get_bonus(parseInt($("#"+uid+"_dex").attr('data-base-value')));
			if(dexBonus!=0)	ret["DEX Mod"] = dexBonus;
		}

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
	},
	mspatk: function(obj) {
		return obj.name;
	},
	mfatk: function(obj) {
		return formatting["mfatk"](obj);
	}
};