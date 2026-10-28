import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

test('Master Admin CMS API Integration Suite', async (t) => {
  await connectDB();

  await t.test('1. Public Health Check', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'healthy');
  });

  await t.test('2. Public Safe Settings returns without leaking secrets', async () => {
    const res = await request(app).get('/api/v1/public/settings');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.siteName);
    assert.equal(res.body.data.password, undefined);
    assert.equal(res.body.data.updatedBy, undefined);
  });

  await t.test('3. Protected endpoint fails without authentication', async () => {
    const res = await request(app).get('/api/v1/dashboard');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  let authCookie;

  await t.test('4. Login with invalid password fails safely', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@mastercms.com', password: 'WrongPassword!' });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'INVALID_CREDENTIALS');
  });

  await t.test('5. Login with valid credentials succeeds and returns session cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@mastercms.com', password: 'Admin@123456' });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.email, 'admin@mastercms.com');
    assert.ok(res.headers['set-cookie']);

    authCookie = res.headers['set-cookie'];
  });

  await t.test('6. Access authenticated /me endpoint using session cookie', async () => {
    const res = await request(app).get('/api/v1/auth/me').set('Cookie', authCookie);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.email, 'admin@mastercms.com');
  });

  await t.test('7. Access Dashboard Stats endpoint with real database data', async () => {
    const res = await request(app).get('/api/v1/dashboard').set('Cookie', authCookie);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.summary.pages.total >= 2);
    assert.ok(res.body.data.summary.services.total >= 3);
  });

  await t.test('8. Pages CRUD workflow', async () => {
    // List pages
    const listRes = await request(app).get('/api/v1/pages').set('Cookie', authCookie);
    assert.equal(listRes.status, 200);
    assert.ok(listRes.body.data.length >= 2);

    // Create a new test page
    const uniqueSlug = `test-page-${Date.now()}`;
    const createRes = await request(app)
      .post('/api/v1/pages')
      .set('Cookie', authCookie)
      .send({
        title: 'Automated Test Page',
        slug: uniqueSlug,
        excerpt: 'Created during test execution',
        status: 'draft',
      });
    assert.equal(createRes.status, 201);
    const newPageId = createRes.body.data._id;

    // Verify unique slug conflict error
    const duplicateRes = await request(app)
      .post('/api/v1/pages')
      .set('Cookie', authCookie)
      .send({
        title: 'Conflict Test',
        slug: uniqueSlug,
      });
    assert.equal(duplicateRes.status, 409);

    // Soft delete
    const deleteRes = await request(app)
      .delete(`/api/v1/pages/${newPageId}`)
      .set('Cookie', authCookie);
    assert.equal(deleteRes.status, 200);
  });

  await t.test('9. Public Contact Form Submission', async () => {
    const res = await request(app)
      .post('/api/v1/public/contact')
      .send({
        name: 'Jane Doe',
        email: 'jane@clientcorp.com',
        phone: '+1 555-0199',
        subject: 'Enterprise Inquiry',
        message: 'Looking for a presentation on your services.',
      });
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
  });

  await t.test('10. System Health Telemetry and Backup', async () => {
    const healthRes = await request(app).get('/api/v1/system/health').set('Cookie', authCookie);
    assert.equal(healthRes.status, 200);
    assert.equal(healthRes.body.success, true);
    assert.equal(healthRes.body.data.status, 'healthy');
    assert.ok(healthRes.body.data.database.collections.length > 0);

    const backupRes = await request(app).get('/api/v1/system/backup').set('Cookie', authCookie);
    assert.equal(backupRes.status, 200);
    assert.ok(backupRes.body.collections);
  });

  await t.test('11. Logout and verify session invalidation', async () => {
    const logoutRes = await request(app).post('/api/v1/auth/logout').set('Cookie', authCookie);
    assert.equal(logoutRes.status, 200);

    const postLogoutRes = await request(app).get('/api/v1/auth/me').set('Cookie', authCookie);
    assert.equal(postLogoutRes.status, 401);

    setTimeout(() => process.exit(0), 100);
  });
});


