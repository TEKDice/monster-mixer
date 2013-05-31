<?php

@session_start();

$server = "localhost";
$database = "users";
$user = "users";
$password = "u53RsT4Bl3!sg0Od";

$sconn = new mysqli($server, $user, $password, $database);

if(isset($_SESSION) && isset($_SESSION["username"]))
    $userid = getUserId($_SESSION["username"]);

function getUserId($username) {
    global $sconn;
    if(!isset($username)) return 0;
    $stmt = $sconn->prepare("select id from Usernames where username=?");
    $stmt->bind_param("s",$username);
    $stmt->execute();
    
    $res = $stmt->get_result();
    $id=$res->fetch_array(MYSQLI_ASSOC);
    $id=$id["id"];
    return $id;
}

function getSessions() {
    
    global $userid;
    global $sconn;
    
    if(!isset($userid)) return json_encode(array());
    
    return json_encode(run_query_arr($sconn, "select name, json, `start` as startTime, last_update as lastUpdate from SyncEncounter where user_id=$userid"));
}

?>