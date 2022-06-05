<template>
  <div>
    <h6 class="q-pa-md">All Employees Payslips</h6>
    <q-table
      :rows="data"
      :columns="columns"
      :rows-per-page-options="[5,50,100,0]"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pa-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td class="" key="employeeName" :props="props">
            <span class="q-mr-sm">
              <q-avatar v-if="props.row.employee.user?.avatar">
                <img :src="props.row.employee.user?.avatar" />
              </q-avatar>
              <q-avatar v-else color="grey" text-color="white" icon="person" />
            </span>
            <span style="font-size: 17px;">{{props.row.employee?.name}}</span>
          </q-td>
          <q-td class="" key="employeeEmail" :props="props">
            <p style="font-size: 17px;">{{props.row.employee?.user?.email}} </p>
          </q-td>
          <q-td class="" key="fromDate" :props="props">
            <p style="font-size: 17px;">{{dateFunc.formatDate(new Date(props.row.fromDate), 'YYYY MMM')}}</p>
          </q-td>
          <q-td class="" key="salary" :props="props">
            <p style="font-size:17px;">{{props.row.employee.salary}}</p>
          </q-td>
          <q-td class="" key="createdAt" :props="props">
            <p style="font-size: 17px;">{{dateFunc.formatDate(new Date(props.row.createdAt), 'YYYY-MM-DD')}}</p>
          </q-td>
          <q-td class="justify-end text-right" key="actions" :props="props">
            <q-btn v-if="canActivate('subject_payroll','create')" flat :to="'/payroll/payslip/' + props.row.id" style="padding 0 !important" class="q-mx-sm bg-warning text-white" clickable v-close-popup>Generate Slip</q-btn>
            <q-btn v-if="canActivate('subject_payroll','delete')" round flat color="red" icon="delete" @click="deletePayslip({id: props.row.id})" style="padding 0 !important" class="q-mx-sm" clickable v-close-popup />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <hr/>
    <q-dialog @closeDialogue="dialogue = false" :inProfile="false" seamless position="right" v-model="dialogue">
      <modal @closeDialogue="dialogue = false" :currentUser="currentUser" :body="body" :id="id" actionType="Edit" />
    </q-dialog>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
// import AddEditPayslip from './AddEditPayslip.vue';
import { date } from 'quasar';
export default {
  computed: {
    ...mapState('payrollStore', ['payslips']),
    data(){
      let finalres = JSON.parse(JSON.stringify(this.payslips)).sort((a,b) => b['id'] - a['id'])
      return finalres
    }
  },
  props: ['currentUser'],
  data() {
    return {
      canActivate: this.$canActivate,
      body: null,
      id: null,
      dateFunc: date,
      dialogue: false,
      loading: false,
      columns : [
        { name: "employeeName", label: "Employee Name", align: "left", sortable:true,field: "employeeName" },
        { name: "employeeEmail", label: "Employee Email", align: "left", sortable:true,field: "employeeEmail" },
        { name: "fromDate", label: "Date", align: "left", sortable:true,field: "fromDate" },
        { name: "salary", label: "Salary", align: "left", sortable:true,field: "salary" },
        { name: "createdAt", label: "Created Date", align: "left", sortable:true,field: "issuedAt" },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions'}
      ]
    }
  },
  components: {
    // modal: AddEditPayslip
  },
  methods: {
    ...mapActions('payrollStore',['getPayslips','deletePayslip']),
    ...mapActions('example', ['getUser']),
    editOvertime(department) {
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
    await this.getUser();
    await this.getPayslips();
    this.loading=false
  }
}
</script>