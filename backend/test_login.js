
async function testLogin() {
    console.log('Testing login endpoint...');
    try {
        const response = await fetch('http://localhost:4000/verify/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@test.com',
                password: 'password'
            })
        });

        console.log('Response Status:', response.status);
        const data = await response.json(); // Assuming JSON response
        console.log('Response Data:', data);

    } catch (error) {
        console.error('Fetch Error:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

testLogin();
