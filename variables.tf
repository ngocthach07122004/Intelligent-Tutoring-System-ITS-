variable "gateway_port" {}
variable "identity_port" {}
variable "course_port" {}
variable "dashboard_port" {}
variable "eureka_port" {}

variable "keycloak_db_name" {}
variable "identity_db_name" {}
variable "userprofile_db_name" {}
variable "course_db_name" {}
variable "dashboard_db_name" {}

variable "keycloak_db_port" {}
variable "identity_db_port" {}
variable "userprofile_db_port" {}
variable "course_db_port" {}
variable "dashboard_db_port" {}

variable "keycloak_db_user" {}
variable "identity_db_user" {}
variable "userprofile_db_user" {}
variable "course_db_user" {}
variable "dashboard_db_user" {}

variable "keycloak_db_password" {
  sensitive = true
}
variable "identity_db_password" {
  sensitive = true
}
variable "userprofile_db_password" {
  sensitive = true
}
variable "course_db_password" {
  sensitive = true
}
variable "dashboard_db_password" {
  sensitive = true
}
########################################
# Variables
########################################

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "app_instance_type" {
  description = "Instance type for EC2"
  type        = string
  default     = "t3.micro"  # free tier nếu còn quota
}

variable "project" {
  type    = string
  default = "its"
}

variable "environment" {
  type    = string
  default = "dev"
}



variable "db_instance_class" {
  type    = string
  default = "db.t3.micro" # free tier
}
