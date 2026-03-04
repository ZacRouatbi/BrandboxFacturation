import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  DocumentType,
  Currency,
  FactureStatus,
  TierRole,
} from '@prisma/client';


describe('Full Billing System (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let tierId: string;
  let documentId: string;
  let designationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    
    await prisma.$disconnect();
    await app.close();
  });

  it('1️⃣ Create Tier', async () => {
    const res = await request(app.getHttpServer())
      .post('/tier')
      .send({
        name: 'Test Client',
        email: 'client@test.com',
        phone: '123456',
        address: 'Test Address',
        role: TierRole.CLIENT,
      })
      .expect(201);

    tierId = res.body.id;
    expect(tierId).toBeDefined();
  });

  it('2️⃣ Find One Tier', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tier/${tierId}`)
      .expect(200);

    expect(res.body.id).toBe(tierId);
  });

  it('3️⃣ Find All Tiers', async () => {
    const res = await request(app.getHttpServer())
      .get('/tier')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('4️⃣ Update Tier', async () => {
    await request(app.getHttpServer())
      .patch(`/tier/${tierId}`)
      .send({
        phone: '999999',
      })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get(`/tier/${tierId}`)
      .expect(200);

    expect(res.body.phone).toBe('999999');
  });

 

  it('5️⃣ Create Document', async () => {
    const res = await request(app.getHttpServer())
      .post('/document')
      .send({
        type: DocumentType.FACTURE,
        tierId: tierId,
        currency: Currency.TND,
        tva: 19,
      })
      .expect(201);

    documentId = res.body.id;
    expect(res.body.totalHT).toBe('0');
    expect(res.body.totalTTC).toBe('0');
  });

  it('6️⃣ Find One Document', async () => {
    const res = await request(app.getHttpServer())
      .get(`/document/${documentId}`)
      .expect(200);

    expect(res.body.id).toBe(documentId);
  });

  it('7️⃣ Find All Documents', async () => {
    const res = await request(app.getHttpServer())
      .get('/document')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('8️⃣ Update Document (currency + status)', async () => {
    await request(app.getHttpServer())
      .patch(`/document/${documentId}`)
      .send({
        currency: Currency.USD,
        factureStatus: FactureStatus.PAID,
      })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get(`/document/${documentId}`)
      .expect(200);

    expect(res.body.currency).toBe(Currency.USD);
    expect(res.body.factureStatus).toBe(FactureStatus.PAID);
  });



  it('9️⃣ Add Designation', async () => {
    const res = await request(app.getHttpServer())
      .post('/designation')
      .send({
        description: 'Website Development',
        quantity: 2,
        unitPrice: 100,
        documentId: documentId,
      })
      .expect(201);

    designationId = res.body.id;
  });

  it('🔟 Check Totals After Add', async () => {
    const res = await request(app.getHttpServer())
      .get(`/document/${documentId}`)
      .expect(200);

    // 2 * 100 = 200
    // TVA 19% = 38
    // TTC = 238

    expect(res.body.totalHT).toBe('200');
    expect(res.body.totalTTC).toBe('238');
  });

  it('1️⃣1️⃣ Update Designation', async () => {
    await request(app.getHttpServer())
      .patch(`/designation/${designationId}`)
      .send({ quantity: 3 })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get(`/document/${documentId}`)
      .expect(200);

  

    expect(res.body.totalHT).toBe('300');
    expect(res.body.totalTTC).toBe('357');
  });

  it('1️⃣2️⃣ Delete Designation', async () => {
    await request(app.getHttpServer())
      .delete(`/designation/${designationId}`)
      .expect(200);

    const res = await request(app.getHttpServer())
      .get(`/document/${documentId}`)
      .expect(200);

    expect(res.body.totalHT).toBe('0');
    expect(res.body.totalTTC).toBe('0');
  });

 

  it('1️⃣3️⃣ Delete Document', async () => {
    await request(app.getHttpServer())
      .delete(`/document/${documentId}`)
      .expect(200);
  });

  it('1️⃣4️⃣ Delete Tier', async () => {
    await request(app.getHttpServer())
      .delete(`/tier/${tierId}`)
      .expect(200);
  });


let userId: string;

it('🟢 Create User', async () => {
  const res = await request(app.getHttpServer())
    .post('/user')
    .send({
      username: 'admin',
      password: 'password123',
    })
    .expect(201);

  expect(res.body.id).toBeDefined();
  expect(res.body.username).toBe('admin');

  userId = res.body.id;
});

it('🟡 Prevent Duplicate Username', async () => {
  await request(app.getHttpServer())
    .post('/user')
    .send({
      username: 'admin',
      password: 'anotherpass',
    })
    .expect(409); // ConflictException
});

it('🟢 Find One User', async () => {
  const res = await request(app.getHttpServer())
    .get(`/user/${userId}`)
    .expect(200);

  expect(res.body.id).toBe(userId);
  expect(res.body.username).toBe('admin');
});

it('🟢 Find All Users', async () => {
  const res = await request(app.getHttpServer())
    .get('/user')
    .expect(200);

  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
});

it('🟢 Update User', async () => {
  const res = await request(app.getHttpServer())
    .patch(`/user/${userId}`)
    .send({
      username: 'adminUpdated',
    })
    .expect(200);

  expect(res.body.username).toBe('adminUpdated');
});

it('🟢 Delete User', async () => {
  await request(app.getHttpServer())
    .delete(`/user/${userId}`)
    .expect(200);
});

it('🔴 Deleted User Should Not Exist', async () => {
  await request(app.getHttpServer())
    .get(`/user/${userId}`)
    .expect(404);
});
});