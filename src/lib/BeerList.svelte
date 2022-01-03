<script lang="ts">
  import { onDestroy, createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { collection, onSnapshot } from 'firebase/firestore';
  import { db, getSessionId, getUserId } from '$lib/firebase';
  import { beer, beerView } from '$lib/models';

  const dispatch = createEventDispatcher();

  // Component props
  export let filterKey: string = null;
  export let filterValue: string | number = null;
  export let editable: boolean = false;
  export let searchable: boolean = true;
  export let sortKey: string = 'brewery';
  export let ascending: boolean = true;

  let beers: any[] = [];
  let beerList: beer[] = [];
  let searchTerm: string = '';

  // Get the beer data and watch for chanes
  const unsubscribe = onSnapshot(collection(db, 'beers'), (snapshot) => {
    beers = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  });
  onDestroy(unsubscribe);

  // Reactive block which re-runs when the search term or sort type changes
  $: {
    const searchTermLower = searchTerm.toLowerCase();

    // Update the search function
    function search(beer: beer): boolean {
      if (filterKey && beer[filterKey] != filterValue) {
        // Exclude beers by filter keys for individual session or member pages
        return false;
      }
      if (!searchable || !searchTerm) {
        return true;
      } else {
        return (
          // The search box only considers these fields
          (beer.name ? beer.name.toLowerCase().includes(searchTermLower) : false) ||
          (beer.brewery ? beer.brewery.toLowerCase().includes(searchTermLower) : false) ||
          (beer.type ? beer.type.toLowerCase().includes(searchTermLower) : false) ||
          (beer.user ? beer.user.toLowerCase().includes(searchTermLower) : false)
        );
      }
    }

    // Update the sorting function
    function compare(a: beer, b: beer) {
      if (a[sortKey] > b[sortKey]) {
        return ascending ? 1 : -1;
      } else if (a[sortKey] < b[sortKey]) {
        return ascending ? -1 : 1;
      } else {
        return 0;
      }
    }

    // Filter and sort the list for rendering
    beerList = beers.filter(search).sort(compare);
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
    if (editable) {
      // Dispatch click events to parent to handle more complex actions (ie. editing)
      dispatch('beerClick', beer);
    } else if (key == 'Session') {
      const id = await getSessionId(beer.session);
      goto(`/session/${id}`);
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
  <div class="w-auto mx-2">
    <input type="search" class="form-control" placeholder="Search" bind:value={searchTerm} />
    <div class="form-text text-end">Edit beers from the session page</div>
  </div>
{/if}
<div class="table-div">
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        {#each beerView.filter((field) => field.key != filterKey) as field}
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
          {#each beerView.filter((field) => field.key != filterKey) as field}
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
