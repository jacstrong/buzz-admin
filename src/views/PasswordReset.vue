<template>
<div>
  <v-content>
    <v-container fluid fill-height>
      <v-layout fill-height align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="light-blue darken-4">
              <v-toolbar-title>Password Reset</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn @click="nav('/login')" color="light-blue darken-3">Login</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <div v-if="id===null && submitted===false">
              <v-card-text class="headline">
                Please enter your email below and a password reset link will be sent to the email.
              </v-card-text>
              <v-form
                ref="emailForm"
                v-model="emailValid"
                lazy-validation>
                <v-card-text>
                    <v-text-field v-model="email" :rules="emailRules" prepend-icon="mail" label="Email" type="text" outline></v-text-field>
                </v-card-text>
              </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="!emailValid" @click="submitRequest()" color="success">Submit Request</v-btn>
                </v-card-actions>
            </div>
            <div v-else-if="submitted===true">
              <v-card-text class="subheading">
                Your request has been submitted. If you do not see the request to your email in a few minutes, please check your spam folder.
              </v-card-text>
            </div>
            <div v-else-if="changeSuccess===false">
              <v-card-text class="subheading">
                Please enter your email below and a password reset link will be sent to the email.
              </v-card-text>
              <v-card-text>
                <p class="body-2 mb-1">Password must contain:</p>
                <ul>
                  <li class="caption"  v-if="containsUpper">Upper case letters <v-icon color="#388E3C" small>check_circle</v-icon></li>
                  <li class="caption" v-else>Upper case letters <v-icon color="#B71C1C" small>highlight_off</v-icon></li>
                  <li class="caption" v-if="containsLower">Lower case letters <v-icon color="#388E3C" small>check_circle</v-icon></li>
                  <li class="caption" v-else>Lower case letters <v-icon color="#B71C1C" small>highlight_off</v-icon></li>
                  <li class="caption" v-if="containsNumber">Number <v-icon color="#388E3C" small>check_circle</v-icon></li>
                  <li class="caption" v-else>Number <v-icon color="#B71C1C" small>highlight_off</v-icon></li>
                  <li class="caption" v-if="containsSymbol">Symbol <v-icon color="#388E3C" small>check_circle</v-icon></li>
                  <li class="caption" v-else>Symbol <v-icon color="#B71C1C" small>highlight_off</v-icon></li>
                  <li class="caption" v-if="isLongEnough">At least 10 characters <v-icon color="#388E3C" small>check_circle</v-icon></li>
                  <li class="caption" v-else>At least 10 characters <v-icon color="#B71C1C" small>highlight_off</v-icon></li>
                  </ul>
              </v-card-text>
              <v-form
                ref="passForm"
                v-model="passValid"
                lazy-validation>
                <v-card-text>
                  <v-text-field v-model="password" label="New Password" type="password" outline></v-text-field>
                  <v-text-field v-model="passwordConf" @click="passwordTooltip = true" label="Confirm Password" type="password" outline></v-text-field>
                </v-card-text>
              </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="passwordTooltip = !passwordTooltip" color="success">text</v-btn>
                  <v-btn :disabled="!passComplete" @click="submitNew()" :loading="loading" color="success">Change Password</v-btn>
                </v-card-actions>
            </div>
            <div v-else>
              <v-card-text class="subheading">
                Your password has successfully been changed. Please click the login button above to return to the login page.
              </v-card-text>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</div>
</template>

<script>
import router from '../router.js';
import { mapMutations } from 'vuex';

export default {
  name: 'PasswordReset',
  components: {
  },
  data: () => ({
    email: '',
    emailValid: false,
    passwordTooltip: false,
    password: '',
    passwordConf: '',
    passValid: false,
    submitted: false,
    changeSuccess: false,
    loading: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    id: null
  }),
  methods: {
    nav (url) {
      router.push(url);
    },
    submitRequest () {
      if (this.$refs.emailForm.validate()) {
        let data = {
          email: this.email
        }
        this.loading = true;
        this.submitted = true;
        this.$http.post(`/api/admin/user/password/forgotpassword/`, data)
          .then(() => {
            
          })
          .catch(err => {
            console.log(err);
            this.setSnack('An error occured.')
          })
          .finally(() => {
            this.loading = false;
          })
      }
    },
    submitNew () {
      this.loading = true;
      let data = {
        password: this.password
      }
      this.$http.post(`/api/admin/user/password/forgotpassword/${this.$route.params.id}`, data)
        .then(() => {
          this.changeSuccess = true;
        })
        .catch(err => {
          console.log(err);
          this.setSnack('An error occured.')
        })
        .finally(() => {
          this.loading = false;
        })
    },
    ...mapMutations({
      setSnack: 'setSnack'
    })
  },
  mounted() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    }
  },
  computed: {
    containsLower: function () {
      return /[a-z]/.test(this.password);
    },
    containsNumber: function () {
      return /[0-9]/.test(this.password);
    },
    containsSymbol: function () {
      return /[^a-zA-Z0-9]/.test(this.password);
    },
    containsUpper: function () {
      return /[A-Z]/.test(this.password);
    },
    passComplete: function () {
      return this.passValid && this.containsLower && this.containsNumber && this.containsSymbol && this.containsUpper && this.passwordsMatch;
    },
    isLongEnough: function () {
      return this.password.length > 10;
    },
    passwordsMatch: function () {
      return this.password === this.passwordConf;
    }
  }
}
</script>

<style lang="scss">

</style>
