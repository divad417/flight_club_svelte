<script lang="ts">
  import BeerList from '../components/beer_list.svelte';
</script>

<h1>Beers!</h1>
<BeerList sortKey={'brewery'} editBeer={false} />
