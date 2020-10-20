<template>
  <div class="modal_container" @click="closeModal()">
    <div class="modal" :class="type" @click.stop>
      <div class="modal_header">
        <div class="close" @click="closeModal()"></div>
      </div>
      <div class="modal_content">
        <Form v-if="type == 'form'" :formLink="value"/>
      </div>
    </div>
</div>
</template>

<script>
import moment from "moment";
import Form from "@/components/views/Form";

export default {
  name: "Event",
  props: ['type', 'value'],
  data: function() {
    return {
      flipped: false,
    };
  },
  components: {
    Form
  },
  methods: {
    closeModal(){
      this.$emit('close')
    }
  },
  filters: {
    formatDate: function(value) {
      return moment(String(value)).format("dddd, MMMM Do YYYY");
    },
  }
};
</script>

<style scoped lang="scss">
.modal_container {
  background: rgba(0,0,0,0.8);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  perspective: 1000px;
  animation: darkenBackground .45s ease forwards;
}


@keyframes darkenBackground {
  0% {
    background: rgba(0,0,0,0);
  }
  100% {
    background: rgba(0,0,0,0.8);
  }
}

@keyframes modalFlip {
  0% {
    transform: rotateX(-15deg) scale(0.8) translateY(60px);
    opacity: 0;
  }
  40% {
  opacity: 1;
}
  100% {
    transform: rotateX(0) scale(1) translateY(0px);
    opacity: 1;
  }
}

.modal {
  display: block;
  opacity: 0;
  width: 60vw;
  height: 80vh;
  position: fixed;
  top: 13vh;
  left: 20vw;
      background: #f9f9f9;
  border-radius: 3px;
  box-shadow: 0 10px 10px rgba(0,0,0,0.4);
  padding: 0px 0 50px;
  animation: modalFlip .65s forwards .2s;
}

.modal_header {
  height: 60px;
  background: #fff;
  width: 100%;
  border-bottom: 1px solid #efefef;
  display: flex; 
  align-items: center;
}
.modal_content {
  overflow: scroll;
  height: 100%;
  width: 100%;
  padding: 30px 40px;
}
.close {
  width: 40px;
  height: 40px;
  position: relative;
  left: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 30' fill='none' %3E%3Cpath d='M12 18.6L10.5 20l-6.9-6.6a2 2 0 010-2.8l7-6.6L12 5.4 6.1 11H21v2H6.1l5.9 5.6z' fill='orangered'/%3E%3C/svg%3E") no-repeat center 5px;
  &:hover {
  cursor: pointer;
}
}

@media only screen and (max-width: 600px) {

.modal {
  left: 0;
  top: 10vh;
  width: 100vw;
  height: 90vh;
}

.modal_container {
  z-index: 999999;
}

.modal_content {
  width: 100%;
  padding: 30px 0px;
}

}
</style>
