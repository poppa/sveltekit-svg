<script lang="ts">
  import LogoSvgComponent from '../assets/sample-logo.svg'
  import logoSvgString from '../assets/sample-logo.svg?src'
  import logoSvgUrl from '../assets/sample-logo.svg?url'
  import LogoSvgFromStatic from '../../static/sample-logo.svg'
</script>

<h2>As inline component </h2>
<LogoSvgComponent />

<h2>As inline string</h2>
{@html logoSvgString}

<h2>As URL in an image tag</h2>
<img src={logoSvgUrl} alt="Sample logo"/>

<h2>As Inline component from static folder</h2>
<LogoSvgFromStatic />
