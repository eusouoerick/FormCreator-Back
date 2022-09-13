import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(5000);

    pactum.request.setBaseUrl('http://localhost:5000/');
    prisma = app.get(PrismaService);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    it('signin', () => {
      return pactum.spec().post('auth/sigin').expectStatus(404);
    });
  });
});
