<template>
   <q-page class="q-pa-md">
      <div class="flex justify-between items-center">
       <div>
        <p class="text-h4">Accounting</p>
        <breadcrumps :map="crumps" />
        </div>
          <q-btn @click="openModal" color="primary" label="Create Record" unelevated rounded no-caps />
      </div>
    <q-tabs
        v-model="tab"
        dense
        class="text-grey bg-white rounded-borders bordered q-mt-md"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab no-caps name="inventory item" label="Inventory items" />
        <q-tab no-caps name="non-inventory item" label="Non-inventory items" />
        <q-tab no-caps name="service" label="Services" />
      </q-tabs>

      <q-tab-panels class="bg-secondary" v-model="tab" animated>
        <q-tab-panel name="inventory item" class="q-pa-none">
          <itemtbl />
        </q-tab-panel>
        <q-tab-panel name="non-inventory item" class="q-pa-none">
          <nitemtbl />
        </q-tab-panel>
        <q-tab-panel class="bg-secondary" name="service">
          <sitemtbl />
        </q-tab-panel>
      </q-tab-panels>
    <q-dialog seamless position="right" v-model="dialogueit" persistent>
        <modalit @closeDialogue="dialogueit = false" action="Add" :type="tab" />
    </q-dialog>
    <q-dialog seamless position="right" v-model="dialoguenit" persistent>
        <modalnit @closeDialogue="dialoguenit = false" action="Add" :type="tab" />
    </q-dialog>
    <q-dialog seamless position="right" v-model="dialogueser" persistent>
        <modalser @closeDialogue="dialogueser = false" action="Add" :type="tab" />
    </q-dialog>
   </q-page>
</template>
<script>
import { ref } from 'vue';
import ItemsTbl from '../components/ItemsTable.vue';
import NItemsTbl from '../components/NonInventoryItemsTable.vue';
import SItemsTbl from '../components/ServiceItemsTable.vue';
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import modalit from '../components/AddEditItem.vue'
import modalnit from '../components/AddEditNItems.vue'
import modalser from '../components/AddEditSItems.vue'
export default {
components : {
    breadcrumps,
    itemtbl: ItemsTbl,
    nitemtbl: NItemsTbl,
    sitemtbl: SItemsTbl,
    modalit,
    modalnit,
    modalser
},
  data() {
    return {
      dialogueit: false,
      dialoguenit: false,
      dialogueser: false,
    }
  },
  methods: {
    openModal() {
      if(this.tab === 'inventory item')
      this.dialogueit = true
      if(this.tab === 'non-inventory item')
      this.dialoguenit = true
      if(this.tab === 'service')
      this.dialogueser = true
    }
  },
  setup () {
    return {
      tab: ref('inventory item'),
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Accounting',icon: 'calculate',path: '/accounting'}
        ],
    }
  }
}
</script>