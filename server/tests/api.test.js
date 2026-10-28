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

  let testVacancySlug = `test-role-${Date.now()}`;
  let testVacancyId;
  let testApplicationId;
  let testAlbumSlug = `test-album-${Date.now()}`;
  let testAlbumId;
  let testImageId;

  await t.test('11. Careers Vacancy CRUD & Validation', async () => {
    // 1. Create a vacancy
    const createRes = await request(app)
      .post('/api/v1/careers')
      .set('Cookie', authCookie)
      .send({
        title: 'Lead Platform Engineer',
        slug: testVacancySlug,
        department: 'Infrastructure',
        employmentType: 'full-time',
        workMode: 'remote',
        openings: 2,
        shortDescription: 'Maintain distributed systems and cloud infrastructure.',
        description: 'Complete job description for lead platform engineer position.',
        responsibilities: ['Ensure 99.99% uptime', 'Automate CI/CD pipelines'],
        requirements: ['Docker', 'Kubernetes', 'Node.js'],
        status: 'published',
      });

    assert.equal(createRes.status, 201);
    assert.equal(createRes.body.success, true);
    assert.equal(createRes.body.data.slug, testVacancySlug);
    testVacancyId = createRes.body.data._id;

    // 2. Reject duplicate slug
    const dupRes = await request(app)
      .post('/api/v1/careers')
      .set('Cookie', authCookie)
      .send({
        title: 'Another Engineer',
        slug: testVacancySlug,
        shortDescription: 'Conflict test',
        description: 'Conflict description',
      });
    assert.equal(dupRes.status, 409);
    assert.equal(dupRes.body.error.code, 'DUPLICATE_SLUG');

    // 3. Update vacancy status
    const statusRes = await request(app)
      .patch(`/api/v1/careers/${testVacancyId}/status`)
      .set('Cookie', authCookie)
      .send({ status: 'draft' });
    assert.equal(statusRes.status, 200);
    assert.equal(statusRes.body.data.status, 'draft');

    // Restore to published
    await request(app)
      .patch(`/api/v1/careers/${testVacancyId}/status`)
      .set('Cookie', authCookie)
      .send({ status: 'published' });
  });

  await t.test('12. Public Careers Endpoints & Draft Exclusion', async () => {
    // 1. Create a draft vacancy
    const draftSlug = `draft-role-${Date.now()}`;
    const draftCreate = await request(app)
      .post('/api/v1/careers')
      .set('Cookie', authCookie)
      .send({
        title: 'Secret Upcoming Role',
        slug: draftSlug,
        shortDescription: 'Draft only',
        description: 'Should not appear publicly',
        status: 'draft',
      });
    assert.equal(draftCreate.status, 201);

    // 2. Public careers list should contain published role but NOT draft role
    const pubListRes = await request(app).get('/api/v1/public/careers');
    assert.equal(pubListRes.status, 200);
    assert.equal(pubListRes.body.success, true);
    assert.ok(Array.isArray(pubListRes.body.data));
    const slugs = pubListRes.body.data.map((v) => v.slug);
    assert.ok(slugs.includes(testVacancySlug));
    assert.ok(!slugs.includes(draftSlug));

    // 3. Public get by slug returns published vacancy
    const pubDetailRes = await request(app).get(`/api/v1/public/careers/${testVacancySlug}`);
    assert.equal(pubDetailRes.status, 200);
    assert.equal(pubDetailRes.body.data.title, 'Lead Platform Engineer');
    // Ensure internal fields are not leaked
    assert.equal(pubDetailRes.body.data.createdBy, undefined);

    // 4. Public get draft vacancy returns 404
    const pubDraftRes = await request(app).get(`/api/v1/public/careers/${draftSlug}`);
    assert.equal(pubDraftRes.status, 404);
  });

  await t.test('13. Public Job Application Submission with CV Document', async () => {
    // 1. Submit application without file should fail
    const noFileRes = await request(app)
      .post(`/api/v1/public/careers/${testVacancySlug}/applications`)
      .field('name', 'Alex Hunter')
      .field('email', 'alex.hunter@example.com')
      .field('phone', '+1 (555) 321-7654')
      .field('education', 'B.S. in Computer Engineering')
      .field('privacyConsent', 'true');
    assert.equal(noFileRes.status, 400);

    // 2. Submit valid application with simulated CV buffer
    const validRes = await request(app)
      .post(`/api/v1/public/careers/${testVacancySlug}/applications`)
      .field('name', 'Alex Hunter')
      .field('email', 'alex.hunter@example.com')
      .field('phone', '+1 (555) 321-7654')
      .field('education', 'B.S. in Computer Engineering')
      .field('currentOrganization', 'Global Net')
      .field('experienceYears', '4 years')
      .field('coverLetter', 'Excited to apply for this lead engineer position.')
      .field('privacyConsent', 'true')
      .attach('resume', Buffer.from('%PDF-1.4 Mock resume content for testing purposes'), 'alex_hunter_resume.pdf');

    assert.equal(validRes.status, 201);
    assert.equal(validRes.body.success, true);
    assert.ok(validRes.body.data.applicationRef.startsWith('APP-'));

    // 3. Duplicate submission within 24 hours should be rejected
    const dupRes = await request(app)
      .post(`/api/v1/public/careers/${testVacancySlug}/applications`)
      .field('name', 'Alex Hunter')
      .field('email', 'alex.hunter@example.com')
      .field('phone', '+1 (555) 321-7654')
      .field('education', 'B.S. in Computer Engineering')
      .field('privacyConsent', 'true')
      .attach('resume', Buffer.from('%PDF-1.4 duplicate test'), 'resume.pdf');
    assert.equal(dupRes.status, 409);
    assert.equal(dupRes.body.error.code, 'DUPLICATE_APPLICATION');
  });

  await t.test('14. Admin Job Application Management, Recruiter Notes, & Status Transitions', async () => {
    // 1. List applications (authenticated)
    const listRes = await request(app).get('/api/v1/job-applications').set('Cookie', authCookie);
    assert.equal(listRes.status, 200);
    assert.ok(listRes.body.data.length >= 1);

    const appRecord = listRes.body.data.find((a) => a.candidate?.email === 'alex.hunter@example.com');
    assert.ok(appRecord);
    testApplicationId = appRecord._id;

    // 2. Get full application details
    const detailRes = await request(app)
      .get(`/api/v1/job-applications/${testApplicationId}`)
      .set('Cookie', authCookie);
    assert.equal(detailRes.status, 200);
    assert.equal(detailRes.body.data.candidate.name, 'Alex Hunter');

    // 3. Add recruiter note
    const noteRes = await request(app)
      .patch(`/api/v1/job-applications/${testApplicationId}/notes`)
      .set('Cookie', authCookie)
      .send({ text: 'Candidate has strong background in distributed systems.' });
    assert.equal(noteRes.status, 200);
    assert.ok(noteRes.body.data.notes.length >= 1);

    // 4. Update status with transition history
    const statusRes = await request(app)
      .patch(`/api/v1/job-applications/${testApplicationId}/status`)
      .set('Cookie', authCookie)
      .send({ status: 'shortlisted', note: 'Advancing to technical phone interview' });
    assert.equal(statusRes.status, 200);
    assert.equal(statusRes.body.data.status, 'shortlisted');
    assert.ok(statusRes.body.data.statusHistory.length >= 2);
  });

  await t.test('15. Secure Authorized CV Download & Access Control', async () => {
    // 1. Unauthenticated download fails
    const unauthRes = await request(app).get(`/api/v1/job-applications/${testApplicationId}/cv`);
    assert.equal(unauthRes.status, 401);

    // 2. Authenticated authorized download succeeds
    const authDownloadRes = await request(app)
      .get(`/api/v1/job-applications/${testApplicationId}/cv`)
      .set('Cookie', authCookie);
    assert.equal(authDownloadRes.status, 200);
    assert.ok(authDownloadRes.headers['content-disposition'].includes('attachment'));
  });

  await t.test('16. Organization Gallery Album & Image Operations', async () => {
    // 1. Create album
    const createAlbumRes = await request(app)
      .post('/api/v1/gallery/albums')
      .set('Cookie', authCookie)
      .send({
        title: 'Automated Test Album',
        slug: testAlbumSlug,
        description: 'Album for integration testing',
        category: 'Technology',
        status: 'published',
      });
    assert.equal(createAlbumRes.status, 201);
    assert.equal(createAlbumRes.body.data.slug, testAlbumSlug);
    testAlbumId = createAlbumRes.body.data._id;

    // 2. Reject duplicate album slug
    const dupAlbumRes = await request(app)
      .post('/api/v1/gallery/albums')
      .set('Cookie', authCookie)
      .send({
        title: 'Conflicting Album',
        slug: testAlbumSlug,
      });
    assert.equal(dupAlbumRes.status, 409);

    // 3. Upload gallery images into album
    const uploadRes = await request(app)
      .post('/api/v1/gallery/images/upload')
      .set('Cookie', authCookie)
      .field('albumId', testAlbumId)
      .field('category', 'Technology')
      .attach('images', Buffer.from('fake image content 1'), 'photo1.jpg')
      .attach('images', Buffer.from('fake image content 2'), 'photo2.jpg');

    assert.equal(uploadRes.status, 201);
    assert.equal(uploadRes.body.data.length, 2);
    testImageId = uploadRes.body.data[0]._id;

    // 4. Update image metadata
    const updateImgRes = await request(app)
      .put(`/api/v1/gallery/images/${testImageId}`)
      .set('Cookie', authCookie)
      .send({
        title: 'Updated Photo Title',
        altText: 'Updated alt text description',
        caption: 'Engineering team at work',
        displayOrder: 1,
      });
    assert.equal(updateImgRes.status, 200);
    assert.equal(updateImgRes.body.data.title, 'Updated Photo Title');

    // 5. Reorder images batch
    const reorderRes = await request(app)
      .patch('/api/v1/gallery/images/reorder')
      .set('Cookie', authCookie)
      .send({
        items: [{ id: testImageId, displayOrder: 5 }],
      });
    assert.equal(reorderRes.status, 200);
  });

  await t.test('17. Public Gallery Endpoints & Ordering', async () => {
    // 1. Public albums listing
    const pubAlbumsRes = await request(app).get('/api/v1/public/gallery');
    assert.equal(pubAlbumsRes.status, 200);
    assert.ok(Array.isArray(pubAlbumsRes.body.data));
    const albumSlugs = pubAlbumsRes.body.data.map((a) => a.slug);
    assert.ok(albumSlugs.includes(testAlbumSlug));

    // 2. Public album by slug includes associated images
    const pubAlbumDetailRes = await request(app).get(`/api/v1/public/gallery/${testAlbumSlug}`);
    assert.equal(pubAlbumDetailRes.status, 200);
    assert.equal(pubAlbumDetailRes.body.data.title, 'Automated Test Album');
    assert.ok(pubAlbumDetailRes.body.data.images.length >= 2);
  });

  await t.test('18. Logout and verify session invalidation', async () => {
    const logoutRes = await request(app).post('/api/v1/auth/logout').set('Cookie', authCookie);
    assert.equal(logoutRes.status, 200);

    const postLogoutRes = await request(app).get('/api/v1/auth/me').set('Cookie', authCookie);
    assert.equal(postLogoutRes.status, 401);

    setTimeout(() => process.exit(0), 100);
  });
});


