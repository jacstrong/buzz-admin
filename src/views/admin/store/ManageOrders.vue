<template>
  <div id="test">
    <v-overlay
      z-index="0"
      :value="!loaded"
      absolute
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container grid-list-xs>
      <div
        v-if="loaded && orders.length === 0"
      >
        <v-card>
          <v-card-text>
            There are no orders in this store.
          </v-card-text>
        </v-card>
      </div>
      <div
        v-else-if="loaded"
        class="py-3"
      >
        <v-card class="mb-3">
          <v-card-actions>
            <v-btn @click="exportStickerPFD()" color="success">Export Stickers</v-btn>
            <v-btn @click="exportPackingSlipsPDF()" color="success">Export Packing Slips</v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <v-card-title primary-title class="grey lighten-2">
            Orders
          </v-card-title>
          <v-card-text class="black--text p">
            <v-layout column>
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex xs4>
                    Name
                  </v-flex>
                  <v-flex xs4>
                  </v-flex>
                  <v-flex xs4 class="text-right">
                    <!-- {{ item.cart.length }} -->
                    Amount
                  </v-flex>
                </v-layout>
              </v-flex>
              <hr>
              <div
                v-for="(order, i) in orders"
                :key="JSON.stringify(order)"
              >
                <v-flex xs12>
                  <v-layout row wrap>
                    <v-flex xs4>
                      {{ i + 1 }}: {{ order.billingID.fullName }}
                    </v-flex>
                    <v-flex xs4>
                      {{ order.billingID.email }}
                    </v-flex>
                    <v-flex xs4 class="text-right">
                      ${{ order.totalCost }}
                    </v-flex>
                  </v-layout>
                </v-flex>
                <hr>
              </div>
              <v-flex
                v-if="itemsLoaded"
                class="text-right"
              >
                ${{storeTotal}}
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </div>
      <div
        v-if="itemsLoaded"
        class="py-3"
      >
        <v-card>
          <v-card-title primary-title class="grey lighten-2">
            Item Totals
          </v-card-title>
          <v-card-text>
            <v-layout column>
              <div
                v-for="item in items"
                :key="JSON.stringify(item)"
                class="mb-3"
              >
                <v-flex
                  xs12
                  v-if="item.colorOrder"
                >
                  <span class="title primary--text">
                    {{item.name}} : total={{item.qty}}
                  </span>
                  <v-layout row wrap
                    v-for="color in item.colorOrder"
                    :key="JSON.stringify(color)"
                    v-if="item.qty > 0"
                  >
                    <v-flex xs4 class="subtitle-2">
                      {{color.color}}
                    </v-flex>
                    <v-flex xs8>
                      <table>
                        <tr>
                          <th>Size</th>
                          <th>Number</th>
                        </tr>
                        <tr
                          v-for="size in color.sizes"
                          :key="JSON.stringify(size)"
                          v-if="size.qty > 0"
                        >
                          <td>{{size.text}}</td>
                          <td>{{size.qty}}</td>
                        </tr>
                      </table>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex 
                  xs12
                  v-else
                >
                  <span class="title primary--text">
                    {{item.name}} : total={{item.qty}}
                  </span>
                  <v-flex xs12>
                    <table>
                      <tr>
                        <th>Size</th>
                        <th>Number</th>
                      </tr>
                      <tr
                        v-for="size in item.sizes"
                        :key="JSON.stringify(size)"
                        v-if="size.qty > 0"
                      >
                        <td>{{size.text}}</td>
                        <td>{{size.qty}}</td>
                      </tr>
                    </table>
                  </v-flex>
                </v-flex>
                <div class="mb-3"></div>
                <hr>
              </div>
            </v-layout>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
    <v-dialog
      v-model="pdfDialog"
      eager
      width="90%"
      transition="dialog-transition"
    >
      <!-- <v-card height="800px"> -->
        <iframe id="pdfPreviewIframe" width="100%" height="600"></iframe>
      <!-- </v-card> -->
    </v-dialog>
  </div>
</template>

<script>
import { format, parseISO, isFuture } from 'date-fns'
import { mapMutations } from 'vuex'
import {
  mdiSquareEditOutline,
  mdiCalendar,
  mdiChevronLeft,
  mdiChevronRight,
  mdiLock
} from '@mdi/js'
import exportPdf from '../../../plugins/pdfLables'
import packingSlipPDF from '../../../plugins/pdfPackingSlips'

export default {
  components: {
  },
  data: () => ({
    error: false,
    loaded: false,
    orders: [],
    pdfDialog: false,
    itemsLoaded: false,
    items: [],
    itemTotals: [],
    storeTotal: 0
  }),
  methods: {
    activate () {
      if (this.activeUntil) {
        this.active = true
        const data = {
          active: this.active,
          activeUntil: this.activeUntil
        }

        this.saveRequest(data)
      } else {
        this.setSnack("Date must be set")
      }
    },
    addNoColorOrder (orderIndex, cartIndex) {
      let itemIndex = this.getItemIndex(this.orders[orderIndex].cart[cartIndex].itemID)
      let sizeIndex = this.getSizeIndex(this.orders[orderIndex].cart[cartIndex].size, itemIndex)
      this.items[itemIndex].sizes[sizeIndex].qty += this.orders[orderIndex].cart[cartIndex].quantity
      this.items[itemIndex].qty += this.orders[orderIndex].cart[cartIndex].quantity
    },
    addColorOrder (orderIndex, cartIndex) {
      let itemIndex = this.getItemIndex(this.orders[orderIndex].cart[cartIndex].itemID)
      let colorIndex = this.getColorOrderIndex(this.orders[orderIndex].cart[cartIndex].color, itemIndex)
      let sizeIndex = this.getColorSizeIndex(this.orders[orderIndex].cart[cartIndex].size, colorIndex, itemIndex)
      this.items[itemIndex].colorOrder[colorIndex].qty += this.orders[orderIndex].cart[cartIndex].quantity
      this.items[itemIndex].colorOrder[colorIndex].sizes[sizeIndex].qty += this.orders[orderIndex].cart[cartIndex].quantity
      this.items[itemIndex].qty += this.orders[orderIndex].cart[cartIndex].quantity
    },
    addColorOrderField (itemIndex) {
      this.items[itemIndex].colorOrder = []
      for (let i = 0; i < this.items[itemIndex].colors.length; i++) {
        this.items[itemIndex].colorOrder.push({
            color: this.items[itemIndex].colors[i],
            qty: 0,
            sizes: []
        })
        for (let j = 0; j < this.items[itemIndex].sizes.length; j++) {
          this.items[itemIndex].colorOrder[i].sizes.push({
            text: this.items[itemIndex].sizes[j].text,
            qty: 0
          })
        }
      }
    },
    addQtyToSize (itemIndex) {
      for(let i = 0; i < this.items[itemIndex].sizes.length; i++) {
        this.items[itemIndex].sizes[i].qty = 0
      }
    },
    addQtyFeild () {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].colors.length > 0) {
          this.addColorOrderField(i)
        } else {
          this.addQtyToSize(i)
        }
        this.items[i].qty = 0
      }
    },
    calculateStoreTotal () {
      this.orders.forEach(el => {
        this.storeTotal += parseFloat(el.totalCost)
      })
    },
    calculateTotals () {
      this.addQtyFeild()

      for (let i = 0; i < this.orders.length; i++) {
        for (let j = 0; j < this.orders[i].cart.length; j++) {
          if (this.orders[i].cart[j].color === '') {
            this.addNoColorOrder(i, j)
          } else {
            this.addColorOrder(i, j)
          }
        }
      }
      this.calculateStoreTotal()
      this.itemsLoaded = true
    },
    exportStickerPFD () {
      let slug = 'order'
      exportPdf(this.orders, this.items, slug)
    },
    exportPackingSlipsPDF () {
      let slug = "order"
      packingSlipPDF(this.orders, this.items, this.slug, document.getElementById('pdfPreviewIframe'))
      this.pdfDialog = true
    },
    getItemIndex (id) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i]._id === id) return i
      }
    },
    getColorOrderIndex (color, itemIndex) {
      for (let i = 0; i < this.items[itemIndex].colorOrder.length; i++) {
        if (this.items[itemIndex].colorOrder[i].color === color) {
          return i
        }
      }
    },
    getColorSizeIndex (size, colorIndex, itemIndex) {
      for (let i = 0; i < this.items[itemIndex].colorOrder[colorIndex].sizes.length; i++) {
        if (this.items[itemIndex].colorOrder[colorIndex].sizes[i].text === size) {
          return i
        }
      }
    },
    getSizeIndex (size, itemIndex) {
      for (let i = 0; i < this.items[itemIndex].sizes.length; i++) {
        if (this.items[itemIndex].sizes[i].text === size) {
          if (!this.items[itemIndex].sizes[i].qty) {
            this.items[itemIndex].sizes[i].qty = 0
          }
          return i
        }
      }
    },
    getOrders () {
      this.$http.get(`/api/admin/store/orders/${this.id}`)
        .then(res => {
          this.orders = res.data
          this.getItems()
          this.loaded = true
        })
        .catch(error => {
          if (error.response.data.error.code && error.response.data.error.code === "bad_id") {
            this.loaded = true
            this.error = true
          }
        })
    },
    getItems () {
      this.$http.get(`/api/admin/store/items/${this.id}`)
        .then(res => {
          this.items = res.data
          this.calculateTotals()
        })
        .catch(error => {
          console.log(error)
          if (error.response.data.error.code && error.response.data.error.code === "bad_id") {
            this.loaded = true
            this.error = true
          }
        })
    },
    getStoreData () {

    }
  },
  computed: {
    computedDateFormat () {
      return this.activeUntil ? format(parseISO(this.activeUntil), 'EEEE, MM/dd/yy') : ''
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.getOrders()
    }
  }
}
</script>

<style lang="scss" scoped>
.description {
  max-width: 30px;
}
</style>

