<template>
  <div class="card">
    <a class="event_title" target="_blank" :href="data.url">{{ data.title }}</a>
    <div class="event_excerpt" v-html="data.text"></div>
    <div class="event_footer">
      <a class="comments" :href="data.url" target="_blank">
        Discussion
      </a>

      <a class="likes" :href="data.url" target="_blank" v-if="data.likes != 0">
        {{ data.likes }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Event",
  props: {
    data: Object,
  },
  data: function() {
    return {
      flipped: false,
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.card {
  display: inline-block;
  flex-direction: column;
  width: 90%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 3px;
  overflow: hidden;
  padding: 5% 5% 0;
  margin-bottom: 1.5rem;
  p {
    font-size: 12px;
    color: black;
    display: inline-block;
    font-weight: bold;
  }
  .event_title {
    margin: 0;
    display: inline-block;
    padding: 1rem;
    font-size: 1rem;
    line-height: 1.4rem;
    &:hover {
      text-decoration: underline;
    }
  }
  .event_excerpt {
    font-size: 0.85rem;
    line-height: 1.2rem;
    padding: 1rem 0;
    max-height: 60px;
    overflow: hidden;
    margin-bottom: 0.75rem;
    transition: all 0.5s ease;
  }
  &:hover {
    .event_excerpt {
      max-height: 600px;

      margin-bottom: 0;
    }
  }
  .event_footer {
    display: flex;
    width: 100%;
    height: 3rem;
    a {
      display: flex;
      align-items: center;
      padding: 0 1rem;
    }
  }
}

.card {
  overflow: hidden;
  .event_title {
    width: 90%;
    padding: 0;
    text-decoration: none;
    font-weight: bold;
  }
  .event_footer {
    border-top: 1px solid #efefef;
    a {
      font-weight: bold;
      text-decoration: none;
      color: black;
      font-size: 0.85rem;
      border-right: 1px solid #efefef;
      &.likes {
        padding-left: 2.25rem;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' baseProfile='basic' x='0px' y='0px' viewBox='0 0 100 125' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23231F20;%7D%0A%3C/style%3E%3Cpath d='M91.25,5h-30v7.5h-7.5v15h-7.5v-15h-7.5V5h-30v7.5h-7.5V50h7.5v7.5h7.5V65h7.5v7.5h7.5V80h7.5v7.5h7.5V95h7.5v-7.5h7.5V80 h7.5v-7.5h7.5V65h7.5v-7.5h7.5V50h7.5V12.5h-7.5V5z M23.75,20h-7.5v7.5V35v7.5h-7.5V35v-7.5V20h7.5v-7.5h7.5V20z'/%3E%3C/svg%3E")
          no-repeat 0.8rem 55%;
        background-size: 14px;
      }
      &.comments {
        padding-left: 1.7rem;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 125'%3E%3Cpath fill='black' d='M16 61V16h68V5H16v11H5v45h11v11h34V61H16zm68-45v56H73v12H61V72H50v12h11v11h12V84h11V72h11V16H84z'/%3E%3C/svg%3E")
          no-repeat 0.2rem 55%;
        background-size: 15px;
      }
    }
  }
}
</style>
