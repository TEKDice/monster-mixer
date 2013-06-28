
var Roll = function (data) {
	return {
		rollData: data,
		_lastRoll: rollDice(data),

		roll: function () {
			this._lastRoll = rollDice(this.rollData);
		}
	};
}

var Atk = function() {
	return {
		monUid: '',
		uid: null,
		bundleId: null,

		isAttack: false,
		isRanged: false,

		baseHit: {},
		baseAttack: {},

		threatHit: {},
		threatAttack: {},
		threatRange: 0,

		critStatus: '',
		atkPreText: '',

		isFor: { name: '', spatk: '', id: '', expr: '' },

		rollBaseAtk: function() {
			var rv = [];
			$.each(this.baseAttack, function (i, e) {
				rv.push(e._lastRoll);
			});
			return arrayToObject([].concat.apply([], rv));
		},

		rerollBaseAtk: function () {
			$.each(this.baseAttack, function (i, e) {
				e.roll();
			});
		},

		rerollForCleave: function() {
			this.baseAttack = arrayToObject([].concat.apply([], [].concat(this.baseAttack[0])));
			this.baseAttack[0].roll();
		},

		display: function () {
			var bH = _rollArray(this.baseHit._lastRoll);
			var tA = _rollArray(this.threatAttack._lastRoll);
			var tH = _rollArray(this.threatHit._lastRoll);
			var bA = _rollArray(this.rollBaseAtk());
			var bundle = this.bundleId;

			var messages = [];

			if (this.isAttack) {
				if (this.critStatus == 'threat' || this.critStatus == 'success') {
					messages.push({
						message: this.atkPreText + logMessages.critAttempt(this.isFor.name, this.isFor.expr, bH.text, bH.result),
						selector: this.critStatus,
						uid: this.isFor.id,
						bundle: bundle
					});

					messages.push({
						message: this.atkPreText + logMessages.critMiss(this.isFor.name, this.isFor.expr, tA.text, tA.result) + (this.hasSpatk() ? " (" + this.isFor.spatk + " occurs)" : ''),
						selector: this.critStatus,
						uid: this.isFor.id,
						bundle: bundle,
						atkUid: this.uid,
						damage: tA.result
					});

					messages.push({
						message: this.atkPreText + logMessages.critSecond(this.isFor.name, this.isFor.expr, tH.text, tH.result),
						selector: this.critStatus,
						uid: this.isFor.id,
						bundle: bundle
					});

					messages.push({
						message: this.atkPreText + logMessages.critSuccess(this.isFor.name, this.isFor.expr, bA.text, bA.result) + (this.hasSpatk() ? " (" + this.isFor.spatk + " occurs)" : ''),
						selector: this.critStatus,
						uid: this.isFor.id,
						bundle: bundle,
						damage: bA.result
					});
				} else {
					messages.push({
						message: this.atkPreText + logMessages.initiate(this.isFor.name, this.isFor.expr, bH.text, bH.result),
						selector: this.critStatus,
						uid: this.isFor.id,
						bundle: bundle
					});

					messages.push({
						message: this.atkPreText + logMessages.hit(this.isFor.name, this.isFor.expr, bA.text, bA.result) + (this.hasSpatk() ? " (" + this.isFor.spatk + " occurs)" : ''),
						selector: this.critStatus,
						uid: this.isFor.id,
						bundle: bundle,
						atkUid: this.uid,
						damage: bA.result
					});
				}
			} else {
				messages.push({
					message: this.atkPreText + logMessages.skill(this.isFor.name, this.isFor.expr, bA.text, bA.result),
					selector: this.critStatus,
					uid: this.isFor.id,
					bundle: bundle
				});
			}

			logModel.addBundleMessage(messages);
		},

		hasSpatk: function () {
			return this.isFor.spatk != null && this.isFor.spatk != 'null';
		}
	};
};

var cleaveAtks = {};

function doAttack(args) {

	var uid = args.uid;
	var expr = args.expr;
	var isAttack = args.isAttack;
	var spatkFor = args.spatkFor;
	var exprFor = args.exprFor;
	var idFor = args.idFor;
	var howManyAttacks = args.howManyAttacks;
	var isRanged = args.isRanged;
	var threatRange = args.threatRange;
	var attackRollString = args.attackRollString;
	var critMult = args.critMult;
	var isFullAttack = args.isFullAttack;
	var atkCtOverride = args.atkCtOverride;
	var atkPosOverride = args.atkPosOverride;
	var bundle = args.bundle;

	if(spatkFor) spatkFor = spatkFor.trim();
	if(exprFor) exprFor = exprFor.trim();

	var nameFor = $("a[href='#" + idFor + "']").html();
	var is2h = exprFor && exprFor.indexOf("(2H)") != -1;
	var iters = 1;

	var totalAttacks = atkCtOverride != null ? atkCtOverride : howManyAttacks;

	var attacks = [];

	for (var atkCount = 0; atkCount < howManyAttacks; atkCount++) {

		var attackObj = new Atk();

		attackObj.bundleId = bundle;
		attackObj.monUid = uid;
		attackObj.isAttack = isAttack;
		attackObj.isRanged = isRanged;
		attackObj.threatRange = threatRange;
		attackObj.isFor.spatk = spatkFor || null;
		attackObj.isFor.expr = exprFor;
		attackObj.isFor.name = nameFor;
		attackObj.isFor.id = idFor;

		var curAtk = atkPosOverride != null ? atkPosOverride : atkCount;

		iters = 1;

		var result = 0;
		var resultText = '';
		var critStatus = '';

		var atkCtText = totalAttacks > 1 ? '(' + (curAtk + 1) + '/' + totalAttacks + ') ' : '';

		attackObj.atkPreText = atkCtText;

		if (isAttack) {

			var attackRoll = _buildRoll(uid, attackRollString, true, isRanged, false);

			attackObj.baseHit = new Roll(attackRoll);

			for (var i in attackObj.baseHit._lastRoll) {
				var val = attackObj.baseHit._lastRoll[i];
				if (val == 0) continue;

				critStatus = _critStatus(val, i, threatRange, true) || critStatus;

				if (critStatus == 'threat' || critStatus == 'success') {

					var threatData = _buildRoll(uid, attackRollString, true, isRanged, false);
						
					var threatBasicAttackResult=0,threatBasicAttackResultText='';

					var threatBasicAttack = _buildRoll(uid, expr, false, isRanged, isAttack);

					if(is2h && threatBasicAttack["Power Attack"] !== undefined)
						threatBasicAttack["Power Attack"] *= 2;

					iters = critMult || 1;

					attackObj.threatAttack = new Roll(threatBasicAttack);
					attackObj.threatHit = new Roll(threatData);
				}
			}
		}

		attackObj.baseAttack = [];

		for(var x=0; x<iters; x++) {
			var roll = _buildRoll(uid, expr, false, isRanged, isAttack);

			if(is2h && roll["Power Attack"] !== undefined) {
				roll["Power Attack"] *= 2;
			}

			var rollObj = new Roll(roll);

			attackObj.baseAttack.push(rollObj);

			for (var i in rollObj._lastRoll) {
				var val = rollObj._lastRoll[i];
				if(val == 0) continue;

				critStatus = _critStatus(val, i, 0, false) || critStatus;
			}
		}

		attackObj.baseAttack = arrayToObject([].concat.apply([], attackObj.baseAttack));

		attackObj.critStatus = critStatus;

		attacks.push(attackObj);
	}
	return attacks;
}

function attack($rollable, $roller, uid) {

	var data = $.parseJSON($rollable.attr('data-roll'));

	if (data == null) throw new Error("There is nothing rollable here");

	if (data.howMany == 0 && data.primary == null) {
		bootbox.alert("Your roll is invalid. If you are trying to sunder or disarm, please select a weapon or a natural attack before rolling.");
		return;
	}

	var isFullAttack = data.isFatk;

	var expr = JSON.stringify(data.primary);

	var spatkFor = data.spatk;
	var exprFor = data.for;
	var idFor = $roller.closest('div[data-for]').attr('id');

	var isAttack = typeof data.secondary !== 'undefined' && data.secondary !== false;
	var howManyAttacks = data.howMany || 1;
	var isRanged = data.range;
	var threatRange = data.minCrit;
	var attackRollString = JSON.stringify(data.secondary);
	var crits = data.critMult;

	var attacks = [];

	var bundle = now();

	if(isFullAttack) {
		var fatk = data.primary;

		isRanged = fatk.range != 0;

		$.each(fatk.rolls, function(i, ee) {
			var index = ee.refIndex;

			var atk = doAttack({
				uid: uid,
				expr: JSON.stringify(ee.tohit),
				isAttack: true,
				spatkFor: fatk.spatk[index],
				exprFor: fatk.names[index],
				idFor: idFor,
				howManyAttacks: 1,
				isRanged: parseInt(fatk.range[index]) != 0,
				threatRange: fatk.minCrit[index],
				attackRollString: JSON.stringify(ee.damage),
				critMult: fatk.critMult[index],
				isFullAttack: true,
				atkCtOverride: fatk.rolls.length,
				atkPosOverride: i,
				bundle: bundle
			});
			attacks.push(atk);
		});

	} else {
		var atk = doAttack({
			uid: uid,
			expr: expr,
			isAttack: isAttack,
			spatkFor: spatkFor,
			exprFor: exprFor,
			idFor: idFor,
			howManyAttacks: howManyAttacks,
			isRanged: isRanged,
			threatRange: threatRange,
			attackRollString: attackRollString,
			critMult: crits,
			isFullAttack: false,
			bundle: bundle
		});
		
		attacks.push(atk);
	}

	displayAttacks([].concat.apply([], attacks));

}

function displayAttacks(attacks) {
	for (var atk = 0; atk < attacks.length; atk++) {
		var curAtk = $.extend(true, {}, attacks[atk]);

		if (!curAtk.isRanged && curAtk.isAttack && monsters.getMonster(curAtk.monUid).feats.hasFeat("Cleave")) {
			var newUid = now();
			curAtk.uid = newUid;
			cleaveAtks[curAtk.uid] = curAtk;
			sessionManager.saveCurrentCleaveData(cleaveAtks);
		}

		curAtk.display();
	}
}

function _critStatus(roll, i, threatRange, canThreat) {
	var critStatus;
	if(roll <= 1 && i.indexOf('1d20') != -1 && i.indexOf('Base') != -1) {
		critStatus = 'fail';

	} else if(canThreat && (roll >= threatRange && i.indexOf('1d20') != -1 && i.indexOf('Base') != -1)) {
		critStatus = 'threat';
		if(roll >= 20) critStatus = 'success';

	} else if(roll >= 20 && i.indexOf('1d20') != -1 && i.indexOf('Base') != -1) {
		critStatus = 'success';

	}
	return critStatus;
}

function _buildRoll(uid, roll, isAttack, isRanged, isDamage) {
	var retRoll = $.parseJSON(roll);

	var featModel = monsters.getMonster(uid).feats;

	if(isAttack) {
		if(featModel.hasFeat('Combat Expertise')) {
			var bonus = parseInt($$(uid+"_calc_ce").val());
			if(!isNaN(bonus))
				retRoll["Combat Expertise"] = -bonus;
		}

		if (featModel.hasFeat('Awesome Blow') && $$(uid + "_calc_ab").is(":checked"))
			retRoll["Awesome Blow"] = -4;

		if (featModel.hasFeat('Point Blank Shot') && $$(uid + "_calc_pbs").is(":checked") && isRanged)
			retRoll["Point Blank Shot"] = 1;

		if (featModel.hasFeat('Power Attack')) {
			var bonus = parseInt($$(uid+"_calc_pa").val());
			if(!isNaN(bonus))
				retRoll["Power Attack"] = -bonus;
		}

		if ($$(uid + "_calc_charge").is(":checked") && !isRanged)
			retRoll["Charge"] = 2;
	}

	if(isDamage) {

		if (featModel.hasFeat('Power Attack')) {
			var bonus = parseInt($$(uid+"_calc_pa").val());
			if(bonus!=0 && !isNaN(bonus))
				retRoll["Power Attack"] = bonus;
		}

		if (featModel.hasFeat('Point Blank Shot') && $$(uid + "_calc_pbs").is(":checked") && isRanged)
			roll["Point Blank Shot"] = 1;
	}

	return retRoll;
}

function _rollArray(arr) {
	var ret = { result: 0, text: '', rolls: {} };
	var idx = 0;
	for(var i in arr) {
		if (arr[i] == 0 || arr[i] == null) continue;
		if (typeof arr[i] === 'object') {
			var newRoll = {};
			for (var j in arr[i]) {
				ret.result += arr[i][j];
				ret.text += j + ": " + arr[i][j] + "<br>";
				newRoll[j] = arr[i][j];
			}
			ret.rolls[idx++] = newRoll;
		} else {
			ret.result += arr[i];
			ret.text += i + ": " + arr[i] + "<br>";
			ret.rolls[i] = arr[i];
		}
	}
	return ret;
}