<template>
    <div class="container">
    <h1>Opps!</h1>
    <p>Sorry not permitted to access this page</p>
    </div>
</template>
<script>
export default {
}
</script>
<style>
.container {
  text-align: center;
  margin: 1rem 0.5rem 0;
}
.container h1 {
  font-family: var(--font-header);
  font-size: calc(4rem + 2vw);
	/* text-transform: uppercase; */
}
.container p {
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  font-size: 2rem;
  margin: 1.5rem 0 3rem;
}
</style>
