pipeline {
    agent any

    parameters {
        text(defaultValue: '', description: 'Repo from which the component should be imported', name: 'repoUrl')
        text(defaultValue: '', description: 'Name of the component', name: 'componentName')
    }

    stages {
        stage("main") {
            steps {
                script {
                    sh "npm i"
                    sh "bower i"
                    // Delete element folder if existing
                    sh "rm -rf ./elements/${params.componentName}"
                    sh "mkdir -p ./elements"
                    // get the remote previous analysis or create the folder
                    sh "aws s3 sync s3://components.kano.me/analysis analysis --region eu-west-1 --only-show-errors || mkdir -p ./analysis"
                    sh "./fetch-element.sh ${params.repoUrl} ${params.componentName}"
                    sh "./generate-doc.sh"
                    sh "polymer build"
                    sh "cp analysis.json ./build/default/analysis.json"
                    sh "cp -r ./elements ./build/default/elements"
                    sh "cp -r ./analysis ./build/default/analysis"
                    sh "aws s3 sync build/default s3://components.kano.me --region eu-west-1 --only-show-errors"
                }
            }
        }
    }
}