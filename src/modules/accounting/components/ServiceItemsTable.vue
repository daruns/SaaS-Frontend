<template>
  <div>
    <q-table
      :rows="serviceItems"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pt-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td key="name" :props="props">
            <p style="font-size: 15px;margin:0 !important;">{{props.row.name}}</p>
          </q-td>
          <q-td key="description" v-html="props.row.description" :props="props">
          </q-td>
          <q-td key="unitPrice" :props="props">
              {{ props.row.unitPrice }}
          </q-td>
          <q-td key="supplier" :props="props">
              {{ props.row.supplier }}
          </q-td>
         <q-td key="actions" :props="props">
          <q-btn style="z-index:10;" dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item  @click="delSItem(props.row.id)" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator />
                <q-item @click="edit(props.row)" clickable v-close-popup>
                 <q-item-section  class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
          <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="flex">
            <p v-if="props.row.subServices.length !== 0" class="text-h6">Sub services</p>
            <q-space />
            <q-btn color="primary" icon="add" no-caps flat>
              <q-popup-proxy :breakpoint="0" class="q-pa-md">
                <q-input v-model="sub" />
                <q-btn size="sm" no-caps label="Submit" :disable="sub === ''" flat @click="addSub(props.row.id)" color="primary" class="q-mt-sm" v-close-popup />
              </q-popup-proxy>
            </q-btn>
            </div>
            <div v-if="props.row.subServices.length === 0">No sub-services found.</div>
            <div v-for="(subServices, index) in props.row.subServices" :key="index" class="flex items-center">
             <q-btn icon="delete" @click="deleteSubService(props.row.subServices[index].id)" color="negative" flat size="sm" /> 
             <div v-if="i === index"><q-spinner-tail color="primary" size="2em"/></div>
            <div v-else @click="subs = props.row.subServices[index].name;" class="text-left">
               {{index+1}}-{{ props.row.subServices[index].name }}
              <q-popup-proxy :breakpoint="0" class="q-pa-md">
                <q-input v-model="subs" />
                <q-btn size="sm" label="Submit" :disable="subs === props.row.subServices[index].name" no-caps flat @click="editSub(props.row.subServices[index].id, props.row.id); i = index" color="primary" class="q-mt-sm" v-close-popup />
              </q-popup-proxy>
              </div>
              </div>
               <div v-if="subLoading" class="q-ml-md"><q-spinner-tail color="primary" size="2em"/></div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog seamless position="right" v-model="prompt" persistent>
        <modal @closeDialogue="prompt = false" :action="action" :body="body" />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import modal from './AddEditSItems.vue'
export default {
  data() {
    return {
    prompt: false,
    loading: false,
    subLoading: false,
    subs: '',
    sub: '',
    i: null,
    action: '',
    body: {},
    columns : [
    { name: '#', align: 'center', label: '#', field: '#'},
    { name: 'name', align: 'left', label: 'Name', field: 'name'},
    { name: 'description', align: 'left', label: 'Description', field: 'description'},
    { name: 'unitPrice', label: 'Unit price', align: 'left', field: 'unitPrice' },
    { name: 'supplier', align: 'left', label: 'Supplier', field: 'supplier'},
    { name: 'actions', align: 'left', label: 'Actions', field: 'actions'}
  ]
   }
  },
  components: {
      modal
  },
  computed : {
      ...mapState('accountingStore', ['serviceItems'])
  },
  methods: {
      ...mapActions('accountingStore', ['getServiceItems','delSItem','addSubService', 'deleteSubService', 'editSubService']),
      rowColor(props) {
        if(props.rowIndex%2 !== 0)
        return 'background: #fff;'
      },
     async editSub(id, serviceItemId) { 
      await this.editSubService({id:id, serviceItemId: serviceItemId, name: this.subs});
         this.i = null
      },
     async addSub(serviceItemId) { 
       this.subLoading = true;
        await this.addSubService({serviceItemId: serviceItemId, name: this.sub});
        this.subLoading = false;
      },
    edit(payload) {
        this.body = payload;
        this.action = 'Edit'; 
        this.prompt = true;
    }
  },
async mounted() {
     await this.getServiceItems();
  }
}
</script>
