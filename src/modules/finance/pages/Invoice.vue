<template>
    <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center q-px-md header-height-standard" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Invoice</div>
    <div class="flex items-center">
    <q-btn @click="prompt = true" color="primary" label="Create Record" unelevated rounded no-caps />
    </div>
    </div>
      <breadcrumps :map="crumps" />
      <div class="q-px-md">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey q-mt-md bg-white rounded-borders bordered"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab no-caps name="Sent" label="Sent" />
          <q-tab no-caps name="Not paid" label="Not paid" />
          <q-tab no-caps name="Paid" label="Paid" />
        </q-tabs>
        <q-tab-panels class="bg-secondary" v-model="tab" animated>
          <q-tab-panel name="Sent" class="q-pa-none">
            <tbl :type="'Sent'" />
          </q-tab-panel>
          <q-tab-panel class="bg-secondary" name="Not paid">
            <tbl :type="'Not paid'" />
          </q-tab-panel>
          <q-tab-panel class="bg-secondary" name="Paid">
            <tbl :type="'Paid'" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <q-dialog seamless position="right" v-model="prompt" persistent>
          <modal @closeDialogue="prompt = false" action="Add" :invoiceType="tab" />
      </q-dialog>
    </q-page>
</template>
<script>
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import tbl from '../components/Table.vue';
import modal from '../components/AddEditInvoice.vue'
export default {
components : {
    breadcrumps,
    tbl,
    modal
},
  data () {
    return {
      tab: 'Sent',
      prompt: false
    }
  },
  setup () {
    return {
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Invoice',icon: 'receipt',path: '/finance/invoice'}
        ],
    }
  }
}
</script>