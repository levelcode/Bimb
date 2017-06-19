<?php

  if( strpos($_GET['url'], "uploads/") !== FALSE ){
    header("Content-Type: image/png");
    header("Content-Disposition: attachment; filename=photo.png;");
    readfile($_GET['url']);
  }

?>
