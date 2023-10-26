module.exports = {
  apps: [
    {
      name: 'webhook',
      script: './bin',
      instances: 3,
      exec_mode: 'cluster',
      merge_logs: true,
      autorestart: true,
      watch: false,
      listen_timeout: 50000,
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
