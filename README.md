
## shopif-plugin

# Shopify ![PHP Version Support](https://img.shields.io/badge/php-%5E8.4-blue) ![docker build](https://img.shields.io/badge/docker%20build-passing-green)

_Alojamiento de servicios expuestos a los clientes._

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

## Pre-requisitos 📋

Obligatorio si no se usa docker:

- php 8.4
- php-ext-gd
- php-ext-pdo_mysql
- php-ext-pdo
- php-ext-soap
- php-ext-sockets
- php-ext-json
- php-ext-mysqli
- composer 2.4

Para usar docker

- docker
- docker-compose
- make (opcional)
- xdebug (opcional)

## Instalación 🔧

### Paso 1: Configura las credenciales

en la carpeta  www crea un archivo con el nombre **.env** que contenga el mismo contendido del archivo **.env.example**, luego personaliza el **.env** con tus credenciales otorgadas por el equipo de desarrollo.

### Paso 2: Usando Docker y Docker Compose
Verifica que tengas instalado el servicio de **Docker** y **Docker Compose** en tu maquina local, de no ser asi por favor diríjase al siguiente enlace y sigue los pasos que allí se describen.

[Instalación de Docker](https://docs.docker.com/get-docker/)

[Instalación de Docker Compose (solo en el caso de linux)](https://docs.docker.com/compose/install/)

#### Archivo Make

_En la raíz del proyecto se encuentra un archivo make para facilitar el trabajo con docker el cual contiene los siguientes comandos:_

```sh
usage: make [target]

targets:
help                    Show this help message
start                   Start the containers
stop                    Stop the containers
restart                 Restart the containers
build                   Rebuilds all the containers
prepare                 Runs backend commands
delete                  eliminar contenedor
run                     starts the test development server in detached mode
logs                    Show test logs in real time
composer-install        Installs composer dependencies
ssh-be                  bash into the be container
```

_Solo basta ejecutar desde nuestra terminal dentro de la carpeta del proyecto los siguientes comandos:_

Crea y arranca el contenedor de docker

```sh
make run
```

Instala todas las dependencias

```sh
make composer-install
```

#### Docker Compose

_Para correr el proyecto con docker-compose sin el archivo make hay que correr los siguientes comandos:_

Crea una red llamada www si aun no la tienes

```sh
docker network create www
```

Crea y arranca el contenedor de docker

Linux

```sh
U_ID=$(id -u) IP_DEBUG=172.17.0.1 docker-compose -f docker-compose-debug.yml --env-file ./docker/api.env up -d --build
```

Mac

```sh
U_ID=$(id -u) IP_DEBUG=host.docker.internal docker-compose -f docker-compose-debug.yml --env-file ./docker/api.env up -d --build
```

Windows

```sh
U_ID=1000 IP_DEBUG=host.docker.internal docker-compose -f docker-compose-debug.yml --env-file ./docker/api.env up -d --build
```

Instala todas las dependencias

```sh
docker-compose -f docker-compose-debug.yml --env-file ./docker/api.env exec php-apache composer install --prefer-dist
```

### Paso 3: Usando solo php
_Ingresa a la ruta  de nuestro proyecto y ejecuta los siguientes comandos:_

Instala todas las dependencias

```sh
composer install --prefer-dist
```

Levantar servidor de desarrollo

```sh
php -S localhost:81 -t epayco/
```

### Paso 4: Comprobar Instalación

_Para comprobar que la instalación se realizo de manera correcta ingresa al proyecto a través del siguiente enlace [http://localhost:81/epayco/ping.php](http://localhost:81/epayco/ping.ph) y veras un mensaje de notificación._

## Configuración XDebug ⚙️
### PhpStorm
Abrir la configuración y crear un servidor con los siguientes parámetros `File -> Settings -> PHP -> Servers`

![server](https://multimedia-epayco-test.s3.amazonaws.com/docs/phpstorm_conex.png)

> Esta imagen se tomo como referencia, asegurarse que el **puerto** sea el mismo por donde escucha la aplicación que por defecto es el **82**.

Agregar una nueva configuración para debug en `Run -> Edit configurations -> PHP Remote Debug`

![remote debug](https://multimedia-epayco-test.s3.amazonaws.com/docs/phpstorm_debug.png)

Selecciona la nueva configuración en el panel debug

![panel](https://multimedia-epayco-test.s3.amazonaws.com/docs/phpstorm_panel.jpg)

### VSCode
Instala la extension [PHP Debug](https://github.com/felixfbecker/vscode-php-debug) y modifica el archivo PHP Debug ```launch.json```.

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Docker Xdebug",
            "type": "php",
            "request": "launch",
            "port": 9001,
            "pathMappings":{
                "/var/www/html":"${workspaceFolder}/www"
            }
        }
    ]
}
```


#### Shopify Configuración
URL de la aplicación
 `http://localhost:${port}`
