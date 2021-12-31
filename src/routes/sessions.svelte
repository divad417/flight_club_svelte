<script lang="ts">
    import { Button } from 'sveltestrap';
    let available: string;
    if (window.indexedDB) {
        available = 'are';
    } else {
        available = 'are not';
    }
</script>

<h1>Sessions</h1>
<Button href='#'>Add Session</Button>
Indexed DB {available} available.