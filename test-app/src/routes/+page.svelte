<script lang="ts">
  import LogoSvgComponent from '../assets/sample-logo.svg?component'
  import logoSvgString from '../assets/sample-logo.svg?src'
  import logoSvgUrl from '../assets/sample-logo.svg?url'
  import LogoOtherSvgComponent from '../other/other-logo.svg?component'
  import LogoSvgFromStatic from '../../static/static-sample-logo.svg'
</script>

<h2>As inline component</h2>
<div id="inline-comp">
  <LogoSvgComponent />
</div>

<h2>As inline string</h2>
<div id="inline-string">
  {@html logoSvgString}
</div>

<h2>As URL in an image tag</h2>
<div id="image">
  <img src={logoSvgUrl} alt="Sample logo" />
</div>

<h2>As Inline component from static folder</h2>
<div id="inline-from-static-folder">
  <LogoSvgFromStatic />
</div>

<h2>With component props</h2>
<div id="with-props">
  <LogoSvgComponent width="200" aria-hidden="false" />
</div>

<h2>From another directory</h2>
<id id="from-another-dir">
  <LogoOtherSvgComponent width="200" />
</id>
