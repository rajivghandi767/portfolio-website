pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
            git url: 'https://github.com/rajivghandi767/portfolio-website', branch: ‘main’
            }
        }
        stage('Build') {
            steps {
                sh '''
                docker version
                docker compose --version
                '''
            }
        } 
    }
}