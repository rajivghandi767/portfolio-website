pipeline {
    agent any
    stages {
        stage('Verify Tools') {
            steps {
                sh '''
                docker version
                docker info
                docker ps
                docker compose version
                '''
            }
        }
        stage('Start Container') {
            steps {
                sh 'docker compose up'
            }
        }
    }
}