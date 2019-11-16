<template>
<div class="home">
  <div id="">
    <v-navigation-drawer
      permanent
      dark
      fixed
      mobile-break-point="900"
      app
      width="300"
    >
      <v-img
        class="drawer-bg"
        src="https://source.unsplash.com/collection/8471113/300x1000"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
      >
        <!-- src="https://source.unsplash.com/collection/894/300x1000" -->

        <v-layout
          fill-height
          justify-space-between
          column
        >
          <v-flex>
            
            <v-list>
              <v-list-item class="pb-2">
                <v-list-item-avatar tile>
                  <img src="@/assets/logo_small.png">
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="title">Badger</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="pt-2"></v-divider>
            </v-list>
            
            <v-list
              rounded
            >
              <v-list-item
                v-for="item in menu"
                :key="item.name"
                @click="nav(item.link)"
                :class="currentRoute === item.link ? 'primary' : ''"
              >
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

            </v-list>
          </v-flex>

          <v-list justify-end exact rounded>  
            <v-divider class="pb-2"></v-divider>
            <v-list-item
              @click="appNav('/')"
            >
              <v-list-item-action>
                <v-icon>{{ icons.mdiHelpNetwork }}</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>Help</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-layout>
      </v-img>

    </v-navigation-drawer>

    <v-app-bar
      color="primary"
      app
      absolute
      clipped-left
      height="48"
      dark
      >
        <!-- <v-toolbar-title><span class="font-weight-bold">Badger Screen Printing Co.</span> - Admin</v-toolbar-title> -->
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon><v-icon>notifications</v-icon></v-btn>


          <v-menu
            v-model="userMenu"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x
          >
            <template v-slot:activator="{ on }">
              <v-btn
                text
                icon
                color="blue"
                v-on="on"
              >
                <v-avatar
                  size="36"
                >
                  <img src="https://randomuser.me/api/portraits/men/85.jpg">
                </v-avatar>
              </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="John">
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>John Doe</v-list-item-title>
                    <v-list-item-subtitle>Badger Screen Printing Co.</v-list-item-subtitle>
                  </v-list-item-content>

                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-item>
                  <v-list-item-action>
                    <v-switch v-model="message" color="purple"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>Enable messages</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-action>
                    <v-switch v-model="hints" color="purple"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>Enable hints</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="logout()"
                  background-color="red lighten-4"
                >
                  <v-list-item-title class="font-weight-bold">Logout</v-list-item-title>
                </v-list-item>
              </v-list>

              <!-- <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text @click="menu = false">Cancel</v-btn>
                <v-btn color="primary" text @click="menu = false">Save</v-btn>
              </v-card-actions> -->
            </v-card>
          </v-menu>

        </v-toolbar-items>
      </v-app-bar>

  </div>
  <div id="content">
    <router-view/>
  </div>
</div>
</template>

<script>
import router from '@/router.js'
import { mapMutations, mapGetters, mapActions } from 'vuex'
// import drawer from '../../components/Drawer'
import {
 mdiViewDashboard,
 mdiAccountSupervisorCircle,
 mdiBridge,
 mdiHelpNetwork
} from '@mdi/js'

export default {
  name: 'AdminIndex',
  components: {
  },
  data: () => ({
    icons: {
      mdiHelpNetwork
    },
    menu: [
      {
        name: 'Dashboard',
        link: { name: 'dashboard' },
        icon: mdiViewDashboard
      },
      {
        name: 'Manage Users',
        link: { name: 'ManageUsers' },
        icon: mdiAccountSupervisorCircle
      },
      {
        name: 'Bridge',
        link: { name: 'ManageUsers' },
        icon: mdiBridge
      }


    ],
    userMenu: false,
    fav: true,
    message: false,
    hints: true
  }),
  methods: {
    appNav (url) {
      router.push('/admin' + url);
      // router.push(url);
    },
    nav(url) {
      router.push(url);
    },
    logout () {
      this.clearAuth();
      this.nav('/login');
    },
    ...mapMutations({
      clearAuth: 'clearAuth',
      setSnack: 'setSnack'
    }),
    ...mapActions({
      checkCurrentUser: 'checkCurrentUser'
    })
  },
  computed: {
    currentRoute () {
      return this.$route.name;
    },
    ...mapGetters([
      'isLoggedIn'
    ])
  },
  created () {
    this.checkCurrentUser(() => {
      if (!this.isLoggedIn) {
        this.nav({ name: 'Login' })
        this.setSnack('User not logged in.')
        console.log('LoggedOut')
      } else {
        console.log('loggedIn')
      }
    });

  }
}
</script>

<style lang="scss">
#home {
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
.drawer-bg {
  height: 100%;
}
</style>
