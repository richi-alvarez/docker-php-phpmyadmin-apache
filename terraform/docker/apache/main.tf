terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

variable "external_port" {
  description = "Puerto externo del contenedor apache-local-tf"
  type        = number
  default     = 86
}

resource "docker_network" "local_network" {
  name = "local-network"
}

resource "docker_image" "apache_local" {
  name = "apache-local:latest"

  build {
    context    = "${path.module}/../../../docker/apache"
    dockerfile = "${path.module}/../../../docker/apache/Dockerfile"
  }

  keep_locally = true
}

resource "docker_container" "apache" {
  name  = "apache-local-tf"
  image = docker_image.apache_local.image_id

  ports {
    internal = 80
    external = var.external_port
  }

  env = [
    "DB_HOST=mysql",
    "DB_USER=root",
    "DB_PASSWORD=test",
    "DB_NAME=prestashop"
  ]

  networks_advanced {
    name = docker_network.local_network.name
  }

  volumes {
    host_path      = abspath("${path.module}/../../../docker/apache/www")
    container_path = "/var/www/html"
  }

  restart = "always"
}