<template>
  <v-snackbar v-model="show" right>
    {{message}}
    <v-btn text color="primary" @click.native="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
      show: false,
      message: ''
    }
  },
  methods: {
    ...mapMutations({
      setNack: 'setSnack'
    })
  },
  created: function () {
    this.$store.watch(state => state.snack, () => {
      const msg = this.$store.state.snack;
      if (msg !== '') {
        this.message = this.$store.state.snack;
        this.show = true;
        this.setNack('');
      }
    })
  }
}
</script>
