export default () => ({
	SCRAPER_SERVICE_URL: process.env.SCRAPER_SERVICE_URL || 'https://app.elasticdata.io',
	APP_MINIO_END_POINT: process.env.APP_MINIO_END_POINT || 'storage.elasticdata.io',
	APP_MINIO_PORT: process.env.APP_MINIO_PORT || 443,
	APP_MINIO_USE_SSL: process.env.APP_MINIO_USE_SSL === 'true' || true,
	APP_MINIO_ACCESS_KEY: process.env.APP_MINIO_ACCESS_KEY || 'elasticdataio',
	APP_MINIO_SECRET_KEY: process.env.APP_MINIO_SECRET_KEY || 'wJalrXUtnFEMI/9874c97c907209cpuvpw97bpb/asdasdasdasdasd',
});
