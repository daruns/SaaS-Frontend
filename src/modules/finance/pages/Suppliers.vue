<template>
    <q-page v-if="!canActivate('subject_suppliers','read')"><Forbidden /></q-page>
    <q-page v-else class="q-pa-md">
       <div class="flex justify-between items-center">
        <div>
        <p class="text-h4">Suppliers</p>``
        <breadcrumps :map="crumps" />
        </div>
        <q-btn v-if="canActivate('subject_suppliers','create')" @click="body =null; action= 'Add'; dialogue = true" color="primary" label="Create Record" unelevated rounded no-caps />
        </div>
    <q-table
      v-if="canActivate('subject_suppliers','read')" 
      :rows="suppliers"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pt-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td class="flex items-center justify-start" key="name" :props="props">
            <p style="font-size: 20px;">{{props.row.name}}</p>
          </q-td>
          <q-td key="phoneNumbers" :props="props">
            {{ props.row.phoneNumbers }}
          </q-td>
          <!-- <q-td key="clientType" :props="props">
            {{ props.row.clientType }}
          </q-td>
          <q-td key="businessType" :props="props">
            {{ props.row.businessType }}
          </q-td> -->
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="website" :props="props">
            {{ props.row.website }}
          </q-td>
          <q-td key="address" :props="props">
            {{ props.row.address }}
          </q-td>
          <q-td key="rate" class="fit" :props="props">
            <q-rating
              style="min-width:73px"
              v-model="props.row.rate"
              :max="5"
              color="primary"
              readonly
            />
          </q-td>
         <q-td key="zipCode" :props="props">
              {{ props.row.zipCode }}
          </q-td>
         <q-td key="zipCode" :props="props">
          <q-btn v-if="canActivate('subject_suppliers','update') || canActivate('subject_suppliers','delete')" dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item v-if="canActivate('subject_suppliers','delete')" @click="deleteSupplier({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator v-if="canActivate('subject_suppliers','update') && canActivate('subject_suppliers','delete')"/>
                <q-item v-if="canActivate('subject_suppliers','update')" @click="body = props.row; action = 'Edit'; dialogue = true" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog @closeDialogue="dialogue = false" :inProfile="false" seamless position="right" v-model="dialogue">
        <modal :id="id" @closeDialogue="dialogue = false" :actionType="action" :body="body" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import modal from '../components/AddEditSupplier.vue'
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import Forbidden from 'src/components/globalComponents/Forbidden.vue';
export default {
  computed: {
    ...mapState('financeStore', ['suppliers'])
  },
  data() {
    return {
      canActivate: this.$canActivate,
      id: null,
      dialogue: false,
      loading: false,
      body: null,
      action: '',
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Suppliers',icon: 'badge',path: '/finance/suppliers'}
        ],
      columns : [
  {
    name: 'name',
    required: true,
    label: 'Company/Individual',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    },
    { name: 'phoneNumbers', align: 'left', label: 'Phone number', field: 'phoneNumbers'},
    // { name: 'clientType', label: 'Client type', align: 'left', field: 'clientType' },
    // { name: 'businessType', label: 'Business type', align: 'left', field: 'businessType' },
    { name: 'email', label: 'E-mail', align: 'left', field: 'email' },
    { name: 'website', label: 'Website', align: 'left', field: 'website'},
    { name: 'address', label: 'Address', align: 'left', field: 'address'},
    { name: 'rate', label: 'Rate', align: 'left', field: 'rate'},
    { name: 'zipCode', label: 'Zip code', align: 'left', field: 'zipCode'},
    { name: 'actions', label: 'Actions', align: 'left', field: 'actions'}
  ]
   }
  },
  components: {
    modal,
    breadcrumps,
    Forbidden
},
  methods: {
    ...mapActions('financeStore',['getSuppliers','updateSupplier','deleteSupplier']),
    editClient(id) {
      this.id = id
      this.dialogue = true
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
        return 'background: #fff;'
      }
  },
  async mounted() {
    if (!this.canActivate('subject_suppliers','read')) return
    this.loading = true
    await this.getSuppliers();
    this.loading=false
  }
}
</script>
<style scoped>
div.q-avatar div.q-avatar__content img {
    border: none !important;
}
</style>