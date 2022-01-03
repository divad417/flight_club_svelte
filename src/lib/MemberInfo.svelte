<script lang="ts">
  import type { user } from '$lib/models';
  export let user: user;
</script>

<div class="row mx-3 mb-3 align-items-center" style="max-width: 600px">
  <div class="col-auto my-auto">
    <img class="rounded-circle" width="60" src={user.photoURL} alt="user" />
  </div>
  <div class="col-auto mb-0">
    <p class="mb-0">
      <strong>{user.full_name}</strong>
      <br />
      <a href={'mailto:' + user.email}>{user.email}</a>
    </p>
  </div>
</div>
<div class="row mx-2" style="max-width: 600px">
  <div class="col-sm">
    <p>
      <strong>Wins:</strong>
      {user.wins ? user.wins : ''}
    </p>
  </div>
  <div class="col-sm">
    <p>
      <strong>Avg Score:</strong>
      {user.avg_score ? user.avg_score.toFixed(1) : ''}
    </p>
  </div>
</div>
<div class="row mx-2 mb-2" style="max-width: 600px">
  <div class="col-sm">
    <p>
      <strong>Avg ABV:</strong>
      {user.avg_abv ? user.avg_abv.toFixed(1) : ''}
    </p>
  </div>
  <div class="col-sm">
    <p>
      <strong>Win Rate:</strong>
      {user.win_rate ? user.win_rate.toFixed(2) : ''}
    </p>
  </div>
</div>
