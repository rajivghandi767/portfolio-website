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
        stage('Prune Docker Data') {
            steps {
                sh 'docker system prune -a --volumes -f'
            }
        }
        stage('Start Container'){
            steps{
                sh 'docker compose up -d --no-colour --wait'
                sh 'docker compose ps'
            }
            
        }
    }
}