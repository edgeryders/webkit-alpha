<template>
  <div class="form">
                <div id="tests" ref="myEl"></div>

    <div class="introduction">
      <h2>{{form.config.title}}</h2>
      <p v-if="!success" v-html="form.config.text"></p>
    </div>
    <div class="logged_in" v-if="apikey && account && account.username && !success">
      <p>You're logged in as <a :href="'https://edgeryders.eu/u/' + account.username" target="_blank">@{{account.username}}</a></p>
    </div>
    <div class="account" :class="{hide: success}" v-else>
     
      <h2><a :href="loginUrl">Login to my existing account</a></h2>
      <h2  class="login">{{form.config.account.title}}</h2>
      <p v-html="form.config.account.text"></p>
      <div class="account_fields">
        <div class="field">
          <h3>Your Email</h3>
          <input @keydown.space.prevent @keyup="validateEmail()" :class="{ valid: valid.email, error: valid.email == false || valid.errors.includes('email') }" v-model="response.account.email" placeholder="email" />
        </div>
        <div class="field">
          <h3>Desired Username</h3>
          <input v-model="response.account.username" :class="{ valid: valid.username, error: valid.username == false || valid.errors.includes('username') }" @keydown.space.prevent @keyup="validateUsername()" placeholder="username" />
        </div>
      </div>
    </div>
    <div class="fields" :class="{hide: success}">
      <div class="field" v-for="(field, index) in form.fields" :key="index">
        <h3 v-if="field.title">{{field.title}}</h3>
        <p v-if="field.text && field.type !== 'checkbox' && field.type !== 'consent'">{{field.text}}</p>
        <input class="text" v-if="field.type == 'input' || field.type == 'text'" :placeholder="placeholder(field)" v-model="response.fields[index]['answer']" />
        <textarea :class="{error: valid.questions.includes(index)}" v-if="field.type == 'textarea'" :placeholder="placeholder(field)" v-model="response.fields[index]['answer']"></textarea>
        <select class="select-css" v-if="field.type == 'select'" v-model="response.fields[index]['answer']">
          <option v-for="(option, option_index) in field.options" :key="option_index" :value="option">{{option}}</option>
        </select>
        <div class="radio" v-if="field.type == 'radio'">
          <div v-for="(option, option_index) in field.options" class="radio_field" :key="option_index">
            <input type="radio" :id="option_index" :value="option" v-model="response.fields[index]['answer']">
            <label :for="option_index">{{option}}</label>
          </div>
        </div>
        <div class="checkbox_field" v-if="field.type == 'checkbox'">
         <input class="inp-cbx" id="cbx" type="checkbox" v-model="response.fields[index]['answer']" style="display: none;"/>
          <label class="cbx" for="cbx"><span>
            <svg width="12px" height="9px" viewbox="0 0 12 9">
              <polyline points="1 5 4 8 11 1"></polyline>
            </svg></span><span>{{field.text}}</span>
          </label>
        </div>

        <div class="consent_field" v-if="field.type == 'consent'">
        <h3>Research Consent Agreement</h3>
        <p v-html="field.text"></p>
         <input class="inp-cbx" id="cbx" type="checkbox" v-model="response.fields[index]['answer']" style="display: none;"/>
          <label class="cbx" for="cbx"><span>
            <svg width="12px" height="9px" viewbox="0 0 12 9">
              <polyline points="1 5 4 8 11 1"></polyline>
            </svg></span><span>{{field.label}}</span>
          </label>
        </div>

      </div>
    </div>

     <div class="errors" v-if="valid.errors.length && !apikey || valid.questions.length && !apikey">
      <p v-if="valid.errors.length">Please enter a valid 
        <span v-for="(error, index) in valid.errors" :key="index">
          <span style="font-weight: bold">{{error}}</span>
          <span v-if="valid.errors.length > 1 && index == valid.errors.length-2"> and </span> 
          <span v-if="valid.errors.length > 2 && index < valid.errors.length-2">, </span> 
        </span> 
      </p>
      <p v-if="valid.questions.length">Please answer <span style="font-weight: bold">question<span v-if="valid.questions.length > 1">s</span> <span v-for="(error, index) in valid.questions" :key="index"><span v-if="index != 0 && index != valid.questions.length"> & </span> {{error + 1}}</span></span></p>
    </div>

    <div class="confirmation" v-if="success">
      <h2>{{form.config.confirmation.title}}</h2>
      <p v-html="form.config.confirmation.text" v-if="!apikey.key"></p>
      <p v-else>Thanks for your submission <a :href="'https://edgeryders.eu/u/' + account.username" target="_blank">@{{account.username}}</a>! Your answer is <a :href="post_url" target="_blank">here</a>, be sure to check in to see comments from other Edgeryders.</p>
    </div>
    
    <button v-if="!success" @click="sendForm">{{submit}}</button>


  </div>
</template>

<script>

import forge from 'node-forge'
import submit from '@/helpers/discourse'

export default {
  name: 'edgeryders-form',
  data: () => ({
    form: null,
    redirect: 'hi',
    formId: "14202",
    valid: {
      email: null,
      username: null,
      questions: [],
      errors: []
    },
    response: {
      account: {
        email: '',
        password: '',
        username: ''
      },
      fields: null
    },
    errors: null,
    submit: 'Submit',
    success: false,
    post_url: null,
    code: '',
    loginUrl: null,
    apikey: null,
    keyPair: null,
    forgeKeypair: null,
    user: null,
    pubkey1: null,
    pubkey2: null,
    privKey: null,
    privateKey: null,
    pathname: '1',
    account: null
  }),
  methods: {
    login(){
      var applicationName = "Edgeryders Webkit";
      var scopes = "read,write";
      
      var ClientId_raw = crypto.getRandomValues(new Uint8Array(30));
      var randomClientId = toBase64URL(btoa(ab2str(ClientId_raw)));
      
      var redirectUrl = window.location.href.replace(/\/+$/, '') + '/auth_redirect';
      console.log(redirectUrl)

      function ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
      }
      function toBase64URL(base64) {
        return base64
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
      }
      // var forgeKeypair = forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001});

      var pem = "-----BEGIN RSA PRIVATE KEY----- MIIEpAIBAAKCAQEA08/hMLzcR5pdTGKb09MpnUZTM8GGMii+ow3dmcs5Zvlyz0Ib fxrYhq8h1Jm1/SBvErY+Jj0YB1O9WjaGQNvL8dFukUB2bAYE9IraWvc2GJyljIqi 2dPDc7eTR+v55Ofh2ZYjr18xK9TlsCAwJm9SRR6orMHK1vzosuPgbiAainXyC6ru tTcW5iiDhM/1VatzxK6tXC1W01ScREke+BEG6Vaca8No4cPm8CTidtVlvYgebH1E SM7dY2BQJkE+HFHXp8jIsP8x6k2GZyX8n7wROkzZrfI/YTspGcLJFDRdfUKodkCM d8fEgSOMNqDb/ur2BOHETsSmKESEjMv5jA4dswIDAQABAoIBAQC97bPRzigAFM0A R5PPV5QDMSI+UJQSujJnZ3GEDJUGXzux2WdqjBoIe1Xsm4By3/h5YO1NwI6hU1eB Y07zLaQszE1G9fS6XJNo7HFsDCx32U8hPNdWV+r1AnGQlmrX9Y2xXE3XXZZr5VWo ntROQpgU3q8FaiiGqvXGI0wFs8fYytRCwOMlKGVcWa7K3r5aiuwllRuiyqx7hz11 x6W4y3sgWRLpIh1W9qXk3Vo9/uMGX6yGUVyAxgI/y9TacwsUHrNUuO+ALQhz+4tF l8ChzF8KKnIlWG3Bbhix7UguO7gzKmw/Jsf38WpqqvtJlcpS2bOeriQsP5KesXXs MONG6/IBAoGBAPF9qa0p1dg+49E3/+xuV8PP3Ow4zw6tNbqq+X+1ELfml1GEP6Qm /magnGRupv6tis2NPhf/LTUwB2T8nFn2TRVQL3N3OfNPzHTKxUZ3ta8UH3nqHd0j rE6gdLO/B2FO/UygLMkrFymEMcsCYUjeNs0IxKnYU6FwXTrHampL6AuBAoGBAOCJ uxO+FrcwGAxtvUED7upRvdvDmVIvUn+l9O+HO4B48vp+33T85kqZoLMYE6IegGRR hUvnn0Gy2JSRVQ94hvGrzec+H9oeG1g6xpGTDctKHCOs9O3OlB1/yYfTeQ1d35lb calb9zFUucJwVXp38S44KVLFHdzC99ApxZ3RmVMzAoGBAJEwRhVQM7uBhCLDkmCp rqaRkHeNaB+gz87dAIhhah3Gy289Ha4pq4Y0RhKz3D7+Q5d1tcFjr+BsceWrYq1L wehwfzbilbrNXVVSm+zUCC2s4YfA1BeiXPQg0ElJLry4at3o50RDXfed/PnbAnZ2 82euP98FqrJDBipSvo4N+QMBAoGAG02EGv11Q6csdW5uodY5mfKAlJVvMkggzva+ FtYpzRBn8z+0KkSKOC4AFWbrFD6DPC+Rds5eVh3KKh6V6kCsn/xVGDY8p0gb6RmU haUM+1gynb/tNHF3HzMnrUVwpchxZPNymbZeE3iK8fK44iBtikI3/CGN5QcsHPrH Vc5jx3MCgYB7l60OR55LkkdlG+p9uqEkbc439rMjcT8AtV8JpwJ5q5MkGF+Z8bBp F1KVJLWcUXXjmrEE+yAeoSvGDgQPukkobRRLeno4iKpO6pacq4jxRvlJooNoAXRj +yJGiXWEbakLuGAgN7okTqQ56XTaPNwVxTnx61p1BH8h8Z66TgeG2Q== -----END RSA PRIVATE KEY-----"

      var privKey = forge.pki.privateKeyFromPem(pem);
      this.privateKey = privKey;
      var pubKey = forge.pki.rsa.setPublicKey(privKey.n, privKey.e);

      this.pubkey1 = forge.pki.publicKeyToPem(pubKey).replace(/\r/g, '');

        const url = new URL('https://edgeryders.eu');
        url.pathname = '/user-api-key/new';
        url.searchParams.set('auth_redirect', redirectUrl);
        url.searchParams.set('application_name', applicationName);
        url.searchParams.set('client_id', randomClientId);
        url.searchParams.set('scopes', scopes);
        url.searchParams.set('public_key', this.pubkey1);
        url.searchParams.set('nonce', this.formId);

      this.loginUrl = url.href;

    },
    postTopic() {
      var payload = {
        title: this.form.config.title + " - response by @" + this.account.username,
        raw: this.markdownResponse()
      };

      if (this.form.config.publish.category) {
        payload["category"] = this.form.config.publish.category
      }

      if (this.form.config.publish.topic) {
        payload["topic_id"] = this.form.config.publish.topic
      }

      var payload_json = JSON.stringify(payload);

      fetch("https://edgeryders.eu/posts.json", {
        method: 'post',
        headers: { 'User-Api-Key': this.apikey.key, 'Content-Type': 'application/json' },
        body: payload_json
      }).then((response) => response.json())
        .then((data) => {
          if (this.form.config.publish.topic) {
            this.post_url = "https://edgeryders.eu/t/" + data.topic_id + "/" + data.post_number
          }
          if (this.form.config.publish.category) {
            this.post_url = "https://edgeryders.eu/t/" + data.topic_id
          }
          this.proceed()
        })

    },
    getUser() {
      var self = this;
      fetch("https://edgeryders.eu/session/current.json", {
        method: 'get',
        headers: { 'User-Api-Key': this.apikey.key, 'Content-Type': 'application/json' }
      }).then((response) => response.json())
        .then((data) => {
          self.account = data.current_user;
        })
      
    },
    decrypt(payload){
      var pem = "-----BEGIN RSA PRIVATE KEY----- MIIEpAIBAAKCAQEA08/hMLzcR5pdTGKb09MpnUZTM8GGMii+ow3dmcs5Zvlyz0Ib fxrYhq8h1Jm1/SBvErY+Jj0YB1O9WjaGQNvL8dFukUB2bAYE9IraWvc2GJyljIqi 2dPDc7eTR+v55Ofh2ZYjr18xK9TlsCAwJm9SRR6orMHK1vzosuPgbiAainXyC6ru tTcW5iiDhM/1VatzxK6tXC1W01ScREke+BEG6Vaca8No4cPm8CTidtVlvYgebH1E SM7dY2BQJkE+HFHXp8jIsP8x6k2GZyX8n7wROkzZrfI/YTspGcLJFDRdfUKodkCM d8fEgSOMNqDb/ur2BOHETsSmKESEjMv5jA4dswIDAQABAoIBAQC97bPRzigAFM0A R5PPV5QDMSI+UJQSujJnZ3GEDJUGXzux2WdqjBoIe1Xsm4By3/h5YO1NwI6hU1eB Y07zLaQszE1G9fS6XJNo7HFsDCx32U8hPNdWV+r1AnGQlmrX9Y2xXE3XXZZr5VWo ntROQpgU3q8FaiiGqvXGI0wFs8fYytRCwOMlKGVcWa7K3r5aiuwllRuiyqx7hz11 x6W4y3sgWRLpIh1W9qXk3Vo9/uMGX6yGUVyAxgI/y9TacwsUHrNUuO+ALQhz+4tF l8ChzF8KKnIlWG3Bbhix7UguO7gzKmw/Jsf38WpqqvtJlcpS2bOeriQsP5KesXXs MONG6/IBAoGBAPF9qa0p1dg+49E3/+xuV8PP3Ow4zw6tNbqq+X+1ELfml1GEP6Qm /magnGRupv6tis2NPhf/LTUwB2T8nFn2TRVQL3N3OfNPzHTKxUZ3ta8UH3nqHd0j rE6gdLO/B2FO/UygLMkrFymEMcsCYUjeNs0IxKnYU6FwXTrHampL6AuBAoGBAOCJ uxO+FrcwGAxtvUED7upRvdvDmVIvUn+l9O+HO4B48vp+33T85kqZoLMYE6IegGRR hUvnn0Gy2JSRVQ94hvGrzec+H9oeG1g6xpGTDctKHCOs9O3OlB1/yYfTeQ1d35lb calb9zFUucJwVXp38S44KVLFHdzC99ApxZ3RmVMzAoGBAJEwRhVQM7uBhCLDkmCp rqaRkHeNaB+gz87dAIhhah3Gy289Ha4pq4Y0RhKz3D7+Q5d1tcFjr+BsceWrYq1L wehwfzbilbrNXVVSm+zUCC2s4YfA1BeiXPQg0ElJLry4at3o50RDXfed/PnbAnZ2 82euP98FqrJDBipSvo4N+QMBAoGAG02EGv11Q6csdW5uodY5mfKAlJVvMkggzva+ FtYpzRBn8z+0KkSKOC4AFWbrFD6DPC+Rds5eVh3KKh6V6kCsn/xVGDY8p0gb6RmU haUM+1gynb/tNHF3HzMnrUVwpchxZPNymbZeE3iK8fK44iBtikI3/CGN5QcsHPrH Vc5jx3MCgYB7l60OR55LkkdlG+p9uqEkbc439rMjcT8AtV8JpwJ5q5MkGF+Z8bBp F1KVJLWcUXXjmrEE+yAeoSvGDgQPukkobRRLeno4iKpO6pacq4jxRvlJooNoAXRj +yJGiXWEbakLuGAgN7okTqQ56XTaPNwVxTnx61p1BH8h8Z66TgeG2Q== -----END RSA PRIVATE KEY-----"


      var privKey = forge.pki.privateKeyFromPem(pem);
      this.privateKey = privKey;

      const cleanPayload = payload.replace(/ /g, '');
      const cypherCode = atob(cleanPayload);
      const decryptCode = this.privateKey.decrypt(cypherCode, 'RSAES-PKCS1-V1_5');
      const result = JSON.parse(decryptCode);
      this.apikey = result;
      this.getUser()
    },
    getFormRemote(id) {
      var self = this;
      fetch("https://edgeryders.eu/raw/" + id + ".json")
      .then((response) => {
        response.text().then(function(text) {
          var form = self.parseJson(text);
          self.submit = self.submitText(form.fields);
          self.form = form;
          var fields = form.fields.filter(x => x.type !== 'submit');
          self.response.fields = fields.map(x => self.createEntry(x));
          self.form.fields = fields;
        });
      })
      .catch((error) => console.error(error));
    },
    getFormLocal() {
      this.response.fields = this.form.fields.filter(x => x.type !== 'submit').map(x => this.createEntry(x));
    },
    parseJson(value) {
      var code = value.match(/```([^`]*)```/);
      if (code) {
        return JSON.parse(code[1]);
      } else {
        return false;
      }
    },
    createEntry(field) {
      var obj = {
        question: field.title,
        answer: '',
        required: field.required || false
      }
      return obj
    },
    markdownResponse() {
      return this.response.fields.map((field) => `**${field.question}** <br /> ${field.answer} <br /><br />`).join(' ');
    },
    validateForm() {
      var errors = [];
      var required = [];
      if (this.response.account.email == '' || this.valid.email == false) {
        errors.push("email")
      } 
      if (this.response.account.username == '' || this.response.account.username == null || this.valid.username == false) { 
        errors.push("username")
      } 

      for (var i = this.response.fields.length - 1; i >= 0; i--) {
        if (this.response.fields[i].required == true && this.response.fields[i].answer == '') {
          required.push(i)
        }
      }

      this.valid.errors = errors
      this.valid.questions = required
    },
    sendForm() {
      this.validateForm();
      if (this.apikey) {
        if (this.valid.questions.length == 0) {
          this.postTopic();
        }
      }
      else {
        if (this.valid.errors.length == 0 && this.valid.questions.length == 0) {
          submit(this.response, this.markdownResponse(), this.form.messages, this.form.config).then(this.proceed, this.fail)
        }
      }
    },
    validateEmail() {
      var email = this.response.account.email.trim();
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email == "") {
        this.valid.email = null;
      } else {
        this.valid.email = re.test(email);
      }
    },
    validateUsername() {
      var username = this.response.account.username.trim();

      var self = this;
      if (username == "") {
        self.valid.username = null;
      }
      if (username.length < 3 && username.length > 0) {
        self.valid.username = false;
      }
      if (username.length > 2) {
        fetch('https://edgeryders.eu/u/' + username + '.json').then(response => response.json()).then(data => {
        if (data.user) {
          self.valid.username = false;
        } else {
          self.valid.username = true;
        }
        })
        .catch(error => { self.valid.username = true } );
      }
    },
    submitText(fields) {
      var field = fields.filter(x => x.type == 'submit');
      if (field && field[0] && field[0].text) {
        return field[0].text
      } else {
        return 'Submit'
      }
    },
    getAvatar(template){
      return "https://edgeryders.eu" + template.replace('{size}', 200)
    },
    proceed() { this.success = true },
    fail(errors) { this.errors = errors },
    placeholder(field) {
      if (field.placeholder) {
        return field.placeholder
      } else {
        return field.title
      }
    },
     scroll() {
   var options = {
        easing: 'ease-in',
        offset: -130,
        force: true,
        cancelable: true,
        x: false,
        y: true
    }
    const myEl = this.$refs.myEl

    this.$scrollTo(myEl, 500, options)
    }

  },
  created() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const payloadParam = urlParams.get('payload')
    if (this.view.config.data) {
      this.formId = this.view.config.data
    }
    if (payloadParam) {
      setTimeout(() =>  this.scroll(), 500);
      const payload = decodeURIComponent(payloadParam);
      this.decrypt(payload);
      this.getFormRemote(this.formId);
    } else {
      this.getFormRemote(this.formId);
      this.login()
    }
  },
  props: ["view"]
}
</script>

<style lang="scss">

.hide {
  display: none !important;
}
@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(10px)
  }
  100% {
    opacity: 1;
    transform: translateY(0px)
  }
}
.form {
  display: flex;
  width: 100%;
  margin: 0;
  flex-direction: column;
  font-family: Helvetica, sans-serif;
  .introduction {
    width: 100%;
    h2 {
      @apply font-bold text-2xl mb-2;
    }
    p {
      @apply leading-normal text-lg;
      font-weight: 100;
    }
    a {
     text-decoration: underline;
     font-weight: bold;
   }
  }
  .confirmation {
    opacity: 0;
    animation: slideUp 1s ease forwards;
  }
  .logged_in {
    padding: 1.3rem 1.5rem;
    margin: 1rem 0;
    border-left: 4px solid #FE5A35;
    background: #fafafa;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    p {
      line-height: 1.7rem !important;
      font-size: 1.1rem;
      margin: 0;
      a {
        color: black;
        font-weight: bold;
        text-decoration: none;
        &:hover {
          color: orangered
        }
      }
    }
  }
  .account {
    h2 {
      @apply inline-block font-bold text-xl;
      margin: 0 0 .5rem 0 !important;
        a {
        color: #FE5A35;
        text-decoration: underline;
      }
    }
    h2.login {
      @apply w-full text-xl block font-bold;
      border-top: 1px solid #ddd;
      padding-top: .5rem !important;
    
    }
  }
  .account, .confirmation {
    display: flex;
    padding: 1.75rem 2rem 1.5rem;
    margin: 2rem 0 1rem;
    border-left: 4px solid #FE5A35;
    background: rgba(0,0,0,0.02);
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    h2 {
      margin: 0 0 1rem 0
    }
    .account_fields {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .field {
        width: 48%;
        @apply mt-3;
        h3 {
          @apply font-bold mb-2;
        }
      }
    }
    input {
      padding: .7rem .75rem;
      border: 3px solid #efefef;
      transition: border .35s ease;
      border-radius: 3px;
      font-size: .85rem;
      width: 100%;
      font-weight: 400;
      background-color: white !important;
      &.error {
        border: 3px solid rgba(255, 66, 40, 0.9);
      }
      &.valid {
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 320'%3E%3Cpath fill='%23329C4E' d='M226 97c-4-4-7-11-7-17V57c0-11-9-20-20-20h-23c-6 0-13-3-17-7l-17-17c-8-8-20-8-28 0L97 30c-4 4-11 7-17 7H57c-11 0-20 9-20 20v23c0 6-3 14-7 17l-17 17c-8 8-8 21 0 28l17 17c4 4 7 11 7 17v23c0 11 9 20 20 20h23c6 0 14 4 17 8l17 16c8 8 21 8 28 0l17-16c4-4 11-8 17-8h23c11 0 20-9 20-20v-23c0-5 4-13 8-17l16-17c8-7 8-20 0-28l-17-17zm-108 63l-33-34 10-10 24 23 42-43 11 11-54 53z'/%3E%3C/svg%3E") 96% 10px no-repeat;
        background-size: 23px;
      }
      &:focus {
        border: 3px solid rgba(0,0,0,0.3);
        outline: none;
      }
    }
    p {
      @apply leading-normal;
      margin: 0rem 0 0;
    }
    .field {
      margin: 0 0 2rem
      h3 {
        margin: 0
      }
      input {
        margin: 0
      }
    }
  }
  .fields {
    margin-top: 1.4rem;
    .field {
      margin-top: 0;
      margin-bottom: 2rem;
      h3 {
        line-height: 1.7rem;
        font-weight: 600;
        font-size: 1.3rem;
        margin: 0 0 1rem;
      }
      p {
        line-height: 1.7rem;
        font-weight: 100;
        font-size: 1.2rem;
        margin: 0 0 1.5rem;
         a {
           text-decoration: underline !important
         }
      }
    }
  }
  input.text {
      padding: .7rem .75rem;
      border: 3px solid #efefef;
      transition: border .35s ease;
      border-radius: 3px;
      font-size: 1.1rem;
      width: 100%;
      margin: 0;
      font-weight: 400;
      background-color: white;
      &:focus {
        border: 3px solid rgba(0,0,0,0.3);
        outline: none;
      }
  }
  textarea {
    width: 100%;
    height: 300px;
    border: 3px solid #efefef;
    font-size: 1.1rem;
    line-height: 1.8rem;
    padding: 1rem;
    border-radius: 5px;
    transition: border .35s ease;
    &:focus {
      border: 3px solid rgba(0,0,0,0.3);
      outline: none;
    }
    &.error {
      border: 3px solid rgba(255, 66, 40, 0.9);
    }
  }
  .errors {
    padding: 1rem 1rem;
    margin: 1.5rem 0 0.5rem;
    color: white;
    background: rgba(255, 66, 40, 0.9);
    border: 3px solid rgba(0,0,0,0.06);
    p {
      margin-top: 0;
      margin-bottom: .5rem;
      &:last-child {
        margin: 0;
      }
    }
  }
  button {
    @apply text-base;
    padding: .75rem 1rem;
    background: white;
    width: auto;
    align-self: flex-start;
    background: #FE5A35;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
      background: #EA5128;
    }
  }
  .radio_field {
    margin-bottom: 1rem;
    border-bottom: 1px solid #ddd;
    width: 50%;
    padding-bottom: 1rem;
       font-weight: bold;

    &:last-child {
      border: none;
    }
    &:hover [type="radio"]:not(:checked) + label {
      color: #000;
    }

    [type="radio"]:checked,
[type="radio"]:not(:checked) {
    position: absolute;
    left: -9999px;
}
[type="radio"]:checked + label,
[type="radio"]:not(:checked) + label
{
    position: relative;
    padding-left: 34px;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
   color: rgba(0,0,0,0.8);
}
[type="radio"]:checked + label:before,
[type="radio"]:not(:checked) + label:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 18px;
    height: 18px;
    border: 2px solid #ddd;
    border-radius: 100%;
    background: #fff;
}
[type="radio"]:checked + label:after,
[type="radio"]:not(:checked) + label:after {
    content: '';
    width: 14px;
    height: 14px;
    background: #FE5A35;
    position: absolute;
    top: 4px;
    left: 4px;
    border-radius: 100%;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}
[type="radio"]:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
}
[type="radio"]:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
}
[type="radio"]:checked + label {
   color: #FE5A35;
   font-weight: bold;
}
  }
  .checkbox_field {
    display: flex;
  }
}


.menu {
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  background: #fafafa;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .profile {
    display: flex;
    align-items: center;
    margin-right: 2rem;

    img {
      width: 25px;
      height: 25px;
      border-radius: 4px;
      margin-right: 10px;
    }
    p {
      font-weight: bold;
      font-size:1rem;
    }
  }
}

@media only screen and (max-width: 600px) {
  .form {
    margin: 0 !important;
    .introduction {
      width: 85%;
      margin: 0 auto;
      p {
        line-height: 1.75rem;
        font-size: 1.1rem;
      }
      .title {
        h2 {
          font-size: 1.5rem;
        }
      }
    }
    width: 100%;
    margin: 30px auto;
    .introduction {
      padding: 0;
      .title {
        display: block;
      }
    }
    .account {
      border: none;
      padding: 3rem 7%;
      .account_fields {
        flex-direction: column;
        .field {
          width: 100%;
        }
      }
    }
    .fields {
      width: 85%;
      margin: 1rem auto;
    }
    button {
      width: 85%;
      margin: 0 auto;
    }
  }
}

/* class applies to select element itself, not a wrapper element */
.select-css {
    display: block;
    font-size: 16px;
    font-family: sans-serif;
    font-weight: 700;
    color: #444;
    line-height: 1.3;
    padding: .6em 1.4em .5em .8em;
    width: 50%;
    max-width: 100%; /* useful when width is set to anything other than 100% */
    box-sizing: border-box;
    margin: 0;
    border: 1px solid #ddd;
    border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    /* note: bg image below uses 2 urls. The first is an svg data uri for the arrow icon, and the second is the gradient. 
        for the icon, if you want to change the color, be sure to use `%23` instead of `#`, since it's a url. You can also swap in a different svg icon or an external image reference
        
    */
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23888%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
    background-repeat: no-repeat, repeat;
    /* arrow icon position (1em from the right, 50% vertical) , then gradient position*/
    background-position: right .7em top 50%, 0 0;
    /* icon size, then gradient */
    background-size: .65em auto, 100%;
}
/* Hide arrow icon in IE browsers */
.select-css::-ms-expand {
    display: none;
}
/* Hover style */
.select-css:hover {
    border-color: #888;
      background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FE5A35%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
}
/* Focus style */
.select-css:focus {
border: 1px solid #ddd;
    color: #222; 
    outline: none !important;
      background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FE5A35%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
}

/* Set options to normal weight */
.select-css option {
    font-weight:normal;
}

/* Support for rtl text, explicit support for Arabic and Hebrew */
*[dir="rtl"] .select-css, :root:lang(ar) .select-css, :root:lang(iw) .select-css {
    background-position: left .7em top 50%, 0 0;
    padding: .6em .8em .5em 1.4em;
}

/* Disabled styles */
.select-css:disabled, .select-css[aria-disabled=true] {
    color: graytext;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22graytext%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
}

.select-css:disabled:hover, .select-css[aria-disabled=true] {
    border-color: #aaa;
}

.cbx {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  margin-top: .75rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
}
.cbx span {
  display: inline-block;
  vertical-align: middle;
  transform: translate3d(0, 0, 0);
}
.cbx span:first-child {
  position: relative;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  transform: scale(1);
  vertical-align: middle;
  border: 2px solid #ddd;
  margin-left: 1px;
  transition: all 0.2s ease;
}
.cbx span:first-child svg {
  position: absolute;
  z-index: 1;
  top: 5.8px;
  left: 3.6px;
  fill: none;
  stroke: white;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 16px;
  stroke-dashoffset: 16px;
  transition: all 0.3s ease;
  transition-delay: 0.1s;
  transform: translate3d(0, 0, 0);
}
.cbx span:first-child:before {
  content: "";
  width: 100%;
  height: 100%;
  background: #FE5A35;
  display: block;
  transform: scale(0);
  opacity: 1;
  border-radius: 50%;
  transition-delay: 0.2s;
}
.cbx span:last-child {
  margin-left: 11px;
}

.cbx:hover span:first-child {
  border-color: #FE5A35;
}

.inp-cbx:checked + .cbx span:first-child {
  border-color: #FE5A35;
  background: #FE5A35;
  animation: check 0.6s ease;
}
.inp-cbx:checked + .cbx span:first-child svg {
  stroke-dashoffset: 0;
}
.inp-cbx:checked + .cbx span:first-child:before {
  transform: scale(2.2);
  opacity: 0;
  transition: all 0.6s ease;
}

@keyframes check {
  50% {
    transform: scale(1.2);
  }
}



</style>