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
  description = "Nombre del contenedor phpMyAdmin"
  type        = string
  default     = "phpmyadmin2"
}

variable "image_name" {
  description = "Imagen de phpMyAdmin"
  type        = string
  default     = "phpmyadmin/phpmyadmin"
}

variable "external_port" {
  description = "Puerto externo para phpMyAdmin"
  type        = number
  default     = 8086
}

variable "network_name" {
  description = "Nombre de la red Docker externa"
  type        = string
  default     = "local-network"
}

variable "pma_host" {
  description = "Host MySQL al que se conecta phpMyAdmin"
  type        = string
  default     = "db"
}

variable "mysql_user" {
  description = "Usuario MySQL"
  type        = string
  default     = "root"
}

variable "mysql_password" {
  description = "Password MySQL"
  type        = string
  default     = "test"
  sensitive   = true
}

variable "mysql_root_password" {
  description = "Password root MySQL"
  type        = string
  default     = "test"
  sensitive   = true
}

data "docker_network" "local_network" {
  name = var.network_name
}

resource "docker_image" "phpmyadmin" {
  name = var.image_name
}

resource "docker_container" "phpmyadmin" {
  name  = var.container_name
  image = docker_image.phpmyadmin.image_id

  ports {
    internal = 80
    external = var.external_port
  }

  env = [
    "PMA_ARBITRARY=1",
    "PMA_HOST=${var.pma_host}",
    "MYSQL_USER=${var.mysql_user}",
    "MYSQL_PASSWORD=${var.mysql_password}",
    "MYSQL_ROOT_PASSWORD=${var.mysql_root_password}"
  ]

  networks_advanced {
    name = data.docker_network.local_network.name
  }

  restart = "always"
}
