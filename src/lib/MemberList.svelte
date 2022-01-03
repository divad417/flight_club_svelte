<script lang="ts">
  import { onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { collection, onSnapshot } from 'firebase/firestore';
  import { db } from '$lib/firebase';
  import { user, userView } from '$lib/models';

  // Component props
  export let sortKey: string = null;
  export let ascending: boolean = true;

  let members: any[] = [];
  let memberList: user[] = [];

  const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
    members = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  });
  onDestroy(unsubscribe);

  $: {
    function compare(a: user, b: user) {
      if (a[sortKey] > b[sortKey]) {
        return ascending ? 1 : -1;
      } else if (a[sortKey] < b[sortKey]) {
        return ascending ? -1 : 1;
      } else {
        return 0;
      }
    }
    memberList = members.sort(compare);
  }

  function onClickColumn(key: string) {
    if (key == sortKey) {
      ascending = !ascending;
    } else {
      sortKey = key;
    }
  }

  function onClickMember(user: user) {
    goto(`/member/${user.id}`);
  }
</script>

<div class="table-div">
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        {#each userView as field}
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
      {#each memberList as member}
        <tr>
          {#each userView as field}
            <td on:click={() => onClickMember(member)}>{field.show(member)}</td>
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
