<script lang="ts">
  import LogoSvgComponent from '../assets/sample-logo.svg?component'
  import logoSvgString from '../assets/sample-logo.svg?src'
  import logoSvgUrl from '../assets/sample-logo.svg?url'
  import logoSvgDataUrl from '../assets/sample-logo.svg?dataurl'
  import LogoOtherSvgComponent from '../other/other-logo.svg?component'
</script>

<h2>As inline component</h2>
<div id="inline-comp">
  <LogoSvgComponent />
</div>

<h2>As inline string</h2>
<div id="inline-string">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html logoSvgString}
</div>

<h2>As URL in an image tag</h2>
<div id="image">
  <img src={logoSvgUrl} alt="Sample logo" />
</div>

<h2>With component props</h2>
<div id="with-props">
  <LogoSvgComponent width="200" aria-hidden="false" />
</div>

<h2>From another directory</h2>
<id id="from-another-dir">
  <LogoOtherSvgComponent width="200" />
</id>

<h2>Data-URL</h2>
<id id="dataurl">
  <img
    src={logoSvgDataUrl}
    alt="Sample logo as data URL"
    width="140"
    height="140"
  />
</id>
