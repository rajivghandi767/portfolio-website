# Portfolio Website 🚀

## 🚀 Overview

This repository contains the source code for my portfolio website, a project that showcases my journey as a Software Engineer with a passion for **Backend Development** and **DevOps**.

More than just a digital resume, this application serves as a live demonstration of my ability to own the entire software development lifecycle—from writing code to managing bare-metal infrastructure. It highlights my capability to build, containerize, deploy, and monitor full-stack applications independently.

The website is built with a **Django REST backend** and a **React TypeScript frontend**. The entire application is self-hosted on a **Raspberry Pi 4B** in my [Home Lab](https://github.com/rajivghandi767/homelab-iac), orchestrated with **Docker**, and features a complete CI/CD pipeline using **Jenkins** for automated builds and zero-downtime deployments. Secrets are dynamically managed by **HashiCorp Vault**, and system health is monitored via **Prometheus** and **Grafana**.

## 🌟 Features & Technical Highlights

- **🚀 Django REST API**: A scalable backend architecture serving dynamic content for my projects, blog, and contact forms.
- **⚛️ React & TypeScript**: A modern, responsive, and strongly-typed frontend built for performance and maintainability.
- **🐳 DevOps & Containerization**: Both frontend and backend are fully containerized, ensuring perfect parity between development and production environments.
- **🤖 Automated CI/CD (Jenkins)**: A robust pipeline that automatically runs tests, builds Docker images, and deploys updates to my production server upon merging to `main`.
- **🔐 Enterprise-Grade Secrets Management**: Integration with HashiCorp Vault to securely inject environment variables, avoiding hardcoded secrets.
- **🥧 Bare-Metal Self-Hosting**: Production environment successfully runs on constrained hardware (Raspberry Pi 4B running DietPi), demonstrating resource-efficient system design.
- **📈 Observability**: Integrated Prometheus & Grafana for real-time performance tracking and system health monitoring.

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
- 🌐 Nginx Proxy Manager & Cloudflare
- 📈 Prometheus & Grafana
- 🥧 Raspberry Pi 4B (DietPi OS)

---

## 📂 Project Structure

```text
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

This project is deployed in a custom [Home Lab](https://github.com/rajivghandi767/homelab-iac) environment. Below is the architecture of the production setup, designed to mimic enterprise DevOps workflows on a micro-scale.

### Infrastructure

- **Host**: 🥧 Raspberry Pi 4B running a headless Debian distro (DietPi).
- **Containerization**: 🐳 Docker and Docker Compose manage isolated services and networking.
- **Reverse Proxy & Routing**: 🌐 Nginx Proxy Manager handles request routing and automatic SSL provisioning.
- **Registry**: Immutable Docker images are built and pushed to a **Private GitHub Container Registry**.
- **Database**: Connects to an external self-hosted PostgreSQL instance running on the same host network.

### CI/CD Pipeline

**Jenkins** monitors the `main` branch. On commit:

1.  Automated tests are executed to ensure code integrity.
2.  Docker images are built, tagged, and pushed to the private registry.
3.  The production environment pulls the new images and updates the containers seamlessly.
4.  Secrets are injected dynamically via **HashiCorp Vault** during the build and deploy stages.
5.  Success or Failure deployment reports are dispatched via Discord Webhooks.

---

## 💻 Local Replication

This section details how to replicate this environment locally. Since the production `docker-compose.yml` is configured for a private registry and external networks, follow these steps to run it locally from source.

### 1. Prerequisites

- 🐳 Docker & Docker Compose
- 📝 A `.env` file (see `env.example`)

### 2. Configure Environment (`.env`)

Create a `.env` file based on `env.example`.

**Key Variable Adjustments:**

- `POSTGRES_HOST`: _Set this to `db` (matching the service name added in Step 4)._
- `DJANGO_ALLOWED_HOSTS`: _Add `localhost,127.0.0.1`._
- `VITE_API_URL`: _Set to `http://localhost:8000`._

### 3. Modify `docker-compose.yml` for Local Build

Update the compose file to build from source rather than pulling from the private registry.

**A. Switch from Image to Build:**
Comment out the `image` tags and add `build` contexts for `portfolio-backend-init`, `portfolio-backend`, `portfolio-frontend`, and `portfolio-nginx`.

```yaml
portfolio-backend:
  # image: ghcr.io/...
  build:
    context: ./backend
    dockerfile: Dockerfile.prod
```

**B. Update Networks:**
Remove `external: true` from the network definitions so Docker creates them automatically.

### 4. Database Setup

Add a local PostgreSQL service to your `docker-compose.yml`:

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

_Ensure your `.env` file matches these credentials._

### 5. Start the Application

Run the following command to build and spin up the environment:

```bash
docker compose up -d --build
```

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:8000`

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 👤 Author

**Rajiv Wallace**

- **LinkedIn**: [linkedin.com/in/rajiv-wallace](https://www.linkedin.com/in/rajiv-wallace)
- **Email**: [rajivghandi972@gmail.com](mailto:rajivghandi972@gmail.com)
