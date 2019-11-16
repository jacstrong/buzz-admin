<template>
  <div>
    <v-overlay
      z-index="0"
      :value="!loaded"
      absolute
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container grid-list-xs>
      <div v-if="loaded && error" class="text-center">
        <span>404 - bad store ID - Talk to Jacob</span>
      </div>
      <div v-if="loaded && !error">
        <h2>Store Name: {{ name }}</h2>
        <hr>
        <h4>Created: {{ createDate | date }}</h4>
        <v-layout row wrap>
          <v-flex xs12 class="my-3">
            <v-card class="mt-5">
              <v-form ref="form">

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn v-if="locked" text icon color="primary" @click="locked = !locked">
                    <v-icon>{{ icons.mdiSquareEditOutline }}</v-icon>
                  </v-btn>
                  <v-btn v-if="!locked" color="accent" @click="save">save</v-btn>
                  <v-btn v-if="!locked" color="warning" @click="getStore">cancel</v-btn>
                </v-card-actions>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex class="px-3" xs12 v-if="!locked">
                      <v-text-field
                        label="Store Name"
                        v-model="name"
                        :rules="nameRules"
                        filled
                        :disabled="locked"
                      ></v-text-field>
                    </v-flex>
                    <v-flex class="px-3" xs12 md6>
                      <v-text-field
                        label="W.O. Number"
                        v-model="workOrderNumber"
                        :rules="woRules"
                        filled
                        v-mask="mask"
                        :disabled="locked"
                      ></v-text-field>
                    </v-flex>
                    <v-flex class="px-3" xs12 md6>
                      <v-text-field
                        label="Customer Name"
                        v-model="customerName"
                        :rules="nameRules"
                        filled
                        :disabled="locked"
                      ></v-text-field>
                    </v-flex>
                    <v-flex class="px-3" xs12>
                      <v-textarea
                        class="pb-0"
                        label="Description"
                        v-model="description"
                        :rules="descriptionRules"
                        auto-grow
                        rows="1"
                        filled
                        :disabled="locked"
                      ></v-textarea>
                    </v-flex>
                    <v-flex class="px-3" xs12 md6>
                      <v-text-field
                        label="URL slug"
                        v-model="slug"
                        :rules="slugRules"
                        filled
                        :disabled="locked"
                      ></v-text-field>
                    </v-flex>
                    <v-flex class="px-3" xs12 md6>
                      <v-textarea
                        label="Notes"
                        v-model="notes"
                        auto-grow
                        rows="1"
                        filled
                        :disabled="locked"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-form>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-btn class="mx-3" color="accent" @click="newItemDialog = true">New Item</v-btn>
          </v-flex>

          <v-flex xs12 class="my-3">
            <v-simple-table
              class="elevation-3"
            >
              <thead
                class="grey lighten-3"
              >
                <th class="text-left">Item Name</th>
                <th class="text-left">Cost</th>
                <th class="text-left">Description</th>
                <!-- <th class="text-right">Actions</th> -->
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in items"
                  :key="item._id"
                  @click="openItem(item._id)"
                >
                  <!-- :class="index % 2 ? 'grey lighten-4' : ''" -->
                  <td>{{ item.name }}</td>
                  <td>$ {{ item.cost }}</td>
                  <td class="text-truncate description">{{ item.description }}</td>
                  <!-- <td class="text-right">
                    <v-btn color="secondary" icon text>
                      <v-icon>{{ icons.mdiSquareEditOutline }}</v-icon>
                    </v-btn>
                  </td> -->
                </tr>
              </tbody>
            </v-simple-table>
          </v-flex>

          <v-flex xs12 md6 class="pa-3">
            <v-card>
              <v-card-title
                :class="active ? 'green lighten-4' : 'blue-grey lighten-4'"
              >
                {{ active ? 'Store is active' : 'Store is off' }}
                <v-spacer></v-spacer>
                <v-btn v-if="active" color="accent" @click="deactivate" >Deactivate</v-btn>
                <v-btn v-if="!active" color="accent" @click="activate" >Activate</v-btn>
              </v-card-title>
              <v-card-text>
                  
                <v-menu
                  v-model="activeUntilMenu"
                  :close-on-content-click="false"
                  :close-on-click="false"
                  full-width
                  max-width="290"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="computedDateFormat"
                      clearable
                      class="mt-2"
                      :prepend-icon="icons.mdiCalendar"
                      label="Store will be available until"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :prev-icon="icons.mdiChevronLeft"
                    :next-icon="icons.mdiChevronRight"
                    v-model="activeUntil"
                    @change="dateChange"
                  ></v-date-picker>
                </v-menu>

              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 md6 class="pa-3">
            <v-card>
              <v-card-title
                class="blue-grey lighten-4"
              >
                {{ hasPassword ? 'Pasword set' : 'No password set' }}
                <v-spacer></v-spacer>
                <v-btn
                  text
                  icon 
                  color="primary" 
                  v-if="!changePassword"
                  @click="changePassword = !changePassword"  
                >
                  <v-icon>{{ icons.mdiSquareEditOutline }}</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-switch
                  label="Enable password protection"
                  v-model="hasPassword"
                  :disabled="!changePassword"
                ></v-switch>
                <v-text-field
                  :prepend-icon="icons.mdiLock"
                  v-if="hasPassword"
                  label="password"
                  v-model="password"
                ></v-text-field>
                <v-card-actions v-if="changePassword">
                  <v-btn color="accent" @click="savePassword">save</v-btn>
                  <v-btn color="warking" @click="getStore">cancel</v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </v-container>
    <newitemdialog :visible="newItemDialog" :storeID="id" @close="newItemClose()" @save="newItemSave()" />
    <edititemdialog
      :visible="editItemDialog" 
      :itemID="editItemID" 
      :editItemData="itemData" 
      @close="editItemClose()" 
      @save="editItemSave()"
      @reload="getItemData()"  
    />
  </div>
</template>

<script>
import newitemdialog from '@/components/NewItemDialog'
import edititemdialog from '@/components/EditItemDialog'
import { mask } from 'vue-the-mask'
import { format, parseISO, isFuture } from 'date-fns'
import { mapMutations } from 'vuex'
import {
  mdiSquareEditOutline,
  mdiCalendar,
  mdiChevronLeft,
  mdiChevronRight,
  mdiLock
} from '@mdi/js'


export default {
  directives: {
    mask
  },
  components: {
    newitemdialog,
    edititemdialog
  },
  data: () => ({
    active: null,
    activeUntil: null,
    activeUntilMenu: false,
    changePassword: false,
    customerName: '',
    createDate: '',
    description: '',
    descriptionRules: [
      v => !!v || 'Description is required',
      v => !!v && v.length <= 2000 || 'Name must be less than 2000 characters'
    ],
    editItemDialog: false,
    editItemID: '',
    error: false,
    hasPassword: null,
    icons: {
      mdiSquareEditOutline,
      mdiCalendar,
      mdiChevronLeft,
      mdiChevronRight,
      mdiLock

    },
    id: '',
    items: [
      {
        name: "Name",
        cost: "9000.01"
      }
    ],
    itemData: {},
    loaded: false,
    locked: true,
    mask: '#######',
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => !!v && v.length <= 40 || 'Name must be less than 40 characters'
    ],
    newItemDialog: false,
    notes: '',
    password: '',
    slug: '',
    slugRules: [
      v => !!v || 'URL slug is required',
      v => !!v && !/[^0-9a-zA-Z\-]/.test(v) || 'Can only contain letters numbers and "-"'
    ],
    workOrderNumber: '',
    woRules: [
      v => !!v || 'Work Order Number is required'
    ]
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
    dateChange () {
      console.log(parseISO(this.activeUntil))
      console.log(new Date(this.activeUntil + ' 23:59:00 -0700'))
      if (!this.loaded) return
      if (!isFuture(parseISO(this.activeUntil))) {
        this.setSnack("Please choose a date in the future")
      } else {
        this.activeUntilMenu = false
        const data = {
          activeUntil: parseISO(this.activeUntil)
        }
        this.saveRequest(data)
      }
    },
    deactivate () {
      this.active = false
      const data = {
        active: this.active
      }

      this.saveRequest(data)
    },
    getItems () {
      this.$http.get(`/api/admin/store/items/${this.id}`)
        .then(res => {
          console.log(res.data)
          this.items = res.data
          this.loaded = true
        })
        .catch(error => {
          if (error.response.data.error.code && error.response.data.error.code === "bad_id") {
            this.loaded = true
            this.error = true
          }
        })
    },
    getItemData () {
      this.$http.get(`/api/admin/store/item/${this.editItemID}`)
        .then(res => {
          this.itemData = res.data
          // this.description = res.data.description
          // this.cost = res.data.cost
          // this.name = res.data.name
          this.editItemDialog = true
        })
        .catch(err => {

          console.log('error')
        })
    },
    getStore () {
      if (this.id === '') return
      this.locked = true
      this.changePassword = false

      this.$http.get(`/api/admin/store/${this.id}`)
        .then(res => {
          this.name = res.data.name
          this.description = res.data.description
          this.workOrderNumber = res.data.workOrderNumber
          this.customerName = res.data.customerName
          this.createDate = res.data.createDate
          this.active = res.data.active
          this.password = res.data.password
          this.hasPassword = res.data.hasPassword
          this.slug = res.data.slug
          this.notes = res.data.notes
          if (res.data.activeUntil) {
            
            this.activeUntil = res.data.activeUntil.substr(0, 10)
          }
          this.getItems()
        })
        .catch(error => {
          if (error.response.data.error.code && error.response.data.error.code === "bad_id") {
            this.loaded = true
            this.error = true
          }
        })
    },
    newItemClose () {
      this.newItemDialog = false
    },
    newItemSave () {
      this.newItemDialog = false
      this.getItems()
    },
    editItemClose () {
      this.editItemDialog = false
    },
    editItemSave () {
      this.editItemDialog = false
      this.getItems()
    },
    openItem(id) {
      this.editItemID = id
      this.getItemData()
    },
    save () {
      const data = {
        name: this.name,
        slug: this.slug,
        description: this.description,
        workOrderNumber: this.workOrderNumber,
        customerName: this.customerName,
        notes: this.notes
      }
      this.locked = true
      this.saveRequest(data)
    },
    savePassword () {
      if (!this.hasPassword) {
        this.password = ''
      }
      const data = {
        password: this.password,
        hasPassword: this.hasPassword
      }
      this.changePassword = false
      this.saveRequest(data)
    },
    saveRequest (data) {
      this.$http.put(`/api/admin/store/${this.id}`, data)
        .then(res => {
          console.info(res)
        })
        .catch(err => {
          console.error(err)
        })
    },
    ...mapMutations({
      setSnack: 'setSnack'
    }),
  },
  computed: {
    computedDateFormat () {
      return this.activeUntil ? format(parseISO(this.activeUntil), 'EEEE, MM/dd/yy') : ''
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.getStore()
    }

    
  }
}
</script>

<style lang="scss" scoped>
.description {
  max-width: 30px;
}
</style>

