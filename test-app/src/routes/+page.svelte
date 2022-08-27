<script lang="ts">
  import LogoSvgComponent from '../assets/sample-logo.svg?component'
  import logoSvgString from '../assets/sample-logo.svg?src'
  import logoSvgUrl from '../assets/sample-logo.svg?url'
  import LogoOtherSvgComponent from '../other/other-logo.svg?component'
  import LogoSvgFromStatic from '../../static/static-sample-logo.svg'
</script>

<h2>As inline component</h2>
<LogoSvgComponent />

<h2>As inline string</h2>
{@html logoSvgString}

<h2>As URL in an image tag</h2>
<img src={logoSvgUrl} alt="Sample logo" />

<h2>As Inline component from static folder</h2>
<LogoSvgFromStatic />

<h2>With component props</h2>
<LogoSvgComponent width="200" aria-hidden="false" />

<h2>From another directory</h2>
<LogoOtherSvgComponent width="200" />
