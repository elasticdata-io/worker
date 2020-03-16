export default () => ({
	DATA_SERVICE_URL: process.env.DATA_SERVICE_URL || 'http://localhost:3001',
	SCRAPER_SERVICE_URL: process.env.SCRAPER_SERVICE_URL || 'http://localhost:8085',
});
