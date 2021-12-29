<script>
  import Navbar from '../components/navbar.svelte';
  import Footer from '../components/footer.svelte';
</script>

<Navbar />
<div class="content">
  <slot />
</div>
<div class="padding" />
<Footer />

<style global>
  .padding {
    height: 50vh;
  }

  body {
    margin: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
  h1 {
    font-family: 'Alfa Slab One';
    color: #d17101;
    font-weight: normal;
    line-height: 1;
    margin: 12px;
  }

  @font-face {
    font-family: 'Alfa Slab One';
    src: url('/fonts/alpha_slab_one.woff2') format('woff2');
  }
</style>
