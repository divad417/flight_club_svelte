<script  lang="ts">
  import { goto } from '$app/navigation';
  import { beerModel, beer } from '../models';
  import { getBeers, getSessionBeers, getUserBeers, getSessionId, getUserId } from '../firebase';
  export let filter: string = null;
  export let value: string = null;
  export let editBeer: boolean = false;
  export let sortKey = 'brewery';
  export let ascending = true;

  let beers: Promise<beer[]>;

  $: {
    if (filter == 'Session') {
      beers = getSessionBeers(sortKey, ascending, value);
    } else if (filter == 'Member') {
      beers = getUserBeers(sortKey, ascending, value);
    } else {
      beers = getBeers(sortKey, ascending);
    }
  }


  function onClickColumn(key: string) {
    if (key == sortKey) {
      ascending = !ascending;
    } else {
      sortKey = key;
    }
  }

  async function onClickBeer(beer: beer, key: string) {
    // A bit hacky but change click behavior for displaying beers on different pages
    if (editBeer) {
      goto(`/edit-beer/${beer.id}`);
    } else if (key == 'Session') {
      const id = await getSessionId(beer.session);
      goto(`/edit-session/${id}`);
    } else if (key == 'Member') {
      try {
        const id = await getUserId(beer.user);
        goto(`/member/${id}`);
      } catch (error) {
        console.log(error.message);
      }
    }
  }
</script>

<div class="table-div">
  <table>
    <thead>
      <tr>
        {#each beerModel.filter((key) => key.text != filter) as key}
          <th width={key.width} on:click={() => onClickColumn(key.key)}>
            {key.text}
            {#if key.key == sortKey}
              <span class="arrow">
                {#if ascending}
                  &#x25B2;
                {:else}
                  &#x25BC;
                {/if}
              </span>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#await beers}
        <p>Loading ...</p>
      {:then data}
        {#each data as beer}
          <tr>
            {#each beerModel.filter((key) => key.text != filter) as field}
              <td on:click={() => onClickBeer(beer, field.text)}>{field.show(beer)}</td>
            {/each}
          </tr>
        {/each}
      {/await}
    </tbody>
  </table>
</div>

<style>
  .arrow {
    color: #116466;
  }
  .table-div {
    overflow: auto;
  }
  table {
    width: 100%;
    overflow: auto;
    table-layout: fixed;
  }
  th {
    text-align: left;
  }
</style>
