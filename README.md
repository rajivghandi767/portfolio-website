<h1 align="center">My Portfolio Website</h1>

<img width="831" alt="Screen Shot 2024-08-22 at 16 22 01" src="https://github.com/user-attachments/assets/3cb885c3-b298-4d47-b10a-935ac35e1763">

## 🚀 Overview

This repository contains the source code for my portfolio website, which showcases primarily showcases my Backend & Dev Ops skills, projects, and experience as a self-taught Software Engineer as well as my personal interests of travel & collecting credit card points.

The website is built with a Django REST backend and a React Typescript frontend, and is hosted locally on my Raspberry Pi4B using Docker and Jenkins for continuous integration and delivery.

## 🌟 Features

- **Django REST API**: Backend API built with Django REST Framework for serving dynamic content.
- **React Frontend**: A modern React.js frontend that interacts with the Django backend.
- **Dockerized Environment**: Both the frontend and backend are containerized using Docker for easy setup and consistency across environments.
- **Jenkins CI/CD**: Jenkins is used to automate the build, test, and deployment processes.
- **Responsive Design**: Adapts to various screen sizes, from mobile to desktop.
- **Dynamic Content**: Projects, Blog and Card data are served from the backend API.
- **Dark Mode**: Includes support for dark mode.

## 🔧 Technologies Used

- **Backend**:
  - Python
  - Django
  - Django REST Framework
- **Frontend**:
  - React / Typescript
  - HTML5
  - CSS3 (with [Tailwind CSS](https://tailwindcss.com/))
- **Containerization**:
  - Docker
- **CI/CD**:
  - Jenkins
- **Database**:
  - PostgreSQL

## 📂 Project Structure

## 🚀 Getting Started

### Prerequisites

Ensure you have Docker & Docker Compose installed on your machine. Jenkins installation is optional.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rajivghandi767/portfolio-website.git
   ```

2. **Docker Setup**:

   Navigate to the project directory:

   ```bash
   cd portfolio-website
   ```

   Build and start the containers using Docker Compose:

   ```bash
   docker compose up -d
   ```

   This command will set up both the Django backend and the React frontend.

3. **Jenkins Setup**:

   - Add a new pipeline project in Jenkins.
   - Configure the pipeline to use the `Jenkinsfile` from this repository.
   - The pipeline will automate the process of building, testing, and deploying the application.

### Accessing the Application

- **Django Backend**: `http://localhost:8000`
- **React Frontend**: `http://localhost:5173`

### Stopping the Application

To stop the application, run:

```bash
docker compose down
```

## 🚀 Deployment

This project is designed to be hosted locally using Docker and Jenkins. The Docker containers ensure that the environment is consistent, while Jenkins automates the CI/CD pipeline.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 👤 Author

**Rajiv Wallace**  
[LinkedIn](https://www.linkedin.com/in/rajiv-wallace) • [Email](mailto:rajivghandi972@gmail.com)
