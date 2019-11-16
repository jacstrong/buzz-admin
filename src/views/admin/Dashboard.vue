<template>
  <v-container grid-list-xs>
    <h2>Active Stores</h2>
    <hr>
    <v-btn
      class="ma-3"
      color="accent"
      @click.stop="newDialog = true"
    >New Store</v-btn>
    <v-layout row wrap>
      <v-flex
        xs12
        md6
        lg4
        pa-3
        v-for="item in stores"
        :key="item.name"
      >
        <v-card>
          <v-card-title
            :class="item.active ? 'green lighten-4' : 'blue-grey lighten-4'"
          >{{ item.name }}</v-card-title>
          <v-card-text class="pb-0 pt-1">
            <p class="text-truncate"><span class="black--text">Description:</span> {{ item.description }}</p>
            <p class="text-truncate"><span class="black--text">Customer Name:</span> {{ item.customerName }}</p>
            <p class="text-truncate"><span class="black--text">Active Until:</span> {{ item.activeUntil | date}}</p>
            <p class="text-truncate"><span class="black--text">Created by:</span> {{ item.followers[0].name }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="navID('ManageStore', item._id)" text color="accent">manage</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="navID('ManageOrders', item._id)" text color="accent">Orders</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <newstoredialog :visible="newDialog" @close="newStoreClose()" />
  </v-container>
</template>

<script>
import router from '@/router.js'
import newstoredialog from '@/components/NewStoreDialog'

export default {
  data: () => ({
    stores: [],
    newDialog: false
  }),
  components: {
    newstoredialog
  },
  methods: {
    nav (url) {
      router.push({ name: url })
        .catch(e => {
          console.error(e)
        })
    },
    navSlug (url, params) {
      router.push({ 
        name: url, 
        params: {
          slug: params
        }
      })
    },
    navID (url, params) {
      router.push({ 
        name: url, 
        params: {
          id: params
        }
      })
    },
    getStores () {
      this.$http.get('/api/admin/store')
        .then(res => {
          this.stores = res.data
        })
        .catch(err => {
          console.error(err)
        })
    },
    newStoreClose () {
      this.newDialog = false
    }
  },
  mounted () {
    this.getStores()
  }
}
</script>

<style lang="scss" scoped>
// .description {
//   height: 3em;
//   overflow: hidden;
//   position: relative;
//   display: block;
//   line-height: 1.5em;
//   // outline: solid 1px red;
//   // background-color: white;
// }

// .description::before {
//   background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, white 50%);
//   content: '\200C';
//   display: block;
//   position: absolute;
//   right: 0;
//   top: 1.5em;
//   width: 25%;
//   text-align: center;
// }
</style>

