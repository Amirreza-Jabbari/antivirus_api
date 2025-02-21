
# Antivirus API

Antivirus API is a monolithic Django-based antivirus scanning solution that provides file scanning functionality with asynchronous background processing using Celery, RabbitMQ as a message broker, and Redis as a result backend. It also includes JWT authentication for secure access. This document explains the project’s features, installation, configuration, and usage.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
  - [With Docker Compose](#With-Docker-Compose)
  - [Running Locally Without Docker](#Running-Locally-Without-Docker)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [File Scan](#file-scan)
  - [Scan Results](#scan-results)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Monolithic Architecture:** All functionality (user authentication, file scanning, and background task processing) is managed within one codebase.
- **JWT Authentication:** Secure access using JSON Web Tokens.
- **File Scanning:** Submit files to be scanned for malicious patterns using YARA rules.
- **Asynchronous Processing:** Celery processes file scans in the background, ensuring the API remains responsive.
- **RabbitMQ & Redis Integration:** RabbitMQ is used as the message broker for Celery tasks and Redis for storing task results.
- **Dockerized Deployment:** Easily run and manage the application using Docker and Docker Compose.

---

## Requirements

- Python 3.12+ 
- RabbitMQ  
- Redis  
- NPM 11.1.0+
- Docker & Docker Compose (for containerized deployment)

*Note:* Although RabbitMQ and Redis are external services, their respective Docker images are used in the docker-compose configuration.

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Amirreza-Jabbari/antivirus_api.git
cd antivirus_api
```

---

## Running the Application

### With Docker Compose

Your project comes with a `docker-compose.yml` file that defines the following services:

- **web:** Runs the Django application via Gunicorn on port 8000.
- **rabbitmq:** RabbitMQ message broker.
- **redis:** Redis for task result storage.
- **celery:** Celery worker processing tasks.
- **frontend:** React/Vite frontend service on port 5173.

To build and run all services:

```bash
docker-compose up --build
```

To stop all services:

```bash
docker-compose down
```

The project is configured to run on port 8000, so you can access the frontend at:
`
http://localhost:5173/
`

### Running Locally Without Docker

If running locally:
### 1. Start RabbitMQ and Redis (or run them via Docker separately).
### 2. Create a Virtual Environment (Recommended)

```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Python Dependencies

If you’re using Docker, these will be installed during the Docker build. Otherwise, run:

```bash
pip install -r requirements.txt
```

### 4. Environment Variables

Make sure you configure the following in your settings or via environment variables:
- `CELERY_BROKER_URL` (set to `amqp://guest@rabbitmq//` for Docker)
- `CELERY_RESULT_BACKEND` (set to `redis://redis:6379/0` for Docker)

### 5. create superuser
```bash
python manage.py createsuperuser
```

### 6. Run Django:

   ```bash
   python manage.py runserver
   ```

### 7. Run Celery worker:

   ```bash
   celery -A antivirus_api worker --loglevel=info --pool=solo
   ```

---

## API Endpoints

### Authentication

- **Obtain Token:**
  - **URL:** `POST /api/token/`
  - **Payload:**
    ```json
    {
      "username": "your_username",
      "password": "your_password"
    }
    ```
  - **Response:**
    ```json
    {
      "access": "your_jwt_access_token",
      "refresh": "your_jwt_refresh_token"
    }
    ```

- **Refresh Token:**
  - **URL:** `POST /api/token/refresh/`
  - **Payload:**
    ```json
    {
      "refresh": "your_jwt_refresh_token"
    }
    ```
  - **Response:**
    ```json
    {
      "access": "new_jwt_access_token"
    }
    ```

### File Scan

- **Scan File:**
  - **URL:** `POST /api/scan/`
  - **Headers:**  
    `Authorization: Bearer <your_jwt_access_token>`
  - **Payload:** Multipart form data containing a file.
  - **Response:**
    ```json
    {
      "task_id": "2500c1a3-3a7f-4aeb-bac1-f9c6f4b3d966"
    }
    ```

### Scan Results

- **Get Scan Result:**
  - **URL:** `GET /api/results/{task_id}/`
  - **Headers:**  
    `Authorization: Bearer <your_jwt_access_token>`
  - **Response Example (Final Result):**
    ```json
    {
      "status": "malicious",
      "report": {
          "matched_rules": [
              "PackedFile",
              "AntiReverseEngineering",
              "RansomwareBehavior",
              "HeuristicAnomaly"
          ],
          "detail": "The file complies with YARA rules."
      }
    }
    ```

  - **Interim Responses:**  
    While the scan is running, you may receive:
    ```json
    { "status": "Processing..." }
    ```
    or
    ```json
    { "status": "Waiting..." }
    ```

---

## Usage Examples

### Using cURL to Authenticate:
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

### Using cURL to Scan a File:
```bash
curl -X POST http://localhost:8000/api/scan/ \
  -H "Authorization: Bearer your_jwt_access_token" \
  -F "file=@/path/to/your/file.exe"
```

### Using cURL to Fetch Scan Results:
```bash
curl -X GET http://localhost:8000/api/results/2500c1a3-3a7f-4aeb-bac1-f9c6f4b3d966/ \
  -H "Authorization: Bearer your_jwt_access_token"
```

---

## Troubleshooting

- **Celery Connection Errors:**  
  Ensure that `CELERY_BROKER_URL` is set to use the service name (e.g., `rabbitmq`) in Docker and that RabbitMQ is healthy (use healthchecks in Docker Compose).

- **CORS Issues:**  
  CORS is allowed by default in this project for development (`CORS_ALLOW_ALL_ORIGINS = True`).

- **JWT Authentication Failures:**  
  Ensure that your tokens are valid and stored in localStorage under the key `"token"`.

---

## Testing

![Demo of Antivirus Application](assets/demo.gif)

## Contributing

Contributions are welcome! Please submit pull requests or open issues on GitHub. Make sure to update tests and documentation accordingly.

---

## License

This project is open-sourced under the [MIT License](LICENSE).

---