pipeline {
    agent { label 'ubuntu-latest' }  // Runs on an Ubuntu agent
    
    environment {
        DOCKER_IMAGE = "farzanapasha/user-api-demo"
        PATH = "/opt/homebrew/bin:$PATH"  // Ensure Docker is accessible
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                sh 'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -'
                sh 'sudo apt-get install -y nodejs'
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test -- --forceExit'
            }
        }
    }
}
