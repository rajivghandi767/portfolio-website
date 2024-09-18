pipeline {
    agent any
    stages {
        stage('Verify Tools for Build') {
            steps {
                sh '''
                docker version
                docker info
                '''
            }
        }
        stage('Prune Docker Data') {
            steps {
                sh 'docker system prune -a --volumes -f'
            }
        }
        stage('Start Backend'){
            steps{
                sh '''
                docker build -t portfolio-backend -f Dockerfile.prod .
                docker run -d -p 8000:8000 portfolio-backend
                docker ps
                '''
            }
            
        }
        stage('Start Frontend'){
            steps{
                sh '''
                docker build -t portfolio-frontend -f Dockerfile.prod .
                docker run -d -p 4000:4000 portfolio-backend
                docker ps
                '''
            }
        }
    }
}