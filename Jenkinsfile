pipeline {
    agent {
        label 'ubuntu_18.04'
    }

    // parameters {
    //     text(defaultValue: '', description: 'Repo from which the component should be imported', name: 'repoUrl')
    //     text(defaultValue: '', description: 'Name of the component', name: 'componentName')
    // }

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
                    def upstream = build.getParent();
                    print upstream
                    sh "yarn"
                    // Delete element folder if existing
                    sh "rm -rf ./elements/${params.componentName}"
                    sh "mkdir -p ./elements"
                    // get the remote previous analysis or create the folder
                    sh "aws s3 sync s3://components.kano.me/analysis analysis --region eu-west-1 --only-show-errors || mkdir -p ./analysis"
                    sh "./fetch-element.sh ${params.repoUrl} ${params.componentName}"
                    sh "./generate-doc.sh"
                    sh "yarn build"
                    sh "cp analysis.json ./build/default/analysis.json"
                    sh "cp -r ./elements ./build/default/elements"
                    sh "cp -r ./analysis ./build/default/analysis"
                    sh "aws s3 sync build/default s3://components.kano.me --region eu-west-1 --only-show-errors"
                }
            }
        }
    }
}