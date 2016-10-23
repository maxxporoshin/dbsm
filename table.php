<?php
require_once('database.php');

if ($_POST['name']) {
	$c = connect();
	$q = "SELECT * FROM " . $_POST['name'];
	$s = oci_parse($c, $q);
	if (!oci_execute($s)) {
		$error = oci_error($s);
		$error['error'] = true;
		echo json_encode($error);
	} else {
		$table = [];
		while ($row = oci_fetch_array($s, OCI_ASSOC)) {
			$r = [];
			foreach ($row as $key => $val) {
				if (is_object($val)) {
					$val = $val->load();
				}
				$r[$key] = htmlentities($val, ENT_QUOTES);
			}
			$table[] = $r;
		}
		echo json_encode($table);
	}
} else {
	echo json_encode('1');
}