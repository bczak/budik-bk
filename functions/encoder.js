const { spawn } = require('child_process');

const child = spawn('python3', ['./encoder.py']);


child.stdout.on('data', data => {
    console.log(`stdout:\n${data}`);
});

child.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
});


child.on('message', (error) => {
    console.log(`message: ${error.message}`);
});
child.on('error', (error) => {
    console.error(`error: ${error.message}`);
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});