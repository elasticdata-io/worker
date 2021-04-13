// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest')('http://localhost:3000');
const expect = require('chai').expect;

describe('POST /', async function() {
	this.timeout(30000);

	describe('when data is invalid', async () => {

		it('should return expected error message', async function () {
			const json = {version: 'v2'};
			const response = await request
				.post('/', )
				.send({ json });

			expect(response.status).to.eql(500);
			expect(response.body.message).to.eql('Error: version "v2" not supported');
		});
		it('should return expected error message', async function () {
			const json = {version: '2.0', commands: []};
			const response = await request
				.post('/', )
				.send({ json });

			expect(response.status).to.eql(500);
			expect(response.body.message).to.eql('Error: commands cannot be empty');
		});
		it('should return expected error message', async function () {
			const response = await request
				.post('/', )
				.send();

			expect(response.status).to.eql(500);
			expect(response.body.message).to.eql('Error: json is required field');
		});
	});

	describe('when data is valid', async () => {
		it('should return expected error message', async function () {
			const json = {
				version: '2.0',
				commands: [
					{
						cmd: 'openurl',
						link: 'http://localhost:3000/api'
					},
					{
						cmd: 'gettext',
						selector: 'head title'
					}
				],
			};
			const response = await request
				.post('/')
				.send( { json });
			expect(response.status).to.eql(201);
			const data = response.body;
			const taskInformation = data.taskInformation;
			expect(data).to.have.all.keys(
				'taskInformation', 'bytes', 'fileLink', 'rootLines');
			expect(data.bytes).to.be.a('number');
			expect(data.fileLink).to.be.a('string');
			expect(data.rootLines).to.be.a('number');
			expect(taskInformation).to.have.all.keys(
				'commandsInformationLink', 'failureReason');
			expect(taskInformation.commandsInformationLink).to.be.a('string');
			expect(taskInformation.failureReason).to.eq(null);
		});
	});
});
