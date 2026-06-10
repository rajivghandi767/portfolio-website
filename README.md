# Portfolio Website & Central API 🚀

**🌍 [View the Live Site: rajivwallace.com](https://rajivwallace.com)**

## 🚀 Overview

This repository contains the source code for my portfolio website and the **central API backend** serving data to my other applications. It showcases my journey as a self-taught Software Engineer transitioning from a career as a Scientific Researcher and NYC Asbestos Inspector into a passionate **Backend Developer** and **DevOps** practitioner.

More than just a digital resume, this application serves as a live demonstration of my ability to own the entire software development lifecycle—from writing code to managing bare-metal infrastructure. It highlights my capability to build, containerize, deploy, and monitor full-stack applications independently.

The application is built with a **Django REST backend** and a **React TypeScript frontend**. The entire stack is self-hosted on a bare-metal **Raspberry Pi 4B** in my [Home Lab](https://github.com/rajivghandi767/homelab-iac), orchestrated with **Docker**, and features a complete CI/CD pipeline using **Jenkins** for automated builds and zero-downtime deployments. Secrets are dynamically managed by **HashiCorp Vault**, and system health is monitored via **Prometheus** and **Grafana**.

## 🌟 Features & Technical Highlights

- **🚀 Central Django REST API**: A scalable backend architecture serving dynamic content for my projects, blog, contact forms, and powering external applications.
- **⚛️ React & TypeScript**: A modern, responsive, and strongly-typed frontend built for performance and maintainability.
- **🐳 DevOps & Containerization**: Both frontend and backend are fully containerized, ensuring perfect parity between development and production environments.
- **🤖 Automated CI/CD (Jenkins)**: A robust pipeline that automatically runs tests, builds Docker images, and deploys updates to my production server upon merging to `main`.
- **🔐 Enterprise-Grade Secrets Management**: Integration with HashiCorp Vault to securely inject environment variables dynamically, completely eliminating hardcoded secrets.
- **🔴 Aggressive Redis Caching**: Bypasses ORM lookups and JSON rendering to accelerate API response times (see Performance Optimization below).
- **🥧 Bare-Metal Self-Hosting**: Production environment successfully runs on constrained hardware (Raspberry Pi 4B running DietPi) within a highly segmented Ubiquiti network.
- **Observability**: Integrated Prometheus & Grafana stack (Node Exporter, cAdvisor) for real-time performance tracking and system health monitoring, with automated Alertmanager triggers sent to Discord.

### Performance Optimization

As a public-facing portfolio and blog, traffic is overwhelmingly read-heavy. The Django REST Framework (DRF) backend is optimized to handle viral traffic spikes using industry-standard caching middlewares:

- **Dispatch Interception:** The `@cache_page` decorator is applied directly to the DRF ViewSets, intercepting the request lifecycle before it ever reaches the database or the JSON renderer. 
- **Instant Response Times:** Complex ORM operations for fetching serialized blog posts, categories, and paginated content are bypassed entirely, serving responses directly from Redis memory for ultra-fast, sub-10ms delivery.

---

## 🔧 Technologies Used

### **Backend**

- 🐍 Python
- 🚀 Django & Django REST Framework

### **Frontend**

- ⚛️ React
- 🔵 TypeScript
- 🍃 Tailwind CSS

### **Database & Caching**

- 🐘 PostgreSQL (Containerized within a private database network)
- 🔴 Redis (In-memory data store for high-speed caching)

### **DevOps & Infrastructure**

- 🐳 Docker & Docker Compose
- 🤖 Jenkins (CI/CD)
- 🔐 HashiCorp Vault
- 🌐 Nginx Proxy Manager & Cloudflare (Ingress & DNS)
- 📈 Prometheus, Grafana & Alertmanager
- 🥧 Raspberry Pi 4B (DietPi OS) & Ubiquiti UniFi Hardware

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

This project is deployed in a custom [Home Lab](https://github.com/rajivghandi767/homelab-iac) environment. The architecture is designed to mimic enterprise DevOps workflows on a micro-scale, incorporating Zero-Trust network segmentation and strict access controls.

### Infrastructure & Networking

- **Network Segmentation**: Incoming traffic routes through **Cloudflare** into a **Ubiquiti UXG-Fiber Gateway**, mapped strictly to an isolated **Homelab VLAN**. This VLAN enforces a Zero-Trust posture, blocking unauthorized lateral movement across personal subnets.
- **Host**: 🥧 Raspberry Pi 4B running a headless Debian distro (DietPi).
- **Reverse Proxy & Routing**: 🌐 Nginx Proxy Manager handles request routing, terminating SSL connections before proxying requests into isolated Docker networks.
- **Database Tier**: Connects to a self-hosted PostgreSQL instance running on a dedicated, isolated `database` Docker network. User roles and catalogs are provisioned dynamically via initialization scripts.

### CI/CD Pipeline

**Jenkins** monitors the `main` branch. On commit:

1.  Automated tests are executed to ensure code integrity.
2.  Docker images are built, tagged, and pushed to a **Private GitHub Container Registry**.
3.  **HashiCorp Vault** is securely queried during the deploy stages to dynamically inject environment variables into the host agent.
4.  The production environment pulls the new images and updates the containers seamlessly with zero-downtime rolling restarts. Scheduled deployments also run daily at `02:00 AM` EST.
5.  Deployment reports (Success/Failure) are dispatched via **Discord Webhooks**.

---

## 💻 Local Replication

This section details how to replicate this environment locally. Everything is fully plug-and-play for local development without the need to modify `docker-compose.yml` configurations or environment paths manually.

### Prerequisites

**For Docker Setup (Recommended):**
- 🐳 Docker & Docker Compose

**For Manual Setup:**
- 🐍 Python 3.x
- 🟢 Node.js & npm

### Option 1: Docker (Recommended)

Local `docker-compose.yml` and `Dockerfile` configurations are already set to build directly from the source code folder for local development rather than pulling registry images. The `docker-compose.yml` is hardcoded to use `.env.example`, so absolutely no environment configuration is required.

**Spin up the stack:**
```bash
docker compose up -d --build
```
*Note: The database migrations and seed data scripts are automatically executed during container startup!*

**Accessing Local Services:**

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

### Option 2: Manual Setup (Non-Docker)

If you prefer running the servers manually without Docker:

**1. Start the Backend API:**

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r dev-requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

**2. Start the Frontend SPA:**

```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 👤 Author

**Rajiv Wallace**  
Self-taught Software Engineer based in NYC (originally from Dominica 🇩🇲). Aviation nerd, Chelsea FC supporter, and passionate about robust Backend Development and bare-metal DevOps.

- **LinkedIn**: [linkedin.com/in/rajiv-wallace](https://www.linkedin.com/in/rajiv-wallace)
- **Email**: [dev@rajivwallace.com](mailto:dev@rajivwallace.com)
