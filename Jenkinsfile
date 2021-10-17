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
    image: lachlanevenson/k8s-helm:v2.12.3
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
                    stage('build') {
                        sh 'docker build -f install/Dockerfile -t localhost:32000/scraper-worker:${DOCKER_TAG} .'
                    }
                    stage('publish') {
                        sh 'docker push localhost:32000/scraper-worker:${DOCKER_TAG}'
                        sh "docker login -u bombascter -p '!Prisoner31!'"
                        sh 'docker tag localhost:32000/scraper-worker:${DOCKER_TAG} bombascter/scraper-worker:${DOCKER_TAG}'
                        sh 'docker push bombascter/scraper-worker:${DOCKER_TAG}'
                    }
				}

				container('k8s-helm') {
					stage('SET ENV') {
						if (env.BRANCH_NAME == 'dev') {
							env.VALUES_FILE = 'values.yaml'
							env.KUBECONFIG = '~/.kube/config'
						}
						if (env.BRANCH_NAME == 'local') {
							env.VALUES_FILE = 'values-local.yaml'
							env.KUBECONFIG = '~/.kube/config'
						}
						if (env.BRANCH_NAME == 'test') {
							env.VALUES_FILE = 'values-test.yaml'
							env.KUBECONFIG = '/opt/.kube/test-kube-config'
						}
						if (env.BRANCH_NAME == 'master') {
							env.VALUES_FILE = 'values-prod.yaml'
							env.KUBECONFIG = '/opt/.kube/prod-kube-config'
						}
					}
					stage('helm init') {
						sh 'helm init --stable-repo-url=https://charts.helm.sh/stable --wait --client-only'
					}
					stage('helm upgrade') {
						sh "helm upgrade \
                            -f install/helm/scraper-worker/values.yaml \
                            -f install/helm/scraper-worker/${VALUES_FILE} \
							--install scraper-worker \
							--namespace scraper \
							--set image.tag=${DOCKER_TAG} \
							install/helm/scraper-worker"
					}
				}
			}
		}
	}
