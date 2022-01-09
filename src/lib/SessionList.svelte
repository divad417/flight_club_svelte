<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { Session, sessionView, sessionsToCsv } from '$lib/models';
  import type { Unsubscribe } from '@firebase/util';

  // Component props
  export let sortKey: string = 'number';
  export let ascending: boolean = false;

  let sessions: any[] = []; // All sessions
  let sessionList: Session[] = []; // Sorted list to display

  const onChange = (update: any[]) => {
    sessions = update;
  };
  let unsubscribe: Unsubscribe;

  onMount(async () => {
    // Using dynamic imports here because of https://github.com/sveltejs/kit/issues/1650
    const { watchSessions } = await import('$lib/firebase');

    // Get sessions from the database and watch for changes
    unsubscribe = watchSessions(onChange);
  });
  onDestroy(() => unsubscribe());

  // Handle user inputs to re-sort, triggers the reactive block below
  function onClickColumn(key: string) {
    if (key == sortKey) {
      ascending = !ascending;
    } else {
      sortKey = key;
    }
  }

  // Reactive block which re-runs when the sort type changes
  $: {
    function compare(a: Session, b: Session) {
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

  function onClickSession(session: Session) {
    // Go to a specific session page
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
<button type="button" class="btn btn-light mx-2" on:click={() => sessionsToCsv(sessions)}
  >Download as CSV</button
>

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
