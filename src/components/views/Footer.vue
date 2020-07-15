<template>
  <div class="section footer">
    <div class="wrapper">
      <div class="terms">
        <h3>Terms of Participation &amp; Privacy Policy</h3>
        <p>
          The Edgeryders online platform and activities are intended for people
          to cooperate within and across projects trying to build a better
          world. The word "better" has here a fairly broad range of meaning.
          These Community Guidelines are here to help you understand what it
          means to be a member of Edgeryders. Don’t forget that your use of
          Edgeryders is subject to these Community Guidelines and our Terms of
          Service.
        </p>
      </div>
      <div>
        <ul>
          <li><a href="mailto:info@edgeryders.eu">Email</a></li>
          <li><a href="https://twitter.com/edgeryders">Twitter</a></li>
          <li><a href="https://t.me/edgeryders">Telegram</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {},
  props: {},
};
</script>
<style lang="scss">
.section.footer {
  background: #efefef;
  width: 100vw;
  display: inline-block;
  height: auto;
  .wrapper {
    width: 90%;
    display: flex;
    font-family: "Helvetica";
    max-width: 1220px;
    margin: 4rem auto 3rem;
    position: relative;
    .terms {
      padding: 0 5rem 0 0;
      h3 {
        margin-bottom: 1rem;
      }
    }
    p {
      line-height: 1.5rem;
    }
    ul {
      list-style: none;
      margin: -1rem 0 0 0;
      display: inline-block;
      width: auto;
      padding: 0;
      min-width: 300px;
      li {
        padding: 1rem 0.2rem;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        &:last-child {
          border: none;
        }
        a {
          color: black;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
