<?php
  if ( isset($_FILES["foto"]) && !empty($_FILES["foto"]) ) {
    // Generate a random name
    $path = $_SERVER['DOCUMENT_ROOT'];
    $name = '/uploads/'.rand(1000000, 2000000).'.png';
    // Save the file to the server
    move_uploaded_file($_FILES["foto"]['tmp_name'], $path.$name);
    // Return the name
    echo $name;
  }
 ?>
