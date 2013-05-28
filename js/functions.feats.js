
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
	$("[data-spfunc='Dodge']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.click(function () {
			var props = monsters[uid].ac.arrayProps();
			if ($this.is(":checked")) {
				props["Dodge"] = 1;
				monsters[uid].ac.arrayProps(props);
			} else {
				props["Dodge"] = 0;
				monsters[uid].ac.arrayProps(props);
			}
		})
	});
	$("[data-spfunc='Rage']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.click(function () {
			var props = monsters[uid].ac.arrayProps();
			var str = monsters[uid].stats.str.base.val();
			var con = monsters[uid].stats.con.base.val();
			if ($this.is(":checked")) {
				props["Rage"] = -2;
				monsters[uid].ac.arrayProps(props);

				monsters[uid].stats.str.base.val(str + 4);
				monsters[uid].stats.con.base.val(con + 4);

			} else {
				props["Rage"] = 0;
				monsters[uid].ac.arrayProps(props);

				monsters[uid].stats.str.base.val(str - 4);
				monsters[uid].stats.con.base.val(con - 4);
			}
		})
	});
	$("[data-spfunc='Frenzy']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.click(function () {
			var props = monsters[uid].ac.arrayProps();
			var str = monsters[uid].stats.str.base.val();
			var con = monsters[uid].stats.con.base.val();
			var will = monsters[uid].stats.will.base.val();

			if ($this.is(":checked")) {
				props["Frenzy"] = -2;
				monsters[uid].ac.arrayProps(props);

				monsters[uid].stats.str.base.val(str + 4);
				monsters[uid].stats.con.base.val(con + 4);
				monsters[uid].stats.will.base.val(will + 2);

			} else {
				props["Frenzy"] = 0;
				monsters[uid].ac.arrayProps(props);

				monsters[uid].stats.str.base.val(str - 4);
				monsters[uid].stats.con.base.val(con - 4);
				monsters[uid].stats.will.base.val(will - 2);
			}
		})
	});
	$("[data-spfunc='Charge']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.click(function () {
			var props = monsters[uid].ac.arrayProps();

			if ($this.is(":checked")) {
				props["Charge"] = -2;
				monsters[uid].ac.arrayProps(props);
			} else {
				props["Charge"] = 0;
				monsters[uid].ac.arrayProps(props);
			}
		})
	});

	var applyNumFunc = function (uid, scope) {
		var bab = monsters[uid].stats.bab.base.val();
		var conv = { "Power Attack": bab, "Combat Expertise": 5, "Cleave": 4 };
		var val = parseInt(scope.val());

		var func = scope.attr('data-spfunc');

		var finMax = conv[func];
		var max = clamp(0, finMax, bab);
		val = clamp(0, max, val);

		scope.val(val);

		if (func == 'Combat Expertise') {
			var props = monsters[uid].ac.arrayProps();
			props["Combat Expertise"] = val;
			monsters[uid].ac.arrayProps(props);
		}

	};

	$(".applyNum[data-spfunc][type='number']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.change(function () { applyNumFunc(uid, $this) });
	});
}