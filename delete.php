<?php

require_once('database.php');

if ($_POST['id'] && $_POST['table'] && $_POST['id-column']) {
	$c = connect();
	$new = $_POST['new'];
	$q = "DELETE FROM " . $_POST['table'] . " WHERE " . $_POST['id-column'] . " = " . $_POST['id'];
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
