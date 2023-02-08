import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PipelineModule } from './pipeline.module';
import { DataStoreModule } from '../data-store/data-store.module';

describe('PipelineController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PipelineModule, DataStoreModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('/v1/run-sync', () => {
    const endpoint = '/v1/run-sync';
    describe('with empty json', () => {
      it(`should return expected error message`, async () => {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send({});
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual(
          `Error: version is required field`,
        );
      });
    });
    describe('with incorrect version', () => {
      it(`should return expected error message`, async () => {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send({ version: 'v2' });
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual(
          'Error: version "v2" is not supported',
        );
      });
    });
    describe('with empty commands', () => {
      it(`should return expected error message`, async () => {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send({ version: '2.0', commands: [] });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error: commands cannot be empty');
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
