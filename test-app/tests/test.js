import { expect, test } from '@playwright/test'

const svg1 =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 455 455" style="enable-background:new 0 0 455 455" xml:space="preserve"><path style="fill-rule:evenodd;clip-rule:evenodd" d="M267.43 215.626c-23.788 0-36.118 21.299-36.118 47.854 0 28.53 14.03 46.431 35.802 46.431 15.135 0 27.187-10.313 30.269-25.132 1.069-3.714 1.385-7.588 1.385-12.052v-21.931c0-2.766-.316-6.64-.791-9.406-3.083-14.028-14.344-25.764-30.547-25.764z"></path><path style="fill-rule:evenodd;clip-rule:evenodd" d="M0 0v455h455V0H0zm155.167 347.727h-52.634V115.729h52.634v231.998zm150.831 0-2.293-24.695h-.789c-10.629 18.849-31.022 28.569-52.637 28.569-39.989 0-71.917-34.102-71.917-86.42-.475-56.826 35.05-89.546 75.318-89.546 20.706 0 36.906 7.272 44.456 18.969h.632v-91.205h52.319v194.026c0 18.967.791 39.041 1.382 50.302h-46.471z"></path></svg>'

const img0 = '<img src="/src/assets/sample-logo.svg" alt="Sample logo">'

const svg2 =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 455 455" style="enable-background:new 0 0 455 455" xml:space="preserve"><path style="fill-rule:evenodd;clip-rule:evenodd" d="M267.43 215.626c-23.788 0-36.118 21.299-36.118 47.854 0 28.53 14.03 46.431 35.802 46.431 15.135 0 27.187-10.313 30.269-25.132 1.069-3.714 1.385-7.588 1.385-12.052v-21.931c0-2.766-.316-6.64-.791-9.406-3.083-14.028-14.344-25.764-30.547-25.764z"></path><path style="fill-rule:evenodd;clip-rule:evenodd" d="M0 0v455h455V0H0zm155.167 347.727h-52.634V115.729h52.634v231.998zm150.831 0-2.293-24.695h-.789c-10.629 18.849-31.022 28.569-52.637 28.569-39.989 0-71.917-34.102-71.917-86.42-.475-56.826 35.05-89.546 75.318-89.546 20.706 0 36.906 7.272 44.456 18.969h.632v-91.205h52.319v194.026c0 18.967.791 39.041 1.382 50.302h-46.471z"></path></svg>'

const svg4 =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 455 455" style="enable-background:new 0 0 455 455" xml:space="preserve" width="200"><path fill="#00f" style="fill-rule:evenodd;clip-rule:evenodd" d="M267.43 215.626c-23.788 0-36.118 21.299-36.118 47.854 0 28.53 14.03 46.431 35.802 46.431 15.135 0 27.187-10.313 30.269-25.132 1.069-3.714 1.385-7.588 1.385-12.052v-21.931c0-2.766-.316-6.64-.791-9.406-3.083-14.028-14.344-25.764-30.547-25.764z"></path><path style="fill-rule:evenodd;clip-rule:evenodd" d="M0 0v455h455V0H0zm155.167 347.727h-52.634V115.729h52.634v231.998zm150.831 0-2.293-24.695h-.789c-10.629 18.849-31.022 28.569-52.637 28.569-39.989 0-71.917-34.102-71.917-86.42-.475-56.826 35.05-89.546 75.318-89.546 20.706 0 36.906 7.272 44.456 18.969h.632v-91.205h52.319v194.026c0 18.967.791 39.041 1.382 50.302h-46.471z"></path></svg>'

const outerHtml = async (elem) => {
  if (!elem) {
    return undefined
  }

  return await elem.evaluate((el) => el.outerHTML)
}

test('SVG as inline component', async ({ page }) => {
  await page.goto('/')
  const svg = page.locator('#inline-comp > svg')
  expect(await outerHtml(svg)).toMatchSnapshot('inline-comp.svg')
})

test('SVG as inline string', async ({ page }) => {
  await page.goto('/')
  const svg = page.locator('#inline-string > svg')
  expect(await outerHtml(svg)).toMatchSnapshot('inline-string.svg')
})

test('As Inline component from static folder', async ({ page }) => {
  await page.goto('/')
  const svg = page.locator('#inline-from-static-folder > svg')
  expect(await outerHtml(svg)).toMatchSnapshot('inline-from-static-folder.svg')
})

test('As URL in an image tag', async ({ page }) => {
  await page.goto('/')
  const img = page.locator('#image > img')
  expect((await img.getAttribute('src')).includes('sample-logo')).toEqual(true)
  expect(await img.getAttribute('alt')).toEqual('Sample logo')
})

test('With component props', async ({ page }) => {
  await page.goto('/')
  const svg = page.locator('#with-props > svg')
  expect(await svg.getAttribute('width')).toEqual('200')
  expect(await svg.getAttribute('aria-hidden')).toEqual('false')
})

test('From another directory', async ({ page }) => {
  await page.goto('/')
  const svg = page.locator('#from-another-dir > svg')
  expect(await outerHtml(svg)).toMatchSnapshot('from-another-dir.svg')
})
