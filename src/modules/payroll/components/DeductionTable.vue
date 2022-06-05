<template>
  <div>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :rows-per-page-options="[20,50,100,0]"
      flat
      class="bg-secondary q-pa-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td class="items-center justify-start" key="employee" :props="props">
            <p style="font-size: 20px;">{{props.row.employee?.name}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="deductionType" :props="props">
            <p style="font-size: 20px;">{{props.row.deductionType?.name}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="qty" :props="props">
            <p style="font-size: 20px;">{{props.row.qty}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="fund" :props="props">
            <p style="font-size: 20px;">{{props.row.deductionType?.fund}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="total" :props="props">
            <p style="font-size: 20px;">{{props.row.total}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="date" :props="props">
            <p style="font-size: 20px;">{{dateFunc.formatDate(new Date(props.row.date), 'YYYY-MM-DD HH:mm')}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="description" :props="props">
            <p style="font-size: 20px;">{{props.row.description}}</p>
          </q-td>
          <q-td class="text-right" key="actions" :props="props">
            <q-btn v-if="canActivate('subject_payroll','delete') || canActivate('subject_payroll','update')" dense round flat icon="more_vert">
              <q-menu
                transition-show="scale"
                transition-hide="scale"
              >
                <q-list style="min-width: 75px">
                  <q-item v-if="canActivate('subject_payroll','delete')"  @click="deleteDeduction({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                    <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                  </q-item>
                  <q-separator v-if="canActivate('subject_payroll','delete') && canActivate('subject_payroll','update')" />
                  <q-item v-if="canActivate('subject_payroll','update')" @click="editDeduction(props.row)" clickable v-close-popup>
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
        <modal @closeDialogue="dialogue = false" :body="body" :id="id" actionType="Edit" />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AddEditDeduction from './AddEditDeduction.vue';
import { date } from 'quasar';

export default {
  computed: {
    ...mapState('payrollStore', ['deductions']),
    data(){
      return this.deductions
    }
  },

  data() {
    return {
      canActivate: this.$canActivate,
      body: null,
      dateFunc: date,
      id: null,
      dialogue: false,
      loading: false,
      columns : [
        { name: 'employee', label: 'Employee', align: 'left', field: 'employee' },
        { name: 'deductionType', label: 'Deduction Type', align: 'left', field: 'deductionType' },
        { name: 'qty', label: 'Quantity', align: 'left', field: 'qty' },
        { name: 'fund', label: 'Fund', align: 'left', field: 'fund' },
        { name: 'total', label: 'Total', align: 'left', field: 'total' },
        { name: 'date', label: 'Date', align: 'left', field: 'date' },
        { name: 'description', label: 'Description', align: 'left', field: 'description' },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions'}
      ]
    }
  },
  components: {
    modal: AddEditDeduction
  },
  methods: {
    ...mapActions('payrollStore',['getDeductions','deleteDeduction']),
    editDeduction(department) {
        if(this.dialogue === true){
          this.dialogue = false;
          setTimeout(() => {
             this.body = department
            this.dialogue = true
          }, 200);
          return
        }
         this.body = department
        this.dialogue = true
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
        return 'background: #fff;'
      }
  },
 async mounted() {
   this.loading = true
   await this.getDeductions();
   this.loading=false
  }
}
</script>