<template>
<div class="cancelEmailConfirmation">
    <v-content>
    <v-container fluid fill-height>
      <v-layout fill-height align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            
            <v-card-text v-if="loading === false">
              The account creation request has been canceled. If you have any questions contact us at <a href="mailto:support@load-stream.com">support@load-stream.com</a>
            </v-card-text>
            <v-card-text v-else>
              Loading
            </v-card-text>
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
  name: 'CancelEmailConfirmation',
  components: {
  },
  data: () => ({
    loading: true,
  }),
  methods: {
    nav (url) {
      router.push(url);
    }
  },
  mounted () {
    if (this.$route.params.id) {
      const userID = this.$route.params.id;
      this.$http.delete(`/api/user/emailconfirmation/${userID}`)
        .then(() => {
           this.loading = false;
        })
    }
  }
}
</script>

<style lang="scss">
#cancelEmailConfirmation {
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
