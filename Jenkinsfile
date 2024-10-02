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
        stage('Prune Docker Data') {
            steps {
                sh 'docker system prune -a --volumes -f'
            }
        }
        stage('Kill Running Portfolio Website  Backend/Frontend') {
            steps{
                sh '''
                docker kill backend
                docker kill frontend
                docker ps
                '''
            }
        stage('Deploy Portfolio Website'){
            steps{
                sh '''
                docker compose up -d
                docker ps
                '''
            }  
        }
    }
}