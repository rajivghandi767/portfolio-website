pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose.prod.yaml"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "Checking out repository"
                checkout scm
            }
        }

        stage('Lint Code') {
            steps {
                echo "Linting Frontend and Backend"
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run lint'
                }
                dir('backend') {
                    sh 'pip install flake8 black'
                    sh 'flake8 .'
                    sh 'black --check .'
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running Tests"
                dir('frontend') {
                    sh 'npm run test'
                }
                dir('backend') {
                    sh 'pip install -r requirements.txt'
                    sh 'python manage.py test'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Frontend and Backend Docker Images"
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} build"
                // Uncomment below for forced rebuild with no cache
                // sh "docker compose -f ${DOCKER_COMPOSE_FILE} build --no-cache"
            }
        }

        stage('Deploy Locally') {
            steps {
                echo "Deploying Services Locally"
                sh """
                    docker compose -f ${DOCKER_COMPOSE_FILE} down
                    docker compose -f ${DOCKER_COMPOSE_FILE} up -d
                """
                // Uncomment below to force container recreation
                // sh "docker compose -f ${DOCKER_COMPOSE_FILE} up -d --force-recreate"
            }
        }

        stage('Clean Up Unused Docker Resources') {
            steps {
                echo "Cleaning up unused Docker resources"
                sh """
                    docker system prune -f --volumes
                    docker network prune -f
                """
            }
        }

        stage('Smoke Test') {
            steps {
                echo "Running Smoke Tests for Portfolio Website"

                echo "Testing Portfolio Website Frontend"
                sh "curl -f https://rajivwallace.com || exit 1"

                echo "Testing Portfolio Website Backend"
                sh "curl -f https://api.rajivwallace.com/health || exit 1"
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Deployment failed. Check the logs for more information."
        }
    }
}