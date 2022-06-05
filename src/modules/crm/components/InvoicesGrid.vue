<template>
  <div>
    <q-table
      :rows="invoicesShow"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pt-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td key="invoiceNumber" :props="props">
            <router-link style="color: black;" :to="`/finance/invoice/${props.row.id}`">
            <p class="text-h6" style="font-size: 15px;margin:0 !important;">{{props.row.invoiceNumber}}</p>
            </router-link>
          </q-td>
          <q-td key="name" :props="props">
              {{ props.row.client.name }}
          </q-td>
         <q-td key="createdAt" :props="props">
              {{ dateConversion(props.row.createdAt) }}
          </q-td>
           <q-td key="dueDate" :props="props">
              {{ dateConversion(props.row.dueDate) }}
          </q-td>
          <q-td key="status" :props="props">
              {{ props.row.status }}
          </q-td>
          <q-td key="totalAmount" :props="props">
              {{ total(props.row) }}
          </q-td>
         <q-td key="actions" :props="props">
          <router-link :to="`/finance/invoice/${props.row.id}`">
            <q-btn dense text-color="dark" round flat icon="visibility" />
          </router-link>
          <q-btn  v-if="canActivate('subject_finance','delete') || canActivate('subject_finance','update')" :disable="props.row.status === 'Paid'" dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item v-if="canActivate('subject_finance','delete')" @click="deleteInvoice(props.row.id)" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator v-if="canActivate('subject_finance','delete') && canActivate('subject_finance','update')"/>
                <q-item v-if="canActivate('subject_crm','update')" @click="edit(props.row)" clickable v-close-popup>
                 <q-item-section  class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <!-- <template v-slot:top-right>
         <q-btn @click="action = 'Add', prompt = true" label="Create Record" no-caps color="primary" unelevated rounded />
      </template> -->
    </q-table>
    <q-dialog seamless position="right" v-model="prompt" persistent>
        <modal @closeDialogue="prompt = false" :action="action" :body="body" />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { date } from 'quasar'
import modal from '../../finance/components/AddEditInvoice.vue'
export default {
  data() {
    return {
    canActivate: this.$canActivate,
    invoicesShow: [],
    prompt: false,
    loading: false,
    action: '',
    body: {},
    columns : [
    { name: 'invoiceNumber', align: 'left', label: 'Invoice number', field: 'invoiceNumber'},
    { name: 'name', align: 'left', label: 'client', field: 'name'},
    { name: 'createdAt', align: 'left', label: 'Purchased at', field: 'createdAt'},
    { name: 'dueDate', align: 'left', label: 'Due date', field: 'dueDate'}, 
    { name: 'status', align: 'left', label: 'Status', field: 'status'}, 
    { name: 'totalAmount', align: 'left', label: 'Total amount', field: 'totalAmount'},    
    { name: 'actions', align: 'left', label: 'Actions', field: 'actions'}
  ]
   }
  },
  computed : {
  },
  components: {
    modal
  },
  props: ['bodyData'],
  methods: {
    total(row) {
      let total = 0;
      let discount = 0;
      let tax = 0;
      for(let i = 0; i<row.invoiceItems.length; i++) {
        total += Number(row.invoiceItems[i].qty) * Number(row.invoiceItems[i].unitPrice);
      }
      discount = Number(row.discount) * total;
      tax = Number(row.taxRate) * total;
     total = total + tax - discount;

     return Math.round(total) ;
    },
      ...mapActions('financeStore', ['getInvoices','deleteInvoice']),
      rowColor(props) {
        if(props.rowIndex%2 !== 0)
        return 'background: #fff;'
      },
     dateConversion(dt) {
      let dtObj = new Date(dt);
      dtObj.setHours(dtObj.getHours() - 3)
       return date.formatDate(dtObj, 'YYYY-MM-DD HH:mm');
    },
    edit(payload) {
        this.body = payload;
        this.action = 'Edit'; 
        this.prompt = true;
    }
  },
  async mounted() {
    if (!this.canActivate('subject_finance','read')) return
    await this.getInvoices();
    this.invoicesShow = this.bodyData?.map(e => e) || []
  }
}
</script>