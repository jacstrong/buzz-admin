<template>
<div class="emailConfirmation">
  <v-content>
    <v-container fluid fill-height>
      <v-layout fill-height align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="light-blue darken-4">
              <v-toolbar-title>Verify Email</v-toolbar-title>
            </v-toolbar>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation>
              <v-card-text>
                Enter the code that was sent to your email in the box below.
              </v-card-text>
              <v-card-text>
                <v-text-field class="largeInput" label="code" solo v-model="code" type="text"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled="!isLength" @click="submit()" >Verify</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</div>
</template>

<script>
import router from '../router.js'

export default {
  name: 'EmailConfirmation',
  components: {
  },
  data: () => ({
    userID: '',
    code: '',
    valid: false
  }),
  methods: {
    nav (url) {
      router.push(url);
    },
    submit () {
      this.$http.post(`/api/user/emailconfirmation/${this.userID}`, {verificationCode: this.code})
        .then(() => {
          this.nav('/login')
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    isLength: function () {
      return this.code.length == 6;
    },
  },
  mounted () {
    if (this.$route.params.id) {
      this.userID = this.$route.params.id;
    }
    console.log(this.$route.params)
  }
}
</script>

<style lang="scss">
.home {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#content {
  padding-top: 48px;
  padding-left: 300px;
}
#nav {
  padding: 40px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
