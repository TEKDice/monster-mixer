
function combatManeuverTooltipText(maneuver) {
	switch (maneuver) {
		case "Bull Rush":
			return "You can make a bull rush as a standard action (an attack) or as part of a charge. When you make a bull rush, you attempt to push an opponent straight back instead of damaging him. You can only bull rush an opponent who is one size category larger than you, the same size, or smaller.<br>If you beat the defender’s Strength check result, you push him back 5 feet. If you wish to move with the defender, you can push him back an additional 5 feet for each 5 points by which your check result is greater than the defender’s check result. You can’t, however, exceed your normal movement limit.";
		case "Charge":
			return "You must move before your attack, not after. You must move at least 10 feet (2 squares) and may move up to double your speed directly toward the designated opponent. You must have a clear path toward the opponent, and nothing can hinder your movement.<br>After moving, you may make a single melee attack. You get a +2 bonus on the attack roll and take a –2 penalty to your AC until the start of your next turn.";
		case "Disarm":
			return " You and the defender make opposed attack rolls with your respective weapons. The wielder of a two-handed weapon on a disarm attempt gets a +4 bonus on this roll, and the wielder of a light weapon takes a –4 penalty. If the combatants are of different sizes, the larger combatant gets a bonus on the attack roll of +4 per difference in size category.<br>NOTE:<br>Use the numerical box to add/subtract the size difference between your monster and the disarm target.";
		case "Feint":
			return "Feinting is a standard action. To feint, make a Bluff check opposed by a Sense Motive check by your target. The target may add his base attack bonus to this Sense Motive check. If your Bluff check result exceeds your target’s Sense Motive check result, the next melee attack you make against the target does not allow him to use his Dexterity bonus to AC (if any). This attack must be made on or before your next turn.";
		case "Grapple Grab":
			return "You make a melee touch attack to grab the target. If you fail to hit the target, the grapple attempt fails.";
		case "Opposed Grapple":
			return "Repeatedly in a grapple, you need to make opposed grapple checks against an opponent. A grapple check is like a melee attack roll.<br>If you succeed in your grapple, and you deal damage to the target as if with an unarmed strike.<br>If you lose, you fail to start the grapple.";
		case "Overrun Attack":
			return "If your opponent blocks you, make a Strength check opposed by the defender’s Dexterity or Strength check. The defender gets a +4 bonus on his check if he has more than two legs or is otherwise more stable than a normal humanoid.";
		case "Overrun Save":
			return "If you lose your overrun check, the defender may immediately react and make a Strength check opposed by your Dexterity or Strength check to try to knock you prone.";
		case "Sunder":
			return "You and the defender make opposed attack rolls with your respective weapons. If the combatants are of different sizes, the larger combatant gets a bonus on the attack roll of +4 per difference in size category.<br>NOTE:<br>Use the numerical box to add/subtract the size difference between your monster and the sunder target.";
		case "Trip Melee Touch Attack":
			return "You can try to trip an opponent as an unarmed melee attack. You can only trip an opponent who is one size category larger than you, the same size, or smaller. This provokes an attack of opportunity from your target as normal for unarmed attacks. If you have the Improved Trip feat, or if you are tripping with a weapon (see below), you don’t provoke an attack of opportunity for making a trip attack.";
		case "Trip STR Check":
			return "If your trip attack succeeds, make a Strength check opposed by the defender’s Dexterity or Strength check. The defender gets a +4 bonus on his check if he has more than two legs or is otherwise more stable than a normal humanoid. If you win, you trip the defender. If you lose, the defender may immediately react and make a Strength check opposed by your Dexterity or Strength check to try to trip you.";
	}
}