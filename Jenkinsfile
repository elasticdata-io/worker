#!groovy
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

def label = "frontend-${UUID.randomUUID().toString()}"
podTemplate(label: label, yaml: """
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
"""
)
	{
		node(label) {
			properties([disableConcurrentBuilds()])
			stage('checkout') {
			    if (env.BRANCH_NAME != 'master') {
                    return
                }

				checkout scm

				container('node') {
                    stage('ci tests') {
                        env.SCRAPER_SERVICE_URL = 'https://app.elasticdata.io'
	                    sh 'npm ci'
	                    sh 'npm run test:ci'
                    }
				}

				container('docker') {
					env.DOCKER_TAG = "${BRANCH_NAME}_${BUILD_NUMBER}"
					stage('build application') {
						sh 'docker login  \
							-u ${DOCKER_CONTAINER_LOGIN}  \
							-p ${DOCKER_CONTAINER_PASSWORD}'
						sh 'docker build -f install/Dockerfile -t  ${DOCKER_CONTAINER_PREFIX}/scraper-worker-ts:${DOCKER_TAG} .'
					}
					stage('publish application') {
						sh 'docker push ${DOCKER_CONTAINER_PREFIX}/scraper-worker-ts:${DOCKER_TAG}'
					}
				}

				container('k8s-helm') {
					stage('helm upgrade') {
						sh "helm upgrade \
                            -f install/helm/scraper-worker/values-production.yaml \
							--install scraper-worker \
							--namespace app \
							--set image.repository=${DOCKER_CONTAINER_PREFIX}/scraper-worker-ts \
							--set image.tag=${DOCKER_TAG} \
							install/helm/scraper-worker"
					}
				}
			}
		}
	}
