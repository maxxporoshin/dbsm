<?php

require_once('database.php');

if ($_POST['table'] && $_POST['column'] && $_POST['id'] && $_POST['id-column'] && $_POST['new']) {
	$c = connect();
	$q = "UPDATE " . $_POST['table'] . " SET " . $_POST['column'] . " = '" . $_POST['new'] . "' WHERE "
		. $_POST['id-column'] . " = " . $_POST['id'];
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
				$answer = $row[0];
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
