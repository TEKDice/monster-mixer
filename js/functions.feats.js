
function formatSpecialFeatName(name) {
	switch (name) {
		case 'Awesome Blow': return 'ab';
		case 'Point Blank Shot': return 'pbs';
		case 'Rage': return 'rage';
		case 'Dodge': return 'dodge';
		case 'Frenzy': return 'frenzy';
		case 'Power Attack': return 'pa';
		case 'Cleave': return 'cleave';
		case 'Charge': return 'charge';
		case 'Sunder': return 'sunder';
		case 'Disarm': return 'disarm';
		case 'Combat Expertise': return 'ce';
	}
	return searchNameForNamedEntries(name);
}

function searchNameForNamedEntries(name) {
	if (name.indexOf('Frenzy') != -1) return 'frenzy';
	if (name.indexOf('Rage') != -1) return 'rage';
	return false;
}

function addFeatFunctions() {
	$("[data-cleave-uid]").livequery(function () {
		$(this).click(function () {
			var cleaveAtk = cleaveAtks[$(this).attr('data-cleave-uid')];
			if (!monsters.getMonster(cleaveAtk.monUid).feats.hasFeat("Great Cleave"))
				cleaveAtk.uid = null;
			cleaveAtk.bundleId = now();
			cleaveAtk.critStatus = 'cleave';
			cleaveAtk.baseHit.roll();
			cleaveAtk.rerollForCleave();
			cleaveAtk.display();
		});
	});

	$("[data-spfunc='Dodge']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.click(function () {
			var props = monsters.getMonster(uid).ac.arrayProps();
			if ($this.is(":checked")) {
				props["Dodge"] = 1;
				monsters.getMonster(uid).ac.arrayProps(props);
			} else {
				props["Dodge"] = 0;
				monsters.getMonster(uid).ac.arrayProps(props);
			}
		})
	});
	$("[data-spfunc='Rage']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		var monster = monsters.getMonster(uid);
		$this.click(function () {
			var props = monster.ac.arrayProps();
			var str = monster.stats.str.base.val();
			var con = monster.stats.con.base.val();
			if ($this.is(":checked")) {
				props["Rage"] = -2;
				monster.ac.arrayProps(props);

				monster.stats.str.base.val(str + 4);
				monster.stats.con.base.val(con + 4);

			} else {
				props["Rage"] = 0;
				monster.ac.arrayProps(props);

				monster.stats.str.base.val(str - 4);
				monster.stats.con.base.val(con - 4);
			}
		})
	});
	$("[data-spfunc='Frenzy']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		var monster = monsters.getMonster(uid);
		$this.click(function () {
			var props = monster.ac.arrayProps();
			var str = monster.stats.str.base.val();
			var con = monster.stats.con.base.val();
			var will = monster.stats.will.base.val();

			if ($this.is(":checked")) {
				props["Frenzy"] = -2;
				monster.ac.arrayProps(props);

				monster.stats.str.base.val(str + 4);
				monster.stats.con.base.val(con + 4);
				monster.stats.will.base.val(will + 2);

			} else {
				props["Frenzy"] = 0;
				monster.ac.arrayProps(props);

				monster.stats.str.base.val(str - 4);
				monster.stats.con.base.val(con - 4);
				monster.stats.will.base.val(will - 2);
			}
		})
	});
	$("[data-spfunc='Charge']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		var monster = monsters.getMonster(uid);
		$this.click(function () {
			var props = monster.ac.arrayProps();
			monster.roller.invalidate();

			if ($this.is(":checked")) {
				props["Charge"] = -2;
				monster.ac.arrayProps(props);
			} else {
				props["Charge"] = 0;
				monster.ac.arrayProps(props);
			}
		})
	});

	var applyNumFunc = function (uid, scope) {
		var bab = monsters.getMonster(uid).stats.bab.base.val();
		var conv = { "Power Attack": bab, "Combat Expertise": 5, "Cleave": 4 };
		var val = parseInt(scope.val());

		var func = scope.attr('data-spfunc');

		var finMax = conv[func];
		var max = clamp(0, finMax, bab);
		val = clamp(0, max, val);

		scope.val(val);

		if (func == 'Combat Expertise') {
			var props = monsters.getMonster(uid).ac.arrayProps();
			props["Combat Expertise"] = val;
			monsters.getMonster(uid).ac.arrayProps(props);
		}

	};

	var sunderFunc = function (uid, scope) {
		var val = parseInt(scope.val());
		val = clamp(-8, 8, val);
		scope.val(val);
		monsters.getMonster(uid).roller.invalidate();
	};

	$(".applyNum[data-spfunc][type='number']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		var func = $this.attr('data-spfunc');
		if (func == 'Sunder' || func == 'Disarm') {
			$this.change(function () { sunderFunc(uid, $this) });
		} else {
			$this.change(function () { applyNumFunc(uid, $this) });
		}
	});
}