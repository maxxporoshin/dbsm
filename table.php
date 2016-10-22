<?php
require_once('database.php');

if ($_POST['name']) {
	$c = connect();
	$q = "SELECT * FROM " . $_POST['name'];
	$s = oci_parse($c, $q);
	oci_execute($s);
	$table = [];
	while ($row = oci_fetch_array($s, OCI_ASSOC)) {
		$r = [];
		foreach ($row as $key => $val) {
			if (is_object($val)) {
				$val = $val->load();
			}
			if (!is_null($val)) {
				$r[$key] = htmlentities($val, ENT_QUOTES);
			}
		}
		$table[] = $r;
	}
	echo json_encode($table);
	close($c);
}