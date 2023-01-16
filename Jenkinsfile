node {
    def imagename = 'service-account'
    def imageFullName = "party-service/${imagename}"
    def line_api_token = 'objrVJTE9zPmRe80rIOpj2plfAWAWrggxCvnXesXP26'
    def msg_status = 'Deployed Success!'
    def msg_event = 'Push Event!'
    def remote_name = 'entro'
    def remote_host = '192.168.10.29'
    def credentialsId = 'id-nexus-bluefin'
    def stickerId = '132'
    def commitMsg

    try {

        stage('clone repository') {
            def commitHash = checkout scm
            commitMsg = commitHash.GIT_COMMIT
            sh "curl -X POST -H 'Authorization: Bearer ${line_api_token}' -F 'message=${imagename} [${commitMsg}] ${msg_event}'   https://notify-api.line.me/api/notify"
            echo 'Checkout Success!'
        }

        stage('Build image') {
            app = docker.build(imageFullName)
             echo 'Build image Success!'
        }

        // stage('Remove Unused image') {  
        //     sh "docker images"
        //     imagenone = sh "docker images -f 'dangling=true' -q"
        //     echo "${imagenone}"
        //     sh "docker rmi \$(docker images -f \"dangling=true\" -q)"
        // }

        stage('Push image') {
            docker.withRegistry('https://nexus.entro-lab.com', credentialsId) {
                app.push("latest")
            }
            echo 'Push image Success!'
        }

        stage('Remove Unused image') {
            sh "docker rmi nexus.entro-lab.com/${imageFullName}:latest"
            echo 'Remove Unused image Success!'
        }

        stage('Start image') {
            def remote = [:]
            remote.name = remote_name
            remote.host = remote_host
            remote.allowAnyHosts = true
            withCredentials([usernamePassword(credentialsId: 'root-entro', passwordVariable: 'pass', usernameVariable: 'user')]) {
            remote.user = user
            remote.password = pass
                sshCommand remote: remote, command: """
            echo Entronic@ | docker login nexus.entro-lab.com -u admin --password-stdin
            docker ps -q --filter name="${imagename}_ais" | xargs -r docker rm -f
            docker ps -q --filter name="${imagename}_singtel" | xargs -r docker rm -f
            docker ps -q --filter name="${imagename}_globe" | xargs -r docker rm -f
            docker pull nexus.entro-lab.com/${imageFullName}:latest
            cd /opt/party-service/party-service-deployed/${imagename}
            pwd
            docker-compose up -d
            """
            }
        }  

    } catch (err) {
        echo "${imagename} Failed: ${err}"
        msg_status = " Failed: ${err}"
        stickerId = '123'
    } finally {
        sh "curl -X POST -H 'Authorization: Bearer ${line_api_token}' -F 'stickerPackageId=1' -F 'stickerId=${stickerId}' -F 'message=${imagename} [${commitMsg}] ${msg_status}'  https://notify-api.line.me/api/notify"
    } 
}
