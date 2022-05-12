<template>
  <q-layout style="width: 500px !important;">
    <q-card style="max-width: 500px;min-height:100vh;" flat square>
      <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
        <q-toolbar-title>
          {{actionType}} Leave
        </q-toolbar-title>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-toolbar>
      <q-card-section class="q-gutter-sm scroll">
        <br/>
        <q-select
          v-model="leaveType"
          ref="leaveTypeRef"
          no-caps
          label="Leave Type"
          :loading="leaveTypeLoading"
          outlined
          @update:model-value="setRemainingDays({from: credentials.from, to: credentials.to})"
          :options="leaveTypeOptions"
          lazy-rules
          :rules="[val => (val && val.id) || 'Please type the Leave Type']"
        />
        <q-checkbox
          ref="forMeRef"
          outlined
          @update:model-value="trigchkbxfrme"
          v-if="currentUser?.myEmployeeProfile.hrMember"
          v-model="forMe"
          label="My leave (Leave Request for my self)"
        />
        <q-select
          v-model="employee"
          :disable="currentUser.myEmployeeProfile && forMe"
          no-caps
          @update:model-value="setCurrentBalance"
          v-if="currentUser?.myEmployeeProfile.hrMember"
          label="Employee"
          :loading="employeeLoading"
          outlined
          clearable
          :options="employeeOptions"
        />
        <q-input
          outlined
          disable
          type="number"
          v-model.number="currentBalance"
          label="Current Balance"
        />
        <q-input
          v-if="leaveType?.durationType === 'hours'"
          outlined
          disable
          v-model="remainBalanceHours"
          label="Remain Balance"
        />
        <q-input
          v-if="leaveType?.durationType === 'days'"
          outlined
          disable
          type="number"
          v-model="remainBalance"
          label="Remain Balance"
        />
        <div v-if="leaveType?.durationType === 'days'" class="flex col-12">
          <q-date
            subtitle="Pick Duration"
            mask="YYYY-MM-DD"
            class="col-12"
            :disable="leaveType == null"
            @update:model-value="setRemainingDays"
            v-model="fromto"
            emit-immediately
            ref="fromToRef"
            range
            lazy-rules
            :rules="[val => (val || val?.from) || 'Please type the Employee']"
          >
            <div v-if="fromtToToggle" class="text-red">* pick a date</div>
            <div v-if="fromtToDaysExceedToggle" class="text-red">* Days exceeded the balance limit</div>
            <div v-if="fromtToleavetypeDaysExceedToggle" class="text-red">* Days exceeded the Leave Type limit</div>
          </q-date>
        </div>
        <div class="flex col-12" v-if="leaveType?.durationType === 'hours'">
          <q-date
            subtitle="Pick Duration"
            mask="YYYY-MM-DD"
            class="my-2 col-12"
            :disable="leaveType == null"
            @update:model-value="setdatetimeDate"
            v-model="datetimeDate"
            emit-immediately
            ref="fromToRef"
            lazy-rules
            :rules="[val => val || 'Please type the Employee']"
          >
            <div v-if="fromtToToggle" class="text-red">* pick a date</div>
            <div v-if="fromtToDaysExceedToggle" class="text-red">* Days exceeded the balance limit</div>
            <div v-if="fromtToleavetypeDaysExceedToggle" class="text-red">* Days exceeded the Leave Type limit</div>
          </q-date>
        </div>
        <div v-if="leaveType?.durationType === 'hours'" class="q-gutter-xs">
          <q-input class="col-6" label="from:" :rules="['time']" @update:model-value="setdatetimeFrom" filled v-model="datetimeFrom">
            <template v-slot:prepend>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time now-btn @update:model-value="setdatetimeFrom" v-model="datetimeFrom" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input class="col-6" label="to:" :rules="['time']" @update:model-value="setdatetimeTo" filled v-model="datetimeTo">
            <template v-slot:prepend>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time now-btn @update:model-value="setdatetimeTo" v-model="datetimeTo" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

        </div>
        <q-input
          ref="descriptionRef"
          outlined
          v-model="credentials.description"
          label="Remark"
        />
      </q-card-section>
    </q-card>
    <q-toolbar class="bg-grey-3 submitBtnClass" style="position:sticky !important; bottom:0;z-index:5;">
      <q-btn :loading="loading" @click="submit" class="full-width" color="primary" label="Submit" no-caps />
    </q-toolbar>
  </q-layout>
</template>
<script>
import { ref } from 'vue'
import { mapActions, mapState } from 'vuex'
import { VueTelInput } from 'vue-tel-input';
import * as moment from 'moment'
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'
export default {
  components : {
    VueTelInput,
    Datepicker
  },
  props: ['currentUser','actionType','body'],
  data() {
    return {
      show: true,
      fromto: ref({from: null,to: null}),
      id: null,
      fromtToDaysExceedToggle: false,
      datetimeDate: ref(moment().format('YYYY-MM-DD')),
      datetimeFrom: ref(moment().format('HH:mm')),
      datetimeTo: ref(moment().format('HH:mm')),
      fromtToleavetypeDaysExceedToggle: false,
      loading: false,
      fromtToToggle: false,
      leaveTypeDuration: 'days',
      leaveTypeOptions: [],
      employeeOptions: [],
      employee: null,
      currentBalance: 0,
      forMe: true,
      leaveType: null,
      leaveTypeLoading: false,
      employeeLoading: false,
      remainBalance: ref(0),
      remainBalanceHours: '',
      credentials : {
        description: null,
        from: null,
        to: null,
        currentBalance: 0,
        employeeId: null,
        leaveTypeId: null,
      },
    }
  },
  computed: {
    ...mapState('hrmStore', ['allEmployees', 'leaveTypes']),
  },
  methods: {
    ...mapActions('hrmStore', ['createLeave', 'updateLeave','getLeaves', 'getEmployees', 'getLeaveTypes']),
    trigchkbxfrme(targval) {
      this.employee = null
      if (targval === false) {
        this.currentBalance = 0
        this.remainBalance = 0
      }
      if (targval === true) {
        if (this.currentUser.myEmployeeProfile) {
          this.currentBalance = Number(this.currentUser.myEmployeeProfile.leaveBalance)
          this.remainBalance = Number(this.currentBalance)
          this.setRemainingDays({from: this.credentials.from, to: this.credentials.to})
        }
      }
    },
    toggleShow() {
      this.show = !this.show;
    },
    setdatetimeDate(val) {
      let fromValueDateTime = `${val} ${this.datetimeFrom}`
      let toValueDateTime = `${val} ${this.datetimeTo}`
      this.fromto = { from: fromValueDateTime, to: toValueDateTime }
      this.setRemainingDays({from: fromValueDateTime, to: toValueDateTime })
    },
    setdatetimeTo(val) {
      let fromValueDateTime = `${this.datetimeDate} ${this.datetimeFrom}`
      let toValueDateTime = `${this.datetimeDate} ${val}`
      this.fromto = { from: fromValueDateTime, to: toValueDateTime }
      this.setRemainingDays({from: fromValueDateTime, to: toValueDateTime })
    },
    setdatetimeFrom(val) {
      let fromValueDateTime = `${this.datetimeDate} ${val}`
      let toValueDateTime = `${this.datetimeDate} ${this.datetimeTo}`
      this.fromto = { from: fromValueDateTime, to: toValueDateTime }
      this.setRemainingDays({from: fromValueDateTime, to: toValueDateTime })
    },
    setCurrentBalance(val) {
      let difference = this.currentBalance - this.remainBalance
      this.currentBalance = Number(val?.leaveBalance)
      this.remainBalance = Number(val?.leaveBalance - difference)
      this.setRemainingDays({from: this.credentials.from, to: this.credentials.to})
    },
    setRemainingDays(val) {
      if (val === null) val = {}
      console.log("typeof: ",typeof val, val, "leavetype: ",this.leaveType.durationType)
      if (typeof val === 'object' && !Object.values(val).includes(null) && Object.keys(val).includes('from')) {
        let vfrom = val?.from
        let vto = val?.to
        if (this.leaveType.durationType === "hours") {
          this.remainBalance = (Number(new Date(vto)/ 86400000) - ( Number( new Date(vfrom) )/ 86400000 ) )
        } else {
          this.remainBalance = (Number(new Date(vto)/ 86400000) - ( Number( new Date(vfrom) )/ 86400000 ) ) + 1
        }
        console.log("remaining balance in above: ",this.remainBalance)
        this.remainBalance = Number(this.currentBalance - this.remainBalance)
        this.credentials.from = val.from
        this.credentials.to = val.to
      } else if (typeof val === 'string' && val !== '') {
        console.log("remaining balance in ----: ",this.currentBalance)
        this.credentials.from = val
        this.credentials.to = val
        if (this.leaveType.durationType === "hours") {
          this.remainBalance = 0
        } else {
          this.remainBalance = 1
        }
        this.remainBalance = this.currentBalance - this.remainBalance
      } else {
        this.credentials.from = null
        this.credentials.to = null
      }
      console.log("this remaining balance",this.remainBalance)
      this.remainBalanceHours = this.currentBalance
      if (typeof this.remainBalance === 'number') {
        let currembals = this.remainBalance.toFixed(2)
        let startRemain = `${currembals}`?.split(".")
        let days = Number(startRemain[0])
        let hours = ((currembals - days) * 24).toFixed(0)
        console.log("remaininghours: ",hours, days,currembals)
        this.remainBalanceHours = days + ' Days ' + hours + ' Hours'
      }
      this.fromtToleavetypeDaysExceedToggle = (Number(this.currentBalance) - Number(this.remainBalance)) > Number(this.leaveType?.days)
      this.fromtToDaysExceedToggle = (Number(this.remainBalance) < 0) && this.leaveType?.urgent != true
      this.fromtToToggle = (this.credentials.from === null||this.credentials.to === null) === true
    },
    async submit() {
      if (
      this.credentials.from === null
      ||
      this.credentials.to === null
      ) {
        this.fromtToToggle = true
      }
      if ((Number(this.currentBalance) - Number(this.remainBalance)) > Number(this.leaveType.days)) {
        this.fromtToleavetypeDaysExceedToggle = true
      }
      if (Number(this.remainBalance) < 0 && this.leaveType?.urgent != true) {
        this.fromtToDaysExceedToggle = true
      }
      this.$refs.leaveTypeRef.validate();
      if (!this.currentUser?.myEmployeeProfile) {
        this.$refs.employeeRef.validate();
        if (this.forMe) this.credentials.employeeId = Number(this.currentUser.myEmployeeProfile?.id)
      }
      // this.$refs.emptyFromToRef.show()
      if (
        this.$refs.leaveTypeRef?.hasError
        ||
        this.credentials.from === null
        ||
        this.credentials.to === null
        ||
        (!this.forMe && this.$refs.employeeRef?.hasError)
        ||
        ((Number(this.currentBalance) - Number(this.remainBalance)) > Number(this.leaveType.days))
        ||
        (Number(this.remainBalance) < 0 && !this.leaveType?.urgent == true)
      ) {
        return
      }else{
        this.loading = true
        let data = {
          description: this.credentials.description,
          from: this.credentials.from,
          to: this.credentials.to,
          leaveTypeId: Number(this.leaveType?.id),
        };

        if (!this.forMe) {
          data['employeeId'] = Number(this.employee?.id)
        }
        if(this.actionType === 'Add'){
          if (this.leaveType) {
            data['leaveTypeId'] = Number(this.leaveType.id)
          }
          if (this.employee) {
            if (!this.currentUser.myEmployeeProfile) {
              data['employeeId'] = Number(this.employee.id)
            }
          }
          let selfout = this
          try {
            await this.createLeave(data)
            selfout.$q.notify({
              type: 'positive',
              message: 'Department created',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
          } catch(err) {
            selfout.$q.notify({
              type: 'negative',
              message: 'Something went wrong while requesting Leave!',
              color: 'negative',
              position: 'top',
              timeout: '500'
            })
          } finally {            
            this.loading = false
            this.$emit('closeDialogue');
          }
        }else{
          data['id'] = Number(this.id)
          await this.updateLeave(data);
          this.getLeaves();
          selfout.$q.notify({
            type: 'positive',
            message: 'Department updated',
            color: 'positive',
            position: 'top',
            timeout: '500'
          })
        }
      }
    },
    getValuesFromApiAsync(apiAct) {
      return new Promise(async resolve => {
        resolve(await apiAct)
      });
    }
  },
  async mounted() {
    if (this.actionType === 'Add') {
      this.employee = {label: this.currentUser.myEmployeeProfile.name, id: this.currentUser.myEmployeeProfile.id, leaveBalance: this.currentUser.myEmployeeProfile.leaveBalance}
      if (this.currentUser.myEmployeeProfile) {
        this.currentBalance = Number(this.currentUser.myEmployeeProfile?.leaveBalance)
        this.remainBalance = this.currentBalance
      }
      this.leaveTypeLoading = true
      this.getValuesFromApiAsync(this.getLeaveTypes()).then(() => {
        for (let leaveType of this.leaveTypes) {
          this.leaveTypeOptions.push({label: `${leaveType.name} - ${Number(leaveType.days)} ${leaveType.durationType}${leaveType.urgent ? ' - Urgent' : ""}`, id: leaveType.id,days: leaveType.days,urgent: leaveType.urgent,durationType: leaveType.durationType})
        }
        this.leaveTypeLoading = false
      })
      this.employeeLoading = true
      this.getValuesFromApiAsync(this.getEmployees()).then(() => {
        for (let employee of this.allEmployees) {
          this.employeeOptions.push({label: employee.name, id: employee.id, leaveBalance: employee.leaveBalance})
        }
        this.employeeLoading = false
      })
    }
    if (this.actionType === 'Edit') {
      this.id = this.body.id
      this.credentials.description = this.body.description
      let fromparsed = moment(this.body.from).format("YYYY-MM-DD").toString()
      let toparsed = moment(this.body.to).format("YYYY-MM-DD").toString()
      this.fromto = {from: moment(this.body.from).format("YYYY-MM-DD"), to: moment(this.body.to).format("YYYY-MM-DD").toString()}
      if (fromparsed === toparsed) this.fromto = moment(this.body.from).format("YYYY-MM-DD")
      this.credentials.from = this.body.from
      this.credentials.to = this.body.to
      this.credentials.currentBalance = this.body.currentBalance
      this.credentials.remainBalance = this.body.remainBalance
      this.leaveTypeLoading = true
      this.getValuesFromApiAsync(this.getLeaveTypes()).then(() => {
        for (let leaveType of this.leaveTypes) {
          this.leaveTypeOptions.push({label: `${leaveType.name} - ${Number(leaveType.days)} ${leaveType.durationType}${leaveType.urgent ? ' - Urgent' : ""}`, id: leaveType.id,days: leaveType.days,urgent: leaveType.urgent,durationType: leaveType.durationType})
        }
        this.leaveType = {label: `${this.body.leaveType.name} - ${Number(this.body.leaveType.days)} ${leaveType.durationType}${this.body.leaveType.urgent ? ' - Urgent' : ""}`, id: this.body.leaveType.id,days: this.body.leaveType.days,urgent: this.body.leaveType.urgent,durationType: leaveType.durationType};
        this.leaveTypeLoading = false
        this.employee = {label: this.currentUser.myEmployeeProfile.name, id: this.currentUser.myEmployeeProfile.id, leaveBalance: this.currentUser.myEmployeeProfile.leaveBalance}
        if (this.currentUser.myEmployeeProfile) {
          this.currentBalance = Number(this.currentUser.myEmployeeProfile?.leaveBalance)
          this.remainBalance = this.currentBalance
          this.setRemainingDays(this.fromto)
        }
      })
      if (this.currentUser.myEmployeeProfile) {
        this.employee = {label: this.currentUser.myEmployeeProfile?.name, id: this.currentUser.myEmployeeProfile?.id}
      } else {
        this.employeeLoading = true
        this.getValuesFromApiAsync(this.getEmployees()).then(() => {
          for (let employee of this.allEmployees) {
            this.employeeOptions.push({label: employee.name, id: employee.id, leaveBalance: employee.leaveBalance})
          }
          this.employee = {label: this.body.employee?.name, id: this.body.employee?.id, leaveBalance: this.body.employee?.leaveBalance}
          this.currentBalance = this.body.employee?.leaveBalance
          this.employeeLoading = false
        })
      }
    }
    console.log("leavetpye----",this.employee)
  }
}
</script>