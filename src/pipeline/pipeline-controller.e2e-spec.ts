import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {INestApplication} from "@nestjs/common";
import { PipelineModule } from './pipeline.module';
import { RunTaskDto } from '../dto/run.task.dto';
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

    describe('run', () => {
        describe('with empty json', () => {
            it(`should return expected error message`, async () => {
                const response = await request(app.getHttpServer())
                  .post('/')
                  .send( {
                      json: {}
                  } as RunTaskDto);
                expect(response.status).toBe(500);
                expect(response.body.message).toEqual('Error: version "undefined" not supported');
            });
        });
        describe('with incorrect version', () => {
            it(`should return expected error message`, async () => {
                const response = await request(app.getHttpServer())
                  .post('/')
                  .send( {
                      json: { version: 'v2' }
                  } as RunTaskDto);
                expect(response.status).toBe(500);
                expect(response.body.message).toEqual('Error: version "v2" not supported');
            });
        });
        describe('with empty commands', () => {
            it(`should return expected error message`, async () => {
                const response = await request(app.getHttpServer())
                  .post('/')
                  .send( {
                      json: { version: '2.0', commands: [] }
                  } as RunTaskDto);
                expect(response.status).toBe(500);
                expect(response.body.message).toBe('Error: commands cannot be empty');
            });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
