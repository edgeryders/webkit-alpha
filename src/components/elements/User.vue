<template>
  <span class="user_container">
    <span class="user_name">
      <a :href="'https://edgeryders.eu/u/' + user" target="_blank"
        >@{{ user }}</a
      >
    </span>
    <span class="user_info_container" :class="{ mini: !bio || mini }">
      <span class="user_info">
        <span class="user_title">
          <img class="user_avatar" :src="avatar" />
          <span>
            <h4 v-if="name">
              {{ name }} <span>@{{ user }}</span>
            </h4>
            <h4 v-else>@{{ user }}</h4>
            <div class="last_active">
              <span>Joined</span>
              <span>{{ since | moment }}</span>
            </div>
          </span>
        </span>
        <span class="user_bio" v-if="bio" v-html="bio"></span>
        <span class="user_contact">
          <span class="contact_links">
            <a :href="sendMessage()" target="_blank" class="message"
              >Send a Message</a
            >
            <a
              :href="
                'https://edgeryders.eu/u/' + username + '/activity/portfolio'
              "
              target="_blank"
              class="portfolio"
              >See Portfolio</a
            >
          </span>
        </span>
      </span>
    </span>
  </span>
</template>
<script>
import moment from "moment";

export default {
  name: "User",
  props: ["username", "mini"],
  data() {
    return {
      avatar: null,
      user: null,
      name: null,
      bio: null,
      since: null,
      account: null,
    };
  },
  created() {
    var self = this;
    fetch("https://edgeryders.eu/u/" + this.username.replace("@", "") + ".json")
      .then((response) => response.json())
      .then((data) => {
        var avatar =
          "https://edgeryders.eu/" +
          data.users[0].avatar_template.replace("{size}", 200);
        var bio = null;
        if (data.user.bio_cooked) {
          bio = data.user.bio_cooked.replace(
            /<[^\/>][^>]*>\s*<\/[^>]+>/gim,
            ""
          );
        }
        self.avatar = avatar;
        self.user = data.users[0].username;
        self.name = data.users[0].name;
        self.bio = bio;
        self.since = data.user.created_at;
        self.account = data;
      });
  },
  filters: {
    moment: function(date) {
      return moment(date).fromNow();
    },
  },
  methods: {
    sendMessage() {
      var recipient = this.username;
      var url = location.href;
      if (this.name) {
        recipient = this.name;
      }
      var link =
        "https://edgeryders.eu/new-message?username=" +
        this.username +
        "&title=hey%20" +
        recipient +
        "!&body=I saw you mentioned [here](" +
        url +
        ") and wanted to get in touch.";
      return link;
    },
  },
};
</script>

<style lang="scss">
.user_name {
  position: relative;
  z-index: 1;
  a {
    font-weight: bold;
    color: black;
    background: rgba(0, 0, 0, 0.06);
    padding: 0.45em 0.5em 0.4em;
    text-decoration: none;
    border-radius: 2px;
    font-size: 0.75em;
    &:hover {
      background: #ef5d3b;
      color: white;
    }
  }
}

@keyframes animation {
  0% {
    transform: matrix3d(0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  4.3% {
    transform: matrix3d(0.757, 0, 0, 0, 0, 0.757, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  8.61% {
    transform: matrix3d(0.939, 0, 0, 0, 0, 0.939, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  12.91% {
    transform: matrix3d(1.026, 0, 0, 0, 0, 1.026, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    opacity: 1;
  }
  17.22% {
    transform: matrix3d(1.047, 0, 0, 0, 0, 1.047, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  28.33% {
    transform: matrix3d(1.01, 0, 0, 0, 0, 1.01, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  39.44% {
    transform: matrix3d(0.997, 0, 0, 0, 0, 0.997, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  61.66% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  83.98% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  100% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    opacity: 1;
  }
}

.user_info_container {
  display: none;
  position: absolute;
  top: 1.3rem;
  width: 350px;
  left: 0px;
  height: auto;
  &.mini {
    height: 150px;
    .user_contact {
      background: none;
    }
    .user_bio {
      display: none !important;
    }
  }
}
.user_info {
  font-style: normal;
  opacity: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 1rem;
  z-index: 999999;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 3px;
  height: 90%;
  width: 100%;
  background: white;
  .user_contact {
    display: flex;
    align-items: flex-end;
    content: "";
    width: 100%;
    .contact_links {
      padding: 0.8rem 0.5rem;
      border-top: 1px solid rgba(0, 0, 0, 0.07);
      width: 100%;
      margin: 0 auto;
    }
    a {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.9);
      text-decoration: none;
      font-size: 0.8rem;
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0.4rem 0.8rem 0.5rem;
      padding-left: 2.3rem;
      &:first-child {
        border: none !important;
      }
      &:hover {
        color: #ef5d3b;
      }
    }
    .message {
      background: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='fas' data-icon='envelope'  xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='rgba(0,0,0,0.9)' d='M502 191c4-3 10 0 10 5v204c0 27-21 48-48 48H48c-26 0-48-21-48-48V196c0-5 6-8 10-5l154 114c21 15 56 47 92 47s72-33 92-47l154-114zM256 320c23 0 57-29 73-41 133-97 143-105 174-129 6-5 9-12 9-19v-19c0-26-22-48-48-48H48C22 64 0 86 0 112v19c0 7 3 14 9 19 31 24 41 32 174 129 16 12 50 41 73 41z'/%3E%3C/svg%3E")
        no-repeat 0.65rem center;
      padding-left: 2.1rem;
      background-size: 1rem !important;
      &:hover {
        background: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='fas' data-icon='envelope'  xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23EF5D3B' d='M502 191c4-3 10 0 10 5v204c0 27-21 48-48 48H48c-26 0-48-21-48-48V196c0-5 6-8 10-5l154 114c21 15 56 47 92 47s72-33 92-47l154-114zM256 320c23 0 57-29 73-41 133-97 143-105 174-129 6-5 9-12 9-19v-19c0-26-22-48-48-48H48C22 64 0 86 0 112v19c0 7 3 14 9 19 31 24 41 32 174 129 16 12 50 41 73 41z'/%3E%3C/svg%3E")
          no-repeat 0.65rem center;
      }
    }
    .portfolio {
      background: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='fas' data-icon='images' class='svg-inline--fa fa-images fa-w-18' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath fill='currentColor' d='M480 416v16c0 27-21 48-48 48H48c-27 0-48-21-48-48V176c0-27 21-48 48-48h16v208c0 44 36 80 80 80h336zm96-80V80c0-27-21-48-48-48H144c-27 0-48 21-48 48v256c0 27 21 48 48 48h384c27 0 48-21 48-48zM256 128a48 48 0 11-96 0 48 48 0 0196 0zm-96 144l56-56c4-4 12-4 16 0l40 40 136-136c4-4 12-4 16 0l88 88v112H160v-48z'/%3E%3C/svg%3E")
        no-repeat 0.85rem center;
      padding-left: 2.3rem;
      background-size: 1rem !important;
      &:hover {
        background: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='fas' data-icon='images' class='svg-inline--fa fa-images fa-w-18' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath fill='%23EF5D3B' d='M480 416v16c0 27-21 48-48 48H48c-27 0-48-21-48-48V176c0-27 21-48 48-48h16v208c0 44 36 80 80 80h336zm96-80V80c0-27-21-48-48-48H144c-27 0-48 21-48 48v256c0 27 21 48 48 48h384c27 0 48-21 48-48zM256 128a48 48 0 11-96 0 48 48 0 0196 0zm-96 144l56-56c4-4 12-4 16 0l40 40 136-136c4-4 12-4 16 0l88 88v112H160v-48z'/%3E%3C/svg%3E")
          no-repeat 0.85rem center;
      }
    }
  }
  img.user_avatar {
    width: 60px !important;
    margin-right: 10px !important;
    border-radius: 6px !important;
  }
  .user_title {
    display: flex;
    padding: 0.75rem 0.75rem;
    align-items: start;
    h4 {
      margin: 0.3rem 0 0 0;
      padding: 0 0 0.3rem 0;
      font-size: 0.85em;
      span {
        color: rgba(0, 0, 0, 0.6);
        border-left: 1px solid rgba(0, 0, 0, 0.1);
        padding-left: 4px;
        padding: 2px 0 2px 6px;
        margin-left: 4px;
      }
    }
    .last_active {
      border-radius: 4px;
      overflow: hidden;
      padding: 0;
      display: flex;
      align-items: center;
      line-height: 1.6rem;
      font-weight: bold;
      font-size: 0.65rem !important;
      margin: 0.3rem 0 0 0;
      span:first-child {
        background: #ef5d3b;
        color: white;
        font-weight: bold;
        padding: 0rem 0.4rem -0rem 0.4rem;
      }
      span:nth-child(2) {
        padding: 0 0.6rem 0;
        background: #efefef;
      }
    }
  }
  .user_bio {
    display: inline-block;
    height: auto;
    flex-shrink: 0;
    max-height: 200px;
    padding: 0.8rem 0.5rem;
    border-top: 1px solid #efefef;
    background: rgba(0, 0, 0, 0.04) !important;
    p {
      margin: 0;
      padding: 0 10px 0;
      font-size: 0.8rem !important;
      line-height: 1.2rem !important;
    }
  }
}

.user_container {
  position: relative;
  display: inline-block;

  &:hover {
    .user_name {
      a {
        background: #ef5d3b;
        color: white;
      }
    }

    .user_info_container {
      display: block;
      .user_info {
        animation: animation 1000ms linear both 0.1s;
      }
    }
  }
}

@media only screen and (max-width: 600px) {
  .user_info_container {
    display: none !important;
  }
}
</style>
