<script lang="ts">
  import { goto } from '$app/navigation';
  import beers from '../stores';
  import { beer, beerModel } from '../models';
  import { getSessionId, getUserId } from '../firebase';
  export let filterKey: string = null;
  export let filterValue: string = null;
  export let editBeer: boolean = false;
  export let searchable: boolean = true;
  export let sortKey = 'brewery';
  export let ascending = true;

  let beerList: beer[] = [];
  let searchTerm: string = '';

  $: {
    let searchTermLower = searchTerm.toLowerCase();
    function search(beer: beer) {
      if (filterKey && beer[filterKey] != filterValue) {
        return false;
      }
      if (!searchable || !searchTerm) {
        return true;
      } else {
        return (
          (beer.name ? beer.name.toLowerCase().includes(searchTermLower) : false) ||
          (beer.brewery ? beer.brewery.toLowerCase().includes(searchTermLower) : false) ||
          (beer.type ? beer.type.toLowerCase().includes(searchTermLower) : false)
        );
      }
    }
    function compare(a: beer, b: beer) {
      if (a[sortKey] > b[sortKey]) {
        return ascending ? 1 : -1;
      } else if (a[sortKey] < b[sortKey]) {
        return ascending ? -1 : 1;
      } else {
        return 0;
      }
    }
    beerList = $beers.filter(search).sort(compare);
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

{#if searchable}
  <input type="search" placeholder="Search" bind:value={searchTerm} />
{/if}
<div class="table-div">
  <table>
    <thead>
      <tr>
        {#each beerModel.filter((field) => field.key != filterKey) as field}
          <th width={field.width} on:click={() => onClickColumn(field.key)}>
            {field.text}
            {#if field.key == sortKey}
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
      {#each beerList as beer}
        <tr>
          {#each beerModel.filter((field) => field.key != filterKey) as field}
            <td on:click={() => onClickBeer(beer, field.text)}>{field.show(beer)}</td>
          {/each}
        </tr>
      {/each}
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
