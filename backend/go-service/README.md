# Intern-Golang

## 1. Tools
#### Mockery
- **Used** for generating mocks for testing
- **Installation**: 
  - Following the instructions [here](https://vektra.github.io/mockery/v2.32/installation/)
  
    ```bash
    go install github.com/vektra/mockery/v2@v2.32.0
    ```
- **Usage:**
  - Add `//go:generate mockery --name=<InterfaceName>` above the interface declaration
  - Run `go generate ./...` in the *root directory* of the project

#### Swagger
- **Used** for generating the API documentation
- **Installation**:
  - Run `go install github.com/swaggo/swag/v2/cmd/swag@latest`
  - Write the Swagger annotations above the package declaration
  - Run `make swagger` in the *root directory* of the project

#### Make
- **Used** for running the project
- **Installation**:
- **Windows**:
  - Download Make for Windows from [here](https://gnuwin32.sourceforge.net/packages/make.htm)
  - Install the executable
  - Add Make to your system's environment variables PATH
  
- **Linux**:
  ```bash
  sudo apt install make
  ```

- **macOS**:
  ```bash
  # Install Homebrew first if not installed
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  
  # Install make
  brew install make
  ```

- **Usage**:
  - Run `make <target>` in the *root directory* of the project
  - Targets:
    - `run-api`: Run the API server
    - `test`: Run the tests

## 2. Project Structure
Clean Architecture is used to structure the project.

![Project Structure](https://raw.githubusercontent.com/bxcodec/go-clean-arch/master/clean-arch.png)

- `cmd`: Contains the main packages for the API and CLI
- `internal`: Contains the core logic of the project
- `pkg`: Contains the external packages

### 2.1. `cmd`
- `api`: Contains the main package for the API
- `consumer`: Contains the main package for the Message Queue consumer

### 2.2. `internal`
- `model`: Contains the data models
- `domain`: Contains the domain logic
  + `delivery`: Contains the delivery layer logic, responsible for handling the HTTP and others requests
  + `usecase`: Contains the use case layer logic, responsible for handling the business logic
  + `repository`: Contains the repository layer logic, responsible for handling the data storage and retrieval
- `middleware`: Contains the middleware
- `appconfig`: Contains the application configuration
- `httpserver`: Contains the HTTP server implementation


