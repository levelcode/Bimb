<?php

  if( strpos($_GET['url'], "services/") !== FALSE ){
    header("Content-Type: image/png");
    header("Content-Disposition: attachment; filename=\"" .$_GET['url']. ".png\";");
    exit();
  }



?>
