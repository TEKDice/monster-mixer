<?php

if(isset($_POST) && isset($_POST["action"]) && !empty($_POST["action"])) {
	
	if(strpos( $_SERVER["HTTP_REFERER"], "tekdice.com") === false 
	&& strpos( $_SERVER["HTTP_REFERER"], "monsters") === false) return;
	
	header('Content Type: application/json');
	switch($_POST["action"]) {
		case "sync": 	break;
		default: return;
	}
}

define('users', TRUE);
require_once('../include/database.php');

function addNewSession($userid, $session_name, $json, $start_time, $update_time) {
	$limit = 5;
	//check current count of sessions, if >=limit, send back error
	
	//send information into db
}

function updateSession($userid, $start_time, $json) {
	//update where $userid and $start_time, set $json
}

function removeSession($userid, $start_time) {
	//remove where $userid and $start_time
}

?>