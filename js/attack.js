

function attack($rollable, $roller, uid) {
	var isAttack = $rollable.attr('data-attack-roll');

	var fullAttackAttacks = 1;

	if(typeof isAttack !== 'undefined' && isAttack.indexOf("[") != -1) 
		fullAttackAttacks = (""+$.parseJSON(isAttack)).split(",").length;

	isAttack = typeof isAttack !== 'undefined' && isAttack !== false;

	for(var fullAtkCount=0; fullAtkCount<fullAttackAttacks; fullAtkCount++) {

		var expr = $rollable.attr('data-roll');

		if(expr.indexOf('[') != -1) {
			expr = $.parseJSON(expr)[fullAtkCount];
			expr = JSON.stringify(expr);
		}

		var spatkFor = $rollable.attr('data-spatk');

		if(spatkFor && typeof spatkFor !== 'undefined' ) {
			if(spatkFor.indexOf('[') != -1) {
				spatkFor = spatkFor.substring(1, spatkFor.length-1);
				spatkFor = spatkFor.split(',');
				spatkFor = spatkFor[fullAtkCount];
			}
			spatkFor = spatkFor.trim();
		}

		var exprFor = $rollable.attr('data-roll-for');
		if(exprFor && typeof exprFor !== 'undefined' ) {
			if(exprFor.indexOf(',') != -1) {
				exprFor = exprFor.split(',');
				exprFor = exprFor[fullAtkCount];
			}
			exprFor = exprFor.trim();
		}
		var idFor = $roller.closest('div[data-for]').attr('id');
		var nameFor = $("a[href='#"+idFor+"']").html();

		var howManyAttacks = $rollable.attr('data-how-many');

		if(typeof howManyAttacks !== 'undefined' && howManyAttacks.indexOf('[') != -1) {
			howManyAttacks = howManyAttacks.substring(1, howManyAttacks.length-1);
			howManyAttacks = howManyAttacks.split(',');
			howManyAttacks = howManyAttacks[fullAtkCount];
		}

		howManyAttacks = parseInt(howManyAttacks) || 1;		

		var isRanged = $rollable.attr('data-range');

		if(typeof isRanged !== 'undefined' && isRanged.indexOf('[') != -1) {
			isRanged = isRanged.substring(1, isRanged.length-1);
			isRanged = isRanged.split(',');
			isRanged = isRanged[fullAtkCount];
		}

		isRanged = isRanged != '0';

		var threatRange = $rollable.attr('data-min-crit');

		if(typeof threatRange !== 'undefined' && threatRange.indexOf('[') != -1) {
			threatRange = threatRange.substring(1, threatRange.length-1);
			threatRange = threatRange.split(',');
			threatRange = threatRange[fullAtkCount];
		}

		threatRange = parseInt(threatRange);

		var is2h = expr.indexOf("(2h)") != -1;

		var attackRollString = $rollable.attr('data-attack-roll');

		if(typeof attackRollString !== 'undefined' && attackRollString.indexOf('[') != -1) {
			attackRollString = $.parseJSON(attackRollString)[fullAtkCount];
			attackRollString = JSON.stringify(attackRollString);
		}

		for(var atkCount=0; atkCount<howManyAttacks; atkCount++) {

			var result = 0;
			var resultText = '';
			var iters=1;
			var critStatus='';

			if(isAttack) {
				var attackRoll = _buildRoll(uid, attackRollString, true, isRanged, false);

				for(var i in attackRoll) {
					if(attackRoll[i] == 0) continue;
					result += attackRoll[i];
					resultText += i + ": "+attackRoll[i]+"<br>";

					critStatus = _critStatus(attackRoll[i], i, threatRange, true) || critStatus;

					if(critStatus == 'threat' || critStatus == 'success') {
						var threatRoll = _buildRoll(uid, attackRollString, true, isRanged, false);
						var threatData = _rollArray(threatRoll);
						var threatBasicAttack = _rollArray(threatRoll);
						iters = parseInt($rollable.attr('data-crit-mult'));
					}
				}
				if(critStatus == 'threat' || critStatus == 'success') {
					addToLog(logMessages.critAttempt(nameFor, exprFor, resultText, result), critStatus, idFor);
					addToLog(logMessages.critMiss(nameFor,exprFor,threatBasicAttack.text,threatBasicAttack.result)+(spatkFor!=null&&spatkFor!='null' ? " ("+spatkFor+" occurs)" : ''), critStatus, idFor);
					addToLog(logMessages.critSecond(nameFor,exprFor,threatData.text,threatData.result), critStatus, idFor);
				} else {
					addToLog(logMessages.initiate(nameFor, exprFor, resultText, result), critStatus, idFor);
				}
			}

			result = 0;
			resultText = '';

			for(var x=0; x<iters; x++) {
				var roll = _buildRoll(uid, expr, false, isRanged, isAttack);

				if(is2h && roll["Power Attack"] !== undefined) {
					roll["Power Attack"] *= 2;
				}

				for(var i in roll) {
					if(roll[i] == 0) continue;
					result += roll[i];
					resultText += i + ": "+roll[i]+"<br>";

					critStatus = _critStatus(roll[i], i, 0, false) || critStatus;
				}
			}

			if((critStatus == 'threat' || critStatus == 'success') && isAttack) {
				addToLog(logMessages.critSuccess(nameFor,exprFor,resultText,result)+(spatkFor!=null&&spatkFor!='null' ? " ("+spatkFor+" occurs)" : ''), critStatus, idFor);
			} else if(isAttack) {
				addToLog(logMessages.hit(nameFor, exprFor, resultText, result)+(spatkFor!=null&&spatkFor!='null' ? " ("+spatkFor+" occurs)" : ''), critStatus, idFor);
			} else {
				addToLog(logMessages.skill(nameFor, exprFor, resultText, result), critStatus, idFor);
			}
				
		}
		
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
	var retRoll = rollDice(roll);

	if(isAttack) {
		if(hasFeat(uid, 'Combat Expertise')) {
			var bonus = parseInt($("#"+uid+"_calc_ce").children("input").val());
			if(bonus!=0 && !isNaN(bonus))
				retRoll["Combat Expertise"] = -bonus;
		}

		if(hasFeat(uid, 'Awesome Blow') && $("#"+uid+"_calc_ab").is(":checked")) 
			retRoll["Awesome Blow"] = -4;

		if(hasFeat(uid, 'Point Blank Shot') && $("#"+uid+"_calc_pbs").is(":checked") && isRanged) 
			retRoll["Point Blank Shot"] = 1;

		if(hasFeat(uid, 'Power Attack')) {
			var bonus = parseInt($("#"+uid+"_calc_pa").children("input").val());
			if(bonus!=0 && !isNaN(bonus))
				retRoll["Power Attack"] = -bonus;
		}
	}

	if(isDamage) {

		if(hasFeat(uid, 'Power Attack')) {
			var bonus = parseInt($("#"+uid+"_calc_pa").children("input").val());
			if(bonus!=0 && !isNaN(bonus))
				retRoll["Power Attack"] = bonus;
		}

		if(hasFeat(uid, 'Point Blank Shot') && $("#"+uid+"_calc_pbs").is(":checked") && isRanged) 
			roll["Point Blank Shot"] = 1;
	}

	return retRoll;
}

function _rollArray(arr) {
	var ret = {result: 0, text: ''};
	for(var i in arr) {
		if(arr[i] == 0) continue;
		ret.result += arr[i];
		ret.text += i + ": "+arr[i]+"<br>";
	}
	return ret;
}