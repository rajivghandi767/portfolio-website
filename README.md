# Portfolio Website 🚀

## 🚀 Overview

This repository contains the source code for my portfolio website, a project that showcases my journey as a Software Engineer with a passion for **Backend Development** and **DevOps**. This project is more than just a portfolio; it is a testament to my dedication to building, deploying, and managing full-stack applications from the ground up.

The website is built with a **Django REST backend** and a **React Typescript frontend**. The entire application is self-hosted on a **Raspberry Pi 4B** in my [Home Lab](https://github.com/rajivghandi767/homelab-iac), orchestrated with **Docker**, and features a complete CI/CD pipeline using **Jenkins** for automated builds and deployments. Secrets are managed by **HashiCorp Vault**, and monitoring is handled by **Prometheus** and **Grafana**.

## 🌟 Features

- **🚀 Django REST API**: A robust backend serving dynamic content for my projects, blog, and more.
- **⚛️ React Frontend**: A modern, responsive frontend built with TypeScript and React.
- **🐳 Dockerized Environment**: Both frontend and backend are fully containerized for consistency.
- **🤖 CI/CD with Jenkins**: Automated build, test, and deployment pipeline.
- **🔐 Secure Secrets Management**: Integration with HashiCorp Vault to manage environment variables securely.
- **🥧 Self-Hosted on Raspberry Pi**: Production environment runs on a Raspberry Pi 4B.
- **📈 Monitoring**: Integrated Prometheus & Grafana for performance tracking.
- **🎨 Dark Mode**: A sleek dark mode for comfortable viewing.

---

## 🔧 Technologies Used

### **Backend**

- 🐍 Python
- 🚀 Django & Django REST Framework

### **Frontend**

- ⚛️ React
- 🔵 TypeScript
- 🍃 Tailwind CSS

### **Database**

- 🐘 PostgreSQL (Self-hosted on Raspberry Pi in Production)

### **DevOps & Infrastructure**

- 🐳 Docker & Docker Compose
- 🤖 Jenkins (CI/CD)
- 🔐 HashiCorp Vault
- 🌐 Nginx Proxy Manager
- 📈 Prometheus & Grafana
- 🥧 Raspberry Pi 4B (DietPi)

---

## 📂 Project Structure

```
.
├── 📁 backend/
│   ├── 📝 blog/
│   ├── 📧 contacts/
│   ├── 🏥 health_check/
│   ├── ℹ️ info/
│   ├── 🏗️ projects/
│   ├── 💳 wallet/
│   ├── ⚙️ config/
│   ├── 🐳 Dockerfile.prod
│   └── 🚀 manage.py
├── 📁 frontend/
│   ├── 📁 src/
│   └── 🐳 Dockerfile.prod
├── 📁 nginx/
│   └── 🐳 Dockerfile
├── 🐳 docker-compose.yml
├── 📄 env.example
├── 🤖 Jenkinsfile
├── 🤖 Jenkinsfile.deploy
└── 📄 README.md
```

---

## 🚀 Deployment & Infrastructure (Production)

This project is deployed in a specific [Home Lab](https://github.com/rajivghandi767/homelab-iac) environment. Below is the documentation of the production architecture.

### Infrastructure

- **Host**: 🥧 Raspberry Pi 4B running a headless Debian distro (DietPi).
- **Containerization**: 🐳 Docker and Docker Compose manage the services.
- **Reverse Proxy**: 🌐 Nginx Proxy Manager handles routing and SSL.
- **Registry**: Images are built and pushed to a **Private GitHub Container Registry**.
- **Database**: Connects to an external self-hosted PostgreSQL instance.

### CI/CD Pipeline

**Jenkins** watches the `main` branch. On commit:

1.  Tests are run.
2.  Docker images are built and pushed to the private registry.
3.  The production environment pulls the new images and updates the containers once daily.
4.  Secrets are injected dynamically via **HashiCorp Vault** during build and deploy stages.
5.  Success or Failure reports are sent to Discord.

---

## 💻 Local Replication

This section details how to replicate this environment locally. Since the `docker-compose.yml` is configured for my specific production environment (private registry, external networks), you will need to make the following adjustments to run it on your machine.

### 1. Prerequisites

- 🐳 Docker & Docker Compose
- 📝 A `.env` file (see `env.example`)

### 2. Configure Environment (`.env`)

Create a `.env` file based on the example.

**Key Variable Adjustments (\*):**

- `POSTGRES_HOST`: _Set this to `db` (matching the service name added in Step 4)._
- `DJANGO_ALLOWED_HOSTS`: _Add `localhost,127.0.0.1`._
- `VITE_API_URL`: _Set to `http://localhost:8000`._

### 3. Modify `docker-compose.yml` for Local Build (\*)

My production file pulls images from a **Private Registry**. To run this locally, you must switch **ALL** services to build from source and remove external network requirements.

**A. Switch from Image to Build:**
_Update `portfolio-backend`, `portfolio-backend-init`, `portfolio-frontend`, and `portfolio-nginx` to use `build` contexts instead of `image`._

```yaml
# In docker-compose.yml (Example Modifications):

portfolio-backend-init:
  # image: ghcr.io/...  <-- COMMENT OUT
  build:
    context: ./backend
    dockerfile: Dockerfile.prod

portfolio-backend:
  # image: ghcr.io/...  <-- COMMENT OUT
  build:
    context: ./backend
    dockerfile: Dockerfile.prod

portfolio-frontend:
  # image: ghcr.io/...  <-- COMMENT OUT
  build:
    context: ./frontend
    dockerfile: Dockerfile.prod

portfolio-nginx:
  # image: ghcr.io/...  <-- COMMENT OUT
  build:
    context: ./nginx
    dockerfile: Dockerfile
```

**B. Update Networks:**
_Remove `external: true` from the network definitions at the bottom of the file so Docker creates them automatically._

```yaml
networks:
  core:
    # external: true  <-- COMMENT OUT
  portfolio:
    # external: true  <-- COMMENT OUT
```

### 4. Database Setup (\*)

Since the production setup connects to an external DB, you must provide one locally. Add this service to your `docker-compose.yml` so the `init` container can reach it:

```yaml
db:
  image: postgres:15-alpine
  container_name: portfolio-db
  environment:
    - POSTGRES_DB=portfolio-db
    - POSTGRES_USER=portfolio-user
    - POSTGRES_PASSWORD=secret
  networks:
    - database
```

_Ensure your `.env` file matches these credentials and sets `POSTGRES_HOST=db`._

### 5. Start the Application

Once the adjustments are made:

```bash
docker compose up -d --build
```

- **Frontend**: `http://localhost:5173` (Requires port mapping in compose if not using Nginx Proxy)
- **Backend**: `http://localhost:8000`

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 👤 Author

**Rajiv Wallace**

- **Linkedin**: [linkedin.com/in/rajiv-wallace](https://www.linkedin.com/in/rajiv-wallace)
- **Email**: [rajivghandi972@gmail.com](mailto:rajivghandi972@gmail.com)
