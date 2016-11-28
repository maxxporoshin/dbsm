<?php

require_once('database.php');

$c = connect();
$q = "SELECT TRIGGER_NAME, TABLE_NAME, STATUS FROM ALL_TRIGGERS WHERE OWNER = 'SYSTEM'";
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
		if (substr($r['TRIGGER_NAME'], 0, 2) === 'N_') {
			$result[] = $r;			
		}
	}
	echo json_encode($result);
}