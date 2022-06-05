<template>
  <div class="q-py-sm" v-if="attends">
    <h6>This Month Attendances</h6>
    <q-table
      :rows="attendancesData"
      :columns="allcolumns"
      row-key="id"
      :loading="loading"
      flat
      :filter="filter"
      class="bg-secondary q-py-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td
            :props="props"
            key="employeeId"
            :class="'items-center'"
          >
            <span class="q-mr-sm">
              <q-avatar v-if="props.row.employee?.user?.avatar">
                <img :src="props.row.employee?.user?.avatar" />
              </q-avatar>
              <q-avatar v-else color="grey" text-color="white" icon="person" />
            </span>
            <span style="font-size: 17px;">{{props.row.employee?.name}}</span>
          </q-td>
          <q-td
            v-for="allcolumn in props.row.attendances"
            :key="allcolumn.day"
            :props="props"
            :class="'items-center justify-center'"
          >
            <q-icon v-if="allcolumn.checked" class="text-primary text-bold" name="done" />
            <q-icon v-else class="text-red text-bold" name="close" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div class="q-py-sm" v-if="myattends">
    <q-card class="q-gutter-md bg-transparent row" flat>
      <div class="rounded-borders bg-white q-pa-sm col">
        <div class="text-left text-h4">
          Time Sheet <span color="grey-3">{{todayDateFull}}</span>
        </div>
        <div class="flex q-pa-md justify-center item-center flex items-center">
          <div class="justify-center flex">
            <q-circular-progress
              :thickness="0.05"
              track-color="grey-3"
              show-value
              class="q-ma-lg"
              font-size="30px"
              :value="todayHoursPercentage"
              size="200px"
              color="grey"
            >{{todayHours}} Hrs</q-circular-progress>
            <q-btn :loading="btnloading" class="q-pa-md text-h6" style="width: 100%" v-if="!lastAttend" label="Punch In" color="primary" @click="autoCloseDialogue()" />
            <q-btn :loading="btnloading" class="q-pa-md text-h6" style="width: 100%" v-else label="Punch Out" color="red" @click="autoCloseDialogue()" />
            <div class="q-py-lg row" style="width: 100%">
              <span class="q-mr-xs rounded-borders text-h6 q-py-md col bg-grey text-center text-white">Break {{breakTime}} hrs</span>
              <span class="q-ml-xs rounded-borders text-h6 q-py-md col bg-grey text-center text-white">Over Time 0 hrs</span>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-borders q-pa-md bg-white col">
        <div class="text-h4">
          Today Activity <span color="grey-3">{{todayDate}}</span>
        </div>
        <q-timeline color="grey">
          <div verticalScrollPosition="0" style="height: 300px; overflow-y: scroll;">
            <q-timeline-entry
              v-for="punch in attendancesData"
              :key="punch.id"
              :title="punch.checkedIn === 1 ? 'Punch In' : 'Punch Out'"
              :subtitle="punch.createdAt?.match(/([0-1]?[0-9]|2[0-3]):[0-5][0-9]/)?.at(0)"
              :color="punch.checkedIn === 1 ? 'primary' : 'red'"
            />
          </div>
        </q-timeline>
      </div>
    </q-card>
    <br/>
    <div class="text-h6">All Attendances</div>
    <q-table
      :rows="myattendancesData"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      :filter="filter"
      class="bg-secondary q-py-md"
    >

      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td class="items-center justify-start" key="indx" :props="props">
            <p style="font-size: 20px;">{{props.row.id}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="duration" :props="props">
            <p style="font-size: 20px;">{{props.row?.duration}}</p>
          </q-td>
          <q-td :class="'items-center justify-center'" key="punchInAt" :props="props">
            <p style="font-size: 20px;">{{props.row.punchInAt}}</p>
          </q-td>
          <q-td :class="'items-center justify-center'" key="punchOutAt" :props="props">
            <p style="font-size: 20px;">{{props.row.punchOutAt}}</p>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ref } from 'vue'
import * as moment from 'moment'
export default {
  computed: {
    ...mapState('hrmStore', ['attendances']),
    attendancesData() {
      let final = JSON.parse(JSON.stringify(this.attendances)).sort((a,b) => b['id'] - a['id'])
      if (this.myattends) {
        if (final[0]) this.lastAttend = final[0]?.checkedIn
      }
      return final
    },
    myattendancesData() {
      let final = JSON.parse(JSON.stringify(this.attendances)).sort((a,b) => b['id'] - a['id'])
      if (this.myattends) {
        let finals = []
        let indx = 1
        let breakTimeDuration = 0;
        let tempfinal = final.sort().reverse()
        if (tempfinal.length) {
          tempfinal.reduce((prev, cur) => {
            if (prev.checkedIn !== 1 && cur.checkedIn === 1) {
              let curat = Number(new Date(cur.createdAt)) / 3600000
              let prevat = Number(new Date(prev.createdAt)) / 3600000
              console.log("difff: ",curat,prevat,prev.createdAt,cur.createdAt)
              breakTimeDuration += Number(curat - prevat)
            }
            if (prev.checkedIn === 1 && prev.checkedIn !== cur.checkedIn) {
              let curat = Number(new Date(cur.createdAt)) / 3600000
              let prevat = Number(new Date(prev.createdAt)) / 3600000
              finals.push( {id: indx,duration: Number(curat - prevat).toFixed(2), punchInAt: moment(prev.createdAt).format("YYYY-MM-DD HH:mm"), punchOutAt: moment(cur.createdAt).format("YYYY-MM-DD HH:mm")} )
              indx++
            }
            return cur
          });
        }
        let filteredFinals = finals.filter(oneItem => {
          return Number(new Date(oneItem.punchInAt.split('.')[0])) > Number(new Date(moment().format('YYYY-MM-DD')) )
        })
        console.log("this duration hours: ",filteredFinals)
        let totalAmount = 0;
        for (let cr of filteredFinals) {
          totalAmount += Number(cr.duration)
        }
        this.breakTime = breakTimeDuration?.toFixed(2)
        this.todayHoursPercentage = totalAmount/8*100
        this.todayHours = totalAmount.toFixed(2)
        return finals
      }
      return []
    }
  },
  props: ['currentUser'],
  data() {
    return {
      canActivate: this.$canActivate,
      filter: ref(""),
      attends: false,
      todayDateFull: moment().format('DD MMM YYYY'),
      todayHours: 0,
      todayHoursPercentage: 0,
      breakTime: 0,
      todayDate: moment().format('DD, MMM'),
      myattends: false,
      btnloading: false,
      lastAttend: false,
      id: null,
      loading: false,
      columns : [
        { name: 'indx', label: '#', align: 'left', field: 'indx'},
        { name: 'duration', label: 'Attended Duration Hours', align: 'left', field: 'duration' },
        { name: 'punchInAt', label: 'Punch In At', align: 'left', field: 'punchInAt' },
        { name: 'punchOutAt', label: 'Punch Out At', align: 'left', field: 'punchOutAt' },
      ],
      allcolumns : [
        { name: 'employeeId', label: 'Employee', align: 'left', field: 'employeeId'},
        ...this.daysInThisMonth()?.map(x => {return { name: x, label: x, align: 'right', field: x}} )
      ]
    }
  },
  methods: {
    ...mapActions('hrmStore',['createAttendance', 'getAttendances']),
    daysInThisMonth() {
      let now = new Date();
      let thismonthDays = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
      return Array.from({length: thismonthDays}, (e, i)=> i+1)
    },
    async autoCloseDialogue () {
      this.btnloading = true
      await this.createAttendance()
      await this.getAttendances()
      this.btnloading = false
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
        return 'background: #fff;'
      }
  },
 async mounted() {
   this.loading = true
   this.getAttendances().then(() => {
     console.log(this.attendances)
     this.loading = false
    })
    if (this.currentUser && (this.currentUser.userType === 'owner' || (this.currentUser.myEmployeeProfile && this.currentUser.myEmployeeProfile.hrMember) )) {
      this.myattends = false
      this.attends = true
    } else {
      this.attends = false
      this.myattends = true
    }
  }
}
</script>