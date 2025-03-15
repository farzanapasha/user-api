pipeline {
    agent any 
    
    environment {
        DOCKER_IMAGE = "farzanapasha/user-api-demo"
 	DOCKER_TAG = "latest"
        PATH = "/Users/farzanapashajahangeer/.nvm/versions/node/v22.14.0/bin:/opt/homebrew/bin:$PATH"  // Ensure Docker is accessible
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

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                sh '''
                    docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
                    docker push $DOCKER_IMAGE:$DOCKER_TAG
                '''
            }
        }
    }
}
