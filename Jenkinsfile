pipeline {
    agent any
    stages {
        stage('Verify Tools for Build') {
            steps {
                sh '''
                docker version
                docker compose version
                docker info
                docker ps
                '''
            }
        }
        stage('Prune Docker Data Before Build') {
            steps {
                sh 'docker system prune -a --volumes -f'
            }
        }
        stage('Deploy Portfolio Website'){
            steps{
                sh '''
                docker compose -f docker-compose.prod.yaml --no-cache
                docker compose -f docker-compose.prod.yaml up -d --force-recreate
                docker ps
                '''
            } 
        }
        stage('Prune Docker Data After Build') {
            steps {
                sh 'docker system prune -a --volumes -f'
            }
        } 
        stage('Confirm Deployment') {
            steps {
                sh 'docker ps'
            }
        }
    }
}