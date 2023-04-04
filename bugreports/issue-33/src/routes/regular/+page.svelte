<script lang="ts">
import SvgComp from '$lib/assets/test1.svg?component';
import Btn_NEXT from '$lib/assets/btn_NEXT.svg?component';
</script>

<h1 class="text-4xl text-red-600">Issue 33</h1>
<p>
	Visit at <a href="https://github.com/poppa/sveltekit-svg/issues/33">poppa/sveltekit-svg</a>
</p>
<Btn_NEXT class="w-16 " fill="black" />
<SvgComp class="issue-33" />

<style>
:global(.issue-33) {
	background: radial-gradient(circle, rgba(241, 244, 190, 1) 0%, rgba(112, 121, 9, 1) 100%);
}
</style>
