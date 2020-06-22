<template>
  <div class="logo" :class="{glyph: type == 'glyph'}">

    <svg v-if="type == 'glyph'" viewBox="0 0 160 135" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd" fill-opacity="1" opacity="1"><path d="M0,66 C-4.46393476e-15,29.5492065 29.5492065,6.69590214e-15 66,0 C102.450793,-6.69590214e-15 132,29.5492065 132,66 C132,102.450793 102.450793,132 66,132 C29.5492065,132 4.46393476e-15,102.450793 0,66 Z M65.5,115 L65.5,66.5 L17,66.5 C17,39.7141896 38.7141896,18 65.5,18 C92.2858104,18 114,39.7141896 114,66.5 C114,93.2858104 92.2858104,115 65.5,115 Z" id="Shape" :fill="color"></path></g></svg>

    <svg v-else viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'><path d='M0 250a250 250 0 1 1 500 0 250 250 0 0 1-500 0zm97-103v106h42v-16h-26v-31h19v-16h-19v-27h26v-16zm80 91c6 0 8-4 8-11v-52c0-8-4-12-13-12h-4v75zm-25-91h23c19 0 27 10 27 29v48c0 20-8 29-26 29h-24zm63 25c0-17 9-27 25-27s24 9 24 27v10h-16v-11c0-8-3-11-8-11-6 0-9 3-9 11v59c0 7 3 11 9 11 5 0 8-4 8-11v-17h-10v-13h26v53h-8l-3-7c-4 7-9 10-16 10-14 0-22-11-22-30zm64-25h43v16h-26v27h18v16h-18v31h26v16h-43zM112 381H95V275h24c18 0 26 8 26 30 0 13-3 21-10 26l12 50h-17l-10-45h-8zm0-60v-31h6c8 0 10 3 10 15 0 11-2 16-10 16zm53-46l10 42h1l10-42h17l-19 62v44h-16v-42l-20-64zm69 90c6 0 9-4 9-11v-51c0-9-4-13-13-13h-4v75zm-24-90h23c18 0 27 9 27 29v47c0 20-8 30-26 30h-24zm136 46v-31h6c8 0 10 3 10 15 0 11-2 16-10 16zm-72-46h43v15h-26v28h19v15h-19v32h26v16h-43zm72 106h-16V275h24c17 0 25 8 25 30 0 13-3 21-10 26l12 50h-17l-10-45h-8zm57-30c1 11 4 16 11 16 6 0 10-4 10-10 0-9-6-14-15-23-12-12-20-21-20-35 0-15 11-26 25-26s24 10 25 26l-16 2c-1-9-3-13-9-13-5 0-9 4-9 10 0 9 7 16 17 25 11 11 18 19 18 34s-11 26-26 26-26-11-27-29zm-65-172v-42h-42a42 42 0 1 1 42 42z' :fill='color' fill-rule='evenodd'/></svg>

  </div>
</template>

<script>
export default {
  name: "Logo",
  props: {
    color: String,
    type: String
  }
};
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 100%;
    height: auto;
  }
  &.glyph {
    svg {
      width: 95%;
    }
  }
}
</style>
