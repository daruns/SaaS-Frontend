<template>
  <div>
    <h6 class="q-pa-md">Pending Approval Overtimes</h6>
    <q-table
      :rows="data"
      :columns="columns"
      :rows-per-page-options="[5,50,100,0]"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pa-md"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />

          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td key="colspan" auto-width>
            <q-btn size="sm" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td class="items-center justify-start" key="employeeName" :props="props">
            <span class="q-mr-sm">
              <q-avatar v-if="props.row.employee?.user?.avatar">
                <img :src="props.row.employee?.user?.avatar" />
              </q-avatar>
              <q-avatar v-else color="grey" text-color="white" icon="person" />
            </span>
            <span style="font-size: 17px;">{{props.row.employee?.name}}</span>
          </q-td>
          <q-td class="items-center justify-start" key="overtimeTypeName" :props="props">
            <p style="font-size: 17px;">{{props.row.overtimeType?.name}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="currentBalance" :props="props">
            <p style="font-size: 17px;">{{Number(props.row.currentBalance)}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="remainBalance" :props="props">
            <p style="font-size: 17px;">{{Number(props.row.remainBalance)}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="from" :props="props">
            <p style="font-size: 17px;">{{dateFunc.formatDate(new Date(props.row.from), 'YYYY-MM-DD')}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="to" :props="props">
            <p style="font-size: 17px;">{{dateFunc.formatDate(new Date(props.row.to), 'YYYY-MM-DD')}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="status" :props="props">
            <q-badge v-if="props.row.status === 'rejected'" rounded class="q-pa-sm bg-red text-white">Rejected</q-badge>
            <q-badge v-else-if="props.row.status === 'completed'" rounded class="q-pa-sm bg-primary text-white">Completed</q-badge>
            <q-badge v-else-if="props.row.status === 'pending'" rounded class="q-pa-sm bg-warning text-white">Pending</q-badge>
          </q-td>
          <q-td class="items-center justify-start" key="description" :props="props">
            <p style="font-size: 17px;">{{props.row.description}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="createdAt" :props="props">
            <p style="font-size: 17px;">{{dateFunc.formatDate(new Date(props.row.createdAt), 'YYYY-MM-DD')}}</p>
          </q-td>
          <q-td class="text-right" key="actions" :props="props">
            <div v-if="currentUser?.myEmployeeProfile?.hrMember === 1" class="row" style="min-width: 75px">
              <q-btn
                v-if="canActivate('subject_hrm','update')" 
                class="col"
                size="sm"
                :loading="approveLoading === props.row.id"
                @click="approveOvertimeMiddle({id: props.row.id, status: 'completed'})"
                flat
                no-caps 
                :disable="(props.row.isRejectCompleted || props.row.overtimeApprovals.some(ee => ee.status === 'rejected') || props.row.status === 'rejected')">
                <q-icon class="text-bold" name="done" :color="(props.row.isRejectCompleted || props.row.overtimeApprovals.some(ee => ee.status === 'rejected') || props.row.status === 'rejected') ? 'grey' : 'primary'" size="xs"></q-icon>Approve hr
              </q-btn>
              <q-btn
                v-if="canActivate('subject_hrm','update')" 
                class="col"
                :loading="rejectLoading === props.row.id"
                @click="approveOvertime({id: props.row.id, status: 'rejected'})"
                size="sm"
                flat
                no-caps 
                :disable="(props.row.isRejectCompleted || props.row.overtimeApprovals.some(ee => ee.status === 'rejected') || props.row.status === 'rejected')">
                <q-icon class="text-bold" name="close" :color="(props.row.isRejectCompleted || props.row.overtimeApprovals.some(ee => ee.status === 'rejected') || props.row.status === 'rejected') ? 'grey' : 'red'" size="xs"></q-icon>Reject hr
              </q-btn>
            </div>
            <div v-else class="flex align-items-center">
              <q-btn
                v-if="canActivate('subject_hrm','update')" 
                class="col"
                :loading="approveLoading === props.row.id"
                @click="updateApprovalMiddle({id: props.row.id, status: 'completed'})"
                size="sm"
                flat
                no-caps 
                :disable="props.row.isRejectCompleted">
                <q-icon class="text-bold" name="done" :color="props.row.isRejectCompleted ? 'grey' : 'primary'" size="xs"></q-icon>Approve
              </q-btn>
              <q-btn
                v-if="canActivate('subject_hrm','update')" 
                :loading="rejectLoading === props.row.id"
                class="col"
                @click="updateApprovalMiddle({id: props.row.id, status: 'rejected'})"
                size="sm"
                flat
                no-caps 
                :disable="props.row.isRejectCompleted">
                <q-icon class="text-bold" name="close" :color="props.row.isRejectCompleted ? 'grey' : 'red'" size="xs"></q-icon>Reject
              </q-btn>
            </div>
          </q-td>
        </q-tr>
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" v-show="props.expand">
          <q-td colspan="100%">
            <div class="q-mb-sm">Approval Stage</div>
            <div class="col-12 flex">
              <span v-for="(approv,index) in props.row.overtimeApprovals" :key="approv" class="flex text-center justify-center">
                <span v-if="index !== 0" class="flex items-center q-mx-md" style="width:80px"><q-linear-progress rounded :color="(approv.status === 'completed') ? 'primary' : 'grey'" size="3px" :value="1" /></span>
                <span class="text-center justify-center" >
                  <q-avatar size="35px" v-if="approv.manager?.user.avatar">
                    <img :src="approv.manager?.user.avatar" />
                  </q-avatar>
                  <q-avatar size="35px" v-else color="grey" text-color="white" icon="person" />
                  <div>{{approv.manager.name}}</div>
                  <span v-if="approv.manager.hrMember === 1">
                    <q-badge v-if="props.row.overtimeApprovals.every(ee => ee.status !== 'rejected') && props.row.status === 'rejected'" rounded class="bg-red text-white"><q-icon name="close"/></q-badge>
                    <q-badge v-else-if="props.row.overtimeApprovals.every(ee => ee.status === 'completed') && props.row.status === 'completed'" rounded class="bg-primary text-white"><q-icon name="done"/></q-badge>
                    <q-badge v-else-if="props.row.overtimeApprovals.every(ee => ee.status === 'completed') && props.row.status === 'pending'" rounded class="bg-warning text-white"><q-icon name="more_horiz"/></q-badge>
                    <q-badge v-else rounded class="bg-grey text-white"><q-icon name="more_horiz"/></q-badge>
                  </span>
                  <span v-else>
                    <q-badge v-if="approv.status === 'rejected'" rounded class="bg-red text-white"><q-icon name="close"/></q-badge>
                    <q-badge v-if="approv.status === 'completed'" rounded class="bg-primary text-white"><q-icon name="done"/></q-badge>
                    <q-badge v-if="approv.status === 'pending'" rounded class="bg-warning text-white"><q-icon name="more_horiz"/></q-badge>
                    <q-badge v-if="approv.status === ''" rounded class="bg-warning text-white"><q-icon name="more_horiz"/></q-badge>
                  </span>
                </span>
              </span>
            </div>
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
import AddEditOvertime from './AddEditOvertime.vue';
import { date } from 'quasar';
import Forbidden from 'src/components/globalComponents/Forbidden.vue';

export default {
  computed: {
    ...mapState('hrmStore', ['overtimeApprovals']),
    data(){
      let finalres = JSON.parse(JSON.stringify(this.overtimeApprovals)).sort((a,b) => b['id'] - a['id'])
      let finalresParsed = finalres.map(overtime => {
        const pendingHrDump = {
          status: "",
          manager: {
            name: "HR",
            hrMember: 1,
            user: {
              name: "HR",
              avatar: null,
            }
          }
        }
        if (overtime.overtimeApprovals.some(approval => {return approval.manager.hrMember === 1})) {
          return overtime
        } else {
          let copovertime = overtime
          if (overtime.overtimeApprovals.every(eaw => {return eaw.status === 'completed'})) {
            pendingHrDump.status = 'pending'
          }
          if (overtime.overtimeApprovals.every(eaw => {return eaw.status === 'completed'}) && overtime.status === "completed") {
            pendingHrDump.status = 'completed'
          }
          copovertime.overtimeApprovals = copovertime.overtimeApprovals.reverse() //.sort((a,b) => {b['id'] - a['id']})
          copovertime.overtimeApprovals.push(pendingHrDump)
          copovertime['isRejectCompleted'] = this.checkInApprovals(copovertime.overtimeApprovals)
          return copovertime
        }
      })
      console.log("overtime approvals: ",finalresParsed)
      return finalresParsed
    }
  },
  props: ['currentUser'],
  data() {
    return {
      canActivate: this.$canActivate,
      body: null,
      id: null,
      approveLoading: null,
      rejectLoading: null,
      dateFunc: date,
      dialogue: false,
      loading: false,
      columns : [
        { name: "employeeName", label: "Employee Name", align: "left", sortable:true,field: "employeeName" },
        { name: "overtimeTypeName", label: "Overtime Type", align: "left", sortable:true,field: "overtimeTypeName" },
        { name: "currentBalance", label: "Previouse Balance", align: "left", sortable:true,field: "currentBalance" },
        { name: "remainBalance", label: "Remained Balance", align: "left", sortable:true,field: "remainBalance" },
        { name: "from", label: "From", align: "left", sortable:true,field: "from" },
        { name: "to", label: "To", align: "left", sortable:true,field: "to" },
        { name: "status", label: "Status", align: "left", sortable:true,field: "status" },
        { name: "description", label: "Remark", align: "left", sortable:true,field: "description" },
        { name: "createdAt", label: "Requested Date", align: "left", sortable:true,field: "issuedAt" },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions'}
      ]
    }
  },
  components: {
    modal: AddEditOvertime,
    Forbidden
  },
  methods: {
    ...mapActions('hrmStore',['getOvertimeApprovals','updateApproval','approveOvertime']),
    ...mapActions('example', ['getUser']),
    async approveOvertimeMiddle (datt) {
      if (datt.status === 'rejected') {
        this.rejectLoading = datt.id;
        await this.approveOvertime(datt);
        this.rejectLoading = null
      }
      if (datt.status === 'completed') {
        this.approveLoading = datt.id;
        await this.approveOvertime(datt);
        this.approveLoading = null
      }
    },
    async updateApprovalMiddle (datt) {
      if (datt.status === 'rejected') {
        this.rejectLoading = datt.id;
        await this.updateApproval(datt)
        this.rejectLoading = null
      }
      if (datt.status === 'completed') {
        this.approveLoading = datt.id;
        await this.updateApproval(datt)
        this.approveLoading = null
      }
    },
    checkInApprovals(datta) {
      if (this.currentUser.myEmployeeProfile.hrMember === 1) {
        return datta.some(e => {return (e.manager.hrMember === 1 && (['completed','rejected'].includes(e.status) ) )} ) && datta.some(ee => {return !['pending',''].includes(ee.status)} )
      }
      return datta.some(e => {return (e.managerId === this.currentUser.myEmployeeProfile?.id && (['completed','rejected'].includes(e.status) ) )} ) && datta.some(ee => {return !['pending',''].includes(ee.status)} )
    },
    rowColor(props) {
      if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
      return 'background: #fff;'
    },
  },
  async mounted() {
    this.loading = true
    await this.getOvertimeApprovals()
    this.loading=false
  }
}
</script>
