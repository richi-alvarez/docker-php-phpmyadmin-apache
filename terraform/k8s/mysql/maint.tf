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

variable "replicas" {
  description = "Numero de replicas del statefulset"
  type        = number
  default     = 1
}

resource "kubernetes_secret_v1" "mariadb_secret" {
  metadata {
    name      = "mariadb-secret"
    namespace = var.namespace
  }

  type = "Opaque"

  data = {
    DB_HOST             = "mariadb-service"
    MYSQL_ROOT_PASSWORD = "test"
    MYSQL_USER          = "root"
    MYSQL_PASSWORD      = "test"
    MYSQL_DATABASE      = "wordpress"
  }
}

resource "kubernetes_persistent_volume_claim_v1" "mariadb_pvcs" {
  metadata {
    name      = "mariadb-pvcs"
    namespace = var.namespace
    labels = {
      app = "mariadb-pvcs"
    }
  }

  spec {
    access_modes       = ["ReadWriteOnce"]
    storage_class_name = "standard"

    resources {
      requests = {
        storage = "10Gi"
      }
    }
  }
}

resource "kubernetes_stateful_set_v1" "dev_mysql" {
  depends_on = [
    kubernetes_persistent_volume_claim_v1.mariadb_pvcs,
    kubernetes_secret_v1.mariadb_secret,
  ]

  metadata {
    name      = "dev-mysql-stateful"
    namespace = var.namespace
    labels = {
      app = "dev-mysql-stateful"
    }
  }

  spec {
    service_name = "mariadb-service"
    replicas     = var.replicas

    selector {
      match_labels = {
        app = "dev-mysql-stateful"
      }
    }

    template {
      metadata {
        labels = {
          app = "dev-mysql-stateful"
        }
      }

      spec {
        restart_policy = "Always"

        container {
          name  = "mysql"
          image = "mysql:5.7"

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
            name = "MYSQL_DATABASE"
            value_from {
              secret_key_ref {
                name = "mariadb-secret"
                key  = "MYSQL_DATABASE"
              }
            }
          }

          env {
            name = "MYSQL_PASSWORD"
            value_from {
              secret_key_ref {
                name = "mariadb-secret"
                key  = "MYSQL_PASSWORD"
              }
            }
          }

          port {
            name           = "mysql"
            container_port = 3306
          }

          readiness_probe {
            exec {
              command = [
                "sh",
                "-c",
                "mysqladmin ping -h 127.0.0.1 -uroot -p\"$${MYSQL_ROOT_PASSWORD}\"",
              ]
            }
            initial_delay_seconds = 10
            period_seconds        = 10
          }

          liveness_probe {
            exec {
              command = [
                "sh",
                "-c",
                "mysqladmin ping -h 127.0.0.1 -uroot -p\"$${MYSQL_ROOT_PASSWORD}\"",
              ]
            }
            initial_delay_seconds = 30
            period_seconds        = 20
          }

          volume_mount {
            name       = "mariadb-pvcs"
            mount_path = "/var/lib/mysql"
          }

          resources {
            requests = {
              memory = "256Mi"
              cpu    = "250m"
            }
            limits = {
              memory = "1Gi"
              cpu    = "1"
            }
          }
        }

        termination_grace_period_seconds = 30

        volume {
          name = "mariadb-pvcs"
          persistent_volume_claim {
            claim_name = "mariadb-pvcs"
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "mariadb_service" {
  metadata {
    name      = "mariadb-service"
    namespace = var.namespace
    labels = {
      app = "mariadb-service"
    }
  }

  spec {
    cluster_ip = "None"
    selector = {
      app = "dev-mysql-stateful"
    }

    port {
      name        = "mysql"
      port        = 3306
      target_port = 3306
    }
  }
}