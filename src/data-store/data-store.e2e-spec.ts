import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import axios from 'axios';
import {INestApplication} from "@nestjs/common";
import {DataStoreModule} from "./data-store.module";
import StorageDataRules from "./dto/storage-data-rules";
import { KeysValuesData } from './dto/keys.values.data';

describe('Data store', () => {
    let app: INestApplication;
    const storeId = 'testStoreId';
    const bucket = '591b716f6e87cc0789badadb' || 'testBucket';
    const fileName = 'testFileName';
    const useruuid = 'useruuid';
    const context = 'root.0';

    const readFile = async (link) => {
        const response = await axios.get(link)
        return response.data;
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [DataStoreModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });

    describe('setting rules', () => {
        const initialValues = [
            {
                key: 'phone',
                value: '+38(097)166-50-11',
            },
            {
                key: 'text-with-spaces',
                value: '  text with spaces  ',
            },
            {
                key: 'phones',
                value: '+38097-123-50-17,+38050-333-11-22',
            },
            {
                key: 'price',
                value: 'price: 540$',
            },
            {
                key: 'colors',
                value: ['red', 'blue', 'red', 'green', 'blue'],
            },
            {
                key: 'iphone-name',
                value: 'iPhone 5 16GB',
            },
            {
                key: 'iphone-name-array',
                value: ['iPhone 5 16GB', 'iPhone 6 128GB'],
            }
        ];
        const rules = [
            {
                cmd: 'only_number',
                bindKey: 'phone',
            },
            {
                cmd: 'trim',
                bindKey: 'text-with-spaces',
                toKey: 'text-without-spaces',
            },
            {
                cmd: 'split',
                bindKey: 'phones',
                toKey: 'phones-array',
                delimiter: ',',
            },
            {
                cmd: 'replace',
                bindKey: 'price',
                toKey: 'price-replaced',
                oldValue: '$',
                newValue: ' dollars',
            },
            {
                cmd: 'replace_regex',
                bindKey: 'phones',
                toKey: 'phones-replaced',
                searchRegex: `\\+38([0-9]{3})`,
                replaceValue: '+38($1)',
            },
            {
                cmd: 'unique',
                bindKey: 'colors',
            },
            {
                cmd: 'join',
                bindKey: 'colors',
                separator: ', ',
            },
            {
                cmd: 'extract_regex',
                bindKey: 'iphone-name',
                toKey: 'iphone-memory',
                regex: '(?<memory>[0-9]+GB)',
                replacement: 'memory',
            },
            {
                cmd: 'extract_regex',
                bindKey: 'iphone-name-array',
                toKey: 'iphone-name-array-memories',
                regex: '(?<memory>[0-9]+GB)',
                replacement: 'memory',
            }
        ];
        const expectedValues = [
            {
                'phone': '380971665011',
                'text-with-spaces': '  text with spaces  ',
                'text-without-spaces': 'text with spaces',
                'phones': '+38097-123-50-17,+38050-333-11-22',
                'phones-array': ['+38097-123-50-17', '+38050-333-11-22'],
                'price': 'price: 540$',
                'price-replaced': 'price: 540 dollars',
                'phones-replaced': '+38(097)-123-50-17,+38(050)-333-11-22',
                'colors': 'red, blue, green',
                'iphone-name': 'iPhone 5 16GB',
                'iphone-memory': '16GB',
                'iphone-name-array': ['iPhone 5 16GB', 'iPhone 6 128GB'],
                'iphone-name-array-memories': ['16GB', '128GB'],
            },
        ];

        beforeEach(async () => {
            await request(app.getHttpServer())
                .post('/v1/store/rule')
                .send({
                    rules: rules,
                    storageId: storeId,
                } as StorageDataRules);
        });

        describe('append data to storage', () => {

            beforeEach(async () => {
                for (let i = 0; i < initialValues.length; i ++) {
                    const initialValue = initialValues[i];
                    const response = await request(app.getHttpServer())
                        .post('/v1/store')
                        .set({
                            useruuid: useruuid,
                        })
                        .send({
                            key: initialValue.key,
                            value: initialValue.value,
                            context: context,
                            id: storeId,
                            userUuid: useruuid,
                        });
                    expect(response.body).toEqual({success: true});
                }
            });

            it(`should return document with changed values`, async () => {
                const response = await request(app.getHttpServer())
                    .post('/v1/store/commit')
                    .send( {
                        storeId: storeId,
                        bucket: bucket,
                        fileName: fileName,
                    });
                const json = await readFile(response.body.fileLink);
                expect(json).toEqual(expectedValues);
            });

        });

    });

    describe('setting not supported rules', () => {
        const rules = [
            {
                cmd: 'not_supported',
                bindKey: 'phone',
            }
        ];

        it('should return expected error', async () => {
           const response = await  request(app.getHttpServer())
               .post('/v1/store/rule')
               .send({
                   rules: rules,
                   storageId: storeId,
               } as StorageDataRules);
            expect(response.body).toEqual({"message": "not supported data rule: not_supported", "statusCode": 500});
        });
    });

    describe('append all data', () => {
        const importValues = [
            {
                link1: 'http://google.com.ua',
                tag1: 'google',

                link2: 'http://yandex.ru',
                tag2: 'yandex',
            },
            {
                links: [
                    {
                        'link': 'http://google.com.ua',
                        'tag': 'google',
                    },
                    {
                        'link': 'http://yandex.ru',
                        'tag': 'yandex',
                    },
                ]
            },
            {
                links: {
                    google: 'http://google.com.ua',
                    yandex: 'http://yandex.ru',
                }
            }
        ];
        describe('when inner context', () => {
            beforeEach(async () => {
                await request(app.getHttpServer())
                  .post('/v1/store/append')
                  .send({
                      values: importValues,
                      context: 'root.0.import',
                      id: storeId,
                      userUuid: useruuid,
                  } as KeysValuesData);
            });
            it(`should return document with imported data`, async () => {
                const response = await request(app.getHttpServer())
                  .post('/v1/store/commit')
                  .send( {
                      storeId: storeId,
                      bucket: bucket,
                      fileName: fileName,
                  });
                const json = await readFile(response.body.fileLink);
                expect(json).toEqual([{import: importValues}]);
            });
        })
        describe('when root context', () => {
            beforeEach(async () => {
                await request(app.getHttpServer())
                  .post('/v1/store/append')
                  .send({
                      values: importValues,
                      context: 'root.0',
                      id: storeId,
                      userUuid: useruuid,
                  } as KeysValuesData);
            });
            it(`should return document with imported data`, async () => {
                const response = await request(app.getHttpServer())
                  .post('/v1/store/commit')
                  .send( {
                      storeId: storeId,
                      bucket: bucket,
                      fileName: fileName,
                  });
                const json = await readFile(response.body.fileLink);
                expect(json).toEqual(importValues);
            });
        })
    });

    describe('replace macros', () => {
        const importValues = [
            {
                key1: 'value1'
            },
        ];
        beforeEach(async () => {
            await request(app.getHttpServer())
              .post('/v1/store/append')
              .send({
                  values: importValues,
                  context: context,
                  id: storeId,
                  userUuid: useruuid,
              } as KeysValuesData);
        });
        describe('replace line', () => {
            describe('when context has data', () => {
                it(`should return document with replaced lines`, async () => {
                    const response = await request(app.getHttpServer())
                      .post('/v1/store/replace-macros')
                      .send( {
                          id: storeId,
                          inputWithMacros: '{$line.key1}',
                          context: 'root.0',
                      });
                    expect(response.text).toEqual('value1');
                });
            });
            describe('when context not has data', () => {
                it(`should return document with replaced lines`, async () => {
                    const response = await request(app.getHttpServer())
                      .post('/v1/store/replace-macros')
                      .send( {
                          id: storeId,
                          inputWithMacros: '{$line.key1}',
                          context: 'root.1',
                      });
                    expect(response.text).toEqual('');
                });
            });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
