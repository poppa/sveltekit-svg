import { expect, test } from '@playwright/test'

const outerHtml = async (elem) => {
  if (!elem) {
    return undefined
  }

  return elem.evaluate((el) => el.outerHTML)
}

test('SVG as inline component', async ({ page }) => {
  await page.goto('/')
  const svg = page.locator('#inline-comp > svg')
  expect(await outerHtml(svg)).toMatchSnapshot('inline-comp.svg')
  await expect(svg).toHaveScreenshot()
})

test('SVG as inline string', async ({ page }) => {
  await page.goto('/')
  const svg = page.locator('#inline-string > svg')
  expect(await outerHtml(svg)).toMatchSnapshot('inline-string.svg')
  await expect(svg).toHaveScreenshot()
})

test('As URL in an image tag', async ({ page }) => {
  await page.goto('/')
  const img = page.locator('#image > img')
  await expect(img).toHaveAttribute(
    'src',
    expect.stringContaining('sample-logo')
  )
  await expect(img).toHaveAttribute('alt', 'Sample logo')
  await expect(img).toHaveScreenshot()
})

test('With component props', async ({ page }) => {
  await page.goto('/')
  const svg = page.locator('#with-props > svg')
  await expect(svg).toHaveAttribute('width', '200')
  await expect(svg).toHaveAttribute('aria-hidden', 'false')
  await expect(svg).toHaveScreenshot()
})

test('From another directory', async ({ page }) => {
  await page.goto('/')
  const svg = page.locator('#from-another-dir > svg')
  expect(await outerHtml(svg)).toMatchSnapshot('from-another-dir.svg')
  await expect(svg).toHaveScreenshot()
})

test('As data URL', async ({ page }) => {
  await page.goto('/')
  const img = page.locator('#dataurl > img')
  expect(await img.getAttribute('src')).toMatchSnapshot('base64imageurl.txt')
  await expect(img).toHaveScreenshot()
})

test('As data URL with explicit base64', async ({ page }) => {
  await page.goto('/dataurl')
  const img = page.locator('#b64e > img')
  expect(await img.getAttribute('src')).toMatchSnapshot('base64explicit.txt')
  await expect(img).toHaveScreenshot()
})

test('As data URL with explicit enc', async ({ page }) => {
  await page.goto('/dataurl')
  const img = page.locator('#enc > img')
  expect(await img.getAttribute('src')).toMatchSnapshot('enc.txt')
  await expect(img).toHaveScreenshot()
})

test('As data URL with explicit unenc', async ({ page }) => {
  await page.goto('/dataurl')
  const img = page.locator('#unenc > img')
  expect(await img.getAttribute('src')).toMatchSnapshot('unenc.txt')
  await expect(img).toHaveScreenshot()
})

test('Transform hook', async ({ page }) => {
  await page.goto('/hook')
  const svg = page.locator('svg > title')

  await expect(svg).toHaveText('Official SVG Logo')
})

test('Optimized URL import', async ({ page }) => {
  await page.goto('/imgurl')
  const samplelogo = await page.locator('img#samplelogo').getAttribute('src')
  const otherlogo = await page.locator('img#otherlogo').getAttribute('src')

  await page.goto(samplelogo)

  let data = await page.content()
  expect(data).toMatchSnapshot('samplelogoopturl.svg')

  await page.goto(otherlogo)
  data = await page.content()
  expect(data).toMatchSnapshot('otherlogoopturl.svg')
})
