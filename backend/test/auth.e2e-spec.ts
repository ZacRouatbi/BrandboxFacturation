import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import cookieParser from 'cookie-parser';

describe('🔐 Auth Module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let agent;

  const testUser = {
    username: 'authuser',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    prisma = moduleFixture.get(PrismaService);

    await app.init();

    agent = request.agent(app.getHttpServer());

    // Clean DB once at start
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  // ===============================
  // AUTH TESTS
  // ===============================

  it('🟢 Should register user', async () => {
    await prisma.user.deleteMany();

    const res = await request(app.getHttpServer())
      .post('/user')
      .send(testUser)
      .expect(201);

    expect(res.body.username).toBe(testUser.username);
    expect(res.body.password).toBeUndefined();
  });

  it('🔴 Should not login with wrong password', async () => {
    await prisma.user.deleteMany();

    await request(app.getHttpServer())
      .post('/user')
      .send(testUser);

    await agent
      .post('/auth/login')
      .send({
        username: testUser.username,
        password: 'wrongpassword',
      })
      .expect(401);
  });

  it('🟢 Should login successfully and set cookie', async () => {
    await prisma.user.deleteMany();

    await request(app.getHttpServer())
      .post('/user')
      .send(testUser);

    const res = await agent
      .post('/auth/login')
      .send(testUser)
      .expect(201);

    expect(res.body.message).toBe('Login successful');
  });

  it('🔴 Should NOT access /auth/me without login', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .expect(401);
  });

  it('🟢 Should access /auth/me after login', async () => {
    await prisma.user.deleteMany();

    await request(app.getHttpServer())
      .post('/user')
      .send(testUser);

    await agent.post('/auth/login').send(testUser).expect(201);

    const res = await agent.get('/auth/me').expect(200);

    expect(res.body.username).toBe(testUser.username);
    expect(res.body.userId).toBeDefined();
  });
});