import Vue from 'vue'
import Vuetify, { colors } from 'vuetify/lib'

Vue.use(Vuetify)
console.log(colors)

export default new (Vuetify, {
  options: {
    customProperties: true
  },
  theme: {
    primary: colors.blue,
    // error: colors.red.darken1,
    accent: colors.blueGrey, // accent should be dark, used as button default
    error: '#C62828',
    info: '#3F51B5',
    warning: '#FFA000',
    success: '#388E3C'
  },
  iconfont: 'md',
})
