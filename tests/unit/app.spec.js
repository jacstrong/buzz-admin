// import Vue from 'vue'
import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import App from '@/App.vue'

Vue.use(Vuetify)

describe("App.test.js", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallowMount(App, {

        });
    });

    it("has the expected html structure", () => {
        expect(cmp.element).toMatchSnapshot();
    });
});
