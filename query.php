<?php

require_once('database.php');

$c = connect();
$q = '';
$s = oci_parse($c, $q);
if (!oci_execute($s)) {
	$error = oci_error($s);
	$error['error'] = true;
	echo json_encode($error);
}
