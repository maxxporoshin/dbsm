<?php
function connect() {
	$conn = oci_connect("system", "meow", "//localhost/xe", 'AL32UTF8');
	if (!$conn) {
	   $m = oci_error();
	   echo $m['message'], "\n";
	   exit;
	}
	return $conn;
}
function close($conn) {
	oci_close($conn);
}
