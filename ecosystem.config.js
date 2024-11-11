module.exports = {
    apps: [
      {
        name: 'Altirev',
        script: 'dist/main.js',
        // or use ts-node directly
        // script: 'ts-node',
        // args: '-r tsconfig-paths/register src/main.ts',
      },
    ],
  };
  