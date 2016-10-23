<?php

require_once('database.php');

if ($_POST['trigger']) {
	$c = connect();
	$q = "SELECT TRIGGER_BODY FROM ALL_TRIGGERS WHERE TRIGGER_NAME = '" . $_POST['trigger'] . "'";
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