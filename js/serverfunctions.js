
function sizeModifier(size) {
	switch(size) {
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

function maneuverModifier(size) {
	switch(size) {
		case 10: 	case "Fine": 		return -4;
		case 9: 	case "Diminutive": 	return -3;
		case 6: 	case "Tiny": 		return -2;
		case 1: 	case "Small": 		return -1;
		case 2: 	case "Medium": 		return 0;
		case 3: 	case "Large": 		return 1;
		case 5: 	case "Huge": 		return 2;
		case 7: 	case "Gargantuan": 	return 3;
		case 8: 	case "Colossal": 	return 4;
	}
}