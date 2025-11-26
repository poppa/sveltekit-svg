/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testMatch: /tests\/.*.js$/,
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4177,
  },
}

export default config
