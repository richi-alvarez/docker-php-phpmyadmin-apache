<?php
try {
   // (new Dotenv\Dotenv(__DIR__))->load();
    $mysqli = new mysqli(
    getenv('DB_HOST'),
    getenv('DB_USER'),
    getenv('DB_PASSWORD'),
    getenv('DB_NAME')
);


if ($mysqli->connect_errno) {
    echo "Error al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
} else {
    echo "Conexión exitosa a la base de datos!  " . $mysqli->query("SELECT DATABASE()")->fetch_row()[0];
}
} 
//catch (Dotenv\Exception\InvalidPathException $e) {
    // .env file not found, continue without loading
  catch (Exception $e) {
    var_dump($e->getMessage());
}


?>