import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import rollupNative from 'rollup/dist/native.js'

const { xxhashBase64Url } = rollupNative

const outerHtml = async (elem) => {
  if (!elem) {
    return undefined
  }

  return elem.evaluate((el) => el.outerHTML)
}

const builtAssetPath = (assetUrl) => {
  const { pathname } = new URL(assetUrl, 'http://localhost:4177')
  const appPath = pathname.slice(pathname.indexOf('/_app/') + 1)

  return join(process.cwd(), '.svelte-kit/output/client', appPath)
}

const expectAssetHashMatchesContent = async (assetUrl) => {
  const file = builtAssetPath(assetUrl)
  const content = await readFile(file)
  const hash = xxhashBase64Url(content).slice(0, 8)

  expect(basename(file)).toContain(`.${hash}.`)
}

const cssUrl = (value) => {
  const match = /^url\("?(.+?)"?\)$/.exec(value)

  return match?.[1]
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
    expect.stringContaining('assets/sample-logo')
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

  await expectAssetHashMatchesContent(samplelogo)

  await page.goto(samplelogo)

  let data = await page.content()
  expect(data).toMatchSnapshot('samplelogoopturl.svg')

  await page.goto(otherlogo)
  data = await page.content()
  expect(data).toMatchSnapshot('otherlogoopturl.svg')
})

test('Optimized CSS URL import', async ({ page }) => {
  await page.goto('/cssurl')

  const backgroundImage = await page
    .locator('#css-url')
    .evaluate((el) => getComputedStyle(el).backgroundImage)
  const samplelogo = cssUrl(backgroundImage)

  expect(samplelogo).toBeTruthy()
  await expectAssetHashMatchesContent(samplelogo)
  await page.goto(samplelogo)

  const data = await page.content()
  expect(data).toMatchSnapshot('css-url-opt.svg')
})

test(`Issue #74: Multiple URL imports`, async ({ page }) => {
  await page.goto('/ticket-74')

  const wavUrl = await page.locator('span#wav').textContent()
  const svgUrl = await page.locator('span#svg').textContent()

  expect(wavUrl.endsWith('wav')).toEqual(true)
  expect(svgUrl.endsWith('svg')).toEqual(true)
})
