<template>
  <div class="form" :style="config && config.style">
    <div v-if="title" v-html="title"></div>
    <div v-if="text" v-html="text"></div>
    <div class="account">
      <div class="account_options" v-if="config.account && config.account == true">
        <div class="option login" :class="{active: new_account}">
          <h3>I already have an account</h3>
          <p>Just sign in and you'll return here to complete the form</p>
        </div>
        <div class="option new_account" @click="new_account = true" :class="{active: new_account}">
          <h3>I'm new to Edgeryders</h3>
          <p>I don't yet have an account yet, but let me in!</p>
          <div class="description">
            <h3><img class="Emoji Emoji--forText" src="https://abs.twimg.com/emoji/v2/72x72/1f469-200d-1f4bb.png" draggable="false" alt="👩‍💻" title="Woman technologist" aria-label="Emoji: Woman technologist">Welcome to our community!</h3>
            <p>An Edgeryders account will connect you with <b>4000+ members</b> and a bunch of new opportunities. We'll send you an email with your account details when you've finished.</p>
          </div>
        </div>
      </div>
      <div class="create_account" v-if="new_account">
        <div class="field">
          <h3>Choose a username</h3>
          <input type="text" class="username" @keydown.space.prevent @keyup="validateUsername()" :class="{ available: account.username.isValid, notavailable: account.username.isValid == false }" v-model="account.username.text" placeholder="your username" />
        </div>
        <div class="field">
          <h3>Your email address</h3>
          <input type="text" class="email" @keydown.space.prevent @keyup="validateEmail()" :class="{ available: account.email.isValid, notavailable: account.email.isValid == false }" v-model="account.email.text" placeholder="your email" />
        </div>
        <div class="field terms">
          <label class="checkbox bounce">
            <input type="checkbox">
            <svg viewBox="0 0 21 21">
              <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
            </svg>
          </label>
             <p>I accept the <a href='https://communities.edgeryders.eu/tos' targer='_blank'>terms of service</a> and <a href='https://communities.edgeryders.eu/tos' targer='_blank'>privacy policy</a> <span class="required">*</span></p>
        </div>
      </div>
    </div>
    <div class="fields">
      <div class="field" v-for="(field, index) in fields" :key="index">
        <div v-if="field.text" class="{'required': field.required}" v-html="field.text"></div>
        <input v-if="field.type == 'text'" type="text" v-model="form[field.id]" :placeholder="field.placeholder"/>
        <input v-if="field.type == 'email'" type="text" v-model="form[field.id]" :placeholder="field.placeholder"/>
        <textarea v-if="field.type == 'textarea'" v-model="form[field.id]" :placeholder="field.placeholder"/>
        <div style="display: flex; align-items: items-center" v-if="field.type == 'boolean'">
          <button @click="form[field.id] == true">Yes</button>
          <button @click="form[field.id] == false">No</button>
        </div>
      </div>
    </div>
    <div class="submit" @click="submitForm">Submit</div>
  </div>
</template>

<script>
import submit from "@/helpers/discourse";

export default {
  name: "TextView",
  data() {
    return {
      topic_text: null,
      new_account: false,
      form: {},
      account: {
        username: {
          text: '',
          isValid: null
        },
        email: {
          text: '',
          isValid: null
        }
      }
    }
  },
  props: {
    title: String,
    text: String,
    fields: Array,
    config: Object
  },
  methods: {
    submitForm(){
      var form = {city: {value: "sadads"}, alias: {value: "adsads"}, bio: {value: "ads"}, name: { value: "owen" }, email: {value: "owengot@gmail.com"} };
      console.log(form);
      submit(form).then(() => window.alert('success'))
     },
    transformForSubmit(obj) {
     return Object.entries(JSON.parse(JSON.stringify(obj)))
       .reduce((result, [key, value]) => {
         result[key] = { value: (value && value.text) || value };
         return result;
       }, {});
    },
    validateUsername() {
      var username = this.account.username.text.trim();
      var self = this;
      if (username == "") {
        self.account.username.isValid = null;
      }
      if (username.length < 3 && username.length > 0) {
        self.account.username.isValid = false;
      }
      if (username.length > 2) {
        fetch('https://edgeryders.eu/u/' + username + '.json').then(response => response.json()).then(data => {
        if (data.user) {
          self.account.username.isValid = false;
        } else {
          self.account.username.isValid = true;
        }
        })
        .catch(error => { self.account.username.isValid = true } );
      }
    },
    validateEmail() {
      var email = this.account.email.text.trim();
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email == "") {
        this.account.email.isValid = null;
      } else {
        this.account.email.isValid = re.test(email);
      }
    }
  },
  created(){
    this.content = this.text;
    if (this.config && this.config.topic) {
      fetch('https://edgeryders.eu/t/' + this.config.topic + '.json')
      .then(response => response.json())
      .then(data => {
        this.topic_text = data.post_stream.posts[0].cooked;
      })
    }
  }
};
</script>

<style lang="scss">

.form {
  .account_options {
    display: flex;
    margin: 1.5rem 0;
    .option {
      text-align: left;
      padding: 20px 30px 20px;
      width: 100%;
      background: #efefef;
      &:first-child {
        border-right: 1px solid #ddd;
      }
      &:hover {
        background: black;
        color: white;
        cursor: pointer;
      }
      &.new_account {
        &:hover {
          background: #EF5D3B;
        }
        .description {
            display: none;
            opacity: 0;
            transform: translateY(20px);
            transition: all 5s ease-out;
          }
        &.active {
          > h3, > p {
            display: none;
          }
          .description {
            opacity: 1;
            transform: translateY(0px);
            display: inline-block;
            img {
              width: 25px;
              height: 25px;
              margin: 0 10px 0 0;
              position: relative;
              top: 3px;
            }
          }
          background: #fafafa;
          border-left: 4px solid #EF5D3B;
          color: black;
        }
      }
      &.login {
        &.active {
          opacity: 0;
          width: 0;
          padding: 0;
          * {
            display: none;
          }
        }
      }
      h3 {
        font-size: 1.2rem;
        border: none;
        margin: 0;
      }
      p {
        font-size: 1rem;
        line-height: 1.45rem;
      }
    }
  }
}

.create_account {
  input.username, input.email {
    transition: padding 0.3s ease;
    background-size: 20px !important;
    background-position: 10px 53% !important;
    background-repeat: no-repeat !important;
    &.available {
      background: url("data:image/svg+xml,%3Csvg width='801' height='801' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0h561c66 0 120 54 120 120v561c0 66-54 120-120 120H120C54 801 0 747 0 681V120C0 54 54 0 120 0zm209 458l230-231c11-11 28-11 38 0l30 29c11 11 11 28 0 38L347 574a26 26 0 01-37 0L175 439a26 26 0 010-38l29-29c11-11 28-11 38 0l87 86z' fill='%23009D6A' fill-rule='evenodd'/%3E%3C/svg%3E");
      padding-left: 40px;
    }
    &.notavailable {
      background: url("data:image/svg+xml,%3Csvg width='801' height='801' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0h561c66 0 120 54 120 120v561c0 66-54 120-120 120H120C54 801 0 747 0 681V120C0 54 54 0 120 0zm343.2 400.5l110.3-110.4a44.6 44.6 0 10-63-63L400 337.4l-110-110a44.6 44.6 0 10-63 63L337.4 401 227.1 511a44.6 44.6 0 1063 63l110.4-110.3 110.4 110.3a44.6 44.6 0 1063-63L463.2 400.5z' fill='%23FF4501' fill-rule='evenodd'/%3E%3C/svg%3E");
      padding-left: 40px;
    }
  }
}

.checkbox {
    --background: #fff;
    --border: #D1D6EE;
    --border-hover: #BBC1E1;
    --border-active: #1E2235;
    --tick: #fff;
    position: relative;
    input,
    svg {
        width: 22px !important;
        height: 22px !important;
        padding: 0px !important;
        display: block;
    }
    input {
        -webkit-appearance: none;
        -moz-appearance: none;
        position: relative;
        outline: none;
        background: var(--background);
        border: none;
        margin: 0;
        padding: 0;
        cursor: pointer;
        border-radius: 4px;
        transition: box-shadow .3s;
        box-shadow: inset 0 0 0 var(--s, 1px) var(--b, var(--border));
        &:hover {
            --s: 2px;
            --b: var(--border-hover);
        }
        &:checked {
            --b: var(--border-active);
        }
    }
    svg {
        pointer-events: none;
        fill: none;
        stroke-width: 2px;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: var(--stroke, var(--border-active));
        position: absolute;
        top: 1px;
        left: 0;
        width: 22px;
        height: 22px;
        transform: scale(var(--scale, 1)) translateZ(0);
    }
    &.path {
        input {
            &:checked {
                --s: 2px;
                transition-delay: .4s;
                & + svg {
                    --a: 16.1 86.12;
                    --o: 102.22;
                }
            }
        }
        svg {
            stroke-dasharray: var(--a, 86.12);
            stroke-dashoffset: var(--o, 86.12);
            transition: stroke-dasharray .6s, stroke-dashoffset .6s;
        }
    }
    &.bounce {
        --stroke: var(--tick);
        input {
            &:checked {
                --s: 11px;
                & + svg {
                    animation: bounce .4s linear forwards .2s;
                }
            }
        }
        svg {
            --scale: 0;
        }
    }
}

@keyframes bounce {
    50% {
        transform: scale(1.1);
    }
    75% {
        transform: scale(.85);
    }
    100% {
        transform: scale(.8);
    }
}

.submit {
  background: black;
  color: white;
  display: inline-block;
  width: auto;
  padding: .8rem .9rem .7rem;
  font-weight: bold;
  border-radius: 3px;
  &:hover {
    cursor: pointer;
  }
}
</style>
