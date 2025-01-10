<?php


$password="hum57fix";  // please set you own password and delete the next line !
// echo "pw=" . $password; 

$db_link = mysqli_connect ("localhost", "g25", $password ,"g25"); // change to your group Number twice !

// ##########################################################################
// Important: Please request UTF8 based communication, otherwise the JSON export will not work!
// see PHP-Doku: https://www.php.net/manual/de/function.json-encode.php
$db_link->query("SET NAMES 'utf8'"); 
$db_link->query("SET CHARACTER SET utf8");  
$db_link->query("SET SESSION collation_connection = 'utf8_unicode_ci'");
// ##########################################################################
 
$sql = "SELECT * FROM user";
 
$db_erg = mysqli_query( $db_link, $sql );
if ( ! $db_erg )
{
  die('Invalid request: ' . mysqli_error());
}
$dbdaten = array();   // new array for JSON-export  
 
$showtable = false; // only for tests 
 
if ($showtable)  echo '<table border="1">';

while ($zeile =  $db_erg->fetch_array( MYSQLI_ASSOC ))
{
if ($showtable)
 {echo "<tr>";
  echo "<td>". $zeile['ProductID'] . "</td>";
  echo "<td>". $zeile['Title'] . "</td>";
  echo "</tr>";
  } 
  $dbdaten[] = $zeile; // read DB-Data row by row and build up a new array 
}
if ($showtable) echo "</table>";

// export books as JSON 
$dbdaten_as_json = json_encode($dbdaten);
echo $dbdaten_as_json;
// print_r ( $db_erg);  // for tests 

// Optional : save the file on the server (for tests) 
// $datei = fopen("dbjson.txt","w"); 
// $written =  fwrite($datei, $dbdaten_as_json);
// fclose($datei); 
 
mysqli_free_result( $db_erg );
?>