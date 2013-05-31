<?php
if(isset($_POST) && isset($_POST["action"]) && !empty($_POST["action"])) {
	
	if(strpos( $_SERVER["HTTP_REFERER"], "tekdice.com") === false 
	&& strpos( $_SERVER["HTTP_REFERER"], "monsters") === false) return;

    define('users', TRUE);
    include_once('../include/database.php');
    include_once('session_functions.php');
	
	header('Content Type: application/json');
	switch($_POST["action"]) {
		case "new": 	echo addNewSession($_POST["sessname"], $_POST["json"], $_POST["sttime"], $_POST["uptime"]); break;
        case "del":     echo removeSession($_POST["sttime"]); break;
        case "get":     echo getSessions(); break;
		default: return;
	}
}

function addNewSession($session_name, $json, $start_time, $update_time) {
    if(!$json) return ajaxReturnText("No data to sync", true);
	$limit = 5;
	//check current count of sessions, if >=limit, send back error
    
    global $userid;
    
    if(!isset($userid)) return ajaxReturnText("No user logged in", true);
    
    global $conn;
    
    //redundancy check
    $stmt = $conn->prepare("select * from SyncEncounter where user_id=$userid and start=?");
    $stmt->bind_param("s", $start_time);
    $stmt->execute();
    $res=$stmt->get_result();
    if($res->num_rows != 0) return updateSession($start_time, $json, $session_name, $update_time);
    
    //count check
	$data = run_query($conn, "select count(*) ct from SyncEncounter where user_id=$userid");
    $data=$data->fetch_array(MYSQLI_ASSOC);
	$count = $data["ct"];
    if($count >= $limit)  return ajaxReturnText("Too many concurrent saved sessions", true);
    
	//send information into db
    $stmt = $conn->prepare("insert into SyncEncounter (`user_id`, `name`, `json`, `start`, `last_update`) values ($userid,?,?,?,?)");
    $stmt->bind_param("ssss",$session_name, $json, $start_time, $update_time);
    $stmt->execute();
    
    if($stmt->error) return ajaxReturnText("Failed to create session (".$stmt->error.")", true);
    
    return ajaxReturnText("Successfully synced session");
}

function updateSession($start_time, $json, $session_name, $update_time) {
	//update where $userid and $start_time, set $json
    
    global $userid;
    global $conn;
    if(!isset($userid)) return ajaxReturnText("No user logged in", true);
    
    $stmt = $conn->prepare("update SyncEncounter set json=?,name=?,last_update=? where start=? and user_id=$userid");
    $stmt->bind_param("ssss", $json, $session_name, $update_time, $start_time);
    $stmt->execute();
    
    if($stmt->error) return ajaxReturnText("Failed to update session (".$stmt->error.")", true);
    
    return ajaxReturnText("Successfully updated session");
}

function removeSession($start_time) {
    
    global $userid;
    global $conn;
    if(!isset($userid)) return ajaxReturnText("No user logged in", true);
    
    $stmt = $conn->prepare("select * from SyncEncounter where user_id=$userid and start=?");
    $stmt->bind_param("s", $start_time);
    $stmt->execute();
    $res=$stmt->get_result();
    if($res->num_rows == 0) return ajaxReturnText("Session does not exist in cloud", true);
    
    $stmt = $conn->prepare("delete from SyncEncounter where user_id=$userid and start=?");
    $stmt->bind_param("s", $start_time);
    $stmt->execute();
    
    if($stmt->error) return ajaxReturnText("Failed to unsync session (".$stmt->error.")", true);
    
    return ajaxReturnText("Successfully unsynced session");
}

function ajaxReturnText($str, $error = false) {
    $rv = new stdClass;
    $rv->isError=$error;
    $rv->msg = $error ? "Error: ".$str : $str;
    return json_encode($rv);
}

?>