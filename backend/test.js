// ─── TaskFlow – Full System Test Script (Milestone 32) ──────────────────────
// Run with: node test.js
// Make sure the backend server is running on port 8000 before running this.

const http = require('http');

const BASE = 'http://localhost:8000/api';
let adminToken  = '';
let leaderToken = '';
let memberToken = '';
let teamId      = '';
let taskId      = '';
let memberId    = '';

// ── helpers ───────────────────────────────────────────────────────────────────
function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data   = body ? JSON.stringify(body) : null;
    const url    = new URL(BASE + path);
    const opts   = {
      hostname: url.hostname,
      port:     url.port || 80,
      path:     url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data  ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` }         : {}),
      },
    };
    const req = http.request(opts, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

let passed = 0;
let failed = 0;

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅  PASS  ${label}`);
    passed++;
  } else {
    console.log(`  ❌  FAIL  ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

// ── test suites ───────────────────────────────────────────────────────────────
async function testAuth() {
  console.log('\n── Authentication ──────────────────────────────────────────');

  // 1. Register admin
  let r = await request('POST', '/auth/register', {
    name: 'Test Admin', email: 'testadmin@taskflow.test',
    password: 'admin123', role: 'admin'
  });
  check('Register admin user', r.status === 201 || r.status === 400);

  // 2. Register leader
  r = await request('POST', '/auth/register', {
    name: 'Test Leader', email: 'testleader@taskflow.test',
    password: 'leader123', role: 'teamleader'
  });
  check('Register team-leader user', r.status === 201 || r.status === 400);

  // 3. Register member
  r = await request('POST', '/auth/register', {
    name: 'Test Member', email: 'testmember@taskflow.test',
    password: 'member123', role: 'member'
  });
  check('Register member user', r.status === 201 || r.status === 400);

  // 4. Login admin
  r = await request('POST', '/auth/login', {
    email: 'testadmin@taskflow.test', password: 'admin123'
  });
  check('Login admin', r.status === 200 && r.body.token);
  adminToken = r.body.token || '';

  // 5. Login leader
  r = await request('POST', '/auth/login', {
    email: 'testleader@taskflow.test', password: 'leader123'
  });
  check('Login team-leader', r.status === 200 && r.body.token);
  leaderToken = r.body.token || '';

  // 6. Login member
  r = await request('POST', '/auth/login', {
    email: 'testmember@taskflow.test', password: 'member123'
  });
  check('Login member', r.status === 200 && r.body.token);
  memberToken = r.body.token || '';

  // 7. Reject bad login
  r = await request('POST', '/auth/login', {
    email: 'testadmin@taskflow.test', password: 'wrongpassword'
  });
  check('Reject incorrect password', r.status === 401);

  // 8. Reject missing fields
  r = await request('POST', '/auth/login', { email: 'notanemail' });
  check('Reject invalid login input', r.status === 400);

  // 9. Get users list (protected route)
  r = await request('GET', '/auth/users', null, adminToken);
  check('Fetch users list (protected)', r.status === 200 && Array.isArray(r.body));
  memberId = (r.body.find(u => u.email === 'testmember@taskflow.test') || {})._id || '';

  // 10. Block unauthenticated access
  r = await request('GET', '/auth/users', null, null);
  check('Block unauthenticated access to /users', r.status === 401);
}

async function testTeams() {
  console.log('\n── Team Management ─────────────────────────────────────────');

  // 1. Create team as leader
  let r = await request('POST', '/teams', { name: 'Test Squad', description: 'Testing' }, leaderToken);
  check('Team leader can create a team', r.status === 201 && r.body.team);
  teamId = (r.body.team || {})._id || '';

  // 2. Member cannot create team
  r = await request('POST', '/teams', { name: 'Bad Team' }, memberToken);
  check('Member cannot create a team (RBAC)', r.status === 403);

  // 3. Add member to team
  if (teamId && memberId) {
    r = await request('POST', `/teams/${teamId}/members`, { userId: memberId }, leaderToken);
    check('Team leader can add member', r.status === 200 || r.status === 201);
  } else {
    check('Add member (skipped – no teamId/memberId)', false, 'prerequisite missing');
  }

  // 4. Get team members
  if (teamId) {
    r = await request('GET', `/teams/${teamId}/members`, null, leaderToken);
    check('Fetch team members', r.status === 200);
  }

  // 5. Get teams for logged-in user
  r = await request('GET', '/teams', null, leaderToken);
  check('Leader can view their teams', r.status === 200);

  // 6. Reject team with short name
  r = await request('POST', '/teams', { name: 'X' }, leaderToken);
  check('Reject team name too short (validation)', r.status === 400);
}

async function testTasks() {
  console.log('\n── Task Workflows ──────────────────────────────────────────');

  // 1. Create task
  let r;
  if (teamId && memberId) {
    r = await request('POST', '/tasks', {
      title: 'Test Task One',
      description: 'A task for testing',
      priority: 'high',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      teamId,
      assignedTo: memberId
    }, leaderToken);
    check('Team leader can create a task', r.status === 201 && r.body.task);
    taskId = (r.body.task || {})._id || '';
  } else {
    check('Create task (skipped – no teamId)', false, 'prerequisite missing');
  }

  // 2. Member cannot create task
  r = await request('POST', '/tasks', { title: 'Bad Task', teamId, assignedTo: memberId }, memberToken);
  check('Member cannot create a task (RBAC)', r.status === 403);

  // 3. Get all tasks
  r = await request('GET', '/tasks', null, memberToken);
  check('Fetch task list (paginated)', r.status === 200);

  // 4. Update task status
  if (taskId) {
    r = await request('PATCH', `/tasks/${taskId}/status`, { status: 'inprogress' }, memberToken);
    check('Update task status to inprogress', r.status === 200);

    r = await request('PATCH', `/tasks/${taskId}/status`, { status: 'completed' }, memberToken);
    check('Update task status to completed', r.status === 200);
  }

  // 5. Search tasks
  r = await request('GET', '/tasks/search?keyword=Test', null, leaderToken);
  check('Search tasks by keyword', r.status === 200);

  // 6. Validation: task title too short
  r = await request('POST', '/tasks', {
    title: 'AB', teamId, assignedTo: memberId
  }, leaderToken);
  check('Reject task with short title (validation)', r.status === 400);
}

async function testComments() {
  console.log('\n── Comments & Collaboration ────────────────────────────────');

  if (!taskId) {
    console.log('  ⚠️  Skipped (no taskId available)');
    return;
  }

  // 1. Add comment
  let r = await request('POST', `/comments/${taskId}`, { text: 'Great progress on this task!' }, memberToken);
  check('Team member can add a comment', r.status === 201);

  // 2. Get comments
  r = await request('GET', `/comments/${taskId}`, null, memberToken);
  check('Fetch comments for a task', r.status === 200 && Array.isArray(r.body));

  // 3. Reject empty comment
  r = await request('POST', `/comments/${taskId}`, { text: '' }, memberToken);
  check('Reject empty comment (validation)', r.status === 400);

  // 4. Block unauthenticated comment
  r = await request('POST', `/comments/${taskId}`, { text: 'Hacked' }, null);
  check('Block unauthenticated comment', r.status === 401);
}

async function testDashboard() {
  console.log('\n── Dashboard & Activity ────────────────────────────────────');

  let r = await request('GET', '/dashboard', null, memberToken);
  check('Member can access dashboard stats', r.status === 200);

  r = await request('GET', '/dashboard', null, adminToken);
  check('Admin can access dashboard stats', r.status === 200);

  r = await request('GET', '/activity', null, memberToken);
  check('Fetch activity logs', r.status === 200);
}

async function testSecurity() {
  console.log('\n── Security & Injection Defense ────────────────────────────');

  // 1. NoSQL injection attempt in login body
  let r = await request('POST', '/auth/login', {
    email: { $gt: '' }, password: 'anything'
  });
  check('NoSQL injection in login blocked', r.status === 400 || r.status === 401);

  // 2. Oversized payload (simulate)
  const bigBody = { name: 'A'.repeat(12000), email: 'x@y.com', password: '123456' };
  r = await request('POST', '/auth/register', bigBody);
  check('Oversized payload rejected (10kb limit)', r.status === 400 || r.status === 413);

  // 3. Invalid role during registration
  r = await request('POST', '/auth/register', {
    name: 'Hacker', email: 'hack@test.com', password: 'pass123', role: 'superadmin'
  });
  check('Reject invalid role on register', r.status === 400);
}

// ── runner ────────────────────────────────────────────────────────────────────
(async () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('       TaskFlow – Full System Test (Milestone 32)      ');
  console.log('═══════════════════════════════════════════════════════');

  try {
    await testAuth();
    await testTeams();
    await testTasks();
    await testComments();
    await testDashboard();
    await testSecurity();
  } catch (err) {
    console.error('\n  💥 Test runner error:', err.message);
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  console.log('═══════════════════════════════════════════════════════\n');
  process.exit(failed > 0 ? 1 : 0);
})();
