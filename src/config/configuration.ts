export default () => ({
	DATA_SERVICE_URL: process.env.DATA_SERVICE_URL || 'http://localhost:3001',
	SCRAPER_SERVICE_URL: process.env.SCRAPER_SERVICE_URL || 'http://localhost:8085',
	RUN_TASK_QUEUE_NAME: process.env.RUN_TASK_QUEUE_NAME || 'DEV_PIPELINE_TASK_RUN_NODE',
	STOP_TASK_QUEUE_NAME: process.env.STOP_TASK_QUEUE_NAME || 'DEV_PIPELINE_TASK_STOP_V2',
	AMQP_CONNECTION_STRING: process.env.AMQP_CONNECTION_STRING || 'amqp://user:password@k8s:30403',
	AMQP_LOG_LEVEL: process.env.AMQP_LOG_LEVEL || 'info',
});
