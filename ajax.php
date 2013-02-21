<?php

if(isset($_POST["action"]) && !empty($_POST["action"])) {
	
	if(strpos( $_SERVER["HTTP_REFERER"], "tekdice.com") === false 
	&& strpos( $_SERVER["HTTP_REFERER"], "monsters") === false) return;
	
	header('Content Type: application/json');
	switch($_POST["action"]) {
		case "test": 	echo "test return"; return;
		case "gen": 	break;
		default: return;
	}
}

define('readonly', true);
require_once('../include/database.php');

if(isset($_POST["orgs"])) {
	$json = json_decode($_POST["orgs"], true);

	global $conn;

	$monsters = array();

	foreach($json["orgs"] as $org) {
		$org = $conn->real_escape_string($org);
		$org_data = get_org_data($org);
		$monsters[$org_data["name"]] = $org_data;
	}

	foreach($json["singles"] as $mon) {
		$monster_data = get_monster_data($conn->real_escape_string($mon));
		$monsters[$monster_data["data"][0]["name"]] = $monster_data;
	}

	echo json_encode($monsters);

} else if(isset($_POST["adv"]) && $_POST["adv"] == "true") {
	$json = json_decode($_POST["data"], true);

	global $conn;

	$type_info = run_query_arr_name($conn, "select name,sql_name,join_table,join_table_col,link_table,is_calculated,is_numeric from GeneratorFilters");

	$query = build_query($json, $type_info);

	$monsters = run_query_arr($conn, $query);

	$newMonsters = array();

	foreach($monsters as $mon) {
		$mon_id = $conn->real_escape_string($mon["monster_id"]);
		$newMonsters[get_monster_name($mon_id)] = array(
			"id" => $mon_id,
			"orgs" => get_monster_orgs($mon_id)
		);
	}

	echo json_encode(array_filter($newMonsters, "remove_empty_entries"));

} else if(isset($_POST["data"])) {
	$json = json_decode($_POST["data"], true);

	global $conn;

	$type_info = run_query_arr_name($conn, "select name,sql_name,join_table,join_table_col,link_table,is_calculated,is_numeric from GeneratorFilters");

	$query = build_query($json, $type_info);

	$monsters = run_query_arr($conn, $query);

	shuffle($monsters);

	foreach($monsters as $arr=>$id) {
		echo json_encode(get_monster_data($conn->real_escape_string($id["monster_id"])));
		return;
	}
} else if(isset($_POST["ids"])) {
	$ids = json_decode($_POST["ids"]);

	$monsters = array();

	foreach($ids as $id) {
		array_push($monsters, get_monster_data($conn->real_escape_string($id)));
	}

	echo json_encode($monsters);
}

function remove_empty_entries($var) {
	return count($var) != 0;
}

function build_query($json, $type_info) {

	$query;

	$first = true;
	$addj  = false;
	$first_header='';
	$first_header_separate=false;

	foreach($json as $header=>$data) {

		$funct='';

		$is_joinable = 	isset($type_info[$header]["join_table_col"]) && $type_info[$header]["join_table_col"] != '';
		$is_calc = 		isset($type_info[$header]["function_name"]) && $type_info[$header]["function_name"] != '';
		if($is_calc) $funct = $type_info[$header]["function_name"];
		$is_numeric = 	isset($type_info[$header]["is_numeric"]) && $type_info[$header]["is_numeric"] == 1;

		$_sql_name = $type_info[$header]["sql_name"];
		$_link_table = $type_info[$header]["link_table"];
		$_join_table = $type_info[$header]["join_table"];
		$_join_table_col = $type_info[$header]["join_table_col"];

		$header = str_replace(" ", "", $header);

		$has_separate_table = isset($_link_table) && $_link_table != '';
		if($first && $has_separate_table) $first_header_separate = true;

		if($first) {
			$query = "SELECT DISTINCT $header"."_table.monster_id FROM (\n";

			$first_header = $header;
		} else {
			$query .= "INNER JOIN (\n";
			$addj = true;
		}

		if($is_joinable) {

			if($has_separate_table) {
				$query .= "\tSELECT DISTINCT monster_id FROM ".($has_separate_table ? $_link_table : "Monster")."\n";
				$query .= "\tWHERE ".$_join_table_col." IN\n";
			} else {
				$query .= "\tSELECT DISTINCT id as monster_id FROM Monster where ".$_join_table_col." IN\n";
			}

			$query .= "\t\t(SELECT id FROM ".$_join_table." WHERE ";

			$first_crit = true;
				
			foreach($data as $criteria) {
				if(!$first_crit) $query .= " OR ";
				$query .= $_sql_name."='".$criteria["value"]."'";

				$first_crit = false;
			}

			$query .= ")\n) ".$header."_table\n\n";
			
			if($has_separate_table) {
				$query .= "ON $first_header"."_table.monster_id=$header"."_table.monster_id\n\n";
			}

		} else if($is_calc) {
			$query .= "\tSELECT DISTINCT id AS monster_id FROM Monster\n";
			$query .= "\tWHERE ";

			$first_crit = true;
			foreach($data as $criteria) {
				if(!$first_crit) $query .= " OR ";
				$query .= $funct."(".$_sql_name.")".$criteria["sign"].$criteria["value"];

				$first_crit = false;
			}

			$query .= "\n";

			$query .= ") ".$header."_table\n\n";
			$query .= "ON $first_header"."_table.monster_id=$header"."_table.monster_id\n\n";

		} else if($is_numeric) {
			$query .= "\tSELECT DISTINCT id AS monster_id FROM Monster\n";
			$query .= "\tWHERE ";

			$first_crit = true;
			foreach($data as $criteria) {
				if(!$first_crit) $query .= " OR ";
				$query .= $_sql_name.$criteria["sign"].$criteria["value"];

				$first_crit = false;
			}

			$query .= "\n";

			$query .= ") ".$header."_table\n\n";
			$query .= "ON $first_header"."_table.monster_id=$header"."_table.monster_id\n\n";
		
		} else {
			$query .= "\tSELECT DISTINCT id AS monster_id FROM Monster\n";
			$query .= "\tWHERE ";

			$first_crit = true;
			foreach($data as $criteria) {
				if(!$first_crit) $query .= " OR ";
				$query .= $_sql_name."='".$criteria["value"]."'";

				$first_crit = false;
			}

			$query .= "\n";

			$query .= ") ".$header."_table\n\n";
			$query .= "ON $first_header"."_table.monster_id=$header"."_table.monster_id\n\n";
		}

		$first = false;
	}

	$query .= "INNER JOIN (\n";
	$query .= "\tSELECT DISTINCT id as monster_id,name FROM Monster\n";
	$query .= "\tWHERE ((Monster.hidden is null OR Monster.hidden=0) AND Monster.id != 135)\n";
	$query .= ") Monster_table\n";
	$query .= "ON Monster_table.monster_id = $header"."_table.monster_id\n";
	$query .= "ORDER BY Monster_table.name";

	return $query;
}
?>