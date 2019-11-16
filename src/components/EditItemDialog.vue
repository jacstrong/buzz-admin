<template>
  <div>
    <v-dialog
      v-model="show"
      :overlay="false"
      min-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title
          class="secondary white--text"
        >
          Edit &nbsp <span class="headline primary--text">{{ name }}</span>
          <v-spacer></v-spacer>
          <v-btn
            text 
            icon 
            color="white"
            @click="$emit('reload')"
          >
            <v-icon>{{ icons.mdiAutorenew }}</v-icon>
          </v-btn>
          <v-btn
            text 
            icon 
            color="white"
            @click="close()"
          >
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-form v-model="valid" ref="form">
          <v-card-text class="mt-5">
            <v-text-field
              class="pa-0"
              label="Name"
              v-model="name"
              :rules="nameRules"
              outlined
            ></v-text-field>
            <v-textarea
              label="Description"
              v-model="description"
              :rules="descriptionRules"
              
              auto-grow
              outlined
            ></v-textarea>
            <v-textarea
              label="Notes"
              v-model="notes"
              auto-grow
              rows="1"
              outlined
            ></v-textarea>
            <v-text-field
              label="Style Code"
              v-model="code"
              outlined
            ></v-text-field>
            <v-combobox
              v-model="colors"
              label="Color Options"
              multiple
              chips
              outlined
            ></v-combobox>
            <v-text-field
              label="Cost"
              v-model="cost"

              prefix="$"
              outlined
            ></v-text-field>
              <!-- v-money="money" -->
            <v-combobox
              v-model="sizes"
              :items="sizeOptions"
              hide-selected
              label="Choose Sizes"
              multiple
              small-chips
              clearable
              outlined
            >
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :key="JSON.stringify(data.item)"
                  color="primary"
                  :input-value="data.selected"
                  label
                  small
                >
                  <span class="pr-2">
                    {{ data.item.text }}
                  </span>
                  <v-icon
                    small
                    @click="data.parent.selectItem(data.item)"
                  >close</v-icon>
                </v-chip>
              </template>
              <template v-slot:item="data">
                <span class="pr-2">
                  {{ data.item.text }}
                </span>
              </template>
            </v-combobox>
            <v-layout
              row 
              wrap
              v-if="sizes.length !== 0"
              >
              <v-flex xs12 pa-5 pt-0>
                
                <v-btn color="success" @click="xlStandardize">XXL Standardize</v-btn>
              </v-flex>
              <v-flex
                v-for="item in sizes"
                :key="JSON.stringify(item)"
                xs6
                sm2
                pa-1
              >
                <v-text-field
                  :label="item.text"
                  v-model="item.cost"
                  prefix="$"
                  outlined
                  v-money="money"
                  :append-icon="icons.mdiEmoticonTongueOutline"
                  @click:append="item = xlStandardizeInd(item)"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout
              row
              wrap
              v-if="itemData !== null"
            >
              <v-flex
                sm6
                lg4
                pa-4
                v-for="imageID in itemData.images"
                :key="imageID"
              >
                <v-hover v-slot:default="{ hover }">
                  <v-img
                    :src="`${$imageURL}api/image/${imageID}`"
                    contain
                    max-height="300px"
                    :class="getImageClass(imageID)"
                  >
                    <!-- :gradient="gradient(hover, imageID)" -->
                    <!-- :gradient="hover ? 'to top right, rgba(0,0,102,.33), rgba(25,32,72,.7)' : ''" -->
                  <v-layout
                    v-if="hover"
                    column
                    fill-height
                    align-center
                    style="width: 100%"
                    justify-space-between
                  >
                    <v-flex>
                      <v-btn
                        text 
                        icon 
                        color="primary"
                        @click="makeMainImage(imageID)"
                      >
                        <v-icon>{{ icons.mdiImage}}</v-icon>
                      </v-btn>
                      <v-btn
                        text
                        icon
                        color="red lighten-1"
                        @click="deleteImage(imageID)"  
                      >
                        <v-icon>{{ icons.mdiTrashCan}}</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  </v-img>
                </v-hover>
              </v-flex>
              
            </v-layout>
            <v-file-input
              v-for="(item , x) in imageNum"
              v-model="uploadImages[x]"
              :key="item"
              outlined
              :rules="imageRules"
              label="Add Image"
              placeholder="Select your file"
              show-size
              :clear-icon="icons.mdiClose"
              :prepend-icon="icons.mdiImage"
            >
              <v-icon @click="removeImage(x)" slot="append" color="red">{{ icons.mdiImageOff }}</v-icon>
            </v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="accent" @click="addImage">Add Image</v-btn>
            <!-- <v-btn text color="warning">remove</v-btn> -->
            <v-spacer></v-spacer>
            <v-btn color="warning" @click="deleteItemDialog = true">Delete Item</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="accent" @click="save()" :loading="loading">Save</v-btn>
            <v-btn color="warning" @click="close()">Close</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteItemDialog"
      persistent :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Warning
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this item? This action cannot be undone. Any orders already placed on this item will still exist.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning">Delete</v-btn>
          <v-btn color="" @click="deleteItemDialog = false">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { VMoney } from 'v-money'
import router from '@/router.js'
import { 
  mdiPaperclip, 
  mdiClose,
  mdiImage,
  mdiImageOff,
  mdiTrashCan,
  mdiAutorenew,
  mdiEmoticonTongueOutline
} from '@mdi/js'
import { mapMutations } from 'vuex'

export default {
  name: 'edit-item-dialog',
  directives: {
    money: VMoney
  },
  props: [
    'visible',
    'itemID',
    'editItemData'
  ],
  data: () => ({
    code: '',
    customerName: '',
    colors: [],
    deleteItemDialog: false,
    description: '',
    descriptionRules: [
      v => !!v || 'Description is required',
      v => !!v && v.length <= 2000 || 'Name must be less than 2000 characters'
    ],
    icons: {
      mdiPaperclip,
      mdiClose,
      mdiImage,
      mdiImageOff,
      mdiTrashCan,
      mdiAutorenew,
      mdiEmoticonTongueOutline
    },
    uploadImages: [],
    imageNum: 0,
    imageRules: [
      value => !!value || value.size < 5000000 || 'Image size should be less than 5 MB'
    ],
    itemData: {},
    loading: false,
    money: {
      decimal: '.',
      thousands: ',',
      prefix: '',
      suffix: '',
      precision: 2,
      masked: false
    },
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => !!v && v.length <= 40 || 'Name must be less than 40 characters'
    ],
    notes: '',
    sizes: [],
    // sizeOptions: ['Y-XS', 'Y-S', 'Y-M', 'Y-L', 'Y-XL', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'],
    sizeOptions: [
      {text: 'Y-XS', cost: ''}, {text: 'Y-S', cost: ''}, {text: 'Y-M', cost: ''}, {text: 'Y-L', cost: ''}, {text:'Y-XL', cost: ''},
      {text: 'XS', cost: ''}, {text: 'S', cost: ''}, {text: 'M', cost: ''}, {text: 'L', cost: ''}, {text:'XL', cost: ''},
      {text: 'XXL', cost: ''}, {text: '3XL', cost: ''}, {text: '4XL', cost: ''}, {text: '5XL', cost: ''}, {text:'6XL', cost: ''}
    ],
    valid: false,
    cost: ''
  }),
  methods: {
    addImage () {
      this.uploadImages.push()
      this.imageNum++
    },
    close () {
      this.$refs.form.reset()
      this.cost = 0
      this.$emit('close')
    },
    deleteImage (id) {
      this.$http.delete(`/api/admin/store/item/image/${id}`)
        .then(res => {
          this.$emit('reload')
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteItem () {
      this.$http.delete(`/api/admin/store/item/${this.itemID}`)
      // Finish me!






      
    },
    getImageClass (imageID) {
      if (imageID === this.itemData.mainImage) {
        return 'main-image'
      } else {
        return 'secondary-image'
      }
    },
    makeMainImage (imageID) {
      let data = {
        imageID : imageID
      }
      this.$http.patch(`/api/admin/store/item/mainimage/${this.itemID}`, data)
        .then(res => {
          this.setSnack('Main image changed')
          this.$emit('reload')
        })
        .catch(err => {
          console.error(err)
          this.$emit('reload')
        })
    },
    removeImage (index) {
      this.uploadImages.splice(index, 1)
      this.imageNum -= 1
    },
    save () {
      if (!this.$refs.form.validate()) return
      this.loading = true
      const data = {
        name: this.name,
        description: this.description,
        cost: this.cost,
        sizes: this.sizes,
        notes: this.notes,
        code: this.code,
        colors: this.colors
      }
      this.$http.patch(`/api/admin/store/item/${this.itemID}`, data)
        .then(res => {
          this.saveImages(this.itemID)
          this.loading = false
          this.saveAndClose()

        })
        .catch(err => {
          console.error(err)
          this.loading = false
          this.saveAndClose
        })

      // this.$emit('close')
    },
    saveAndClose () {
      this.cost = 0.00
      this.uploadImages = []
      this.imageNum = 0
      this.$emit('save')
    },
    saveImages (itemID) {
      for (let x = 0; x < this.uploadImages.length; x++) {
        let formData = new FormData()
        formData.append('image', this.uploadImages[x]);
        this.$http.post(`/api/admin/store/item/${itemID}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
        
      }
    },
    xlStandardizeInd (item) {
      switch (item.text) {
        case 'XXL':
          item.cost = parseFloat(this.cost) + 2
          break
        case '3XL':
          item.cost = parseFloat(this.cost) + 2.5
          break
        case '4XL':
          item.cost = parseFloat(this.cost) + 3
          break
        case '5XL':
          item.cost = parseFloat(this.cost) + 3.5
          break
        case '6XL':
          item.cost = parseFloat(this.cost) + 4
          break
        default:
          item.cost = parseFloat(this.cost)
          break
      }
      item.cost = item.cost.toFixed(2).toString()
      return item
    },
    xlStandardize () {
      this.sizes.forEach(el => {
        el = this.xlStandardizeInd(el)
      })
    },
    ...mapMutations({
      setSnack : 'setSnack'
    })
  },
  computed: {
    show: {
      get () {

        return this.visible
      },
      set(value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  },
  watch: {
    editItemData: function (val, oldVal) {
      this.itemData = val
      this.description = val.description
      this.cost = val.cost
      this.name = val.name
      this.sizes = val.sizes
      this.notes = val.notes
      this.code = val.code
      this.colors = val.colors
    }
  }
}
</script>

<style lang="scss" scoped>
.main-image {
  border-style: solid;
  border-width: 5px;
  border-color: green;
}

.secondary-image {
  border: 5px;
  border-color: green;
}
</style>
