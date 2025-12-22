pipeline {
    agent any

    environment {
        // Environment variables can be defined here
        CI = 'true'
    }

    stages {
        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    echo 'Installing Frontend Dependencies...'
                    sh 'npm install'
                    
                    echo 'Running Frontend Tests...'
                    // 'run' mode executes tests once and exits (CI mode)
                    sh 'npx vitest run'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    echo 'Installing Backend Dependencies...'
                    // In a production Jenkins agent, consider using a virtualenv or Docker agent
                    sh 'pip install -r requirements.txt'
                    
                    echo 'Running Backend Tests...'
                    sh 'pytest'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                // Vault Integration Placeholder for build-time secrets
                // Make sure the 'HashiCorp Vault' plugin is installed in Jenkins.
                // Replace 'https://vault.example.com' and 'vault-cred-id' with your actual values.
                withVault(configuration: [
                    vaultUrl: 'https://vault.example.com', 
                    vaultCredentialId: 'vault-cred-id'
                ], vaultSecrets: [
                    [
                        path: 'secret/data/portfolio-app', 
                        secretValues: [
                            [envVar: 'DJANGO_SECRET_KEY', vaultKey: 'DJANGO_SECRET_KEY'],
                            [envVar: 'POSTGRES_USER', vaultKey: 'POSTGRES_USER'],
                            [envVar: 'POSTGRES_PASSWORD', vaultKey: 'POSTGRES_PASSWORD'],
                            [envVar: 'POSTGRES_DB', vaultKey: 'POSTGRES_DB']
                        ]
                    ]
                ]) {
                    echo 'Building Docker Images...'
                    // The environment variables from Vault will be available here
                    sh 'docker-compose build'
                }
            }
        }

        stage('Deploy to Raspberry Pi') {
            steps {
                script {
                    // Placeholder: Replace 'raspberry-pi-ssh-credential' with your Jenkins SSH credential ID
                    // This credential should contain the username and private key to connect to your Pi.
                    withCredentials([sshUserPrivateKey(credentialsId: 'raspberry-pi-ssh-credential', keyFileVariable: 'SSH_KEY', passphraseVariable: 'SSH_PASSPHRASE', usernameVariable: 'SSH_USER')]) {
                        // Placeholder: Replace 'your_pi_ip_or_hostname' and '/path/to/project'
                        def pi_host = 'your_pi_ip_or_hostname'
                        def project_path = '/path/to/your/project'
                        def remote_git_branch = 'production' // Assuming your Pi pulls from this branch

                        echo "Deploying to Raspberry Pi at ${pi_host}..."
                        
                        // Ensure the ssh-agent is running and add the key
                        // This uses a temporary file for the SSH key
                        sh """
                            eval \$(ssh-agent -s)
                            echo "\$SSH_KEY" | ssh-add -
                            
                            ssh -o StrictHostKeyChecking=no ${SSH_USER}@${pi_host} << 'EOF'
                                cd ${project_path}
                                git pull origin ${remote_git_branch}
                                docker-compose -f docker-compose.yml down --remove-orphans
                                docker-compose -f docker-compose.yml pull # Pulling pre-built images from a registry
                                # OR: docker-compose -f docker-compose.yml build # If building on the Pi
                                docker-compose -f docker-compose.yml up -d
                                docker-compose -f docker-compose.yml run --rm portfolio-backend-init python manage.py migrate --noinput
                            EOF
                            
                            ssh-agent -k
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Clean up workspace or send notifications
            cleanWs()
        }
    }
}
