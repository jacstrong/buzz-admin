<template>
  <div>
    <v-dialog
      v-model="show"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title
          class="secondary white--text"
        >
          New Store
        </v-card-title>
        <v-form v-model="valid" ref="form">
          <v-card-text class="mt-5">
            <v-text-field
              label="Name"
              outlined
              v-model="name"
              :rules="nameRules"
              required
            ></v-text-field>
            <v-textarea
              label="Description"
              v-model="description"
              :rules="descriptionRules"
              rows="1"
              auto-grow
              outlined
            ></v-textarea>
            <v-text-field
              label="Customer Name"
              v-model="customerName"
              :rules="nameRules"
              outlined
            ></v-text-field>
            <v-text-field
              label="W.O. Number"
              v-model="workOrderNumber"
              :rules="woRules"
              outlined
              v-mask="mask"
            ></v-text-field>
            <v-text-field
              label="URL slug"
              v-model="slug"
              :rules="slugRules"
              outlined
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
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
import { mask } from 'vue-the-mask'
import router from '@/router.js'

export default {
  name: 'new-store-dialog',
  directives: {
    mask
  },
  props: [
    'visible'
  ],
  data: () => ({
    customerName: '',
    description: '',
    descriptionRules: [
      v => !!v || 'Description is required',
      v => !!v && v.length <= 2000 || 'Name must be less than 2000 characters'
    ],
    loading: false,
    mask: '#######',
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => !!v && v.length <= 40 || 'Name must be less than 40 characters'
    ],
    slug: '',
    slugRules: [
      v => !!v || 'URL slug is required',
      v => !!v && !/[^0-9a-zA-Z\-]/.test(v) || 'Can only contain letters numbers and "-"'
    ],
    valid: false,
    workOrderNumber: '',
    woRules: [
      v => !!v || 'Work Order Number is required'
    ]
  }),
  methods: {
    close () {
      this.$refs.form.reset()
      this.$emit('close')
    },
    save () {
      if (!this.$refs.form.validate()) return
      this.loading = true
      const data = {
        name: this.name,
        customerName: this.customerName,
        description: this.description,
        workOrderNumber: this.workOrderNumber,
        slug: this.slug
      }
      this.$http.post('/api/admin/store', data)
        .then(res => {
          console.log(res)
          this.loading = false
          router.push({ name: 'ManageStore', params: { id: res.data.id}})
        })
        .catch(err => {
          console.error(err)
          this.loading = false
        })

      // this.$emit('close')
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
