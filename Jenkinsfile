pipeline {
    agent any
    stages {
        stage('Verify Tools') {
            steps {
                sh '''
                docker version
                docker info
                docker compose version
                curl --version
            '''
            }       
        }
    }
}