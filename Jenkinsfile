pipeline {
    agent any
    stages {
        stage('Verify Tools') {
            steps {
                sh '''
                docker version
                docker info
                docker ps
                '''
            }
        }
        stage('Start Container') {
            steps {
                sh 'docker compose up'
                sh 'docker ps'
            }
        }
    }
}