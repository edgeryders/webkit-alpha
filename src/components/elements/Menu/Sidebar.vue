<template>
  <div class="items">
    <div
      class="item campfire"
      :class="{ active: active == 'campfire' }"
      @click="select('campfire')"
    >
      <div>
        <h3>Campfire</h3>
        <p>Catch up on the latest</p>
      </div>
    </div>

    <div
      class="item events"
      :class="{ active: active == 'events' }"
      @click="select('events')"
    >
      <div>
        <h3>Events</h3>
        <p>Our participatory events</p>
      </div>
    </div>

    <div
      class="item research"
      :class="{ active: active == 'research' }"
      @click="select('research')"
    >
      <div>
        <h3>Research</h3>
        <p>Follow our research projects</p>
      </div>
    </div>

    <div
      class="item academy"
      :class="{ active: active == 'academy' }"
      @click="select('academy')"
    >
      <div>
        <h3>Academy</h3>
        <p>Follow the latest discussion</p>
      </div>
    </div>

    <div
      class="item company"
      :class="{ active: active == 'company' }"
      @click="select('company')"
    >
      <div>
        <h3>Company</h3>
        <p>Follow the latest discussion</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      active: "campfire",
    };
  },
  components: {},
  methods: {
    select(value) {
      this.active = value;
      this.$emit("select", value);
    },
  },
  created() {},
};
</script>

<style scoped lang="scss">
.items {
  flex-shrink: 0;
  display: inline-flex;
  box-shadow: inset -4px 0 5px rgba(0, 0, 0, 0.04);
  height: 100%;
  width: 240px;
  overflow: hidden !important;
  position: relative;
  flex-direction: column;
}
.item {
  position: relative;
  padding: 15px 20px 13px;
  background: rgba(0, 0, 0, 0.01);
  color: black;
  display: inline-flex;

  &:hover {
    background-color: #efefef;
  }
  &:first-child {
    border-top: 1px solid white;
    border-radius: 8px 0 0 0 !important;
    &:hover {
    }
  }
  h3 {
    display: flex;
    width: 90%;
    align-items: center;
    margin-bottom: 10px;
    padding: 2px 0 12px 30px !important;
    font-size: 1.1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    margin: 0 0 0.5rem 0;
    padding: 0 0 0.5rem 0;
    background-position: 0 0 !important;
    background-size: 20px !important;
    background-repeat: no-repeat !important;
  }
  &.campfire {
    div {
      width: 100%;
    }
    h3 {
      background-size: 20.5px !important;
      background: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' style='-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);' preserveAspectRatio='xMidYMid meet' viewBox='0 0 36 37'%3E%3Cpath stroke='rgba(0,0,0,1)' stroke-width='1.5' fill='none' d='M35 19a16.96 16.96 0 0 0-1.04-5.868c-.46 5.389-3.333 8.157-6.335 6.868c-2.812-1.208-.917-5.917-.777-8.164c.236-3.809-.012-8.169-6.931-11.794c2.875 5.5.333 8.917-2.333 9.125c-2.958.231-5.667-2.542-4.667-7.042c-3.238 2.386-3.332 6.402-2.333 9c1.042 2.708-.042 4.958-2.583 5.208c-2.84.28-4.418-3.041-2.963-8.333A16.936 16.936 0 0 0 1 19c0 9.389 7.611 17 17 17s17-7.611 17-17z'/%3E%3C/svg%3E");
      background-position: 0 4px !important;
    }
    &.active,
    &:hover {
      h3 {
        background-size: 22px !important;
        background-position: 0 1.5px !important;
        background: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' style='-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);' preserveAspectRatio='xMidYMid meet' viewBox='0 0 36 36'%3E%3Cpath fill='%23F4900C' d='M35 19a16.96 16.96 0 0 0-1.04-5.868c-.46 5.389-3.333 8.157-6.335 6.868c-2.812-1.208-.917-5.917-.777-8.164c.236-3.809-.012-8.169-6.931-11.794c2.875 5.5.333 8.917-2.333 9.125c-2.958.231-5.667-2.542-4.667-7.042c-3.238 2.386-3.332 6.402-2.333 9c1.042 2.708-.042 4.958-2.583 5.208c-2.84.28-4.418-3.041-2.963-8.333A16.936 16.936 0 0 0 1 19c0 9.389 7.611 17 17 17s17-7.611 17-17z'/%3E%3Cpath fill='%23FFCC4D' d='M28.394 23.999c.148 3.084-2.561 4.293-4.019 3.709c-2.106-.843-1.541-2.291-2.083-5.291s-2.625-5.083-5.708-6c2.25 6.333-1.247 8.667-3.08 9.084c-1.872.426-3.753-.001-3.968-4.007A11.964 11.964 0 0 0 6 30c0 .368.023.73.055 1.09C9.125 34.124 13.342 36 18 36s8.875-1.876 11.945-4.91c.032-.36.055-.722.055-1.09c0-2.187-.584-4.236-1.606-6.001z'/%3E%3C/svg%3E");
      }
    }
  }
  &.research {
    h3 {
      background-size: 19px !important;
      background-position: 0px 2px !important;
      background-image: url("data:image/svg+xml,%0A%3Csvg width='45px' height='52px' viewBox='0 0 45 52' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='noun_Network_1266876' fill='%23000000' fill-rule='nonzero'%3E%3Cg id='Group'%3E%3Cpath d='M20.2132743,29.9805094 C19.806257,29.9805094 19.4091797,29.9360759 19.033552,29.8487956 C16.4486259,29.3028971 14.557408,26.9510905 14.557408,24.2612712 C14.557408,22.2808025 15.5467006,20.4733074 17.2040667,19.4254151 C18.1117467,18.8483074 19.1533551,18.5425619 20.2132743,18.5425619 C22.0223564,18.5425619 23.7315151,19.4259441 24.7851563,20.904948 C25.4914202,21.8671469 25.8696638,23.0324708 25.8696638,24.2612712 C25.8696638,25.4906006 25.4914202,26.6559245 24.7762625,27.6302898 C23.7315151,29.0971273 22.0223563,29.9805094 20.2132743,29.9805094 Z M20.2132743,20.7092285 C19.5572336,20.7092285 18.9106097,20.9001871 18.3424595,21.2614745 C17.3134068,21.9121093 16.7002651,23.0329996 16.7002651,24.2612711 C16.7002651,25.9307047 17.8747559,27.3906657 19.4928851,27.7323812 C20.8243234,28.0418294 22.2535924,27.4652507 23.0461775,26.3517659 C23.4945243,25.740804 23.7268067,25.0219319 23.7268067,24.2612711 C23.7268067,23.5006104 23.4945243,22.7822672 23.0550713,22.1834716 C22.394322,21.255656 21.3349261,20.7092285 20.2132743,20.7092285 Z' id='Shape'%3E%3C/path%3E%3Cpath d='M38.5405622,43.4237874 C35.4220145,43.4237874 32.8846959,40.8582763 32.8846959,37.7045491 C32.8846959,36.4746907 33.2629394,35.3098958 33.9786203,34.3355306 C35.0223214,32.869222 36.7309571,31.9858398 38.5405622,31.9858398 C41.6596331,31.9858398 44.1969518,34.5513509 44.1969518,37.7045491 C44.1969518,40.8582763 41.6596331,43.4237874 38.5405622,43.4237874 Z M38.5405622,34.1525065 C37.4183873,34.1525065 36.3600376,34.6989339 35.7081822,35.6140543 C35.2598354,36.2250162 35.027553,36.9433594 35.027553,37.7045491 C35.027553,39.6633301 36.6033063,41.2571208 38.5405622,41.2571208 C40.4778181,41.2571208 42.0540946,39.6633301 42.0540946,37.7045491 C42.0540946,35.7457682 40.4778181,34.1525065 38.5405622,34.1525065 Z' id='Shape'%3E%3C/path%3E%3Cpath d='M38.5405622,16.525594 C36.7388044,16.525594 35.0270298,15.6443277 33.9618792,14.1684976 C33.2566616,13.1888427 32.8846959,12.0266926 32.8846959,10.8063557 C32.8846959,7.65262853 35.4220145,5.08711742 38.5405622,5.08711742 C41.6596331,5.08711742 44.1969518,7.65262853 44.1969518,10.8063557 C44.1969518,13.9600829 41.6596331,16.525594 38.5405622,16.525594 Z M38.5405622,7.2537842 C36.6033063,7.2537842 35.027553,8.84757488 35.027553,10.8063558 C35.027553,11.5654297 35.2577428,12.2869466 35.6935337,12.8926189 C36.3558524,13.8103843 37.4204799,14.3589275 38.5405622,14.3589275 C40.4778181,14.3589275 42.0540946,12.7651368 42.0540946,10.8063558 C42.0540946,8.84757488 40.4778181,7.2537842 38.5405622,7.2537842 Z' id='Shape'%3E%3C/path%3E%3Cpath d='M15.6288365,52 C12.5097657,52 9.972447,49.4344889 9.972447,46.2807617 C9.972447,43.1275635 12.5097657,40.5620524 15.6288365,40.5620524 C16.0389928,40.5620524 16.4365933,40.6064859 16.8106515,40.6942952 C19.3934849,41.2386067 21.2847029,43.5904133 21.2847029,46.2807617 C21.2847029,49.4344889 18.7473842,52 15.6288365,52 Z M15.6288365,42.728719 C13.6915806,42.728719 12.1153041,44.3219807 12.1153041,46.2807617 C12.1153041,48.2395426 13.6915806,49.8333333 15.6288365,49.8333333 C17.5660924,49.8333333 19.1418458,48.2395426 19.1418458,46.2807617 C19.1418458,44.6107991 17.967355,43.1513671 16.349749,42.8101806 C16.1138044,42.7551676 15.8726283,42.728719 15.6288365,42.728719 Z' id='Shape'%3E%3C/path%3E%3Cpath d='M6.45943779,11.4379476 C3.34036693,11.4379476 0.80304825,8.87243652 0.80304825,5.71870932 C0.80304825,2.56551111 3.34036693,0 6.45943779,0 C9.57798546,0 12.1153041,2.56551111 12.1153041,5.71870932 C12.1153041,7.69970706 11.1254883,9.50773113 9.46812225,10.5545654 C8.56148861,11.1316731 7.51988004,11.4379476 6.45943779,11.4379476 Z M6.45943779,2.16666667 C4.52218189,2.16666667 2.94590539,3.75992836 2.94590539,5.71870932 C2.94590539,7.67749027 4.52218189,9.27128096 6.45943779,9.27128096 C7.11547854,9.27128096 7.76210239,9.08032233 8.32972939,8.71903489 C9.35930529,8.06840017 9.972447,6.94750983 9.972447,5.71870932 C9.972447,3.75992836 8.39669368,2.16666667 6.45943779,2.16666667 Z' id='Shape'%3E%3C/path%3E%3Cpath d='M17.7727399,21.4275716 C17.4666922,21.4275716 17.1627372,21.2958578 16.950858,21.0398356 L8.0791365,10.3313395 C7.69932343,9.87272141 7.75896354,9.18929039 8.21254189,8.80525717 C8.665074,8.42122396 9.34151786,8.48099774 9.72185411,8.94014485 L18.5935756,19.6486409 C18.9733887,20.107259 18.9137486,20.79069 18.4601702,21.1747233 C18.2598005,21.3445231 18.0154855,21.4275716 17.7727399,21.4275716 Z' id='Path'%3E%3C/path%3E%3Cpath d='M23.9167131,22.62146 C23.5850307,22.62146 23.2580566,22.4664714 23.0487932,22.1744792 C22.7008929,21.6904704 22.8076171,21.0128581 23.2863072,20.6616211 L34.1978236,12.6535238 C34.6770367,12.3017579 35.3466796,12.4096679 35.6940569,12.8936768 C36.0419572,13.3776855 35.935233,14.0552979 35.4565429,14.4065349 L24.5450265,22.4146322 C24.35512,22.5542806 24.1348703,22.62146 23.9167131,22.62146 Z' id='Path'%3E%3C/path%3E%3Cpath d='M16.5694755,42.8329264 C16.4962333,42.8329264 16.4219448,42.8255208 16.3471332,42.8096516 C15.7679968,42.6858723 15.3981237,42.1114094 15.5200196,41.5258381 L18.225272,28.5692138 C18.3482143,27.9836426 18.9147949,27.6096598 19.4949777,27.7329101 C20.0741141,27.8566894 20.4439872,28.4311523 20.3220913,29.0167236 L17.6168388,41.9733479 C17.5101144,42.4832763 17.0654297,42.8329264 16.5694755,42.8329264 Z' id='Path'%3E%3C/path%3E%3Cpath d='M34.8376465,36.0647379 C34.6200125,36.0647379 34.400286,35.9980876 34.2103795,35.8589681 L23.2873535,27.862508 C22.8081404,27.5118 22.7008929,26.8341877 23.047747,26.3496499 C23.3951243,25.8666991 24.0647671,25.756673 24.5439803,26.1073811 L35.4670062,34.1038411 C35.9462193,34.4545491 36.0534669,35.1321615 35.7066127,35.6166992 C35.4968262,35.9092204 35.1698521,36.0647379 34.8376465,36.0647379 Z' id='Path'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    &.active,
    &:hover {
      h3 {
        background-image: url("data:image/svg+xml,%3Csvg width='45' height='52' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' id='a'%3E%3Cstop stop-color='%2382BEC4' offset='0%25'/%3E%3Cstop stop-color='%234B8991' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' id='b'%3E%3Cstop stop-color='%2382BEC4' offset='0%25'/%3E%3Cstop stop-color='%234B8991' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%25' y1='-211.7%25' x2='50%25' y2='100%25' id='c'%3E%3Cstop stop-color='%2382BEC4' offset='0%25'/%3E%3Cstop stop-color='%234B8991' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='163.8%25' y1='80.4%25' x2='100%25' y2='-99.7%25' id='d'%3E%3Cstop stop-color='%2382BEC4' offset='0%25'/%3E%3Cstop stop-color='%234B8991' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='246.3%25' id='e'%3E%3Cstop stop-color='%2382BEC4' offset='0%25'/%3E%3Cstop stop-color='%234B8991' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill-rule='nonzero' fill='none'%3E%3Cpath d='M38.5 43.4a5.7 5.7 0 01-4.5-9c1-1.5 2.7-2.4 4.5-2.4 3.2 0 5.7 2.6 5.7 5.7 0 3.2-2.5 5.7-5.7 5.7z' fill='url(%23a)'/%3E%3Cpath d='M38.5 16.5a5.7 5.7 0 01-5.6-5.7c0-3.1 2.5-5.7 5.6-5.7 3.2 0 5.7 2.6 5.7 5.7 0 3.2-2.5 5.7-5.7 5.7z' fill='url(%23b)'/%3E%3Cpath d='M15.6 52a5.7 5.7 0 01-5.6-5.7 5.7 5.7 0 016.8-5.6A5.7 5.7 0 0115.6 52zM6.5 11.4A5.7 5.7 0 01.8 5.7C.8 2.6 3.3 0 6.5 0c3 0 5.6 2.6 5.6 5.7a5.7 5.7 0 01-5.6 5.7zM20.2 30c-.4 0-.8 0-1.2-.2a5.7 5.7 0 011.2-11.3c1.8 0 3.5 1 4.6 2.4.7 1 1 2.1 1 3.4 0 1.2-.3 2.4-1 3.3a5.6 5.6 0 01-4.6 2.4z' fill='url(%23a)'/%3E%3Cpath d='M17.8 21.4a1 1 0 01-.8-.4L8 10.3a1 1 0 01.2-1.5 1 1 0 011.5.1l8.9 10.7a1 1 0 01-.1 1.6 1 1 0 01-.7.2z' fill='url(%23c)'/%3E%3Cpath d='M24 22.6a1 1 0 01-1-.4 1 1 0 01.3-1.5l10.9-8a1 1 0 011.5.2 1 1 0 01-.2 1.5l-11 8a1 1 0 01-.6.2z' fill='url(%23d)'/%3E%3Cpath d='M16.6 42.8h-.3a1 1 0 01-.8-1.3l2.7-13a1 1 0 112.1.5l-2.7 13a1 1 0 01-1 .8z' fill='%234B8991'/%3E%3Cpath d='M34.8 36a1 1 0 01-.6-.1l-11-8a1 1 0 01-.2-1.6 1 1 0 011.5-.2l11 8c.4.4.6 1 .2 1.5a1 1 0 01-.9.5z' fill='url(%23e)'/%3E%3C/g%3E%3C/svg%3E");
      }
    }
  }
  &.events {
    h3 {
      background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='black' stroke-width='1.2' d='M45.7 5c0-.2 0-.3-.2-.4-.1-.1-.1-.1-16 1.4V1c0-.3-.2-.5-.5-.5h-8c-.3 0-.5.2-.5.5v5.9L1.4 8.7a.5.5 0 00-.5.5L4.7 49a.5.5 0 00.5.5L49 45.3a.5.5 0 00.5-.5L45.7 5zM21.5 1.5h7v11h-7v-11zm-15.9 47L2 9.6 20.5 8V13c0 .3.2.5.5.5h8c.3 0 .5-.2.5-.5V7l15.2-1.5 3.8 38.9-42.9 4z' fill='%23000' fill-rule='nonzero'/%3E%3C/svg%3E");
      background-size: 19px !important;
      background-position: 0px 2px !important;
    }
    &.active,
    &:hover {
      h3 {
        background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' id='a'%3E%3Cstop stop-color='%232600FF' offset='0%25'/%3E%3Cstop stop-color='%23AFE4FF' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill-rule='nonzero' fill='none'%3E%3Cpath d='M45.7 5c0-.2 0-.3-.2-.4-.1-.1-.1-.1-16 1.4V1c0-.3-.2-.5-.5-.5h-8c-.3 0-.5.2-.5.5v5.9L1.4 8.7a.5.5 0 00-.5.5L4.7 49a.5.5 0 00.5.5L49 45.3a.5.5 0 00.5-.5L45.7 5z' fill='%23FFF'/%3E%3Cpath fill='%233B22FF' d='M21.5 1.5h7v11h-7z'/%3E%3Cpath d='M5.6 48.5L2 9.6 20.5 8V13c0 .3.2.5.5.5h8c.3 0 .5-.2.5-.5V7l15.2-1.5 3.8 38.9-42.9 4z' fill='url(%23a)'/%3E%3C/g%3E%3C/svg%3E");
        background-size: 21px !important;
      }
    }
  }
  &.company {
    h3 {
      background: url("data:image/svg+xml,%3Csvg width='51' height='51' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 25.5a24.5 24.5 0 1149 0 24.5 24.5 0 01-49 0zm24.5 18v-18h-18a18 18 0 1118 18z' stroke='%23000' stroke-width='1.8' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E");
      background-position: 1px 3px !important;
      background-size: 20px !important;
    }
    &.active,
    &:hover {
      h3 {
        background-image: url("data:image/svg+xml,%3Csvg width='49' height='49' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient x1='50%25' y1='100%25' x2='50%25' y2='0%25' id='a'%3E%3Cstop stop-color='%23E13F19' offset='0%25'/%3E%3Cstop stop-color='%23FF3203' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M0 24.5a24.5 24.5 0 1149 0 24.5 24.5 0 01-49 0zm24.5 18v-18h-18a18 18 0 1118 18z' fill='url(%23a)' fill-rule='evenodd'/%3E%3C/svg%3E");
      }
    }
  }
  &.academy {
    h3 {
      background: url("data:image/svg+xml,%3Csvg width='52' height='53' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='nonzero' stroke-width='1.4' fill='none'%3E%3Cpath d='M51.5 29.8L39 22.5V7.9l-.1-.2L26.2.3H26L13.4 7.7l-.1.2v14.6L.7 29.8V45l12.7 7.4h.2L26 45l12.6 7.3h.2l12.6-7.4.1-.2V30v-.2z' fill='%23FFF'/%3E%3Cpath stroke='%23000' d='M26 15.4v14.2l-12.3-7.1V8.2zM38.6 22.5l-12.3 7.1V15.4l12.3-7.2zM13.5 22.8L25.7 30 13.5 37 1.2 30zM13.7 37.5l12.2-7.2v14.3l-12.2 7.1zM26.3 30.3l12.3 7.2v14.2l-12.3-7zM38.8 37.1L26.5 30l12.3-7.2L51 30zM26.1.7L38.4 8 26 15 14 8zM1 30.3l12.3 7.2v14.2L1 44.7zM39 51.7V37.5l12.2-7.2v14.3z'/%3E%3C/g%3E%3C/svg%3E");
      background-position: 0 2px !important;
    }
    &.active,
    &:hover {
      h3 {
        background-image: url("data:image/svg+xml,%3Csvg width='51' height='52' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' id='a'%3E%3Cstop stop-color='%230052FB' offset='0%25'/%3E%3Cstop stop-color='%236684FF' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' id='b'%3E%3Cstop stop-color='%23000CFF' offset='0%25'/%3E%3Cstop stop-color='%23278FFF' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' id='c'%3E%3Cstop stop-color='%23EA4A4A' offset='0%25'/%3E%3Cstop stop-color='%23FF4300' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' id='d'%3E%3Cstop stop-color='%23FF7878' offset='0%25'/%3E%3Cstop stop-color='%23FF2F00' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' id='e'%3E%3Cstop stop-color='%23000CFF' offset='0%25'/%3E%3Cstop stop-color='%23278FFF' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='70.7%25' id='f'%3E%3Cstop stop-color='%23FF3939' offset='0%25'/%3E%3Cstop stop-color='%23FF6300' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill-rule='nonzero' fill='none'%3E%3Cpath fill='%2300C140' d='M25 15.4v14.2l-12.3-7.1V8.2z'/%3E%3Cpath fill='%2305D960' d='M37.6 22.5l-12.3 7.1V15.4l12.3-7.2z'/%3E%3Cpath fill='url(%23a)' d='M13.5 22.8L25.7 30 13.5 37 1.2 30z' transform='translate(-1)'/%3E%3Cpath fill='url(%23b)' d='M13.7 37.5l12.2-7.2v14.3l-12.2 7.1z' transform='translate(-1)'/%3E%3Cpath fill='url(%23c)' d='M26.3 30.3l12.3 7.2v14.2l-12.3-7z' transform='translate(-1)'/%3E%3Cpath fill='url(%23d)' d='M38.8 37.1L26.5 30l12.3-7.2L51 30z' transform='translate(-1)'/%3E%3Cpath fill='%2316CC02' d='M25.1.7L37.4 8 25 15 13 8z'/%3E%3Cpath fill='url(%23e)' d='M1 30.3l12.3 7.2v14.2L1 44.7z' transform='translate(-1)'/%3E%3Cpath fill='url(%23f)' d='M39 51.7V37.5l12.2-7.2v14.3z' transform='translate(-1)'/%3E%3C/g%3E%3C/svg%3E");
      }
    }
  }
  &.active {
    background: rgba(0, 0, 0, 0.03);
  }
}
</style>
