<?php

require_once('database.php');

if ($_POST['query']) {
	$c = connect();
	$q = $_POST['query'];
	$s = oci_parse($c, $q);
	if (!oci_execute($s)) {
		$error = oci_error($s);
		$error['error'] = true;
		echo json_encode($error);
	} else {
		$result = [];
		while ($row = oci_fetch_array($s, OCI_ASSOC)) {
			$r = [];
			foreach ($row as $key => $val) {
				if (is_object($val)) {
					$val = $val->load();
				}
				$r[$key] = htmlentities($val, ENT_QUOTES);
			}
			$result[] = $r;
		}
		echo json_encode($result);
	}
} else {
	echo json_encode(2);
}