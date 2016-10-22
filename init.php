<?php

require_once('database.php');

$c = connect();
$q = 'SELECT TABLE_NAME FROM USER_TABLES';
$s = oci_parse($c, $q);
oci_execute($s);
$tables = [];
while ($row = oci_fetch_array($s, OCI_RETURN_NULLS + OCI_ASSOC)) {
	if (substr($row['TABLE_NAME'], 0, 2) === 'Z_') {
		$tables[] = $row['TABLE_NAME'];
	}
}
echo json_encode($tables);
close($c);