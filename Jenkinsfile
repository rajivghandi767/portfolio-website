pipeline {
    agent any
    stages {
        stage('Verify Tools') {
            sh '''
                docker version
                docker info
                docker compose version
                curl --version
            '''
        }
    }
}