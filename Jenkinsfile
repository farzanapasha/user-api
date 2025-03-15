pipeline {
    environment {
        PATH = "/opt/homebrew/bin:$PATH"
    }
    agent {
        docker {
            image 'node:22.14.0-alpine3.21'
            args '--network=host' // Example of additional options
        }
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
    }
}
