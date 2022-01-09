<script lang="ts">
  import type { Member } from '$lib/models';
  export let member: Member;
</script>

<div class="row mx-3 mb-3 align-items-center" style="max-width: 600px">
  <div class="col-auto my-auto">
    <img class="rounded-circle" width="60" src={member.photoURL} alt="member" />
  </div>
  <div class="col-auto mb-0">
    <p class="mb-0">
      <strong>{member.full_name}</strong>
      <br />
      <a href={'mailto:' + member.email}>{member.email}</a>
    </p>
  </div>
</div>
<div class="row mx-2" style="max-width: 600px">
  <div class="col-sm">
    <p>
      <strong>Wins:</strong>
      {member.wins ? member.wins : ''}
    </p>
  </div>
  <div class="col-sm">
    <p>
      <strong>Avg Score:</strong>
      {member.avg_score ? member.avg_score.toFixed(1) : ''}
    </p>
  </div>
</div>
<div class="row mx-2 mb-2" style="max-width: 600px">
  <div class="col-sm">
    <p>
      <strong>Avg ABV:</strong>
      {member.avg_abv ? member.avg_abv.toFixed(1) : ''}
    </p>
  </div>
  <div class="col-sm">
    <p>
      <strong>Win Rate:</strong>
      {member.win_rate ? member.win_rate.toFixed(2) : ''}
    </p>
  </div>
</div>
