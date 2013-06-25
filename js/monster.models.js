
var MonsterModel = function (uid, data) {
	var self = this;

	//store the monster data here
	self.monsterBaseStats = data.data[0];

	self.uid = uid;

	self.id = self.monsterBaseStats.m_id;

	self.feats = new FeatModel(data.mfeat, uid);

	//statmodel
	self.stats = {
		str: new StatModel(self.monsterBaseStats['str']),
		dex: new StatModel(self.monsterBaseStats['dex']),
		con: new StatModel(self.monsterBaseStats['con']),
		wis: new StatModel(self.monsterBaseStats['wis']),
		int: new StatModel(self.monsterBaseStats['int']),
		cha: new StatModel(self.monsterBaseStats['cha']),
		fort: new StatModel(self.monsterBaseStats['fort']),
		ref: new StatModel(self.monsterBaseStats['ref']),
		will: new StatModel(self.monsterBaseStats['will']),
		grapple: new GrappleModel(self.monsterBaseStats['grapple'], self.feats),
		bab: new StatModel(self.monsterBaseStats['base_atk']),
		cmd: new StatModel(self.monsterBaseStats['cmd']),
		cmb: new StatModel(self.monsterBaseStats['cmb']),

		reach: self.monsterBaseStats['reach'],
		space: self.monsterBaseStats['space_taken'],
		treasure: self.monsterBaseStats['treasure'],

		cr: ko.observable(parseFloat(self.monsterBaseStats.cr)),
		size: ko.observable(self.monsterBaseStats.size),
		category: ko.observable(self.monsterBaseStats.category),
		name: ko.observable(self.monsterBaseStats.name)
	};

	self.skills = new SkillModel(data.mskill);

	self.reductions = new DRModel(data.mdmgred);

	self.languages = new LanguageModel(data.mlang);

	self.qualities = new QualityModel(data.mqualit, self.monsterBaseStats.name);

	self.armor = new ArmorModel(data.marmor);

	self.spatks = new SpecialAttackModel(data.mspatk, self.monsterBaseStats.name);

	self.weapons = new WeaponAttackModel(data.mweapon, self.monsterBaseStats.name);

	self.attacks = new WeaponAttackModel(data.mattack, self.monsterBaseStats.name);

	self.initiative = new InitiativeModel(self.stats.dex, self.feats, self.uid);

	self.hp = new HPModel(self.monsterBaseStats.hit_dice, self.stats.con, self.feats, self.uid);

	self.speeds = new SpeedModel(data.mmove);

	self.fatks = new FullAttackModel(data.mfatk, self.monsterBaseStats.name);

	self.ac = new ACModel(self, {
		"Natural AC": parseInt(self.monsterBaseStats.natural_ac),
		"Base": 10,
		"DEX Bonus": self.stats.dex.bonus(),
		"Size Mod": _getSizeModifier(self.stats.size())
	});

	self.roller = new RollerHandler(self);

	self.formatCR = function (cr) {
		return formatCR(cr);
	};

	self.formatSpName = function (name) {
		return self.uid + "_calc_" + formatSpecialFeatName(name);
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

function RollerHandler(monModel) {
	var self = this;

	self.dummy = ko.observable();

	self.invalidate = function () {
		self.dummy.notifySubscribers();
	};

	self.monster = monModel;

	self.rollStat = function (stat) {
		var roll = self.monster.stats[stat];
		return JSON.stringify({ 'for': stat.toUpperCase(), 'primary': roll.primaryRoll(), 'howMany': 1 });
	};

	self.rollNonBasicStat = function (stat, name) {
		var roll = self.monster.stats[stat];
		return JSON.stringify({ 'for': name, 'primary': roll.nonBasicPrimaryRoll(), 'howMany': 1 });
	};

	self.rollSkill = function (skill) {
		var roll = self.monster.skills.primaryRoll(skill);
		return JSON.stringify({ 'for': skill.name, 'primary': roll, 'howMany': 1 });
	};

	self.rollAttack = function (attack) {
		if (attack.name == "None") return;
		var primary = self.monster.attacks.attackToHitRoll(attack,
						self.monster.stats.bab.base.val(),
						self.monster.stats.size(),
						self.monster.stats.dex.bonus(),
						self.monster.stats.str.bonus(),
						self.monster.feats.hasWeaponFocus(attack.aname),
						self.monster.feats.hasFeat('Weapon Finesse'));
		var secondary = self.monster.attacks.attackDamageRoll(attack, self.monster.stats.str.bonus());
		var critical = self.determineCritical(attack, self.monster.feats.hasFeat('Improved Critical'));
		return JSON.stringify({
			'for': self.formatName(attack.aname), 'primary': secondary, 'secondary': primary, 'howMany': parseInt(attack.how_many),
			'minCrit': critical.min, 'critMult': critical.mult, 'range': parseInt(attack.range), 'spatk': self.monster.spatks.formatName(attack.spatk)
		});
	};

	self.rollWeapon = function (weapon) {
		if (weapon.name == "None") return;
		var primary = self.monster.weapons.weaponToHitRoll(weapon,
			self.monster.feats.hasWeaponFocus(weapon.wname),
			self.monster.stats.bab.base.val(),
			self.monster.stats.size(),
			self.hasFeat('Weapon Finesse'),
			self.monster.stats.dex.bonus(),
			self.monster.stats.str.bonus());

		var secondary = self.monster.weapons.weaponDamageRoll(weapon, self.monster.stats.str.bonus(), weapon.is_ranged, parseInt(weapon.is_ranged) == 0);
		var critical = self.determineCritical(weapon, self.hasFeat('Improved Critical'));
		return JSON.stringify({
			'for': self.formatName(weapon.wname), 'primary': secondary, 'secondary': primary, 'howMany': parseInt(weapon.how_many) || 1,
			'minCrit': critical.min, 'critMult': critical.mult, 'range': parseInt(weapon.is_ranged), 'spatk': self.monster.spatks.formatName(weapon.spatk)
		});
	};

	self.rollSpatk = function (spatk) {
		if (!self.monster.spatks.isRollable(spatk)) return;
		var primary = self.monster.spatks.toHitRoll(spatk, self.monster.stats.dex.bonus(), self.monster.stats.str.bonus());
		var secondary = self.monster.spatks.damageRoll(spatk, self.monster.stats.str.bonus());
		var critical = self.determineCritical(spatk);

		return JSON.stringify({
			'for': self.formatName(spatk.name), 'primary': secondary, 'secondary': primary, 'howMany': 1,
			'minCrit': critical.min, 'critMult': critical.mult, 'range': parseInt(spatk.range)
		});
	};

	self.rollFatk = function (fatk) {
		var toHit = self.monster.fatks.toHitRoll(fatk, self.monster.attacks,
						self.monster.stats.bab.base.val(),
						self.monster.stats.size(),
						self.monster.stats.dex.bonus(),
						self.monster.stats.str.bonus(),
						self.monster.feats.hasWeaponFocus(self.monster.fatks.formatName(fatk)),
						self.hasFeat('Weapon Finesse'),
						self.hasTwoWeapons(),
						self.hasFeat('Multiattack'));
		var damage = self.monster.fatks.damageRoll(fatk, self.monster.attacks, self.monster.stats.str.bonus());
		var primary = self.monster.fatks.primaryRoll(fatk,
			self.monster.stats.name,
			self.hasFeat('Improved Critical'),
			self.monster.stats.bab.base.val(),
			self.hasGreaterMultiFighting(),
			self.hasImprovedMultiFighting(),
			damage,
			toHit);

		return JSON.stringify({
			'for': "a fatk", 'primary': primary, isFatk: true, range: 0
		});

	};

	self.hasFeat = function (feat) {
		return self.monster.feats.hasFeat(feat);
	}

	self.hasTwoWeapons = function () {
		return self.hasFeat("Two-Weapon Fighting") || self.hasFeat("Multiweapon Fighting")
	};

	self.hasGreaterMultiFighting = function () {
		return self.hasFeat("Greater Two-Weapon Fighting") || self.hasFeat("Greater Multiweapon Fighting");
	};

	self.hasImprovedMultiFighting = function () {
		self.hasFeat("Improved Two-Weapon Fighting") || self.hasFeat("Improved Multiweapon Fighting");
	};

	self.determineCritical = function (obj, hasImpCrit) {
		var minCrit = 20;
		var critMult = 2;

		if (obj.hasOwnProperty('critical')) {
			if (obj.critical.indexOf('-') != -1) {
				var critArr = obj.critical.split("-");
				critMult = parseInt(critArr[1].split("x")[1]);
				minCrit = parseInt(critArr[0]);
			} else if (obj.critical == '0') {
				minCrit = 20;
			} else if (obj.critical.indexOf("x") != -1) {
				minCrit = 20;
				critMult = parseInt(obj.critical.substring(1));
			} else {
				console.error("critical wasn't parseable: " + obj.critical + " " + obj.name);
			}
		}

		if (hasImpCrit)
			minCrit = 21 - ((20 - minCrit + 1) * 2);

		return { min: minCrit, mult: critMult };
	}

	self.formatName = function (name) {
		if (name == undefined) return;
		if (name.indexOf(self.monster.stats.name()) != -1) return name.substring(self.monster.stats.name().length + 1).trim();
		return name;
	};

	self.rollBullrush = ko.computed(function () {
		self.dummy();
		var roll = { "Base": "1d20" };
		roll["STR Mod"] = self.monster.stats.str.bonus();
		roll["Size Mod"] = maneuverModifier(self.monster.stats.size()) * 4;
		roll["Charge Mod"] = $$(self.monster.uid + "_calc_charge").is(":checked") ? 2 : 0;
		roll["Improved Bull Rush"] = self.monster.feats.hasFeat("Improved Bull Rush") ? 4 : 0;
		return JSON.stringify({ 'for': 'Bull Rush', 'howMany': 1, 'primary': roll });
	});

	self.rollDisarm = ko.computed(function () {
		self.dummy();

		var $selected = $("#" + self.monster.uid + "_mweapon_table .info, #" + self.monster.uid + "_mattack_table .info");
		if ($selected.size() == 0) return JSON.stringify({ 'for': 'Disarm', 'howMany': 0, 'primary': null });;

		var $child = $selected.find("td:first-child a");
		var tt = $child.attr('data-tt');

		var roll = { "Base": "1d20" };
		roll["Base Attack Bonus"] = self.monster.stats.bab.base.val();

		if (tt.indexOf('Weight: Light') !== -1)
			roll["Light Weapon Penalty"] = -4;

		roll["Size Difference"] = parseInt($$(self.monster.uid + "_calc_disarm").val()) * 4;
		roll["STR Mod"] = self.monster.stats.str.bonus();

		if (tt.indexOf('Two-handed') !== -1)
			roll["Two-handed Bonus"] = 4;

		return JSON.stringify({ 'for': 'Disarm using ' + $child.text(), 'howMany': 1, 'primary': roll });
	});

	self.rollFeint = ko.computed(function () {
		var roll = { "Base": "1d20" };
		roll["Bluff"] = self.monster.skills.countSkill('Bluff');
		roll["CHA Mod"] = self.monster.stats.cha.bonus();
		return JSON.stringify({ 'for': 'Feint', 'howMany': 1, 'primary': roll });
	});

	self.rollOverrunAttack = ko.computed(function () {
		var roll = { "Base": "1d20" };
		roll["STR Mod"] = self.monster.stats.str.bonus();
		roll["Size Mod"] = maneuverModifier(self.monster.stats.size()) * 4;
		return JSON.stringify({ 'for': 'Overrun Attack', 'howMany': 1, 'primary': roll });
	});

	self.rollOverrunSave = ko.computed(function () {
		var roll = { "Base": "1d20" };
		roll["Size Mod"] = maneuverModifier(self.monster.stats.size()) * 4;
		var dexMod = self.monster.stats.dex.bonus();
		var strMod = self.monster.stats.str.bonus();
		if (dexMod > strMod) {
			roll["DEX Mod"] = dexMod;
		} else {
			roll["STR Mod"] = strMod;
		}
		return JSON.stringify({ 'for': 'Overrun Save vs. Prone', 'howMany': 1, 'primary': roll });
	});

	self.rollGrappleGrab = ko.computed(function () {
		var roll = { "Base": "1d20" };
		roll["STR Mod"] = self.monster.stats.str.bonus();
		roll["Base Attack Bonus"] = self.monster.stats.bab.base.val();
		return JSON.stringify({ 'for': 'Grapple Grab', 'howMany': 1, 'primary': roll });
	});

	self.rollOpposedGrapple = ko.computed(function () {
		var roll = { "Base": "1d20" };
		roll["Base Attack Bonus"] = self.monster.stats.bab.base.val();
		roll["STR Mod"] = self.monster.stats.str.bonus();
		roll["Size Mod"] = maneuverModifier(self.monster.stats.size()) * 4;
		return JSON.stringify({ 'for': 'Opposed Grapple', 'howMany': 1, 'primary': roll });
	});

	self.rollSunder = ko.computed(function () {
		self.dummy();
		var $selected = $("#" + self.monster.uid + "_mweapon_table .info, #" + self.monster.uid + "_mattack_table .info");
		if ($selected.size() == 0) return JSON.stringify({ 'for': 'Sunder', 'howMany': 0, 'primary': null });;

		var roll = { "Base": "1d20" };
		var $child = $selected.find("td:first-child a");
		var tt = $child.attr('data-tt');

		roll["Base Attack Bonus"] = self.monster.stats.bab.base.val();

		if (tt.indexOf('Weight: Light') !== -1)
			roll["Light Weapon Penalty"] = -4;

		roll["Size Difference"] = parseInt($$(self.monster.uid + "_calc_sunder").val()) * 4;

		if (tt.indexOf('Two-handed') !== -1)
			roll["Two-handed Bonus"] = 4;

		return JSON.stringify({'for': 'Sunder using '+$child.text(), 'howMany': 1, 'primary': roll});
	});

	self.rollTripTouch = ko.computed(function () {
		self.dummy();
		var roll = { "Base": "1d20" };
		roll["Base Attack Bonus"] = self.monster.stats.bab.base.val();
		roll["STR Mod"] = self.monster.stats.str.bonus();
		return JSON.stringify({ 'for': 'Trip Melee Touch Attack', 'howMany': 1, 'primary': roll });
	});

	self.rollTripStr = ko.computed(function () {
		self.dummy();
		var roll = { "Base": "1d20" };
		roll["STR Mod"] = self.monster.stats.str.bonus();
		roll["Size Mod"] = maneuverModifier(self.monster.stats.size()) * 4;
		return JSON.stringify({ 'for': 'Trip STR Check', 'howMany': 1, 'primary': roll });
	});
}

//#region AC-related Models
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

	self.flatfoot = new ArrayValueCountModel(monsterModel.uid + "_flatfoot_ac", self, ["Dodge", "Combat Expertise"]);
	self.touch = new ArrayValueCountModel(monsterModel.uid + "_touch_ac", self, ["Natural AC"]);
	self.total = new ArrayValueCountModel(monsterModel.uid + "_ac", self, []);
}

function ArmorModel(armors) {
	var self = this;

	if (armors.length == 0) armors.push({ name: "None", descript: "" });

	this.armors = ko.observableArray(armors);
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
				retStr += i + ": " + e + "<br>";
		});

		$$(tag).attr('data-original-title', retStr);
		return retStr;

	});
}
//#endregion

//#region Attack-related Models
function FullAttackModel(fatks, mname) {
	var self = this;

	if (fatks.length == 1 && fatks[0].length == 0) fatks.pop();

	if (fatks.length == 0) fatks.push({ "0": { aname: "None" } });

	self.mname = mname;
	self.fatks = ko.observableArray(fatks);

	self.formatName = function (fatk) {
		var retStr = [];
		$.each(fatk, function (i, e) {
			console.log(e);
			var name;
			try {
				name = self.formatNameStr(e.spatkname || e.aname || e.wname);
			} catch (e) {
				name = "ERROR";
				var exceptionMessage = e.message + " | DATA = " + JSON.stringify(e);
				Raven.captureException(exceptionMessage);
				console.error(exceptionMessage);
			}

			retStr.push(name);
		});
		return retStr.join(", ");
	};

	self.toolTip = function (fatk) {
		var retStr = '';
		$.each(fatk, function (i, e) {
			var atkStr = self.formatNameStr(e.aname || e.wname || e.spatkname);
			atkStr += ': ';
			var rollStr = e.hitdc;
			var eleStr = (rollStr == '0' || rollStr == null ? '' : '+') + e.dmgred_hd + ' ' + e.dmgname;
			var count = e.whm || e.atkhm;

			if (rollStr != '0' && rollStr != null) atkStr += rollStr + "x" + count + " ";
			if (e.dmgname != null) atkStr += eleStr;
			atkStr += "<br />";
			retStr += atkStr;
		});
		return retStr;
	};

	self.formatNameStr = function (name) {
		if (name == undefined) {
			throw new Error("Could not get a name for a full attack attribute in " + mname)
		}
		if (name.indexOf(mname) != -1) return name.substring(mname.length).trim();
		return name;
	};

	self.primaryRoll = function (obj, monsterName, hasImpCrit, creatureBab, hasGreaterTwoWeapFighting, hasImpTwoWeapFighting, toHitRoll, attackRoll) {
		var spatkA = [], rangeA = [], critMultA = [], minCritA = [], howManyA = [],
			babUseA = [], secA = [], rollsA = [], nameA = [], atkCtA = [];
		$.each(obj, function (ind, e) {

			if (e.spatkname != null && e.spatkname.indexOf(monsterName) != -1) e.spatkname = e.spatkname.substring(monsterName.length + 1);

			babUseA.push(parseInt(e.is_uses_bab));

			spatkA.push(e.spatkname);

			secA.push(e.mfa_class_mult == "0.50" ? 1 : 0);

			if (e.wir)
				rangeA.push(e.wir);
			else
				rangeA.push(e.mfa_range);

			var minCrit = 0;

			e.critical = e.atkct || e.wct;
			if (!e.critical) e.critical = '0';

			e.how_many = e.atkhm || e.whm;
			if (!e.how_many) e.how_many = '1';

			nameA.push(e.wname || e.aname);

			howManyA.push(e.how_many);

			if (e.hasOwnProperty('critical')) {
				if (e.critical.indexOf('-') != -1) {
					var critArr = e.critical.split("-");
					critMultA.push(critArr[1].split("x")[1]);
					minCrit = parseInt(critArr[0]);
				} else if (e.critical == '0') {
					minCrit = 20;
					critMultA.push(2);
				} else if (e.critical.indexOf("x") != -1) {
					minCrit = 20;
					critMultA.push(e.critical.substring(1));
				} else {
					console.error("critical wasn't parseable: " + obj.critical + " " + obj.name);
				}
			}

			if (hasImpCrit) {
				minCrit = 21 - ((20 - minCrit + 1) * 2);
			}
			minCritA.push(minCrit);

			if (e.is_uses_bab == "1") {
				var div = creatureBab / 5;
				var mod = creatureBab % 5;
				var attacks = Math.max(Math.floor(div) + (mod != 0 ? 1 : 0), 1);

				var bonusAttacks = 1;

				for (var i = 0; i < attacks; i++) {

					var roll = { damage: $.extend(true, {}, attackRoll[ind]), tohit: $.extend(true, {}, toHitRoll[ind]), refIndex: ind };

					//I tried renaming these variables and rearranging everything and it refused to work
					//this is actually taking away from the rolls to-hit
					if (bonusAttacks > 1)
						roll["damage"]["Attack " + (bonusAttacks)] = -(bonusAttacks - 1) * 5;

					if (secA[ind]) {
						if (i == 0)
							rollsA.push(roll);

						else if (hasGreaterTwoWeapFighting && bonusAttacks == 2) {

							rollsA.push(roll);
							bonusAttacks++;

						} else if (hasImpTwoWeapFighting && bonusAttacks == 1) {

							rollsA.push(roll);
							bonusAttacks++;
						}
					} else {
						rollsA.push(roll);
						bonusAttacks++;
					}
				}
				atkCtA.push(bonusAttacks);
			} else {
				var roll = { damage: $.extend(true, {}, attackRoll[ind]), tohit: $.extend(true, {}, toHitRoll[ind]), refIndex: ind };
				for (var i = 0; i < howManyA[ind]; i++)
					rollsA.push(roll);
			}
		});

		var fatk = {
			range: rangeA, spatk: spatkA, names: nameA,
			critMult: critMultA, howMany: howManyA, atkCt: atkCtA,
			minCrit: minCritA, secondary: secA, rolls: rollsA
		};

		return fatk;
	};

	self.damageRoll = function (obj, attackModel, strBonus) {
		var ret = [];

		$.each(obj, function (i, e) {
			var retO = {};

			//attack
			if (e.atkhd) {
				var parsed = attackModel.attackDamageRoll(e, strBonus);
				retO = collect(retO, parsed);
			}

			//weapon
			if (e.wname) {
				e.mfa_strict = e.mfa_strict == "0" ? "1" : "0";
				var range = (parseInt(e.wir) || parseInt(e.mfa_range));
				var parsed = attackModel.weaponDamageRoll(e, strBonus, range, parseInt(e.mfa_strict));
				var strMod = parseFloat(e.mfa_str_mod);
				parsed["STR Mod"] *= strMod;
				retO = collect(retO, parsed);
			}

			ret.push(retO);
		});

		return ret;
	};

	self.toHitRoll = function (obj, attackModel, bab, size, dexBonus, strBonus, hasWeaponFocus, hasWeaponFinesse, hasTwoWeapons, hasMultiAttack) {
		var ret = [];

		var weaponCount = [];

		$.each(obj, function (i, e) {

			var retO = {};
			//attack
			if (e.atkhd) {
				var parsed = attackModel.attackToHitRoll(e, bab, size, dexBonus, strBonus, hasWeaponFocus, hasWeaponFinesse);
				retO = collect(retO, parsed);
				if (parseFloat(e.mfa_class_mult) == 0.5 && !hasTwoWeapons) {
					if (hasMultiAttack)
						retO["Secondary Penalty"] = -2;
					else
						retO["Secondary Penalty"] = -5;
				}
				e.wlight = "1";
				e.mfa_class_mult = "0.50";
			}

			//weapon
			if (e.wname) {
				var parsed = attackModel.weaponToHitRoll(e, hasWeaponFocus, bab, size, hasWeaponFinesse, dexBonus, strBonus);
				retO = collect(retO, parsed);
			}
			weaponCount.push(e);

			ret.push(retO);
		});

		if (weaponCount.length > 1) {

			var minusTwo = false;

			$.each(weaponCount, function (i, e) {
				if ((e.aname != null && e.wlight == "1") || e.wlight == "1" && e.mfa_class_mult == "0.50") {
					minusTwo = true;
				}
			});

			var has2W = hasTwoWeapons;
			if (has2W)
				$.each(weaponCount, function (i, e) {
					var minus = 0;
					if (e.mfa_class_mult == "1.00") {
						minus = -6;
						if (has2W)
							minus += 2;
						if (minusTwo)
							minus += 2;
						ret[i]["Multiweapon Penalty (Primary)"] = minus;
					} else {
						minus = -10;
						if (has2W)
							minus += 6;
						if (minusTwo)
							minus += 2;
						ret[i]["Multiweapon Penalty (Secondary)"] = minus;
					}
				});
		}
		return ret;
	};
}

function SpecialAttackModel(spatks, mname) {
	var self = this;

	if (spatks.length == 0) spatks.push({ name: "None", descript: "", hit_dice: '0' });

	self.mname = mname;
	self.spatks = ko.observableArray(spatks);

	self.countColumns = function (spatk) {
		var cols = 3;
		if (spatk.hit_dice != '0') cols--;
		if (spatk.dmgred_nm != null) cols--;
		return cols;
	};

	self.formatElemental = function (spatk) {
		var retStr = '';
		if (spatk.hit_dice != '0') retStr = '+';
		retStr += spatk.dmgred_hd + " ";
		retStr += spatk.dmgred_nm;
		return retStr;
	};

	self.formatName = function (name) {
		if (!name) return;
		if (name.indexOf(mname) != -1) return name.substring(mname.length);
		return name;
	};

	self.isRollable = function (spatk) {
		return spatk.hit_dice != '0' || spatk.dmgred_nm != null;
	};

	self.decideRollable = function (spatk) {
		return self.isRollable(spatk) ? '' : 'unrollable';
	}

	self.toHitRoll = function (spatk, dexBonus, strBonus) {
		var ret = {};
		ret["Base"] = "1d20";
		if (spatk.range == "0")
			ret["STR Mod"] = strBonus;
		else
			ret["DEX Mod"] = dexBonus;

		return ret;
	};

	self.damageRoll = function (obj, strBonus) {
		var ret = {};
		if (obj.hit_dice != '0')
			ret["Base (" + obj.hit_dice + ")"] = obj.hit_dice;

		if (obj.dmgred_hd != '0')
			ret[obj.dmgred_nm] = obj.dmgred_hd;

		ret["STR Mod"] = strBonus;
		return ret;
	};
}

function WeaponAttackModel(damagers, mname) {
	var self = this;

	self.dummy = ko.observable();

	self.invalidate = function () {
		self.dummy.notifySubscribers();
	};

	var _damagers = [];

	self.calcRange = function (weapon) {
		return weapon.is_ranged == "0" ? "Melee" : weapon.is_ranged + " ft";
	};

	self.isTwoHanded = function (weapon) {
		return weapon.hasOwnProperty("is_multi_handed") && weapon.is_multi_handed == "1" && weapon.is_one_handed == "0";
	};

	self.handClassification = function (weapon) {
		return self.isTwoHanded(weapon) ? "Two-handed" : "One-handed";
	};

	self.weightClassification = function (weapon) {
		return weapon.is_light == "1" ? "Light" : "Normal";
	};

	self.newTooltip = function (weapon) {
		if (weapon.hasOwnProperty("aname")) return weapon.descript;
		var tt = "Range: " + self.calcRange(weapon) + "<br>";
		tt += "Classification: " + self.handClassification(weapon) + "<br>";
		tt += "Weight: " + self.weightClassification(weapon) + "<br>";
		return tt + weapon.descript;
	};

	$.each(damagers, function (i, e) {
		if (e.hasOwnProperty("is_melee") && e.hasOwnProperty("is_ranged") && e.hasOwnProperty("wname") && e.is_melee == "1" && e.is_ranged != "0") {

			var oldName = e.wname.trim();
			var range = e.is_ranged;
			var oldDescript = e.descript;

			e.wname = oldName + " (Melee)";
			e.is_ranged = "0";
			e.descript = self.newTooltip(e);
			_damagers.push(e);

			var newObject = $.extend(true, {}, e);

			newObject.is_ranged = range;
			newObject.is_melee = "0";
			newObject.wname = oldName + " (Ranged)";
			newObject.descript = oldDescript;
			newObject.descript = self.newTooltip(newObject);

			_damagers.push(newObject);

		} else if (e.hasOwnProperty("is_multi_handed") && e.is_multi_handed == "1") {
			var oldName = e.wname.trim();
			var oldDescript = e.descript;

			e.is_one_handed = "1";
			e.wname = oldName + " (1H)";
			e.descript = self.newTooltip(e);
			_damagers.push(e);

			var newObject = $.extend(true, {}, e);

			newObject.is_one_handed = "0";
			newObject.wname = oldName + " (2H)";
			newObject.descript = oldDescript;
			newObject.descript = self.newTooltip(newObject);
			_damagers.push(newObject);
		} else {
			e.descript = self.newTooltip(e);
			_damagers.push(e);
		}
	});

	self.mname = mname;
	self.damagers = ko.observableArray(_damagers);

	if (damagers.length == 0) _damagers.push({ name: "None", descript: "", hit_dice: '0' });

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
		if (name == undefined) return;
		if (name.indexOf(mname) != -1) return name.substring(mname.length).trim();
		return name;
	};

	self.attackToHitRoll = function (obj, bab, size, dexBonus, strBonus, hasWeaponFocus, hasWeaponFinesse) {
		var ret = {};
		ret["Base"] = "1d20";

		if (hasWeaponFocus)
			ret["Weapon Focus"] = 1;

		ret["BAB"] = bab;

		ret["Size (" + size + ")"] = sizeModifier(size);

		if (obj.is_strictly_melee == "0")
			if (hasWeaponFinesse)
				ret["DEX Mod"] = dexBonus;
			else
				ret["STR Mod"] = strBonus;
		else
			ret["DEX Mod"] = dexBonus;

		return ret;
	};

	self.attackDamageRoll = function (obj, strBonus) {
		var ret = {};
		ret["Base"] = obj.hitdc;

		if (obj.dmgname != null)
			ret[obj.dmgname + " (" + obj.dmgred_hd + ")"] = obj.dmgred_hd;

		ret["STR Mod"] = Math.floor(strBonus*parseFloat(obj.max_str_mod));

		return ret;
	}

	self.weaponToHitRoll = function (obj, hasWeaponFocus, bab, size, hasWeaponFinesse, dexBonus, strBonus) {
		var ret = {};
		ret["Base"] = "1d20";

		if (hasWeaponFocus)
			ret["Weapon Focus"] = 1;

		ret["BAB"] = bab;

		ret["Size (" + size + ")"] = sizeModifier(size);
		
		if (obj.is_ranged == "0" || (obj.hasOwnProperty("wir") && obj.wir == "0")) {

			if (hasWeaponFinesse)
				ret["DEX Mod"] = dexBonus;
			else
				ret["STR Mod"] = strBonus;

			if (obj.wname.indexOf('Javelin') != -1)
				ret["Javelin"] = -4;

		} else {
			if (obj.wname && obj.wname.toLowerCase().indexOf('composite') != -1) {
				var strMod = parseFloat(obj.max_str_mod) || 0;
				if (strBonus < strMod) {
					ret["Composite Proficiency"] = -2;
				}
			}
			ret["DEX Mod"] = dexBonus;
		}

		ret["Enchantment"] = parseInt(obj.enchantment_bonus);
		return ret;
	};

	self.weaponDamageRoll = function (obj, strBonus, range, melee) {
		var ret = {};
		ret["Base"] = obj.hitdc;
		if (obj.dmgname != null)
			ret[obj.dmgname + " (" + obj.dmgred_hd + ")"] = obj.dmgred_hd;
		
		var strMod = parseFloat(obj.max_str_mod) || 0;

		ret["STR Mod"] = strBonus;

		if (melee && obj.is_uses_str_mod == "1" && obj.is_one_handed == "0") {
			ret["STR Mod"] = (strBonus * 1.5);
		} else {

			if (strBonus < 0 && obj.wname.toLowerCase().indexOf('crossbow') == -1)
				ret["STR Mod"] = strBonus;
		}

		if (obj.is_uses_str_mod == "0") ret["STR Mod"] = 0;

		ret["Enchantment"] = parseInt(obj.enchantment_bonus);

		return ret;
	};
}
//#endregion

//#region Basic Statistic Models
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
		var retStr = "Base (1d20): " + self.init.num().val();
		if (self.dex != 0) retStr += ("<br>DEX: " + self.dex());
		if (self.countImprovedInitiative() != 0) retStr += ("<br>Improved Initiative: " + (4 * self.countImprovedInitiative()));
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
		return self.init.num().val() + self.dex() + (4 * self.countImprovedInitiative());
	});
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

	self.nonBasicPrimaryRoll = function () {
		return { "Base": "1d20", "Bonus": self.calc() };
	};
}

function StatModel(base) {
	if (typeof base !== "number") base = parseInt(base);
	var self = this;
	self.base = new ModifiableNumberModel(base);
	self.bonus = ko.computed(function () {
		return getBonus(self.base.val());
	});
	self.format = ko.computed(function () {
		if (self.base.val() == 0) return "--";
		var bonus = self.bonus();

		if (bonus > 0) bonus = "+" + bonus;
		return self.base.val() + " " + "(" + bonus + ")";
	});

	self.primaryRoll = function () {
		return { "Base": "1d20", "Bonus": self.bonus() };
	};

	self.nonBasicPrimaryRoll = function () {
		return { "Base": "1d20", "Bonus": self.base.val() };
	};
}
//#endregion

//#region HP-related Models
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

	self.max = ko.computed(function () {
		return self.initTotal() + (3 * self.countToughness()) + self.calcConBonus();
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
		self.val(self.val() + 1);
	};
	self.decrement = function () {
		self.val(self.val() - 1);
	};
	self.relative = function (num) {
		self.val(self.val() + num);
	}
	self.absolute = function (num) {
		self.val(num);
	}
}
//#endregion

//#region List-backed Stat Models
function DRModel(reductions) {
	var self = this;

	if (reductions.length == 0) reductions.push({ name: "None", reduction_amount: -1 });

	self.dr = ko.observableArray(reductions);
	self.format = function (val) {
		return val == '0' || val == 0 ? "Immune" : (val == -1 ? '' : val);
	};
}

function LanguageModel(languages) {
	var self = this;

	if (languages.length == 0) languages.push({ language: "None" });

	self.languages = ko.observableArray(languages);
}

function FeatModel(feats, uid) {
	var self = this;

	if (feats.length == 1) if (feats[0].name == 'No Feats') feats.pop();

	if (feats.length == 0) feats.push({ name: "None", descript: "" });

	self.uid = uid;
	self.feats = ko.observableArray(feats);
	self.checkboxFeats = ["Dodge", "Point Blank Shot", "Awesome Blow", "Frenzy", "Rage", "Rapid Shot", "Multi Shot"];
	self.numberFeats = ["Power Attack", "Combat Expertise"];

	self.countFeat = function (featName) {
		var ret = 0;

		$.each(self.feats(), function (i, e) {
			if (e.name && e.name.indexOf(featName) != -1) ret = parseInt(e.feat_level);
		});

		return ret;
	};

	self.hasWeaponFocus = function (wname) {
		if (!wname) return false;
		if (!self.hasFeat('Weapon Focus')) return false;

		var ret = false;

		$.each(self.feats(), function (i, e) {
			if (e.name.indexOf('Weapon Focus') == -1) return;
			var atk = e.name.substring(e.name.indexOf("(") + 1, e.name.indexOf(")"));
			if (!atk) return;
			if (wname.toLowerCase().indexOf(atk.toLowerCase()) != -1)
				ret = true;
		});

		return ret;
	};

	self.hasFeat = function (nameToFind) {
		return self.countFeat(nameToFind) != 0;
	};

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
}

function QualityModel(qualities, mname) {
	var self = this;

	if (qualities.length == 1) if (qualities[0].name == 'No Qualities') qualities.pop();

	if (qualities.length == 0) qualities.push({ name: "None", descript: "" });

	self.mname = mname;
	self.qualities = ko.observableArray(qualities);

	self.isMeasurable = function (name) {
		name = self.formatName(name);
		return name != 'Spell Resistance' && name != "Regeneration" && name != "Turn Resistance" && name != "Fast Healing";
	};
	self.format = function (qual) {
		return qual.value + (self.isMeasurable(qual.name) ? "ft" : "");
	};
	self.formatName = function (name) {
		if (name.indexOf(mname) != -1) return name.substring(mname.length).trim();
		return name.trim();
	};
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

	self.primaryRoll = function (skill) {
		return { "Base": "1d20", "Bonus": skill.skill_level };
	};

	self.hasSkill = function (skill) {
		return self.countSkill(skill) != 0;
	};

	self.countSkill = function (skillName) {
		var ret = 0;

		$.each(self.skills(), function (i, e) {
			if (e.name && e.name.indexOf(skillName) != -1) ret = parseInt(e.skill_level);
		});

		return ret;
	};
}

function SpeedModel(speeds) {
	var self = this;
	this.speeds = ko.observableArray(speeds);
}
//#endregion