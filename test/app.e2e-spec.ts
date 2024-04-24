import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { AuthConstants } from '../src/constants/auth.constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/users/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'admin@dominio.com', password: 'admin' })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('/products (POST)', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Product Name 1',
        sku: 'SKU-PRD-NAME-001',
        quantity: Math.round(Math.random() * 100),
        price: +Math.round(Math.random() * 100).toFixed(2),
        userId: 1,
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${AuthConstants.tokenAdmin}`)
      .expect(201)
      .expect('Content-Type', /json/);
  });

  afterAll(async () => {
    await app.close();
  });
});
