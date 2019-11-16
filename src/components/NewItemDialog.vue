<template>
  <div>
    <v-dialog
      v-model="show"
      persistent
      :overlay="false"
      min-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title
          class="secondary white--text"
        >
          New Item
          <v-spacer></v-spacer>
          <v-btn
            text 
            icon 
            color="white"
            @click="$emit('close')"
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
              label="Standard Cost"
              v-model="cost"
              prefix="$"
              outlined
              v-money="money"
            ></v-text-field>
            <v-btn class="mb-4 mx-2" color="success" @click="sizeAllAdult">All Adult</v-btn>
            <v-btn class="mb-4 mx-2" color="success" @click="sizeAdultStandard">Adult Standard</v-btn>
            <v-btn class="mb-4 mx-2" color="success" @click="sizeAdultExtended">Adult Extended</v-btn>
            <v-btn class="mb-4 mx-2" color="success" @click="sizeYouth">Youth</v-btn>
            <v-btn class="mb-4 mx-2" color="success" @click="sizePants">Pants</v-btn>
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
            <v-file-input
              v-model="images[0]"
              outlined
              :rules="imageRules"
              label="Main Image"
              placeholder="Select your file"
              show-size
              :clear-icon="icons.mdiClose"
              :prepend-icon="icons.mdiImage"
            >
            </v-file-input>
            <v-file-input
              v-for="(item , x) in imageNum"
              v-model="images[item]"
              :key="item"
              outlined
              :rules="imageRules"
              :label="'Image ' + (item + 1)"
              placeholder="Select your file"
              show-size
              :clear-icon="icons.mdiClose"
              :prepend-icon="icons.mdiImage"
            >
              <v-icon @click="removeImage(item)" slot="append" color="red">{{ icons.mdiImageOff }}</v-icon>
            </v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="accent" @click="addImage">Add Image</v-btn>
            <!-- <v-btn text color="warning">remove</v-btn> -->
            <v-spacer></v-spacer>
            <v-btn color="accent" @click="save()" :loading="loading">Save</v-btn>
            <v-btn color="warning" @click="close()">Discard</v-btn>
          </v-card-actions>
        </v-form>
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
  mdiEmoticonTongueOutline
} from '@mdi/js'

export default {
  name: 'new-item-dialog',
  directives: {
    money: VMoney
  },
  props: [
    'visible',
    'storeID'
  ],
  data: () => ({
    code: '',
    customerName: '',
    colors: [],
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
      mdiEmoticonTongueOutline
    },
    images: [],
    imageNum: 0,
    imageRules: [
      value => !!value || value.size < 5000000 || 'Image size should be less than 5 MB'
    ],
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
    sizeOptions: [
      {text: 'Y-XS', cost: 0}, {text: 'Y-S', cost: 0}, {text: 'Y-M', cost: 0}, {text: 'Y-L', cost: 0}, {text:'Y-XL', cost: 0},
      {text: 'XS', cost: 0}, {text: 'S', cost: 0}, {text: 'M', cost: 0}, {text: 'L', cost: 0}, {text:'XL', cost: 0},
      {text: 'XXL', cost: 0}, {text: '3XL', cost: 0}, {text: '4XL', cost: 0}, {text: '5XL', cost: 0}, {text:'6XL', cost: 0}
    ],
    valid: false,
    cost: 0.00
  }),
  methods: {
    addImage () {
      this.images.push()
      this.imageNum++
    },
    close () {
      this.$refs.form.reset()
      this.$emit('close')
    },
    removeImage (index) {
      this.images.splice(index, 1)
      this.imageNum -= 1
    },
    sizeAllAdult () {
      this.sizes = [{text: 'XS', cost: 0}, {text: 'S', cost: 0}, {text: 'M', cost: 0}, {text: 'L', cost: 0}, {text:'XL', cost: 0},
        {text: 'XXL', cost: 0}, {text: '3XL', cost: 0}, {text: '4XL', cost: 0}, {text: '5XL', cost: 0}, {text:'6XL', cost: 0}]
    },
    sizeAdultStandard () {
      this.sizes = [{text: 'XS', cost: 0}, {text: 'S', cost: 0}, {text: 'M', cost: 0}, {text: 'L', cost: 0}, {text:'XL', cost: 0}]
    },
    sizeAdultExtended () {
      this.sizes = [{text: 'XXL', cost: 0}, {text: '3XL', cost: 0}, {text: '4XL', cost: 0}, {text: '5XL', cost: 0}, {text:'6XL', cost: 0}]
    },
    sizeYouth () {
      this.sizes = [{text: 'Y-XS', cost: 0}, {text: 'Y-S', cost: 0}, {text: 'Y-M', cost: 0}, {text: 'Y-L', cost: 0}, {text:'Y-XL', cost: 0}]
    },
    sizePants () {
      this.sizes = [{text: 'XS', cost: 0}, {text: 'S', cost: 0}, {text: 'M', cost: 0}, {text: 'L', cost: 0}, {text:'XL', cost: 0}]
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
      this.$http.post(`/api/admin/store/item/${this.storeID}`, data)
        .then(res => {
          this.saveImages(res.data.id)
          this.loading = false
          this.$emit('save')

        })
        .catch(err => {
          console.error(err)
          this.loading = false
          this.$emit('save')
        })

      // this.$emit('close')
    },
    saveImages (itemID) {
      for (let x = 0; x < this.images.length; x++) {
        let formData = new FormData()
        formData.append('image', this.images[x]);
        this.$http.post(`/api/admin/store/item/${itemID}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          // onUploadProgress: function (progressEvent) {
          //   // Do whatever you want with the native progress event
          // },
        })
        
      }
    },
    xlStandardizeInd (oldItem, index) {
      let item = oldItem
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
          item.cost = parseFloat(this.cost) + 0
          break
      }

      item.cost = item.cost.toFixed(2).toString()

      return item
    },
    xlStandardize () {
      this.sizes.forEach(el => {
        el = this.xlStandardizeInd(el)
      })
    }

  },
  computed: {
    show: {
      get () {
        // if (this.edit !== null) {
        //   this.setEditInfo()
        //   this.isEdit = true
        // }
        return this.visible
      },
      set(value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
