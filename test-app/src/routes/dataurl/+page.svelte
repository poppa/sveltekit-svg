<script lang="ts">
  import b64explicit from '../../assets/sample-logo.svg?dataurl=base64'
  import enc from '../../assets/sample-logo.svg?dataurl=enc'
  import unenc from '../../assets/sample-logo.svg?dataurl=unenc'
</script>

<h2>Base 64 (Explicit)</h2>
<div id="b64e"><img src={b64explicit} alt="b64explicit" /></div>

<h2>Base 64 (Enc)</h2>
<div id="enc"><img src={enc} alt="Enc" /></div>

<h2>Base 64 (UnEnc)</h2>
<div id="unenc"><img src={unenc} alt="UnEnc" /></div>

<style>
  img {
    width: 128px;
  }
</style>
