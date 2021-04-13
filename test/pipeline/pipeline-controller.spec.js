// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest')('http://localhost:3000');
const expect = require('chai').expect;

const endpoint = '/v1/run-sync';

function readFile(fileLink) {
	fileLink = path.resolve(path.normalize(fileLink.replace('file:', '')));
	return JSON.parse(fs.readFileSync(fileLink).toString('utf-8'));
}

describe(`POST ${endpoint}`, async function() {
	this.timeout(30000);

	describe('when data is invalid', async () => {

		it('should return expected error message', async function () {
			const json = {version: 'v2'};
			const response = await request
				.post(endpoint )
				.send(json);

			expect(response.status).to.eql(500);
			expect(response.body.message).to.eql('Error: version "v2" is not supported');
		});
		it('should return expected error message', async function () {
			const json = {version: '2.0', commands: []};
			const response = await request
				.post(endpoint)
				.send(json);

			expect(response.status).to.eql(500);
			expect(response.body.message).to.eql('Error: commands cannot be empty');
		});
		it('should return expected error message', async function () {
			const response = await request
				.post(endpoint)
				.send();

			expect(response.status).to.eql(500);
			expect(response.body.message).to.eql('Error: version is required field');
		});
	});

	describe('when data is valid', async () => {
		it('should return expected response', async function () {
			const json = {
				"version": "2.0",
				"commands": [
					{
						"cmd": "openurl",
						"link": "http://localhost:3000/api"
					},
					{
						"cmd": "gettext",
						"selector": "head title",
						"key": "title"
					}
				]
			};
			const response = await request
				.post(endpoint)
				.send( json );
			expect(response.status).to.eql(201);
			const data = response.body;
			const taskInformation = data.taskInformation;
			expect(taskInformation.failureReason).to.eql(null);
			const parsedData = readFile(data.fileLink);
			expect(parsedData).to.deep.equal([ { title: "Swagger UI" } ]);
		});
	});
});
