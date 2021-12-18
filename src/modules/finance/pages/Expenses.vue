<template>
  <q-page class="q-pa-md">
    <div class="flex justify-between items-center">
        <div>
        <p class="text-h4">Expenses</p>
        <breadcrumps :map="crumps" />
        </div>
        <q-btn @click="action = 'Add';prompt = true" color="primary" label="Create Record" unelevated rounded no-caps />
    </div>
    <q-table
      :rows="expenses"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pt-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td key="expenseNumber" :props="props">
            <router-link style="color: black;" :to="`/finance/expense/${props.row.id}`">
            <p class="text-h6" style="font-size: 15px;margin:0 !important;">{{props.row.expenseNumber}}</p>
            </router-link>
          </q-td>
          <q-td key="description" v-html="props.row.description" :props="props">
          </q-td>
         <q-td key="date" :props="props">
              {{ dateConversion(props.row.date) }}
          </q-td>
           <q-td key="dueDate" :props="props">
              {{ dateConversion(props.row.dueDate) }}
          </q-td>
          <q-td key="status" :props="props">
              {{ props.row.status }}
          </q-td>
          <q-td key="totalAmount" :props="props">
              {{ props.row.totalAmount }}
          </q-td>
         <q-td key="actions" :props="props">
          <q-btn  :disable="props.row.status === 'Paid'" style="z-index:10;" dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item @click="deleteExpense({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
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
      </template>
    </q-table>
    <q-dialog seamless position="right" v-model="prompt" persistent>
        <modal @closeDialogue="prompt = false" :action="action" :body="body" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { date } from 'quasar'
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import modal from '../components/AddEditExpense.vue'
export default {
  props: ['type'],
  data() {
    return {
    prompt: false,
    loading: false,
    action: '',
    body: {},
    crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Expense',icon: 'attach_money',path: '/finance/expenses'}
    ],
    columns : [
    { name: 'expenseNumber', align: 'left', label: 'Expense number', field: 'expenseNumber'},
    { name: 'description', align: 'left', label: 'Description', field: 'description'},
    { name: 'date', align: 'left', label: 'Expense date', field: 'date'},
    { name: 'dueDate', align: 'left', label: 'Due date', field: 'dueDate'}, 
    { name: 'status', align: 'left', label: 'Status', field: 'status'}, 
    { name: 'totalAmount', align: 'left', label: 'Total amount', field: 'totalAmount'},    
    { name: 'actions', align: 'left', label: 'Actions', field: 'actions'}
  ]
   }
  },
  computed : {
      ...mapState('financeStore', ['expenses']),
  },
  components: {
    modal,
    breadcrumps
  },
  methods: {
      ...mapActions('financeStore', ['getExpenses','deleteExpense']),
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
     await this.getExpenses();
  }
}
</script>