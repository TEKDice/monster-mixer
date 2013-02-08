

function addNewMonster(monster) {

	var uid = new Date().getTime();

	var $li = $("<li/>");
	$li.appendTo($("#monsterList"));

	var $a = $("<a/>",{
		href: "#"+uid,
		text: "["+$("#monsterList").children().size()+"] "+monster.data[0].name
	}).attr('data-toggle','tab');

	$a.appendTo($li);

	var newHtml = $("#dummyData").html();
	$("#monsterData").append(newHtml);

	var $parent = $("[data-for='none']").not("#dummyData > [data-for='none']");

	$parent.attr('id', uid);
	$parent.attr('data-for', uid);

	addDataToMonster($parent, monster, uid);

	$('#monsterList').niceScroll({horizrailenabled: false});
	$('#monsterList').css('overflow','hidden');

	tabChangeScrollbars();

	rollableRowHighlighting($parent);

	setupRollables($parent);

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
}

function addDataToMonster($parent, monster, uid) {

	var root = monster.data[0];

	//all of the base attributes in the data object
	$parent.find("*[id*='1A']").each(function() {
		var attr = $(this).attr('data-attr');
		$(this).attr('id', $(this).attr('id').replace('1A', uid));
		$(this).attr('data-uid', uid);
		if(root.hasOwnProperty(attr)) {
			var val = root[attr] == '0' && attr!='initiative' ? '--' : root[attr] + (attr=='base_spd' ? 'ft' : '');
			$(this).text(val);
			$(this).attr('data-base-value',$(this).text());
			determineRoll($(this));
		}
	});

	$parent.find(".stats tr").each(function() {
		var stat = $(this).children("td").eq(1).text();
		var num = get_bonus(stat);
		$(this).children("td").eq(1).text(stat + (stat != '--' ? " ("+(num < 0 ? num : "+"+num) + ")" : ''));
		$(this).attr('data-roll', JSON.stringify({Base: "1d20", Bonus:num}));
		$(this).attr('data-roll-for', $(this).children("td").eq(0).text());
	});

	$parent.find(".cstats tr").each(function() {
		var num = parseInt($(this).children("td").eq(1).text());
		$(this).attr('data-roll', JSON.stringify({Base: "1d20", Bonus:num}));
		$(this).attr('data-roll-for', $(this).children("td").eq(0).text());
	});

	for(var prop in monster) {
		if(prop!='data' && isNaN(parseInt(prop))) {
			var $table = $("#"+uid+"_"+prop+"_table");
			if($table.length == 0 || monster[prop].length == 0) continue;
			appendToTable($table, root.name, prop, monster[prop]);
		}
	}

	var nameTooltip = root.size + " " + root.category;
	if(monster.msubcat.length > 0) {
		var subcats = [];
		$.each(monster.msubcat, function(i, e) {
			subcats.push(e.subcategory);
		});
		if(subcats.length > 0)
			nameTooltip += " ("+subcats.join(', ')+")";
	}
	$("#"+uid+"_name").attr('title', nameTooltip).tooltip();

	setUpHp($parent, uid);
	rollInit($("#"+uid+"_init"));
}

function setUpHp($parent, uid) {
	$hpNode = $parent.find("span[data-attr='hit_dice']");
	var hp = $hpNode.attr('data-initial-roll');
	$hpNode.text('');
	$hpNode.append("<span class='hp_val'></span>");
	rollHp(uid, $hpNode, hp);
	$hpNode.append('<i id="health_'+uid+'" class="icon-heart"></i>');
	var popover = $("#dummyModifiable").html();
	popover = popover.split("1A").join(uid);
	$("#health_"+uid).popover({
		html: true,
		placement: 'bottom',
		content: popover,
		title: "Modify HP"
	});
}

function appendToTable($table, monsterName, attr, arr) {
	if(attr!='mmove')
		$table.empty();
	$.each(arr, function(i, obj) {
		var $tr = $("<tr/>");
		if(rollable.hasOwnProperty(attr))  {
			$tr.attr('data-roll', rollable[attr](obj));
			$tr.attr('data-roll-for', mainStat[attr](obj));
			if(attr == 'mweapon' || attr == 'mattack') {
				$tr.attr('data-range',obj.is_ranged);
				$tr.attr('data-min-crit');
				$tr.attr('data-crit-mult');
			}
		}
		if(attr == 'mfeat') {
			$tr.attr('data-times-taken',obj.feat_level);
		}
		$tr.appendTo($table);
		var inner = formatting[attr](obj);
		if(inner.indexOf(monsterName) != -1) inner = inner.substring(monsterName.length);
		$tr.append("<td"+(obj.hasOwnProperty('descript') ? " class='has-tooltip' data-desc='"+obj.descript.split("\n").join("<br>")+"'" : "")+">"+inner+"</td>");
	});
	$table.find("td.has-tooltip").each(function() {
		var text = $(this).text();
		$(this).text('');
		$(this).prepend('<i class="icon-bookmark"></i><a href="#" rel="tooltip" title="'+$(this).attr('data-desc')+'">'+text+"</a>");
		$(this).find('a').tooltip({html: true, placement: 'bottom', trigger: 'manual'});

		$(this).find('a').click(function() {

			var $me = $(this);
			var doShow = true;

			$(".in").each(function() {
				if($(this).siblings("a").is($me)) {
					doShow = false;
				}
				$(this).siblings("a").tooltip('hide');

			});
			if(doShow)
				$(this).tooltip('show');
		});
	});

}