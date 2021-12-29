<template>
    <q-page class="q-pa-md">
       <div class="flex justify-between items-center">
        <div>
        <p class="text-h4">Payment Methods</p>
        <breadcrumps :map="crumps" />
        </div>
        <q-btn @click="body =null; action= 'Add'; dialogue = true" color="primary" label="Create Record" unelevated rounded no-caps />
        </div>
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
          <q-td key="logo" :props="props">
            <q-avatar size="30px">
            <img src="~/assets/one_logo_neat.png">
            </q-avatar>
          </q-td>
          <q-td class="flex items-center justify-start" key="name" :props="props">
            <p style="font-size: 20px;">{{props.row.name}}</p>
          </q-td>
          <q-td key="description" v-html="props.row.description" :props="props">
          </q-td>
          <!-- <q-td key="clientType" :props="props">
              {{ props.row.clientType }}
          </q-td>
          <q-td key="businessType" :props="props">
              {{ props.row.businessType }}
          </q-td> -->
          <q-td key="pin" :props="props">
              {{ props.row.pin }}
          </q-td>
          <q-td key="cvs" :props="props">
              {{ props.row.cvs }}
          </q-td>
         <q-td key="expireDate" :props="props">
              {{ dateConversion(props.row.expireDate) }}
          </q-td>
         <q-td key="actions" :props="props">
          <q-btn dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item @click="deletePaymentMethod({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator />
                <q-item @click="body = props.row; action = 'Edit'; dialogue = true" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog @closeDialogue="dialogue = false" seamless position="right" v-model="dialogue">
        <modal :id="id" @closeDialogue="dialogue = false" :action="action" :body="body" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import modal from '../components/AddEditPaymentMethod.vue'
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import { date } from 'quasar'
export default {
  computed: {
    ...mapState('financeStore', ['paymentMethods'])
  },
  data() {
    return {
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
    name: 'logo',
    required: true,
    label: '#',
    align: 'center',
    field: row => row.name,
    format: val => `${val}`,
  },
  {
    name: 'name',
    required: true,
    label: 'Company/Individual',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    },
    { name: 'description', label: 'Description', align: 'left', field: 'description' },
    { name: 'pin', label: 'PIN code', align: 'left', field: 'pin'},
    { name: 'cvs', label: 'CVV', align: 'left', field: 'cvs'},
    { name: 'expireDate', label: 'Expire date', align: 'left', field: 'expireDate'},
    { name: 'actions', label: 'Actions', align: 'left', field: 'actions'}
  ]
   }
  },
  components: {
    modal,
    breadcrumps
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
   this.loading = true
   await this.getPaymentMethods();
   this.loading=false
  }
}
</script>