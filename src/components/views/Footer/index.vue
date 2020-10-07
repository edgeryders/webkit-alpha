<template>
  <div class="section footer">
    <CKick v-if="config && config.template && config.template == 'climate_kick'" />
    <Standard v-else />
  </div>
</template>

<script>
import Standard from "./templates/Standard.vue";
import CKick from "./templates/CKick.vue";
export default {
  name: "Footer",
  data() {},
  props: {
    config: Object
  },
  components: {
    Standard,
    CKick
  }
};
</script>
<style lang="scss">
.section.footer {
  background: #efefef;
  width: 100vw;
  display: inline-block;
  height: auto;
}

@media screen and (max-width: 800px) {
.section.footer {
  .wrapper {
    a.partner_logo {
    img {
      width: 180px;
    }
    }
    flex-direction: column;
    margin: 2.5rem auto 0;
    width: 85% !important;
    .terms {
      padding: 0;
      margin-bottom: 2rem;
    }
  }
}
}
</style>
