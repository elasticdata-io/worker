pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: some-label-value
spec:
  volumes:
  - name: dockersock
    hostPath:
      path: /var/run/docker.sock
  - name: kubeconfig
    hostPath:
      path: /opt/kubernetes/storage/.kube
  containers:
  - name: k8s-helm
    image: lachlanevenson/k8s-helm:v3.6.0
    command:
    - cat
    tty: true
    volumeMounts:
      - name: kubeconfig
        mountPath: "/opt/.kube"
  - name: docker
    image: docker
    volumeMounts:
      - name: dockersock
        mountPath: "/var/run/docker.sock"
    command:
    - cat
    tty: true
  - name: node
    image: node
    command:
    - cat
    tty: true
'''
        }
    }
    environment {
        SCRAPER_SERVICE_URL = 'https://app.elasticdata.io'
    }
    stages {
        stage('ci tests') {
            steps {
                container('node') {
                    sh 'npm ci'
                    sh 'npm run test:ci'
                }
            }
        }
        stage('docker build & push') {
            steps {
                container('docker') {
                    script{
                        def now = new Date()
                        env.dateFormatted = now.format("yyyy-MM-dd'T'HH:mm:ss'Z'")
                    }
                    sh 'docker login -u bombascter -p "!Prisoner31!"'
                    sh 'docker build -f install/Dockerfile -t bombascter/scraper-worker:${GIT_COMMIT} .'
                    sh 'docker push bombascter/scraper-worker:${GIT_COMMIT}'
                }
            }
        }
        stage('helm') {
            steps {
                container('k8s-helm') {
                    sh "helm upgrade \
                        -f install/helm/scraper-worker/values-production.yaml \
                        --install scraper-worker \
                        --namespace app \
                        --set image.repository=bombascter/scraper-worker \
                        --set image.tag=${GIT_COMMIT} \
                        install/helm/scraper-worker"
                }
            }
        }
    }
}
