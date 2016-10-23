<?php

require_once('database.php');

if ($_POST['table'] && $_POST['data']) {
	$c = connect();
	$q = "INSERT INTO " . $_POST['table'] . " VALUES ( ";
	$first = true;
	foreach($_POST['data'] as $col) {
		if (!$first) {
			$q .= ", ";
		}
		$q .= "'" . $col . "'";
		$first = false;
	}
	$q .= ")";
	$s = oci_parse($c, $q);
	if (!oci_execute($s)) {
		$error = oci_error($s);
		$error['error'] = true;
		echo json_encode($error);
	} else {
		echo json_encode(1);
	}
} else {
	echo json_encode(2);
}
