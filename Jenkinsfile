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
                    sh "mkdir -p ./elements"
                    sh "mkdir -p ./analysis"
                    sh "./fetch-element.sh ${params.repoUrl} ${params.componentName}"
                    sh "./generate-doc.sh"
                    sh "aws s3 sync elements s3://components.kano.me/elements --region eu-west-1 --only-show-errors"
                    sh "aws s3 sync analysis.json s3://components.kano.me/analysis.json --region eu-west-1 --only-show-errors"
                    sh "aws s3 sync index.html s3://components.kano.me/index.html --region eu-west-1 --only-show-errors"
                    sh "aws s3 sync bower_components s3://components.kano.me/bower_components --region eu-west-1 --only-show-errors"
                }
            }
        }
    }
}