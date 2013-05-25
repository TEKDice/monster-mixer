
var atk = function() {
	return {
		isAttack: false,
		isRanged: false,

		baseHit: {},
		baseAttack: {},

		threatHit: {},
		threatAttack: {},

		critStatus: '',
		atkPreText: '',

		isFor: { name: '', spatk: '', id: '', expr: '' },

		display: function () {

			var bH = _rollArray(this.baseHit);
			var tA = _rollArray(this.threatAttack);
			var tH = _rollArray(this.threatHit);
			var bA = _rollArray(this.baseAttack);

			if (this.isAttack) {
				if (this.critStatus == 'threat' || this.critStatus == 'success') {
					addToLog(this.atkPreText + logMessages.critAttempt(this.isFor.name, this.isFor.expr,
						bH.text, bH.result), this.critStatus, this.isFor.id);

					addToLog(this.atkPreText + logMessages.critMiss(this.isFor.name, this.isFor.expr,
						tA.text, tA.result) +
							(this.hasSpatk() ? " (" + this.isFor.spatk + " occurs)" : ''), this.critStatus, this.isFor.id);

					addToLog(this.atkPreText + logMessages.critSecond(this.isFor.name, this.isFor.expr,
						tH.text, tH.result), this.critStatus, this.isFor.id);

					addToLog(this.atkPreText + logMessages.critSuccess(this.isFor.name, this.isFor.expr,
						bA.text, bA.result) +
							(this.hasSpatk() ? " (" + this.isFor.spatk + " occurs)" : ''), this.critStatus, this.isFor.id);
				} else {
					addToLog(this.atkPreText + logMessages.initiate(this.isFor.name, this.isFor.expr,
						bH.text, bH.result), this.critStatus, this.isFor.id);

					addToLog(this.atkPreText + logMessages.hit(this.isFor.name, this.isFor.expr,
						bA.text, bA.result) +
							(this.hasSpatk() ? " (" + this.isFor.spatk + " occurs)" : ''), this.critStatus, this.isFor.id);
				}
			} else 
				addToLog(this.atkPreText + logMessages.skill(this.isFor.name, this.isFor.expr,
						bH.text, bH.result), this.critStatus, this.isFor.id);
		},

		hasSpatk: function () {
			return this.isFor.spatk != null && this.isFor.spatk != 'null';
		}
	};
};

function doAttack(uid, expr, isAttack, spatkFor, exprFor, idFor, howManyAttacks, isRanged, threatRange,
	attackRollString, critMult, isFullAttack, atkCtOverride, atkPosOverride) {

	if(spatkFor) spatkFor = spatkFor.trim();
	if(exprFor) exprFor = exprFor.trim();

	var nameFor = $("a[href='#"+idFor+"']").html();
	var is2h = expr.indexOf("(2H)") != -1;
	var iters = 1;

	var totalAttacks = atkCtOverride != null ? atkCtOverride : howManyAttacks;

	var attacks = [];

	for (var atkCount = 0; atkCount < howManyAttacks; atkCount++) {

		var attackObj = new atk();

		attackObj.isAttack = isAttack;
		attackObj.isRanged = isRanged;
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

			attackObj.baseHit = attackRoll;

			for(var i in attackRoll) {
				if(attackRoll[i] == 0) continue;
				result += attackRoll[i];
				resultText += i + ": "+attackRoll[i]+"<br>";

				critStatus = _critStatus(attackRoll[i], i, threatRange, true) || critStatus;

				if (critStatus == 'threat' || critStatus == 'success') {

					var threatData = _buildRoll(uid, attackRollString, true, isRanged, false);
						
					var threatBasicAttackResult=0,threatBasicAttackResultText='';

					var threatBasicAttack = _buildRoll(uid, expr, false, isRanged, isAttack);

					if(is2h && threatBasicAttack["Power Attack"] !== undefined)
						threatBasicAttack["Power Attack"] *= 2;
					for(var i in threatBasicAttack) {
						if(threatBasicAttack[i] == 0) continue;
						threatBasicAttackResult += threatBasicAttack[i];
						threatBasicAttackResultText += i + ": "+threatBasicAttack[i]+"<br>";
					}

					iters = critMult || 1;

					attackObj.threatAttack = threatBasicAttack;
					attackObj.threatHit = threatData;

					threatData = _rollArray(threatData);
					threatBasicAttack = _rollArray(threatBasicAttack);
				}
			}
			if(critStatus == 'threat' || critStatus == 'success') {
				//addToLog(atkCtText+logMessages.critAttempt(nameFor, exprFor, resultText, result), critStatus, idFor);
				//addToLog(atkCtText+logMessages.critMiss(nameFor,exprFor,threatBasicAttackResultText,threatBasicAttackResult)+(spatkFor!=null&&spatkFor!='null' ? " ("+spatkFor+" occurs)" : ''), critStatus, idFor);
				//addToLog(atkCtText+logMessages.critSecond(nameFor,exprFor,threatData.text,threatData.result), critStatus, idFor);
			} else {
				//addToLog(atkCtText+logMessages.initiate(nameFor, exprFor, resultText, result), critStatus, idFor);
			}
		}

		result = 0;
		resultText = '';

		attackObj.baseAttack = [];

		for(var x=0; x<iters; x++) {
			var roll = _buildRoll(uid, expr, false, isRanged, isAttack);

			if(is2h && roll["Power Attack"] !== undefined) {
				roll["Power Attack"] *= 2;
			}

			attackObj.baseAttack.push(roll);

			for(var i in roll) {
				if(roll[i] == 0) continue;
				result += roll[i];
				resultText += i + ": "+roll[i]+"<br>";

				critStatus = _critStatus(roll[i], i, 0, false) || critStatus;
			}
		}

		attackObj.baseAttack = arrayToObject([].concat.apply([], attackObj.baseAttack));

		if((critStatus == 'threat' || critStatus == 'success') && isAttack) {
			//addToLog(atkCtText+logMessages.critSuccess(nameFor, exprFor, resultText, result)+(spatkFor!=null&&spatkFor!='null' ? " ("+spatkFor+" occurs)" : ''), critStatus, idFor);
		} else if(isAttack) {
			//addToLog(atkCtText+logMessages.hit(nameFor, exprFor, resultText, result)+(spatkFor!=null&&spatkFor!='null' ? " ("+spatkFor+" occurs)" : ''), critStatus, idFor);
		} else {
			//addToLog(atkCtText+logMessages.skill(nameFor, exprFor, resultText, result), critStatus, idFor);
		}

		attackObj.critStatus = critStatus;

		attacks.push(attackObj);
	}
	return attacks;
}

function attack($rollable, $roller, uid) {

	var data = $.parseJSON($rollable.attr('data-roll'));

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

	if(isFullAttack) {
		var fatk = data.primary;

		isRanged = fatk.range != 0;

		$.each(fatk.rolls, function(i, ee) {
			var index = ee.refIndex;
			attacks.push(doAttack(uid, JSON.stringify(ee.tohit), true, fatk.spatk[index], fatk.names[index], 
				idFor, 1, isRanged, fatk.minCrit[index], JSON.stringify(ee.damage), 
				fatk.critMult[index], true, fatk.rolls.length, i));
		});

	}  else {
		attacks.push(doAttack(uid, expr, isAttack, spatkFor, exprFor, idFor, howManyAttacks, isRanged, threatRange, attackRollString, crits, false));
	}

	displayAttacks([].concat.apply([], attacks));

}

var lastAtk;
function displayAttacks(attacks) {
	for (var atk = 0; atk < attacks.length; atk++) {
		lastAtk = attacks[atk];
		console.log(attacks[atk]);
		attacks[atk].display();
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

function _buildRoll(uid, roll, isAttack, isRanged, isDamage, cleaveAtk) {
	var retRoll = rollDice(roll);

	var featModel = monsters[uid].feats;

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
	var ret = {result: 0, text: ''};
	for(var i in arr) {
		if (arr[i] == 0 || arr[i] == null) continue;
		console.log(i + " " + typeof arr[i]);
		if (typeof arr[i] === 'object') {
			for (var j in arr[i]) {
				ret.result += arr[i][j];
				ret.text += j + ": " + arr[i][j] + "<br>";
			}
		} else {
			ret.result += arr[i];
			ret.text += i + ": " + arr[i] + "<br>";
		}
	}
	return ret;
}