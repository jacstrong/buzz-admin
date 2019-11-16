<template>
<div>
  <v-content>
    <v-container fluid fill-height>
      <v-layout fill-height align-center justify-center>
        <v-flex xs12 sm8 md6 lg4>
          <v-card class="elevation-12">
            <v-toolbar dark color="light-blue darken-4">
              <v-toolbar-title>Login form</v-toolbar-title>
              <!-- <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn @click="nav('/signup')" color="light-blue darken-3">Sign Up</v-btn>
              </v-toolbar-items> -->
            </v-toolbar>
            <v-form>
              <v-card-text>
                  <v-text-field v-model="email" prepend-icon="person" label="Email" type="text"></v-text-field>
                  <v-text-field
                    v-model="password"
                    prepend-icon="lock"
                    label="Password"
                    type="password"
                    @keypress.enter="submit()"
                    :error="errorMessage !== ''"
                    :error-messages="errorMessage"
                    ></v-text-field>
              </v-card-text>
              <v-card-text>
              </v-card-text>
            </v-form>
              <v-card-actions>
                <v-btn small text @click="nav('/passwordreset')" color="error">Forgot password?</v-btn>
                <v-spacer></v-spacer>
                <v-btn :disabled="!dataEntered" @click="submit()" color="success">Login</v-btn>
              </v-card-actions>
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
  name: 'Login',
  components: {
  },
  data: () => ({
    email: '',
    password: '',
    errorMessage: '',
    loading: false
  }),
  methods: {
    nav (url) {
      router.push(url);
    },
    submit () {
      let data = {
        email: this.email,
        password: this.password
      }
      this.loading = true;
      this.$http.post(`/api/admin/user/login`, data)
        .then(response => {
          this.loading = false;
          if (response.data.success === true) {
            this.setAuth(response.data.user)
            this.nav('admin/')
          }
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 401) this.errorMessage = 'Username or password incorrect'
          } else if (error.request) {
            this.errorMessage = 'server error'
          } else {
            this.errorMessage = 'internal error'
          }
          console.log(error.config);
        })
    },
    ...mapMutations({
      setAuth: 'setAuth'
    })
  },
  computed: {
    dataEntered: function () {
      return this.email !== '' && this.password !== '';
    }
  }
}
</script>

<style lang="scss">

</style>
