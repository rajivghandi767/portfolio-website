pipeline {
    agent none
    stages {
        stage('Backend') {
            agent {
                docker { image 'python:latest' }
            }
            steps {
                sh 'python --version'
            }
        }
        stage('Frontend') {
            agent {
                docker { image 'node:current-alpine' }
            }
            steps {
                sh 'node --version'
            }
        }
    }
}