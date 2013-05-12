var MonsterModel = function(uid, data) {
	var self = this;

	console.log(data);

	//store the monster data here
	//self.monsterData = data;
	self.monsterBaseStats = data.data[0];

	self.uid = uid;

	self.id = self.monsterBaseStats.m_id;

	self.feats = new FeatModel(data.mfeat, uid);

	//statmodel
	self.stats = {
		str:	new StatModel(self.monsterBaseStats['str']),
		dex:	new StatModel(self.monsterBaseStats['dex']),
		con:	new StatModel(self.monsterBaseStats['con']),
		wis:	new StatModel(self.monsterBaseStats['wis']),
		int:	new StatModel(self.monsterBaseStats['int']),
		cha:	new StatModel(self.monsterBaseStats['cha']),
		fort:	new StatModel(self.monsterBaseStats['fort']),
		ref:	new StatModel(self.monsterBaseStats['ref']),
		will:	new StatModel(self.monsterBaseStats['will']),
		grapple:new GrappleModel(self.monsterBaseStats['grapple'],self.feats),
		bab:	new StatModel(self.monsterBaseStats['base_atk']),
		cmd:	new StatModel(self.monsterBaseStats['cmd']),
		cmb:	new StatModel(self.monsterBaseStats['cmb']),

		reach:	  self.monsterBaseStats['reach'],
		space:	  self.monsterBaseStats['space_taken'],
		treasure: self.monsterBaseStats['treasure'],

		size:	ko.observable(self.monsterBaseStats.size),
		category: ko.observable(self.monsterBaseStats.category)
	};

	self.skills = new SkillModel(data.mskill);

	self.reductions = new DRModel(data.mdmgred);

	self.qualities = new QualityModel(data.mqualit, self.monsterBaseStats.name);

	self.armor = new ArmorModel(data.marmor);

	self.spatks = new SpecialAttackModel(data.mspatk, self.monsterBaseStats.name);

	self.weapons = new WeaponAttackModel(data.mweapon, self.monsterBaseStats.name);

	self.attacks = new WeaponAttackModel(data.mattack, self.monsterBaseStats.name);

	self.initiative = new InitiativeModel(self.stats.dex, self.feats, self.uid);

	self.hp = new HPModel(self.monsterBaseStats.hit_dice, self.stats.con, self.feats, self.uid);

	self.speeds = new SpeedModel(data.mmove);

	self.fatks = new FullAttackModel(data.mfatk);
	
	self.ac = new ACModel(self, {
		"Natural AC": parseInt(self.monsterBaseStats.natural_ac),
		"Base": 10,
		"DEX Bonus": self.stats.dex.bonus(),
		"Size Mod": _getSizeModifier(self.stats.size())
	});

	self.formatCR = function (cr) {
		switch (cr) {
			case '0.25': return $("<div/>").html("&frac14;").text();
			case '0.33': return $("<div/>").html("&frac13;").text();
			case '0.50': return $("<div/>").html("&frac12;").text();
		}
		return parseInt(cr);
	};

	self.nameTooltip = ko.computed(function () {
		var retStr = self.stats.size() + " " + self.stats.category();

		if (data.msubcat.length != 0) {
			var arr = [];
			$.each(data.msubcat, function (i, e) {
				arr.push(e.subcategory);
			});
			retStr += " (" + arr.join(', ') + ")";
		}

		$$(uid + "_name").attr('data-original-title', retStr);
		return retStr;
	});
}

function ACModel(monsterModel, props) {
	var self = this;

	self.sizeBonus = ko.observable(_getSizeModifier(monsterModel.stats.size()));
	self.dex = ko.observable(monsterModel.stats.dex.bonus());

	monsterModel.stats.size.subscribe(function (newValue) {
		self.sizeBonus(_getSizeModifier(newValue));
		self.arrayProps()["Size Mod"] = self.sizeBonus();
	});

	monsterModel.stats.dex.bonus.subscribe(function (newValue) {
		self.dex(newValue);
		self.arrayProps()["DEX Bonus"] = self.dex();
	});

	self.arrayProps = ko.observable(props);

	self.flatfoot = new ArrayValueCountModel(monsterModel.uid + "_flatfoot_ac", self, ["Dodge","Combat Expertise"]);
	self.touch =	new ArrayValueCountModel(monsterModel.uid + "_touch_ac", self, ["Natural AC"]);
	self.total =	new ArrayValueCountModel(monsterModel.uid + "_ac", self, []);
}

function HPModel(hpRoll, conModel, featModel, uid) {
	var self = this;

	self.hp = ko.observable(new RollableNumberModel(hpRoll));
	self.con = ko.observable(conModel.bonus());
	self.mod = ko.observable(new ModifiableNumberModel(0));
	self.feats = ko.observable(featModel.feats);
	self.uid = uid;

	self.countToughness = ko.computed(function () {
		var ret = 0;
		$.each(self.feats()(), function (i, e) {
			if (e.name == 'Toughness') ret = parseInt(e.feat_level);
		});
		return ret;
	});

	conModel.bonus.subscribe(function (newValue) {
		self.con(newValue);
	});

	self.initTotal = ko.computed(function () {
		return self.hp().num().val();
	});

	self.calcConBonus = ko.computed(function () {
		return self.con() * parseInt(hpRoll.split('d')[0]);
	});

	self.total = ko.computed(function () {
		return self.initTotal() + self.mod().val() + (3 * self.countToughness()) + self.calcConBonus();
	});

	self.toolTip = ko.computed(function () {
		var curHp = self.hp().num().val();
		var modHp = self.mod().val();
		var retStr = "Base (" + hpRoll + "): " + curHp;
		if (modHp != 0) retStr += "<br>Modification: " + modHp;
		if (self.calcConBonus() != 0) retStr += "<br>CON Bonus: " + self.calcConBonus();
		if (self.countToughness() != 0) retStr += "<br>Toughness: " + (3 * self.countToughness());


		//hack for dynamic tooltip text
		$$(uid + "_hp").attr('data-original-title', retStr);
		return retStr;
	});
}

function FullAttackModel(fatks) {
	var self = this;

	if (fatks.length == 0) fatks.push({ "0": { aname: "None" }});

	self.fatks = ko.observableArray(fatks);

	self.formatName = function (fatk) {
		var retStr = [];
		$.each(fatk, function (i, e) {
			retStr.push(e.aname || e.wname);
		});
		return retStr.join(", ");
	};

	self.toolTip = function (fatk) {
		var retStr = '';
		$.each(fatk, function (i, e) {
			var atkStr = e.aname || e.wname;
			atkStr += ': ';
			var rollStr = e.hitdc;
			var eleStr = (rollStr == '0' ? '' : '+') + e.dmgred_hd + ' ' + e.dmgname;
			var count = e.whm || e.atkhm;

			if (rollStr != '0') atkStr += rollStr + "x" + count + " ";
			if (e.dmgname != null) atkStr += eleStr;
			atkStr += "<br />";
			retStr += atkStr;
		});
		return retStr;
	};
}

function InitiativeModel(dexModel, featModel, uid) {
	var self = this;
	self.init = new RollableNumberModel('1d20');
	self.dex = ko.observable(dexModel.bonus());
	self.feats = ko.observable(featModel.feats);

	self.countImprovedInitiative = ko.computed(function () {
		var ret = 0;
		$.each(self.feats()(), function (i, e) {
			if (e.name == 'Improved Initiative') ret = parseInt(e.feat_level);
		});
		return ret;
	});

	self.toolTip = ko.computed(function () {
		var retStr = "Base (1d20): "+self.init.num().val();
		if (self.dex != 0) retStr += ("<br>DEX: " + self.dex());
		if (self.countImprovedInitiative() != 0) retStr += ("<br>Improved Initiative: "+(4 * self.countImprovedInitiative()));
		$$(uid + "_init").attr('data-original-title', retStr);
		return retStr;
	});

	featModel.feats.subscribe(function (newValue) {
		self.feats(newValue);
	});

	dexModel.bonus.subscribe(function (newValue) {
		self.dex(newValue);
	});

	self.totalInit = ko.computed(function () {
		return self.init.num().val()+self.dex()+(4 * self.countImprovedInitiative());
	});
}

function WeaponAttackModel(damagers, mname) {
	var self = this;

	var _damagers = [];

	$.each(damagers, function (i, e) {
		if (e.hasOwnProperty("is_melee") && e.hasOwnProperty("is_ranged") && e.hasOwnProperty("wname") && e.is_melee == "1" && e.is_ranged != "0") {

			var oldName = e.wname.trim();
			var range = e.is_ranged;

			e.wname = oldName + " (Melee)";
			e.is_ranged = "0";
			_damagers.push(e);

			var newObject = $.extend(true, {}, e);

			newObject.is_ranged = range;
			newObject.is_melee = "0";
			newObject.wname = oldName + " (Ranged)";

			_damagers.push(newObject);

		} else if (e.hasOwnProperty("is_multi_handed") && e.is_multi_handed == "1") {
			var oldName = e.wname.trim();

			e.is_one_handed = "1";
			e.wname = oldName + " (1H)";
			_damagers.push(e);

			var newObject = $.extend(true, {}, e);

			newObject.is_one_handed = "0";
			newObject.wname = oldName + " (2H)";
			_damagers.push(newObject);
		} else {
			_damagers.push(e);
		}
	});

	if (damagers.length == 0) _damagers.push({ name: "None", descript: "", hit_dice: '0' });

	self.mname = mname;
	self.damagers = ko.observableArray(_damagers);

	self.countColumns = function (spatk) {
		var cols = 3;
		if (spatk.hitdc != '0') cols--;
		if (spatk.dmgname != null) cols--;
		return cols;
	};

	self.formatElemental = function (spatk) {
		var retStr = '';
		if (spatk.hitdc != '0') retStr = '+';
		retStr += spatk.dmgred_hd + " ";
		retStr += spatk.dmgname;
		return retStr;
	};

	self.formatName = function (name) {
		if (name == undefined) return "ERROR";
		if (name.indexOf(mname) != -1) return name.substring(mname.length);
		return name;
	};
}

function SpeedModel(speeds) {
	var self = this;
	this.speeds = ko.observableArray(speeds);
}

function SpecialAttackModel(spatks, mname) {
	var self = this;

	if (spatks.length == 0) spatks.push({ name: "None", descript: "", hit_dice:'0' });

	self.mname = mname;
	self.spatks = ko.observableArray(spatks);

	self.countColumns = function (spatk) {
		var cols = 3;
		if (spatk.hit_dice != '0') cols--;
		if (spatk.dmgred_nm != null) cols--;
		return cols;
	};

	self.formatElemental = function(spatk) {
		var retStr = '';
		if(spatk.hit_dice != '0') retStr='+';
		retStr += spatk.dmgred_hd + " ";
		retStr += spatk.dmgred_nm;
		return retStr;
	};

	self.formatName = function (name) {
		if (name.indexOf(mname) != -1) return name.substring(mname.length);
		return name;
	};
}

function ArmorModel(armors) {
	var self = this;

	if (armors.length == 0) armors.push({ name: "None", descript: "" });

	this.armors = ko.observableArray(armors);
}

function GrappleModel(base, featModel) {
	if (typeof base !== "number") base = parseInt(base);
	var self = this;
	self.feats = ko.observable(featModel.feats);
	self.base = new ModifiableNumberModel(base);

	self.grappleBonus = ko.computed(function () {
		var ret = 0;
		$.each(self.feats()(), function (i, e) {
			if (e.name == 'Racial Grapple Bonus') ret += 4;
			if (e.name == 'Improved Grapple') ret += 4;
		});
		return ret;
	});

	self.calc = ko.computed(function () {
		return self.base.val() + self.grappleBonus();
	});
}

function StatModel(base) {
	if (typeof base !== "number") base = parseInt(base);
	var self = this;
	self.base = new ModifiableNumberModel(base);
	self.bonus = ko.computed(function() {
		return getBonus(self.base.val());
	});
	self.format = ko.computed(function () {
		if (self.base.val() == 0) return "--";
		var bonus = self.bonus();
		if (bonus == 0) return self.base.val();

		if (bonus > 0) bonus = "+" + bonus;
		return self.base.val() + " " + "(" + bonus + ")";
	});
}

function ArrayValueCountModel(tag, model, filterProps) {
	var self = this;
	
	self.tag = tag;
	self.ignored = filterProps;
	self.kvs = ko.observable(model.arrayProps);

	self.sum = ko.computed(function () {
		var sum = 0;

		$.each(self.kvs()(), function (k, v) {
			if ($.inArray(k, self.ignored) == -1) {
				if (typeof v !== 'number') sum += v();
				else sum += v;
			}
		});

		return sum;
	});

	self.toolTip = ko.computed(function () {

		var retStr = '';
		$.each(self.kvs()(), function (i, e) {
			if ($.inArray(i, self.ignored) == -1 && e != 0)
				retStr += i + ": " + e+"<br>";
		});

		$$(tag).attr('data-original-title', retStr);
		return retStr;

	});
}

function SkillModel(skills) {
	var self = this;

	if (skills.length == 1) if (skills[0].name == 'No Skills') skills.pop();

	if (skills.length == 0) skills.push({ name: "None", sub_skill: "", descript: "", skill_level: 0 });

	self.skills = ko.observableArray(skills);

	self.formatName = function (skill) {
		if (skill.sub_skill != "" && skill.sub_skill != null) return skill.name + " (" + skill.sub_skill + ")";
		return skill.name;
	};
	self.formatNum = function (skill) {
		if (skill.skill_level == 0) return "";
		if (skill.skill_level > 0) return "+" + skill.skill_level;
		return skill.skill_level;
	};
}

function FeatModel(feats, uid) {
	var self = this;

	if (feats.length == 1) if (feats[0].name == 'No Feats') feats.pop();

	if (feats.length == 0) feats.push({ name: "None", descript: "" });

	self.uid = uid;
	self.feats = ko.observableArray(feats);
	self.checkboxFeats = ["Dodge", "Point Blank Shot", "Awesome Blow", "Frenzy", "Rage"];
	self.numberFeats   = ["Power Attack", "Combat Expertise", "Cleave"];

	self.format = function (feat) {
		return feat.name + (feat.feat_level > 1 ? " (x" + feat.feat_level + ")" : "");
	};

	self.canBeShown = function (name) {
		return name != 'Racial Grapple Bonus';
	};

	self.hasCheckbox = function (name) {
		return self.checkboxFeats.indexOf(name) != -1;
	};

	self.hasNumber = function (name) {
		return self.numberFeats.indexOf(name) != -1;
	};

	self.countColumns = function (name) {
		if (self.hasCheckbox(name) || self.hasNumber(name)) return 1;
		return 2;
	};
	
	self.formatSpName = function (name) {
		return self.uid+"_calc_"+formatSpecialFeatName(name);
	};
}

function QualityModel(qualities, mname) {
	var self = this;

	if (qualities.length == 1) if (qualities[0].name == 'No Qualities') qualities.pop();

	if (qualities.length == 0) qualities.push({ name: "None", descript: "" });

	self.mname = mname;
	self.qualities = ko.observableArray(qualities);

	self.isMeasurable = function(name) {
		return name != 'Spell Resistance' && name != "Regeneration" && name != "Turn Resistance";
	};
	self.format = function (qual) {
		return qual.value + (self.isMeasurable(qual.name) ? "ft" : "");
	};
	self.formatName = function (name) {
		if (name.indexOf(mname) != -1) return name.substring(mname.length);
		return name;
	};
}

function DRModel(reductions) {
	var self = this;

	if (reductions.length == 0) reductions.push({ name: "None", reduction_amount: -1 });

	self.dr = ko.observableArray(reductions);
	self.format = function(val) {
		return val == '0' || val == 0 ? "Immune" : (val == -1 ? '' : val);
	};
}

function KVModel(kv) {
	var self = this;
	self.array = ko.observableArray(kv);
}

function RollableNumberModel(baseRoll) {
	var self = this;
	self.rollStr = baseRoll;
	self.num = ko.observable(new ModifiableNumberModel(roll(self.rollStr)));

	self.reroll = function () {
		self.num(new ModifiableNumberModel(roll(self.rollStr)));
	};
}

function ModifiableNumberModel(baseVal) {
	var self = this;
	self.init = baseVal;
	self.val = ko.observable(baseVal);

	self.reset = function () {
		self.val(self.init);
	};

	self.resetToVal = function (offset) {
		self.val(self.init);
		self.relative(offset);
	};

	self.increment = function () {
		self.val(self.val()+1);
	};
	self.decrement = function () {
		self.val(self.val()-1);
	};
	self.relative = function (num) {
		self.val(self.val()+num);
	}
	self.absolute = function (num) {
		self.val(num);
	}
}

ko.bindingHandlers.bootstrapTooltip = {
	init: function (element, valueAccessor, allBindingAccessor, viewModel) {
		var options = ko.utils.unwrapObservable(valueAccessor());
		var defaultOptions = {};
		options = $.extend(true, {}, defaultOptions, options);
		$(element).tooltip(options);

		$(element).click(function () {

			var $me = $(this);
			var doShow = true;

			$(".in").each(function () {
				if ($(this).siblings("a").is($me)) {
					doShow = false;
				}
				$(this).siblings("a").tooltip('hide');

			});
			if (doShow)
				$(this).tooltip('show');
		});
	}
};