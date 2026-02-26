terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

variable "container_name" {
  description = "Nombre del contenedor MySQL"
  type        = string
  default     = "mysql"
}

variable "mysql_image" {
  description = "Imagen de MySQL"
  type        = string
  default     = "mysql:8.0"
}

variable "mysql_database" {
  description = "Nombre de la base de datos inicial"
  type        = string
  default     = "prestashop"
}

variable "mysql_password" {
  description = "Password del usuario MySQL"
  type        = string
  default     = "test"
  sensitive   = true
}

variable "mysql_root_password" {
  description = "Password de root MySQL"
  type        = string
  default     = "test"
  sensitive   = true
}

variable "external_port" {
  description = "Puerto externo para MySQL"
  type        = number
  default     = 3308
}

variable "network_name" {
  description = "Nombre de la red Docker externa"
  type        = string
  default     = "local-network"
}

data "docker_network" "local_network" {
  name = var.network_name
}

resource "docker_volume" "persistent" {
  name = "persistent"
}

resource "docker_image" "mysql" {
  name = var.mysql_image
}

resource "docker_container" "mysql" {
  name  = var.container_name
  image = docker_image.mysql.image_id

  command = [
    "--default-authentication-plugin=mysql_native_password",
    "--explicit_defaults_for_timestamp=1"
  ]

  env = [
    "MYSQL_DATABASE=${var.mysql_database}",
    "MYSQL_PASSWORD=${var.mysql_password}",
    "MYSQL_ROOT_PASSWORD=${var.mysql_root_password}"
  ]

  ports {
    internal = 3306
    external = var.external_port
  }

  networks_advanced {
    name    = data.docker_network.local_network.name
    aliases = ["mysql"]
  }

  volumes {
    host_path      = abspath("${path.module}/../../../mysql/init-prestashop.sql")
    container_path = "/docker-entrypoint-initdb.d/init-prestashop.sql"
  }

  volumes {
    volume_name    = docker_volume.persistent.name
    container_path = "/var/lib/mysql"
  }

  healthcheck {
    test     = ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-ptest"]
    interval = "10s"
    timeout  = "5s"
    retries  = 10
  }

  restart = "always"
}
