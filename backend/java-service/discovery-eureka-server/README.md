# Discovery Server (Eureka)
 
 ## 🧭 Overview
 The **Discovery Server** is a Service Registry based on Netflix Eureka. It allows microservices to register themselves and discover other services without hardcoding hostnames and ports.
 
 ## 🏗 Architecture & Design
 Implements the **Service Registry** pattern. It acts as a phonebook for all microservices.
 
 ### Key Concept
 - **Client-Side Discovery**: Clients (Gateway, other services) query Eureka to get the location of a service instance and then make the request directly.

## 🛠 Tech Stack
- **Framework**: Spring Cloud Netflix Eureka Server

## ⚙️ Configuration
| Property | Description | Default |
|----------|-------------|---------|
| `server.port` | Port for the registry | `8761` |
| `eureka.client.register-with-eureka` | Self-registration | `false` |
| `eureka.client.fetch-registry` | Fetch registry | `false` |

## 🚀 How to Run
```bash
mvn spring-boot:run
```
Access the Eureka Dashboard at `http://localhost:8761`.
