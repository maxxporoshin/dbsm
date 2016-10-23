<?php

require_once('database.php');

if ($_POST['table'] && $_POST['column'] && $_POST['id'] && $_POST['id-column'] && $_POST['new']) {
	$c = connect();
	$q = 'UPDATE ' . $_POST['table'] . ' SET ' . $_POST['column'] . ' = ' . $_POST['new'] . ' WHERE '
		. $_POST['id-column'] . ' = ' . $_POST['id'];
	$s = oci_parse($c, $q);
	if (!oci_execute($s)) {
		$error = oci_error($s);
		$error['error'] = true;
		echo json_encode($error);
	} else {
		echo json_encode('1');
	}
} else {
	echo json_encode('1');
}
