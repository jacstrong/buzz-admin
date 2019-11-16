<template>
  <v-navigation-drawer
      permanent
      dark
      fixed
      clipped
      app
      width="300"
      >
      <v-layout
        fill-height
        justify-space-between
        column
        >
        
      <v-list>
        <div>

          <v-list-item
            @click="appNav('/')"
            >
            <v-list-item-action>
              <v-icon>fa-tachometer-alt</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>Dashbaord</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            prepend-icon="fa-truck-loading"
            no-action
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-title>Loads</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item
              @click="appNav('/newload')"
              >
              <v-list-item-title>New Load</v-list-item-title>
              <v-list-item-action>
                <v-icon>fa-plus</v-icon>
              </v-list-item-action>
            </v-list-item>

            <v-list-item
              @click="appNav('/activeloads')"
              >
              <v-list-item-title>Active Loads</v-list-item-title>
              <v-list-item-action>
                <v-icon>all_out</v-icon>
              </v-list-item-action>
            </v-list-item>

            <v-list-item
              @click="appNav('/searchloads')"
              >
              <v-list-item-title>Search Loads</v-list-item-title>
              <v-list-item-action>
                <v-icon>search</v-icon>
              </v-list-item-action>
            </v-list-item>

          </v-list-group>


          <v-list-group
            prepend-icon="fa-truck"
            no-action
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-title>Equipment</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item
              @click="appNav('/viewequipment')"
              >
              <v-list-item-title>View Equipment</v-list-item-title>
              <v-list-item-action>
                <v-icon>fa-list-alt</v-icon>
              </v-list-item-action>
            </v-list-item>

            <v-list-item
              @click="appNav('/addequipment')"
              >
              <v-list-item-title>Add Equipment</v-list-item-title>
              <v-list-item-action>
                <v-icon>fa-plus</v-icon>
              </v-list-item-action>
            </v-list-item>

            <v-list-item
              @click="appNav('/equipmentaction')"
              >
              <v-list-item-title>Action Items</v-list-item-title>
              <v-list-item-action>
                <v-icon>fa-clipboard-check</v-icon>
              </v-list-item-action>
            </v-list-item>

          </v-list-group>


          <v-list-group
            prepend-icon="fa-users"
            no-action
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-title>Organization</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item>
              <v-list-item-title>Manage Users</v-list-item-title>
              <v-list-item-action>
                <v-icon>fa-user-cog</v-icon>
              </v-list-item-action>
            </v-list-item>

          </v-list-group>
        </div>

      </v-list>

      <v-list avatar justify-end exact>  

        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-action>
            <v-icon>fa-graduation-cap</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>Learn</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-icon>fa-hands-helping</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>Help</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </v-layout>
    </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  data: () => ({
    logo: './img/vuetifylogo.png',
    links: [
      {
        to: '/dashboard',
        icon: 'mdi-view-dashboard',
        text: 'Dashboard'
      },
      {
        to: '/user-profile',
        icon: 'mdi-account',
        text: 'User Profile'
      },
      {
        to: '/table-list',
        icon: 'mdi-clipboard-outline',
        text: 'Table List'
      },
      {
        to: '/typography',
        icon: 'mdi-format-font',
        text: 'Typography'
      },
      {
        to: '/icons',
        icon: 'mdi-chart-bubble',
        text: 'Icons'
      },
      {
        to: '/maps',
        icon: 'mdi-map-marker',
        text: 'Maps'
      },
      {
        to: '/notifications',
        icon: 'mdi-bell',
        text: 'Notifications'
      }
    ],
    responsive: false
  }),
  computed: {
    ...mapState('app', ['image', 'color']),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
    items () {
      return this.$t('Layout.View.items')
    },
    sidebarOverlayGradiant () {
      return `${this.$store.state.app.sidebarBackgroundColor}, ${this.$store.state.app.sidebarBackgroundColor}`
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  }
}
</script>

<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;
      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }
    .v-image__image--contain {
      top: 9px;
      height: 60%;
    }
    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }
    div.v-responsive.v-image > div.v-responsive__content {
      overflow-y: auto;
    }
  }
</style>
