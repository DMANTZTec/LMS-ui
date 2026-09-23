pipeline {
    agent any

    parameters {
        choice(
            name: 'BUILD_ENV',
            choices: ['uat', 'production'],
            description: 'Target environment — drives `vite build --mode <env>` and loads the matching .env.<env> file'
        )
    }

    environment {
        IMAGE_NAME     = "lms-webui-docker-container"
        NEXUS_REGISTRY = "nexus.local:8443"
        NEXUS_REPO     = "lms-webui-docker-private-repo"
        NEXUS_CREDS_ID = "nexus-admin"
        GIT_CREDS_ID   = "shanti-bitbucket"
        GIT_URL        = "https://github.com/DMANTZTec/LMS-ui.git"
        GIT_BRANCH     = "uat"
        NOTIFY_TO      = "shanti.mobdev@gmail.com"
        NOTIFY_CC      = "shanti@dmantz.com"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: "${GIT_BRANCH}",
                    credentialsId: "${GIT_CREDS_ID}",
                    url: "${GIT_URL}"
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    sh """
                        docker build \\
                            --build-arg BUILD_ENV=${params.BUILD_ENV} \\
                            -t ${IMAGE_NAME}:${params.BUILD_ENV} \\
                            -f Dockerfile .
                    """
                }
            }
        }

        stage('Push to Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${NEXUS_CREDS_ID}",
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh """
                        FULL_IMAGE="${NEXUS_REGISTRY}/repository/${NEXUS_REPO}/${IMAGE_NAME}:${params.BUILD_ENV}"
                        echo "\${NEXUS_PASS}" | docker login -u "\${NEXUS_USER}" --password-stdin ${NEXUS_REGISTRY}
                        docker tag ${IMAGE_NAME}:${params.BUILD_ENV} \${FULL_IMAGE}
                        docker push \${FULL_IMAGE}
                        docker rmi \${FULL_IMAGE}
                    """
                }
            }
        }

        stage('Deployment Approval') {
            steps {
                script {
                    timeout(time: 5, unit: 'MINUTES') {
                        mail bcc: '',
                             body: "<br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br>Environment: ${params.BUILD_ENV} <br>Approve deployment at: ${env.BUILD_URL}input",
                             cc: "${NOTIFY_CC}",
                             charset: 'UTF-8',
                             from: 'shanti.mobdev@gmail.com',
                             mimeType: 'text/html',
                             replyTo: '',
                             subject: "Deployment Approval Required: ${env.JOB_NAME} #${env.BUILD_NUMBER} [${params.BUILD_ENV}]",
                             to: "${NOTIFY_TO}"

                        input id: 'Deploy-Gate',
                              message: "Deploy ${IMAGE_NAME}:${params.BUILD_ENV} to ${params.BUILD_ENV.toUpperCase()}?",
                              ok: 'Proceed',
                              submitter: 'Shanti'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${NEXUS_CREDS_ID}",
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh """
                        FULL_IMAGE="${NEXUS_REGISTRY}/repository/${NEXUS_REPO}/${IMAGE_NAME}:${params.BUILD_ENV}"
                        echo "\${NEXUS_PASS}" | docker login -u "\${NEXUS_USER}" --password-stdin ${NEXUS_REGISTRY}
                        docker pull \${FULL_IMAGE}
                        docker stop ${IMAGE_NAME}-${params.BUILD_ENV} || true
                        docker rm   ${IMAGE_NAME}-${params.BUILD_ENV} || true
                        docker run -d \\
                            --name ${IMAGE_NAME}-${params.BUILD_ENV} \\
                            --restart unless-stopped \\
                            -p 30280:80 \\
                            \${FULL_IMAGE}
                    """
                }
            }
        }
    }

    post {
        always {
            mail bcc: '',
                 body: "<br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br>Environment: ${params.BUILD_ENV} <br>Status: ${currentBuild.currentResult} <br>URL: ${env.BUILD_URL}",
                 cc: '',
                 charset: 'UTF-8',
                 from: '',
                 mimeType: 'text/html',
                 replyTo: '',
                 subject: "${currentBuild.currentResult} CI [${params.BUILD_ENV}]: ${env.JOB_NAME}",
                 to: "${NOTIFY_TO}"
        }
        success {
            echo "Image ${IMAGE_NAME}:${params.BUILD_ENV} built, pushed, and deployed successfully."
        }
        failure {
            echo "Pipeline failed. Check the logs above."
        }
    }
}
