export default () => ({
	DATA_SERVICE_URL: process.env.DATA_SERVICE_URL || 'http://localhost:3001',
	SCRAPER_SERVICE_URL: process.env.SCRAPER_SERVICE_URL || 'http://localhost:8085',
	WORKER_QUEUE_NAME: process.env.WORKER_QUEUE_NAME || 'DEV_PIPELINE_TASK_RUN_NODE',
	AMQP_CONNECTION_STRING: process.env.AMQP_CONNECTION_STRING || 'amqp://user:password@k8s:30403',
	AMQP_LOG_LEVEL: process.env.AMQP_LOG_LEVEL || 'info',
});
