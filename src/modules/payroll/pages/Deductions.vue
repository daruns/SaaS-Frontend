<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center header-height-standard q-px-md" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Deductions</div>
      <div class="flex items-center">
        <q-btn @click="dialogue = true" color="primary" :label="'Add '+tab[0].toUpperCase()+tab.substr(1, tab.length)" unelevated rounded no-caps />
      </div>
    </div>
    <q-scroll-area style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);" class="q-px-md">
      <deductionsTable :currentUser="user" />
      <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" :type="tab" :currentUser="user"  actionType="Add" :id="{}" />
      </q-dialog>
    </q-scroll-area>
  </q-page>
</template>
<script>
import deductionsTable from '../components/DeductionTable.vue';
import { ref } from 'vue';
import AddEditDeduction from '../components/AddEditDeduction.vue'
import { mapActions, mapState } from 'vuex';
export default {
  components: {
    modal: AddEditDeduction,
    deductionsTable,
  },
  computed: {
    ...mapState('example', ['user'])
  },
  data() {
    return {
      deductionsView: false,
      dialogue: false,
      hrMember: false,
    }
  },
  methods: {
    ...mapActions('example', ['getUser']),
  },
  setup() {
    return {
      tab: ref('deduction'),
    }
  },
  async mounted() {
    await this.getUser()
  },
}
</script>

<style scoped>

</style>