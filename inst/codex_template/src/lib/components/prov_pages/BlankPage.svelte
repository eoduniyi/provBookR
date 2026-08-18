<script lang="ts">
  import TypeComposer from '../TypeComposer.svelte';

  let { pageKey = 'blank-page' } = $props<{ pageKey?: string }>();
</script>

<div class="blank-page">
  <TypeComposer {pageKey} />
</div>

<style>
  .blank-page {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 400px;
  }
</style>
