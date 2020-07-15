<template>
  <div
    class="card"
    @click="flipCard"
    :class="{ active: flipped }"
    v-resize="onResize"
  >
    <kinesis-container style="height: 100%">
      <kinesis-element strength="10" :type="parallax" style="height: 100%">
        <div class="container">
          <div class="front" :style="{ background: 'url(' + data.image + ')' }">
            <div class="card_info">
              <h2>{{ data.title }}</h2>
            </div>
          </div>
          <div class="back">
            <div class="text">{{ data.text.substring(0, 490) }}..</div>
            <a class="read_more" :href="data.url" target="_blank">
              Discuss this topic
            </a>
          </div>
        </div>
      </kinesis-element>
    </kinesis-container>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Card",
  props: {
    data: Object,
    parallax: Boolean,
  },
  data: function() {
    return {
      flipped: false,
    };
  },
  methods: {
    flipCard() {
      this.flipped = !this.flipped;
    },
  },
};
</script>

<style scoped lang="scss">
@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes bgfade {
  0% {
    background: #efefef;
  }
  100% {
    opacity: #fff;
  }
}
.card {
  border-radius: 10px;
  padding: 1%;
  position: relative;
  float: left;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .card_info {
    width: 85%;
  }
  h2 {
    display: inline;
    padding: 10px;
    margin: 0.75rem;
    line-height: 2.4rem;
    box-decoration-break: clone;
    background: white;
    color: black;
  }
}

.container {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: #efefef;
  animation: bgfade 0s ease forwards 3s;
}

.front,
.back {
  height: 100%;
  display: inline-flex;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  backface-visibility: hidden;
  opacity: 0;
  animation: fadein 0.6s ease forwards 3s;
}

.front {
  transform: rotateY(0deg);
  transform-style: preserve-3d;
  background-size: cover !important;
  background-position: 50% 50% !important;
}

.back {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff !important;
  transform: rotateY(180deg);
  transform-style: preserve-3d;
  overflow: hidden;
  .text {
    overflow: hidden;
    padding-top: 1.75rem;
    padding-left: 8%;
    padding-right: 8%;
    font-size: 0.8rem;
    position: relative;
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
  .read_more {
    &:before {
      position: absolute;
      bottom: 42px;
      width: 100%;
      height: 70px;
      left: 0;
      background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      content: "";
    }
    position: relative;
    background: black;
    bottom: 0;
    width: 80%;
    padding: 6% 10% !important;
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 0.9rem;
  }
}

.card {
  &.active .front {
    transform: rotateY(-180deg);
    transform-style: preserve-3d;
  }
  &.active .back {
    transform: rotateY(0deg);
    transform-style: preserve-3d;
  }
}

@media only screen and (max-width: 600px) {
  .card {
    .back {
      display: block;
      .text {
        width: 80% !important;
        padding: 0;
        overflow: scroll;
        padding: 10%;
        font-size: 0.9rem;
        line-height: 1.3rem;
      }
      a.read_more {
        display: inline-block;
        position: absolute;
        padding: 5% 10% !important;
        width: 90%;
        &:before {
          display: none;
        }
      }
    }
  }
}
</style>
