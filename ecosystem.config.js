module.exports = {
  apps: [{
    name: 'qube.brave',
    script: 'npm',
    args: 'start',
    cwd: './qube.brave',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}