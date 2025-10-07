# Portfolio Website 🚀

## 🚀 Overview

This repository contains the source code for my portfolio website, a project that showcases my journey as a Software Engineer with a passion for **Backend Development** and **DevOps**. This project is more than just a portfolio; it's a testament to my dedication to building, deploying, and managing full-stack applications from the ground up.

The website is built with a **Django REST backend** and a **React Typescript frontend**. The entire application is self-hosted on a **Raspberry Pi 4B** in my home lab, orchestrated with **Docker**, and features a complete CI/CD pipeline using **Jenkins** for automated builds and deployments. Secrets are managed by **HashiCorp Vault**, and monitoring is handled by **Prometheus** and **Grafana** to ensure everything runs smoothly.

## 🌟 Features

- **🚀 Django REST API**: A robust backend serving dynamic content for my projects, blog, and more.
- **⚛️ React Frontend**: A modern, responsive frontend built with TypeScript and React.
- **🐳 Dockerized Environment**: Both frontend and backend are fully containerized for consistency and easy deployment.
- **🤖 CI/CD with Jenkins**: Automated build, test, and deployment pipeline for seamless updates.
- **🔐 Secure Secrets Management**: Integration with HashiCorp Vault to manage environment variables and other secrets securely.
- **🥧 Self-Hosted on Raspberry Pi**: The entire stack is hosted on a Raspberry Pi 4B, demonstrating my ability to manage and maintain a production-like environment.
- **📈 Monitoring with Prometheus & Grafana**: Integrated monitoring to track application performance and health, with visualizations in Grafana.
- **✍️ Dynamic Content**: All project, blog, and credit card information is served dynamically from the backend API.
- **🎨 Dark Mode**: A sleek dark mode for comfortable viewing.

---

## 🔧 Technologies Used

### **Backend**

- 🐍 Python
- 🚀 Django
- ✅ Django REST Framework

### **Frontend**

- ⚛️ React
- 🔵 TypeScript
- 🍃 Tailwind CSS

### **Database**

- 🐘 PostgreSQL

### **DevOps & Infrastructure**

- 🐳 Docker & Docker Compose
- 🤖 Jenkins
- 🔐 HashiCorp Vault
- 🌐 Nginx
- 📈 Prometheus & Grafana
- 🥧 Raspberry Pi 4B

---

## 📂 Project Structure

```
.
├── 📁 backend/
│   ├── 📝 blog/
│   ├── 📧 contacts/
│   ├── ℹ️ info/
│   ├── 🏗️ projects/
│   ├── 💳 wallet/
│   ├── ⚙️ config/
│   ├── 🐳 Dockerfile.prod
│   └── 🚀 manage.py
├── 📁 frontend/
│   ├──  src/
│   └── 🐳 Dockerfile.prod
├── 📁 nginx/
│   └── 🐳 Dockerfile
├── 🐳 docker-compose.yml
├── 🤖 Jenkinsfile
└── 📄 README.md
```

---

## 🚀 Getting Started

### Prerequisites

- 🐳 Docker & Docker Compose
- 📝 A `.env` file (see `.env.example` for required variables)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/rajivghandi767/portfolio-website.git
    ```

2.  **Create your `.env` file:**

    Create a `.env` file in the root of the project and populate it with the necessary environment variables. You can use `.env.dev` as a template.

3.  **Docker Setup:**

    Navigate to the project directory and start the containers:

    ```bash
    docker compose up -d --build
    ```

    This command will build the images and start the Django backend, React frontend, and Nginx reverse proxy.

### Accessing the Application

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`

### Stopping the Application

```bash
docker compose down
```

---

## 🚀 Deployment, CI/CD, and Secrets Management

This project is self-hosted on a Raspberry Pi 4B and utilizes a Jenkins pipeline for automated builds and deployments.

### Infrastructure

- **Host**: 🥧 Raspberry Pi 4B running a headless Debian distro (DietPi).
- **Containerization**: 🐳 Docker and Docker Compose are used to manage the application's services.
- **Reverse Proxy**: 🌐 Nginx Proxy Manager handles routing and SSL.
- **CI/CD**: 🤖 Jenkins is configured to watch for changes to the `main` branch of this repository. When a change is detected, it automatically triggers a new build and deployment.

For a more in-depth look at my production deployment and infrastructure as code, please see my [homelab-iac](https://github.com/rajivghandi767/homelab-iac) repository.

### Secrets Management

- **Vault**: 🔐 Environment variables and other secrets are securely managed using **HashiCorp Vault**.
- **Jenkins Integration**: During the CI/CD pipeline, Jenkins authenticates with Vault to fetch the necessary secrets and injects them into the application environment at build time. This ensures that no sensitive information is ever stored directly in the source code or Jenkins configuration.

### Monitoring

- **Prometheus & Grafana**: 📈 The application is monitored using a combination of **Prometheus** for data collection and **Grafana** for visualization. The Django backend exposes a `/metrics` endpoint that Prometheus scrapes to collect data on application performance and health. This data is then visualized in Grafana dashboards.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 👤 Author

**Rajiv Wallace**

- **Linkedin**: [linkedin.com/in/rajiv-wallace](https://www.linkedin.com/in/rajiv-wallace)
- **Email**: [rajivghandi972@gmail.com](mailto:rajivghandi972@gmail.com)
