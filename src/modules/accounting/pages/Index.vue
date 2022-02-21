<template>
   <q-page class="q-pa-md">
      <div class="flex justify-between items-center">
       <div>
        <p class="text-h4">Product & services</p>
        <breadcrumps :map="crumps" />
        </div>
          <q-btn @click="dialogSelectNewItemCat = true" color="primary" label="Create Record" unelevated rounded no-caps />
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
      <q-dialog seamless position="right" v-model="dialogSelectNewItemCat" persistent>
        <select-new-item-category @closeDialogue="dialogSelectNewItemCat = false" />
      </q-dialog>
   </q-page>
</template>
<script>
import { ref } from 'vue';
import ItemsTbl from '../components/ItemsTable.vue';
import NItemsTbl from '../components/NonInventoryItemsTable.vue';
import SItemsTbl from '../components/ServiceItemsTable.vue';
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import SelectNewItemCategory from '../components/SelectNewItemCategory.vue';
export default {
  components : {
    breadcrumps,
    itemtbl: ItemsTbl,
    nitemtbl: NItemsTbl,
    sitemtbl: SItemsTbl,
    SelectNewItemCategory

},
  data() {
    return {
      dialogSelectNewItemCat: false,
    }
  },
  methods: {
  },
  setup () {
    return {
      tab: ref('inventory item'),
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Products & Services',icon: 'calculate',path: '/accounting'}
        ],
    }
  }
}
</script>