<template>
  <q-layout style="width: 500px !important;">
    <q-card style="max-width: 500px;min-height:100vh;" flat square>
      <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
        <q-toolbar-title>
          {{actionType}} Salary
        </q-toolbar-title>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-toolbar>
      <q-card-section class="q-gutter-sm scroll">
        <br/>
        <q-select
          v-model="employee"
          no-caps
          label="Employee"
          @update:model-value="val => {salary = val?.salary; credentials.employeeId = val?.id}"
          :loading="employeeLoading"
          outlined
          ref="employeeRef"
          :rules="[val => (credentials.employeeId !== null) || 'Please type the Employee']"
          clearable
          :options="employeeOptions"
        />
        <q-input
          outlined
          disable
          type="number"
          v-model.number="salary"
          label="Basic Salary"
        />
        <div class="flex col-12">
          <q-date
            subtitle="Pick Duration"
            mask="YYYY-MM"
            class="col-12"
            @update:model-value="setFromDate"
            v-model="credentials.fromDate"
            emit-immediately
            ref="fromDateRef"
            :rules="[val => (val !== null) || 'Please type the Employee']"
          >
            <!-- TODO: add already exist payslip with this month error -->
            <!-- <div v-if="exist" class="text-red">* Days exceeded the Leave Type limit</div> -->
          </q-date>
        </div>
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
      loading: false,
      employeeOptions: [],
      employee: null,
      salary: 0,
      employeeLoading: false,
      credentials : {
        fromDate: null,
        employeeId: null,
      },
    }
  },
  computed: {
    ...mapState('payrollStore', ['payslips']),
    ...mapState('hrmStore', ['allEmployees']),
  },
  methods: {
    ...mapActions('payrollStore', ['createPayslip']),
    ...mapActions('hrmStore', ['getEmployees']),
    setFromDate(val) {
      console.log(val)
    },
    async submit() {
      this.$refs.employeeRef.validate();
      // this.$refs.fromDateRef.validate();
      if (
        this.credentials.fromDate === null
        ||
        this.credentials.employeeId === null
      ) {
        return
      } else {
        this.loading = true
        let data = {
          employeeId: Number(this.credentials.employeeId),
          fromDate: this.credentials.fromDate,
        };

        let selfout = this
        try {
          await this.createPayslip(data)
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
      this.employee = {label: '', id: null, salary: 0}
      this.employeeLoading = true
      this.getValuesFromApiAsync(this.getEmployees()).then(() => {
        for (let employee of this.allEmployees) {
          this.employeeOptions.push({label: employee.name, id: employee.id, salary: employee.salary})
        }
        this.employeeLoading = false
      })
    }
  }
}
</script>