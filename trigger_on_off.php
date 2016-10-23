<?php

require_once('database.php');

if ($_POST['need-to'] && $_POST['trigger']) {
	$c = connect();
	$q = "ALTER TRIGGER " . $_POST['trigger'] . " " . $_POST['need-to'];
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