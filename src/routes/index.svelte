<script lang="ts">
  import ClubList from '$lib/ClubList.svelte';
  import JoinClub from '$lib/JoinClub.svelte';
</script>

<svelte:head>
  <title>Flight Club</title>
</svelte:head>

<h1>Welcome</h1>
<ClubList />
<JoinClub />

<style>
  h1 {
    text-align: center;
    margin: 80px auto;
  }
</style>
