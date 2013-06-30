//tooltip objects
function _getArmorBonus($all_data) {
	var ret = {};
	if(isset($all_data["marmor"][0])) ret[$all_data["marmor"][0]["aname"]] = parseInt($all_data["marmor"][0]["ac_bonus"]);
	if(isset($all_data["marmor"][1])) ret[$all_data["marmor"][1]["aname"]] = parseInt($all_data["marmor"][1]["ac_bonus"]);
	return ret;
}

function getFlatac($all_data) {
	var ret = {"Base": 10};
	var natAc = parseInt($all_data["data"][0]["natural_ac"]);
	var insAc = parseInt($all_data["data"][0]["insight"]);
	var defAc = parseInt($all_data["data"][0]["deflection"]);
	var dexBon = getBonus($all_data["data"][0]["dex"]);
	var sMod = _getSizeModifier($all_data["data"][0]["size"]);

	if(natAc != 0) ret["Natural AC"] = natAc;
	if(insAc != 0) ret["Insight AC"] = insAc;
	if(defAc != 0) ret["Deflection AC"] = defAc;
	if(dexBon > 0) ret["DEX Bonus"] = dexBon;
	if(sMod  != 0) ret["Size Mod"] = sMod;

	ret = collect(ret, _getArmorBonus($all_data));
	return ret;
				
}

function getTouchac($all_data) {
	return _baseAc($all_data);
}

function getAc($all_data) {
	var ret = {};
	var natAc = parseInt($all_data["data"][0]["natural_ac"]);
	var insAc = parseInt($all_data["data"][0]["insight"]);
	var defAc = parseInt($all_data["data"][0]["deflection"]);

	if(natAc != 0) ret["Natural AC"] = natAc;
	if(insAc != 0) ret["Insight AC"] = insAc;
	if(defAc != 0) ret["Deflection AC"] = defAc;
	ret = collect(ret, _baseAc($all_data), _getArmorBonus($all_data));
	return ret;
}

function _baseAc($all_data) {
	var ret = {"Base": 10};
	var dexBon = getBonus($all_data["data"][0]["dex"]);
	var sMod = _getSizeModifier($all_data["data"][0]["size"]);

	if(dexBon != 0) ret["DEX Bonus"] = dexBon;
	if(sMod  != 0) ret["Size Mod"] = sMod;
	return ret;
}

function _getSizeModifier($size) {
	switch($size) {
		case 10: 	case "Fine": 		return 8;
		case 9: 	case "Diminutive": 	return 4;
		case 6: 	case "Tiny": 		return 2;
		case 1: 	case "Small": 		return 1;
		case 2: 	case "Medium": 		return 0;
		case 3: 	case "Large": 		return -1;
		case 5: 	case "Huge": 		return -2;
		case 7: 	case "Gargantuan": 	return -4;
		case 8: 	case "Colossal": 	return -8;
	}
}

function isset($vari) {
	return $vari != undefined && $vari.length != 0;
}


function sizeModifier(size) {
	return _getSizeModifier(size);
}

function maneuverModifier(size) {
	switch (size) {
		case 10: case "Fine": return -4;
		case 9: case "Diminutive": return -3;
		case 6: case "Tiny": return -2;
		case 1: case "Small": return -1;
		case 2: case "Medium": return 0;
		case 3: case "Large": return 1;
		case 5: case "Huge": return 2;
		case 7: case "Gargantuan": return 3;
		case 8: case "Colossal": return 4;
	}
}

function numToSize(size) {
	switch (size) {
		case 1: case "Fine": return "Fine";
		case 2: case "Diminutive": return "Diminuitive";
		case 3: case "Tiny": return "Tiny";
		case 4: case "Small": return "Small";
		case 5: case "Medium": return "Medium";
		case 6: case "Large": return "Large";
		case 7: case "Huge": return "Huge";
		case 8: case "Gargantuan": return "Gargantuan";
		case 9: case "Colossal": return "Colossal";
	}
}

function sizeToNum(size) {
	switch (size) {
		case 1: case "Fine": return 1;
		case 2: case "Diminutive": return 2;
		case 3: case "Tiny": return 3;
		case 4: case "Small": return 4;
		case 5: case "Medium": return 5;
		case 6: case "Large": return 6;
		case 7: case "Huge": return 7;
		case 8: case "Gargantuan": return 8;
		case 9: case "Colossal": return 9;
	}
}