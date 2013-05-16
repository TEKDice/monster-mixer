
var monsterCount = 0;
var tempMon;

var monsters = {};

function addNewMonster(monster) {

	$(".alert").hide();
	$("#monsterList").show();

	var uid = new Date().getTime();

	_addNewMonster(monster, uid)

	_hidePopup();

	sortMonsters();

	saveMonsters();

	return uid;

}

function _addNewMonster(monster, uid, name) {

	var $li = $("<li/>");

	var realName = monster == null ? name : monster.data[0].name;

	var $a = $("<a/>", {
		href: "#" + uid
	}).html("[<span class='logCount'>" + (++monsterCount) + "</span>] " + realName).attr('data-toggle', 'tab').attr('data-uid', uid);

	$a.appendTo($li);

	$a.attr('class', 'hp-good');

	var newHtml = $("#dummyData").html();
	$("#monsterData").append(newHtml);

	var $parent = $(".tab-pane[data-for='none']").not("#dummyData > [data-for='none']");

	$parent.attr('id', uid);
	$parent.attr('data-for', uid);

	$parent.find("*[id*='1A']").each(function () {
		$(this).attr('id', $(this).attr('id').replace('1A', uid));
	});

	$parent.find("*[data-uid*='1A']").each(function () {
		$(this).attr('data-uid', $(this).attr('data-uid').replace('1A', uid));
	});

	if (!(uid in monsters)) {
		monsters[uid] = new MonsterModel(uid, monster);
	}
	ko.applyBindings(monsters[uid], $$(uid)[0]);

	setUpHp(uid);

	var nice = $('#monsterList').niceScroll({ horizrailenabled: false, zindex: 9, railoffset: { left: -118 } });
	$('#monsterList').css('overflow', 'hidden');

	tabChangeScrollbars();

	setupRollables($parent);

	var newLog = $("#dummyLog").html();
	$("#curMon").append(newLog);

	var $pLog = $(".log[data-for='none']").not("#dummyLog > [data-for='none']");
	$pLog.attr('id', uid + "_log").attr('data-for', uid);

	$li.appendTo($("#monsterList"));

	$a.tab('show');
}

function sortMonsters() {
	var mylist = $('#monsterList');
	var listitems = mylist.children('li').get();
	listitems.sort(function (a, b) {
		var left = parseInt($("#" + $(a).children("a").attr('data-uid') + "_init").text());
		var right = parseInt($("#" + $(b).children("a").attr('data-uid') + "_init").text());
		return right - left;
	});
	$.each(listitems, function (idx, itm) { mylist.append(itm); });
}

function setUpHp(uid) {
	var popover = $("#dummyModifiable").html();
	popover = popover.split("1A").join(uid);
	$("#health_" + uid).popover({
		html: true,
		placement: 'bottom',
		content: popover,
		title: "Modify HP"
	}).click(function () {
		$(".modify-hp").click(function () {
			var modHp = parseInt($$(uid + "_hp_mod").val());
			if ($(this).hasClass('subtract')) {
				modifyHp(uid, -modHp);
			} else {
				modifyHp(uid, modHp);
			}
		});
	});
}