<template>
  <div class="form" v-resize="onResize" :style="config && config.style">
    <h1> {{title}} </h1>
    <input v-model="name" placeholder="Full Name" />
    <input v-model="email" placeholder="Email" />
    <button>Register Now</button>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      name: '',
      email: ''
    };
  },
  components: {
  },
  props: {
    title: String,
    text: String,
    fields: Array,
    config: Object
  },
  mounted() {
  },
  methods: {
   
  },
};
</script>

<style lang="scss">
.form {
  @apply rounded-lg pb-6;
  flex-shrink: 0;
  width: 100% !important;
  h1 {
    @apply font-bold text-2xl block border-b mb-4 pb-2 rounded-t-lg;
    color: black;
  }
  input, textarea {
    @apply w-full py-3 border-b mb-2;
    &:focus {
      outline: none;
      background: #fafafa;
      border-bottom: 1px solid #ddd;
    }
  }
  button {
    @apply mt-2 border p-3 text-sm font-bold;
  }
}
</style>
