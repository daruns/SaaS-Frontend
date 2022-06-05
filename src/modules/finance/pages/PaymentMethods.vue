<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center q-px-md header-height-standard" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Payment Types</div>
      <div class="flex items-center">
        <q-btn  v-if="canActivate('subject_finance','create')" @click="body =null; action= 'Add'; dialogue = true" color="primary" label="Create Record" unelevated rounded no-caps />
      </div>
    </div>
    <breadcrumps class="q-pa-md full-width" :map="crumps" />
    <div v-if="!canActivate('subject_finance','read')"><Forbidden /></div>
    <div v-else class="q-px-md">
    <q-table
      :rows="paymentMethods"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pt-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <!-- <q-td key="logo" :props="props">
            <q-avatar size="30px">
            <img src="~/assets/one_logo_neat.png">
            </q-avatar>
          </q-td> -->
          <q-td class="flex items-center justify-start" key="name" :props="props">
            <p style="font-size: 20px;">{{props.row.name}}</p>
          </q-td>
          <q-td class="col" key="description" :props="props">
            <p style="">{{props.row.description}}</p>
          </q-td>
          <!-- <q-td key="clientType" :props="props">
              {{ props.row.clientType }}
          </q-td>
          <q-td key="businessType" :props="props">
              {{ props.row.businessType }}
          </q-td> -->
          <!-- <q-td key="pin" :props="props">
              {{ props.row.pin }}
          </q-td>
          <q-td key="cvs" :props="props">
              {{ props.row.cvs }}
          </q-td>
         <q-td key="expireDate" :props="props">
              {{ dateConversion(props.row.expireDate) }}
          </q-td> -->
         <q-td key="actions" :props="props">
          <q-btn  v-if="canActivate('subject_finance','delete') || canActivate('subject_finance','update')" dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item v-if="canActivate('subject_finance','delete')"  @click="deletePaymentMethod({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator v-if="canActivate('subject_finance','delete') && canActivate('subject_finance','update')" />
                <q-item v-if="canActivate('subject_finance','update')"  @click="body = props.row; action = 'Edit'; dialogue = true" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    </div>
    <q-dialog @closeDialogue="dialogue = false" seamless position="right" v-model="dialogue">
      <modal :id="id" @closeDialogue="dialogue = false" :action="action" :body="body" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import modal from '../components/AddEditPaymentMethod.vue'
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import Forbidden from 'src/components/globalComponents/Forbidden.vue';
import { date } from 'quasar'
export default {
  computed: {
    ...mapState('financeStore', ['paymentMethods'])
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
        {id:2,name:'Payment',icon: 'payment',path: '/finance/payment'}
        ],
      columns : [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    },
    { name: 'description', label: 'Description', align: 'left', field: 'description' },
    // { name: 'pin', label: 'PIN code', align: 'left', field: 'pin'},
    // { name: 'cvs', label: 'CVV', align: 'left', field: 'cvs'},
    // { name: 'expireDate', label: 'Expire date', align: 'left', field: 'expireDate'},
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
    ...mapActions('financeStore',['getPaymentMethods', 'deletePaymentMethod']),
    editClient(id) {
      this.id = id
      this.dialogue = true
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0)
        return 'background: #fff;'
      },
    dateConversion(dt) {
      let dtObj = new Date(dt);
      dtObj.setHours(dtObj.getHours() - 3)
       return date.formatDate(dtObj, 'YYYY-MM-DD HH:mm');
    },
  },
 async mounted() {
    if (!this.canActivate('subject_finance','read')) return
   this.loading = true
   await this.getPaymentMethods();
   this.loading=false
  }
}
</script>