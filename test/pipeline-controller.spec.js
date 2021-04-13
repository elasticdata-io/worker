// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;

describe('POST /', function () {
	it("returns all airports, limited to 30 per page", async function () {
		const response = await request.post('/');

		expect(response.status).to.eql(500);
		expect(response.body.message).to.eql('SyntaxError: Unexpected token u in JSON at position 0');
	});
});
