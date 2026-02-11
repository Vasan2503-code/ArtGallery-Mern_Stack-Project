
const timestamp = Date.now();
const email = `test${timestamp}@test.com`;
const password = 'password123';

async function testAuthFlow() {
    console.log(`Testing full auth flow with ${email}...`);

    try {
        // 1. Register
        console.log('1. Registering...');
        const regRes = await fetch('http://localhost:4000/verify/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email, password, role: 'customer' }) // VALID ROLE
        });

        if (!regRes.ok) {
            throw new Error(`Register failed: ${regRes.status} ${await regRes.text()}`);
        }
        console.log('Register success:', await regRes.json());

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await fetch('http://localhost:4000/verify/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
        }
        console.log('Login success:', await loginRes.json());

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

testAuthFlow();
