pipeline {
    agent {
        label 'ubuntu_18.04'
    }
    stages {
        stage('tools') {
            steps {
                script {
                    def NODE_PATH = tool name: 'Node 8.11.2', type: 'nodejs'
                    env.PATH = "${env.PATH}:${NODE_PATH}/bin"
                    def YARN_PATH = tool name: 'yarn', type: 'com.cloudbees.jenkins.plugins.customtools.CustomTool'
                    env.PATH = "${env.PATH}:${YARN_PATH}/bin"
                }
            }
        }
        stage('main') {
            steps {
                script {
                    // get action first
                    def action = currentBuild.rawBuild.getAction(hudson.model.CauseAction.class)
                    // another way to find specific UpsteamCause directly
                    def cause = action.findCause(hudson.model.Cause.UpstreamCause.class)
                    def project = cause.getUpstreamProject()
                    def (org, name, branch) = project.tokenize('/')

                    action = null
                    cause = null
                    project = null

                    def url = "https://github.com/${org}/${name}"
                    sh "yarn"
                    // Delete element folder if existing
                    sh "rm -rf ./elements/${name}"
                    sh "mkdir -p ./elements"
                    // get the remote previous analysis or create the folder
                    sh "aws s3 sync s3://components.kano.me/analysis analysis --region eu-west-1 --only-show-errors || mkdir -p ./analysis"
                    sh "./fetch-element.sh ${url} ${name}"
                    sh "./generate-doc.sh"
                    sh "yarn build"
                    sh "cp analysis.json ./build/default/analysis.json"
                    sh "cp -r ./elements ./build/default/elements"
                    sh "cp -r ./analysis ./build/default/analysis"
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'kart']]) {
                        sh "aws s3 sync build/default s3://components.kano.me --region eu-west-1 --only-show-errors"
                    }
                }
            }
        }
    }
}