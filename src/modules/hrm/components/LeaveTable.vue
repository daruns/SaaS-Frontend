<template>
  <div>
    <h6 class="q-pa-md">All Employees Leaves</h6>
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
              <q-avatar v-if="props.row.employee.user?.avatar">
                <img :src="props.row.employee.user?.avatar" />
              </q-avatar>
              <q-avatar v-else color="grey" text-color="white" icon="person" />
            </span>
            <span style="font-size: 17px;">{{props.row.employee?.name}}</span>
          </q-td>
          <q-td class="items-center justify-start" key="leaveTypeName" :props="props">
            <p style="font-size: 17px;">{{props.row.leaveType?.name}}</p>
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
          <!-- <q-td class="text-right" key="actions" :props="props">
            <q-btn dense round flat icon="more_vert">
              <q-menu
                transition-show="scale"
                transition-hide="scale"
              >
                <q-list style="min-width: 75px">
                  <q-item @click="deleteLeave({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                    <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item @click="editLeave(props.row)" clickable v-close-popup>
                    <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td> -->
        </q-tr>
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" v-show="props.expand">
          <q-td colspan="100%">
            <div class="q-mb-sm">Approval Stage</div>
            <div class="col-12 flex">
              <span v-for="(approv,index) in props.row.leaveApprovals" :key="approv" class="flex text-center justify-center">
                <span v-if="index !== 0" class="flex items-center q-mx-md" style="width:80px"><q-linear-progress rounded :color="(approv.status === 'completed') ? 'primary' : 'grey'" size="3px" :value="1" /></span>
                <span class="text-center justify-center" >
                  <q-avatar size="35px" v-if="approv.manager?.user.avatar">
                    <img :src="approv.manager?.user.avatar" />
                  </q-avatar>
                  <q-avatar size="35px" v-else color="grey" text-color="white" icon="person" />
                  <div>{{approv.manager.name}}</div>
                  <span v-if="approv.manager.hrMember === 1">
                    <q-badge v-if="props.row.leaveApprovals.every(ee => ee.status !== 'rejected') && props.row.status === 'rejected'" rounded class="bg-red text-white"><q-icon name="close"/></q-badge>
                    <q-badge v-else-if="props.row.leaveApprovals.every(ee => ee.status === 'completed') && props.row.status === 'completed'" rounded class="bg-primary text-white"><q-icon name="done"/></q-badge>
                    <q-badge v-else-if="props.row.leaveApprovals.every(ee => ee.status === 'completed') && props.row.status === 'pending'" rounded class="bg-warning text-white"><q-icon name="more_horiz"/></q-badge>
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
import AddEditLeave from './AddEditLeave.vue';
import { date } from 'quasar';
export default {
  computed: {
    ...mapState('hrmStore', ['leaves']),
    data(){
      let finalres = JSON.parse(JSON.stringify(this.leaves)).sort((a,b) => b['id'] - a['id'])
      let finalresParsed = finalres.map(leave => {
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
        if (leave.leaveApprovals.some(approval => {return approval.manager.hrMember === 1})) {
          return leave
        } else {
          let copleave = leave
          if (leave.leaveApprovals.every(eaw => {return eaw.status === 'completed'})) {
            pendingHrDump.status = 'pending'
          }
          if (leave.leaveApprovals.every(eaw => {return eaw.status === 'completed'}) && leave.status === "completed") {
            pendingHrDump.status = 'completed'
          }
          copleave.leaveApprovals = copleave.leaveApprovals.reverse() //.sort((a,b) => {b['id'] - a['id']})
          copleave.leaveApprovals.push(pendingHrDump)
          return copleave
        }
      })
      console.log("leaves: ",finalresParsed)
      return finalresParsed
    }
  },
  props: ['currentUser'],
  data() {
    return {
      body: null,
      id: null,
      dateFunc: date,
      dialogue: false,
      loading: false,
      columns : [
        { name: "employeeName", label: "Employee Name", align: "left", sortable:true,field: "employeeName" },
        { name: "leaveTypeName", label: "Leave Type", align: "left", sortable:true,field: "leaveTypeName" },
        { name: "currentBalance", label: "Previouse Balance", align: "left", sortable:true,field: "currentBalance" },
        { name: "remainBalance", label: "Remained Balance", align: "left", sortable:true,field: "remainBalance" },
        { name: "from", label: "From", align: "left", sortable:true,field: "from" },
        { name: "to", label: "To", align: "left", sortable:true,field: "to" },
        { name: "status", label: "Status", align: "left", sortable:true,field: "status" },
        { name: "description", label: "Remark", align: "left", sortable:true,field: "description" },
        { name: "createdAt", label: "Requested Date", align: "left", sortable:true,field: "issuedAt" },
        // { name: 'actions', label: 'Actions', align: 'right', field: 'actions'}
      ]
    }
  },
  components: {
    modal: AddEditLeave
  },
  methods: {
    ...mapActions('hrmStore',['getLeaves','deleteLeave']),
    ...mapActions('example', ['getUser']),
    editLeave(department) {
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
    await this.getLeaves();
    this.loading=false
  }
}
</script>