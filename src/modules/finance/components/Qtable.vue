<template>
  <div>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pt-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td key="quoteNumber" :props="props">
            <router-link style="color: black;" :to="`/finance/quote/${props.row.id}`">
            <p class="text-h6" style="font-size: 15px;margin:0 !important;">{{props.row.quoteNumber}}</p>
            </router-link>
          </q-td>
          <q-td key="client" :props="props">
              {{ props.row.client.name }}
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
         <q-td key="actions" :props="props">
          <q-btn  v-if="canActivate('subject_finance','update') || canActivate('subject_finance','delete')" style="z-index:10;" dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item  v-if="canActivate('subject_finance','delete')" @click="deleteQuote(props.row.id)" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator  v-if="canActivate('subject_finance','update') && canActivate('subject_finance','delete')" />
                <q-item  v-if="canActivate('subject_finance','update') && props.row.status !== 'Paid'" @click="edit(props.row)" clickable v-close-popup>
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
        <modal @closeDialogue="prompt = false" :action="action" :body="body"  />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { date } from 'quasar'
import modal from './AddEditQuote.vue'
export default {
  props: ['type'],
  data() {
    return {
      canActivate: this.$canActivate,
    prompt: false,
    loading: false,
    action: '',
    body: {},
    columns : [
    { name: 'quoteNumber', align: 'left', label: 'Quote number', field: 'quoteNumber'},
    { name: 'client', align: 'left', label: 'Client', field: 'client'},
    { name: 'date', align: 'left', label: 'Quote date', field: 'date'},
    { name: 'dueDate', align: 'left', label: 'Due date', field: 'dueDate'}, 
    { name: 'status', align: 'left', label: 'Status', field: 'status'},  
    { name: 'actions', align: 'left', label: 'Actions', field: 'actions'}
  ]
   }
  },
  computed : {
      ...mapState('financeStore', ['sentQuotes','acceptedQuotes','rejectedQuotes']),
      data() {
        if(this.type === 'Sent') {
          return this.sentQuotes
        } else if(this.type === 'Accepted'){
          return this.acceptedQuotes
        }else{
          return this.rejectedQuotes
        }
      }
  },
  components: {
    modal
  },
  methods: {
      ...mapActions('financeStore', ['getQuotes','deleteQuote']),
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
    await this.getQuotes();
  }
}
</script>