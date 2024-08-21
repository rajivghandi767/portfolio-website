pipeline {
    agent any
    stages{
        stage ('Run Docker') {
            steps{
                script{
                    img = 'httpd:2.4-alpine'
                    docker.image("${img}").run('d -p 90:90')
                }
            }
        }
    }
}