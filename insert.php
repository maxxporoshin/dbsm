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
		if ($_POST['table'] !== 'N_VISIT') {
			echo json_encode(1);
		} else {
			$q = "select log from doctor_log";
			$s = oci_parse($c, $q);
			if (!oci_execute($s)) {
				$error = oci_error($s);
				$error['error'] = true;
				echo json_encode($error);
			} else {
				$answer = "";		
				$row = oci_fetch_array($s, OCI_NUM);
				$answer = $row;
				if (is_object($answer)) {
					$answer = $answer->load();
					$answer = htmlentities($answer, ENT_QUOTES);
				}
				$q = "update doctor_log set log = " . "'" . "'" . ' where rownum = 1';
				$s = oci_parse($c, $q);
				if (!oci_execute($s)) {
					$error = oci_error($s);
					$error['error'] = true;
					echo json_encode($error);
				} else {
					if ($answer) {
						echo json_encode($answer);
					} else {
						echo json_encode(1);
					}
				}
			}
		}
	}
} else {
	echo json_encode(2);
}
