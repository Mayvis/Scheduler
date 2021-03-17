<template>
  <div id="app">
    <schedule></schedule>
  </div>
</template>

<script>
import Schedule from "@/components/Schedule";

export default {
  name: "App",
  components: { Schedule }
};
</script>

<style lang="scss" scoped>
#app {
  padding: 5% 0;
}
</style>
