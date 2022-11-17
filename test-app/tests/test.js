import { expect, test } from '@playwright/test'

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

test('As data URL', async ({ page }) => {
  await page.goto('/')
  const img = page.locator('#dataurl > img')
  expect(await img.getAttribute('src')).toMatchSnapshot('base64imageurl.txt')
})
