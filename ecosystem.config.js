module.exports = {
  apps: [
    {
      name: 'woniu-tools',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: '/www/wwwroot/woniu-tools',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
