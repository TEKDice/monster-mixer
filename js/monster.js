
var monsterCount = 0;

var monsters = {};

function addNewMonster(monster) {

	$(".alert").hide();
	$("#monsterList").show();

	var uid = new Date().getTime();

	_addNewMonster(monster, uid);

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

	var nice = $('#monsterList').niceScroll({ horizrailenabled: false, zindex: 9, railoffset: { left: -118 } });
	$('#monsterList').css('overflow', 'hidden');

	setupGrids(uid);

	tabChangeScrollbars($a);

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

function modifyHp(uid, mod, notLog) {
	if (isNaN(mod)) return;
	monsters[uid].hp.mod().relative(mod);

	var curHp = monsters[uid].hp.total();
	var maxHp = monsters[uid].hp.max();
	var $monsterNode = $("[href=#" + uid + "]");
	var monsterName = $monsterNode.html();

	var hpPerc = Math.round((curHp/maxHp)*100);
	if(hpPerc <= 15)	  $monsterNode.attr('class','hp-critical');
	else if(hpPerc <= 50) $monsterNode.attr('class','hp-warning');
	else 				  $monsterNode.attr('class','hp-good');

	if(!notLog)
		addToLog(monsterName + (mod < 0 ? " lost " : " gained ") + Math.abs(mod) + " hp. ("+curHp+"/"+maxHp+") ["+hpPerc+"%]");

	saveMonsters();

	if(curHp <= 0) {		
		bootbox.confirm("It looks like "+$monsterNode.text()+" has died. Would you like to mark it as 'killed'?", function(result) {
			if(result)
				remove(uid, true);
		});
	}
}

function remove(uid, killed) {
	var $node = $("#monsterList a[href='#"+uid+"']");
	var pos = parseInt($node.find('.logCount').text());

	var count = 0;

	$("#monsterList li").each(function(i, e) {
		count++;
	});
	
	var $a = $("#monsterList li a").first();

	_showScrollbars($a);
	$a.tab('show');

	if (count > 0) {
		$a = $("#monsterList li:nth-child("+(pos-1)+")").find("a");
		_showScrollbars($a);
		$a.tab('show');
	} else {
		if(killed) {
			$("#winAlert").show();
		} else {
			$("#genAlert").show();
		}
		$("#monsterList").hide();
	}

	$node.parent().remove();
	$(".tab-pane[data-for='" + uid + "']").remove();
	$("div[data-nice-uid='" + uid + "']").hide();
	$("#" + uid + "_log").remove();

	saveMonsters();

	updateLogNumbers(uid, killed);
}

function updateLogNumbers(uid, killed) {
	$("#allInfo div p span.logCount").each(function(i,e){
		var uid = $(this).closest('[data-uid]').attr('data-uid');

		if($(this).text() == 'DEAD' || $(this).text() == 'GONE');

		var $monNode = $("#monsterList a[href='#"+uid+"']");

		if($monNode.length == 0) {
			$(this).text(killed ? 'DEAD' : 'GONE');
		} else {
			//$(this).text($monNode.find('.logCount').text());
		}
	});
}