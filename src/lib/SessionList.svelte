<script lang="ts">
  import { onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { collection, onSnapshot } from 'firebase/firestore';
  import { db } from '$lib/firebase';
  import { session, sessionView } from '$lib/models';

  // Component props
  export let sortKey: string = 'number';
  export let ascending: boolean = false;

  let sessions: any[] = [];  // All sessions
  let sessionList: session[] = [];  // Sorted list to display

  const unsubscribe = onSnapshot(collection(db, 'sessions'), (snapshot) => {
    sessions = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  });
  onDestroy(unsubscribe);

  // Reactive block to handle re-sorting the list
  $: {
    function compare(a: session, b: session) {
      if (a[sortKey] > b[sortKey]) {
        return ascending ? 1 : -1;
      } else if (a[sortKey] < b[sortKey]) {
        return ascending ? -1 : 1;
      } else {
        return 0;
      }
    }
    sessionList = sessions.sort(compare);
  }

  function onClickColumn(key: string) {
    if (key == sortKey) {
      ascending = !ascending;
    } else {
      sortKey = key;
    }
  }

  function onClickSession(session: session) {
    goto(`/session/${session.id}`);
  }
</script>

<div class="table-div">
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        {#each sessionView as field}
          <th width={field.width} on:click={() => onClickColumn(field.key)} class="text-start">
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
      {#each sessionList as session}
        <tr>
          {#each sessionView as field}
            <td on:click={() => onClickSession(session)}>{field.show(session)}</td>
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
</style>
