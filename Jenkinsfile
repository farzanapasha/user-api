pipeline {
    agent any 
    
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
