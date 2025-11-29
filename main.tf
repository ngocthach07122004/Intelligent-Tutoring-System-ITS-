########################################
# Provider & Terraform setup
########################################

terraform {
  required_version = ">= 1.4.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

########################################
# VPC
########################################

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = "its-vpc" }
}

########################################
# Internet Gateway
########################################

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "its-igw" }
}

########################################
# Subnets
########################################

# Public subnets
resource "aws_subnet" "public" {
  for_each = {
    a = { cidr = var.public_subnet_cidrs[0], az = "ap-southeast-1a" }
    b = { cidr = var.public_subnet_cidrs[1], az = "ap-southeast-1b" }
  }

  vpc_id                  = aws_vpc.main.id
  cidr_block              = each.value.cidr
  availability_zone       = each.value.az
  map_public_ip_on_launch = true

  tags = { Name = "its-public-${each.key}" }
}

# Private subnets
resource "aws_subnet" "private" {
  for_each = {
    a = { cidr = var.private_subnet_cidrs[0], az = "ap-southeast-1a" }
    b = { cidr = var.private_subnet_cidrs[1], az = "ap-southeast-1b" }
  }

  vpc_id                  = aws_vpc.main.id
  cidr_block              = each.value.cidr
  availability_zone       = each.value.az
  map_public_ip_on_launch = false

  tags = { Name = "its-private-${each.key}" }
}

########################################
# Routing — only public route (NO NAT → FREE)
########################################

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = { Name = "its-public-rt" }
}

resource "aws_route_table_association" "public_assoc" {
  for_each       = aws_subnet.public
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

########################################
# Locals
########################################

locals {
  public_subnet_ids  = [for s in aws_subnet.public : s.id]
  private_subnet_ids = [for s in aws_subnet.private : s.id]
}

########################################
# Security Groups
########################################

# Public API Gateway SG
resource "aws_security_group" "gateway" {
  name        = "its-gateway-sg"
  description = "SG for public API gateway"
  vpc_id      = aws_vpc.main.id

  # SSH
  ingress {
    protocol    = "tcp"
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP (optional)
  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Gateway port (env: GATEWAY_PORT=8181)
  ingress {
    protocol    = "tcp"
    from_port   = 8181
    to_port     = 8181
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound
  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "its-gateway-sg" }
}

# Backend SG
resource "aws_security_group" "backend" {
  name        = "its-backend-sg"
  description = "SG for backend & infra"
  vpc_id      = aws_vpc.main.id

  # Allow SSH from gateway
  ingress {
    protocol        = "tcp"
    from_port       = 22
    to_port         = 22
    security_groups = [aws_security_group.gateway.id]
  }

  # Allow Eureka UI (public) – demo
  ingress {
    protocol    = "tcp"
    from_port   = 8761
    to_port     = 8761
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow application ports (backend) from gateway
  # Identity: 8082, UserProfile: 8083 (nếu chạy), Course: 8084, Dashboard: 8085
  ingress {
    protocol        = "tcp"
    from_port       = 8082
    to_port         = 8085
    security_groups = [aws_security_group.gateway.id]
  }

  # Allow internal backend <-> backend
  ingress {
    protocol  = "tcp"
    from_port = 0
    to_port   = 65535
    self      = true
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "its-backend-sg" }
}

resource "aws_security_group" "rds" {
  name        = "its-rds-sg"
  description = "Allow backend EC2 to access PostgreSQL"
  vpc_id      = aws_vpc.main.id

  # Multi RDS port: 5433-5437 (keycloak, identity, userprofile, course, dashboard)
  ingress {
    protocol        = "tcp"
    from_port       = 5433
    to_port         = 5437
    security_groups = [aws_security_group.backend.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "its-rds-sg"
  }
}

resource "aws_security_group" "mongodb" {
  name        = "its-mongodb-sg"
  description = "Allow backend EC2 to access MongoDB"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = 27017
    to_port         = 27017
    security_groups = [aws_security_group.backend.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "its-mongodb-sg" }
}

########################################
# IAM for EC2 (SSM login)
########################################

resource "aws_iam_role" "app_instance_role" {
  name = "its-app-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_attach" {
  role       = aws_iam_role.app_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "app_instance_profile" {
  name = "its-app-instance-profile"
  role = aws_iam_role.app_instance_role.name
}

# (Giữ tạm – không dùng ECR nhưng cũng không sao)
resource "aws_iam_role_policy_attachment" "ecr_readonly" {
  role       = aws_iam_role.app_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

########################################
# AMI for EC2
########################################

data "aws_ssm_parameter" "ami" {
  name = "/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id"
}

########################################
# DB Subnet Group for RDS
########################################

resource "aws_db_subnet_group" "this" {
  name       = "${var.project}-${var.environment}-rds-subnet-v2"
  subnet_ids = local.private_subnet_ids

  tags = {
    Name = "its-rds-subnet"
  }
}

########################################
# EC2 Instances (5 machines + Mongo)
########################################

# 1) API Gateway (public)
resource "aws_instance" "gateway" {
  ami                         = data.aws_ssm_parameter.ami.value
  instance_type               = var.app_instance_type
  subnet_id                   = local.public_subnet_ids[0]
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.gateway.id]
  iam_instance_profile   = aws_iam_instance_profile.app_instance_profile.name

  user_data = <<-EOF
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker

docker pull quangtran013/its-api-gateway:latest
docker stop gateway || true
docker rm gateway || true
docker run -d --name gateway \
  -p ${var.gateway_port}:${var.gateway_port} \
  -e GATEWAY_PORT=${var.gateway_port} \
  -e EUREKA_SERVER=http://${aws_instance.infra.private_ip}:${var.eureka_port}/eureka \
  quangtran013/its-api-gateway:latest
EOF

  tags = {
    Name = "its-app-gateway"
    Role = "gateway"
  }
}

# 2) Identity service (port 8082)
resource "aws_instance" "identity_user" {
  ami                         = data.aws_ssm_parameter.ami.value
  instance_type               = var.app_instance_type
  subnet_id                   = local.public_subnet_ids[0]
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.backend.id]
  iam_instance_profile   = aws_iam_instance_profile.app_instance_profile.name

  user_data = <<-EOF
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker

docker pull quangtran013/its-identity:latest
docker stop identity || true
docker rm identity || true
docker run -d --name identity \
  -p ${var.identity_port}:${var.identity_port} \
  -e SERVER_PORT=${var.identity_port} \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://${aws_db_instance.multi["identity"].address}:${var.identity_db_port}/${var.identity_db_name} \
  -e SPRING_DATASOURCE_USERNAME_IDENTITY=${var.identity_db_user} \
  -e SPRING_DATASOURCE_PASSWORD_IDENTITY=${var.identity_db_password} \
  -e EUREKA_SERVER=http://${aws_instance.infra.private_ip}:${var.eureka_port}/eureka \
  quangtran013/its-identity:latest
EOF

  tags = {
    Name = "its-app-identity-user"
    Role = "identity-user"
  }
}

# 3) Course service (port 8084)
resource "aws_instance" "course_practice" {
  ami                         = data.aws_ssm_parameter.ami.value
  instance_type               = var.app_instance_type
  subnet_id                   = local.public_subnet_ids[0]
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.backend.id]
  iam_instance_profile   = aws_iam_instance_profile.app_instance_profile.name

  user_data = <<-EOF
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker

docker pull quangtran013/its-course:latest
docker stop course || true
docker rm course || true
docker run -d --name course \
  -p ${var.course_port}:${var.course_port} \
  -e SERVER_PORT=${var.course_port} \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://${aws_db_instance.multi["course"].address}:${var.course_db_port}/${var.course_db_name} \
  -e SPRING_DATASOURCE_USERNAME_COURSE=${var.course_db_user} \
  -e SPRING_DATASOURCE_PASSWORD_COURSE=${var.course_db_password} \
  -e EUREKA_SERVER=http://${aws_instance.infra.private_ip}:${var.eureka_port}/eureka \
  quangtran013/its-course:latest
EOF

  tags = {
    Name = "its-app-course-practice"
    Role = "course-practice"
  }
}

# 4) Dashboard service (port 8085, tạm chạy trên go_services EC2)
resource "aws_instance" "go_services" {
  ami                         = data.aws_ssm_parameter.ami.value
  instance_type               = var.app_instance_type
  subnet_id                   = local.public_subnet_ids[0]
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.backend.id]
  iam_instance_profile   = aws_iam_instance_profile.app_instance_profile.name

  user_data = <<-EOF
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker

docker pull quangtran013/its-dashboard:latest
docker stop dashboard || true
docker rm dashboard || true
docker run -d --name dashboard \
  -p ${var.dashboard_port}:${var.dashboard_port} \
  -e SERVER_PORT=${var.dashboard_port} \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://${aws_db_instance.multi["dashboard"].address}:${var.dashboard_db_port}/${var.dashboard_db_name} \
  -e SPRING_DATASOURCE_USERNAME_DASHBOARD=${var.dashboard_db_user} \
  -e SPRING_DATASOURCE_PASSWORD_DASHBOARD=${var.dashboard_db_password} \
  -e EUREKA_SERVER=http://${aws_instance.infra.private_ip}:${var.eureka_port}/eureka \
  quangtran013/its-dashboard:latest
EOF

  tags = {
    Name = "its-app-go-services"
    Role = "go-services"
  }
}

# 5) Infra (Eureka)
resource "aws_instance" "infra" {
  ami                         = data.aws_ssm_parameter.ami.value
  instance_type               = var.app_instance_type
  subnet_id                   = local.public_subnet_ids[0]
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.backend.id]
  iam_instance_profile   = aws_iam_instance_profile.app_instance_profile.name

  user_data = <<-EOF
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker

docker pull quangtran013/its-eureka:latest
docker stop eureka || true
docker rm eureka || true
docker run -d --name eureka -p 8761:8761 quangtran013/its-eureka:latest
EOF

  tags = {
    Name = "its-app-infra"
    Role = "infra"
  }
}

# 6) MongoDB Instance
resource "aws_instance" "mongodb" {
  ami                         = data.aws_ssm_parameter.ami.value
  instance_type               = var.app_instance_type
  subnet_id                   = local.public_subnet_ids[0]
  associate_public_ip_address = true

  vpc_security_group_ids = [
    aws_security_group.backend.id,
    aws_security_group.mongodb.id
  ]

  iam_instance_profile = aws_iam_instance_profile.app_instance_profile.name

  user_data = <<-EOF
#!/bin/bash
tee /etc/yum.repos.d/mongodb-org-6.0.repo << REPO
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
REPO

yum update -y
yum install -y mongodb-org

systemctl start mongod
systemctl enable mongod

# Listen 0.0.0.0 để backend EC2 truy cập được
sed -i 's/bindIp: 127.0.0.1/bindIp: 0.0.0.0/' /etc/mongod.conf
systemctl restart mongod
EOF

  tags = {
    Name = "its-mongodb"
    Role = "mongodb"
  }
}

########################################
# MULTI-RDS (5 Instances)
########################################

locals {
  rds_databases = {
    keycloak    = { name = "keycloak",      port = 5433, user = "keycloak",        pass = "12345678" }
    identity    = { name = "identityDb",    port = 5434, user = "identityUser",    pass = "12345678" }
    userprofile = { name = "userProfileDb", port = 5435, user = "userProfileUser", pass = "12345678" }
    course      = { name = "courseDb",      port = 5436, user = "courseUser",      pass = "12345678" }
    dashboard   = { name = "dashboardDb",   port = 5437, user = "dashboardUser",   pass = "12345678" }
  }
}

resource "aws_db_instance" "multi" {
  for_each = local.rds_databases

  identifier     = "${var.project}-${var.environment}-${each.key}-pg"
  engine         = "postgres"
  engine_version = "16.6"
  instance_class = var.db_instance_class

  allocated_storage     = 20
  max_allocated_storage = 20

  db_name  = each.value.name
  username = each.value.user
  password = each.value.pass
  port     = each.value.port

  publicly_accessible   = false
  multi_az              = false
  storage_encrypted     = true
  skip_final_snapshot   = true

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  tags = {
    Name        = "its-rds-${each.key}"
    Project     = var.project
    Environment = var.environment
  }
}

########################################
# Outputs
########################################

output "gateway_public_ip" {
  value = aws_instance.gateway.public_ip
}

output "backend_private_ips" {
  value = {
    identity_user   = aws_instance.identity_user.private_ip
    course_practice = aws_instance.course_practice.private_ip
    go_services     = aws_instance.go_services.private_ip
    infra           = aws_instance.infra.private_ip
  }
}

# Map các endpoint RDS theo key: keycloak / identity / userprofile / course / dashboard
output "rds_endpoint" {
  value = {
    for k, db in aws_db_instance.multi :
    k => db.address
  }
}

output "mongodb_private_ip" {
  value = aws_instance.mongodb.private_ip
}
