
var monsterCount = 0;

function addNewMonster(monster) {

	$(".alert").hide();
	$("#monsterList").show();

	var uid = new Date().getTime();

	_addNewMonster(monster, uid);

	modifyHp(uid, 0, true);

	_hidePopup();

	sortMonsters();

	saveMonsters();

	return uid;

}

function _addNewMonster(monster, uid, name) {

	var realName = monster == null ? name : monster.data[0].name;

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

	if (!(uid in monsters.allMonsters())) {
		monsters.addMonster(uid, new MonsterModel(uid, monster));
	}

	var monsterModel = monsters.getMonster(uid);

	ko.applyBindings(monsterModel, $$(uid)[0]);

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

	var nice = $('#monsterList').niceScroll({ horizrailenabled: false, zindex: 9, railalign: "left" });
	$('#monsterList').css('overflow', 'hidden');

	var $a = $("a[data-uid='" + uid + "']");

	tabChangeScrollbars($a);

	$a.tab('show');
}

function sortMonsters() {
	var mylist = $('#monsterList');
	var listitems = mylist.children('li').get();
	listitems.sort(function (a, b) {
		var leftId = $(a).children("a").attr('data-uid');
		var rightId = $(b).children("a").attr('data-uid');

		var left = parseInt($$(leftId + "_init").text());
		var right = parseInt($$(rightId + "_init").text());
		//var left = monsters[leftId].initiative.init.num().val();
		//var right = monsters[rightId].initiative.init.num().val();

		if ((right-left) == 0) {
			var leftDex = monsters.getMonster(leftId).stats.dex.bonus();
			var rightDex = monsters.getMonster(rightId).stats.dex.bonus();

			//TODO if rightDex-leftDex <0 sort by alpha

			return rightDex - leftDex;
		}

		return right - left;
	});
	$.each(listitems, function (idx, itm) { mylist.append(itm); });
}

function modifyHp(uid, mod, notLog) {
	if (isNaN(mod)) return;
	monsters.getMonster(uid).hp.mod().relative(mod);

	var curHp = monsters.getMonster(uid).hp.total();
	var maxHp = monsters.getMonster(uid).hp.max();
	var $monsterNode = $("[href=#" + uid + "]");
	var monsterName = $monsterNode.html();

	var hpPerc = Math.round((curHp/maxHp)*100);
	if(hpPerc <= 15)	  $monsterNode.attr('class','hp-critical');
	else if(hpPerc <= 50) $monsterNode.attr('class','hp-warning');
	else 				  $monsterNode.attr('class','hp-good');

	if(!notLog)
		addToLog({
			message: monsterName + (mod < 0 ? " lost " : " gained ") +Math.abs(mod) + " hp. ("+curHp+"/"+maxHp+") ["+hpPerc+"%]",
			selector: 'health-mod',
			damage: Math.abs(mod)
		});

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
	var pos = parseInt($node.find('.logCount').attr('data-pos'));

	var count = $("#monsterList li").size() - 1;

	var selPos;

	if (count > 0) {

		var $liElem = $node.parent();

		var listPos = $liElem.parent().children().index($liElem);

		selPos = listPos == 0 ? 1 : listPos;
		
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

	if (selPos)
		$("#monsterList li:nth-child(" + (selPos) + ")").find("a").tab('show');

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