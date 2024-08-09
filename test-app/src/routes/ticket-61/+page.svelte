<script lang="ts">
  import { page } from '$app/stores'
  import BeakerOff from '../../assets/icons/beaker-off.svg?component'
  import Beaker from '../../assets/icons/beaker.svg?component'
  import CapsuleOff from '../../assets/icons/capsule-off.svg?component'
  import Capsule from '../../assets/icons/capsule.svg?component'
  import EcgOff from '../../assets/icons/electrocardiogram-off.svg?component'
  import Ecg from '../../assets/icons/electrocardiogram.svg?component'
  import InfusionOff from '../../assets/icons/infusion-off.svg?component'
  import Infusion from '../../assets/icons/infusion.svg?component'

  const options = [
    {
      name: 'Beaker',
      href: '/',
      selected: Beaker,
      unSelected: BeakerOff,
    },
    {
      name: 'Capsule',
      href: '/capsule',
      selected: Capsule,
      unSelected: CapsuleOff,
    },
    {
      name: 'Ecg',
      href: '/ecg',
      selected: Ecg,
      unSelected: EcgOff,
    },
    {
      name: 'Infusion',
      href: '/infusion',
      selected: Infusion,
      unSelected: InfusionOff,
    },
  ]

  let path: string | undefined
  $: path = $page.url.searchParams.get('icon') ?? '/'
</script>

<nav class="t61">
  {#each options as option (option.href)}
    <a
      href="/ticket-61?icon={option.href}"
      class:selected={option.href === path}
    >
      {#if option.href === path}
        <svelte:component
          this={option.selected}
          name={option.name}
          aria-checked="true"
        />
        <span>{option.name}</span>
      {:else}
        <svelte:component this={option.unSelected} name={option.name} />
        <span>{option.name}</span>
      {/if}
    </a>
  {/each}
</nav>

<style>
  .t61 a {
    display: flex;
    align-items: center;
    gap: 1em;
    font-family: sans-serif;
    text-decoration: none;
    font-weight: bold;
    color: #555;
  }
  .t61 a.selected {
    color: #ce0202;
  }
  :global(.t61 a svg) {
    width: 64px;
    height: auto;
  }
</style>
