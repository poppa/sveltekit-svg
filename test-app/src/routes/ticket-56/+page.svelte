<script lang="ts">
  import Sample from '../../assets/ticket-56.svg?component'
  import sampleRaw from '../../assets/ticket-56.svg?src'
  import sampleUrl from '../../assets/ticket-56.svg?url'
</script>

<div>
  <p>Sample Component</p>
  <Sample />
</div>

<div>
  <p>Sample Raw</p>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html sampleRaw}
</div>

<div>
  <p>Sample Img</p>
  <img src={sampleUrl} alt="" />
</div>
