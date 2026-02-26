<?php
try {
   // (new Dotenv\Dotenv(__DIR__))->load();
    $dbHost = getenv('DB_HOST') ?: 'mysql';
    $dbUser = getenv('DB_USER') ?: 'root';
    $dbPass = getenv('DB_PASSWORD') ?: 'test';
    $dbName = getenv('DB_NAME') ?: 'wordpress';
    //echo "Intentando conectar a MySQL con host: $dbHost, usuario: $dbUser, base de datos: $dbName";
    $mysqli = new mysqli(
    $dbHost,
    $dbUser,
    $dbPass,
    $dbName
);


if ($mysqli->connect_errno) {
    echo "Error al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
} else {
    echo "Bienvenido k8s!, Conexión exitosa a la base de datos!  " . $mysqli->query("SELECT DATABASE()")->fetch_row()[0];
}
} 
//catch (Dotenv\Exception\InvalidPathException $e) {
    // .env file not found, continue without loading
  catch (Exception $e) {
    var_dump($e->getMessage());
}


?>