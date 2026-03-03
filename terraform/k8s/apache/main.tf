terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.30"
    }
  }
}

provider "kubernetes" {
  config_path = var.kubeconfig_path
}

variable "kubeconfig_path" {
  description = "Ruta del kubeconfig para conectar al cluster"
  type        = string
  default     = "~/.kube/config"
}

variable "namespace" {
  description = "Namespace de Kubernetes"
  type        = string
  default     = "default"
}

variable "node_port" {
  description = "NodePort para el servicio apache"
  type        = number
  default     = 30080
}

variable "replicas" {
  description = "Numero de replicas del deployment"
  type        = number
  default     = 1
}

variable "host_www_path" {
  description = "Ruta hostPath para montar /var/www/html"
  type        = string
  default     = "/mnt/www"
}

variable "db_host" {
  description = "Host de base de datos"
  type        = string
  default     = "mariadb-service"
}

resource "kubernetes_deployment_v1" "apache_local_deployment" {
  metadata {
    name      = "apache-local-deployment"
    namespace = var.namespace
    labels = {
      app = "apache-local"
    }
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        app = "apache-local"
      }
    }

    template {
      metadata {
        labels = {
          app = "apache-local"
        }
      }

      spec {
        container {
          name              = "local"
          image             = "apache-local:latest"
          image_pull_policy = "Never"

          env {
            name  = "XDEBUG_CLIENT_HOST"
            value = "172.17.0.1"
          }

          env {
            name  = "XDEBUG_CLIENT_PORT"
            value = "9004"
          }

          env {
            name  = "PHP_IDE_CONFIG"
            value = "serverName=local-server"
          }

          env {
            name  = "DB_HOST"
            value = var.db_host
          }

          env {
            name = "DB_USER"
            value_from {
              secret_key_ref {
                name = "mariadb-secret"
                key  = "MYSQL_USER"
              }
            }
          }

          env {
            name = "MYSQL_ROOT_PASSWORD"
            value_from {
              secret_key_ref {
                name = "mariadb-secret"
                key  = "MYSQL_ROOT_PASSWORD"
              }
            }
          }

          env {
            name = "DB_NAME"
            value_from {
              secret_key_ref {
                name = "mariadb-secret"
                key  = "MYSQL_DATABASE"
              }
            }
          }

          env {
            name = "DB_PASSWORD"
            value_from {
              secret_key_ref {
                name = "mariadb-secret"
                key  = "MYSQL_PASSWORD"
              }
            }
          }

          port {
            name           = "local-http"
            container_port = 80
          }

          volume_mount {
            name       = "www-data"
            mount_path = "/var/www/html"
          }
        }

        volume {
          name = "www-data"
          host_path {
            path = var.host_www_path
            type = "Directory"
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "dev_stack_local" {
  metadata {
    name      = "dev-stack-local"
    namespace = var.namespace
    labels = {
      app = "dev-stack"
    }
  }

  spec {
    type = "NodePort"
    selector = {
      app = "apache-local"
    }

    port {
      name        = "http"
      port        = 80
      target_port = 80
      node_port   = var.node_port
    }
  }
}