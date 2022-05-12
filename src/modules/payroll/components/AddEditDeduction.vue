<template>
  <q-layout style="width: 500px !important;">
    <q-card style="max-width: 500px;min-height:100vh;" flat square>
      <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
        <q-toolbar-title>
          {{actionType}} Deduction
        </q-toolbar-title>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-toolbar>
      <q-card-section class="q-gutter-sm scroll">
        <br/>
        <q-select
          v-model="deductionType"
          ref="deductionTypeRef"
          no-caps
          label="Deduction Type"
          :loading="deductionTypeLoading"
          outlined
          :options="deductionTypeOptions"
          lazy-rules
          :rules="[val => (val) || 'Please Select an Deduction Type']"
          @update:model-value="updateTotal()"
        />
        <q-select
          v-model="employee"
          no-caps
          label="Employee"
          ref="employeeRef"
          :loading="employeeLoading"
          outlined
          :options="employeeOptions"
          lazy-rules
          :rules="[val => (val) || 'Please Select an Employee']"
        />
        <q-input
          outlined
          type="number"
          ref="qtyRef"
          v-model.number="credentials.qty"
          label="Quantity"
          @update:model-value="updateTotal()"
        />
        <q-input
          outlined
          readonly
          v-model="totalValue"
          label="Total"
        />
        <q-input
          filled
          v-model="credentials.date"
          ref="dateRef"
          :rules="[val => val.length > 0 || 'Please type the Date']"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="credentials.date" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="credentials.date" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          outlined
          v-model="credentials.description"
          label="Decription"
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
      id: null,
      totalValue: ref(0),
      loading: false,
      deductionTypeOptions: [],
      employeeOptions: [],
      employee: null,
      deductionType: null,
      deductionTypeLoading: false,
      employeeLoading: false,
      credentials : {
        qty: 0,
        description: '',
        date: ref(moment().format('YYYY-MM-DD HH:mm')),
        employeeId: null,
        deductionTypeId: null,
      },
    }
  },
  computed: {
    ...mapState('payrollStore', ['deductionTypes']),
    ...mapState('hrmStore', ['allEmployees']),
  },
  methods: {
    ...mapActions('payrollStore', ['createDeduction', 'updateDeduction','getDeductions', 'getDeductionTypes']),
    ...mapActions('hrmStore', ['getEmployees']),
    toggleShow() {
      this.show = !this.show;
    },
    updateTotal() {
      this.totalValue = Number(this.credentials?.qty || 0) * Number(this.deductionType?.fund || 0)
      console.log(this.credentials?.qty ,this.deductionType?.fund, this.totalValue)
    },
    async submit() {
      this.$refs.deductionTypeRef.validate();
      this.$refs.employeeRef.validate();
      this.$refs.qtyRef.validate();
      if (
        this.$refs.deductionTypeRef?.hasError
        ||
        this.$refs.employeeRef?.hasError
        ||
        this.$refs.qtyRef?.hasError
      ) {
        return
      }else{
        this.loading = true
        let data = {}
        if (this.deductionType) {
          this.credentials.deductionTypeId = Number(this.deductionType.id)
        }
        if (this.employee) {
          this.credentials.employeeId = Number(this.employee.id)
        }
        if(this.actionType === 'Add'){
          data['description'] = this.credentials.description
          data['qty'] = this.credentials.qty
          data['date'] = this.credentials.date
          data['employeeId'] = this.credentials.employeeId
          data['deductionTypeId'] = this.credentials.deductionTypeId

          let selfout = this
          try {
            console.log(data)
            await this.createDeduction(data)
            selfout.$q.notify({
              type: 'positive',
              message: 'Deduction created',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
          } catch(err) {
            selfout.$q.notify({
              type: 'negative',
              message: 'Something went wrong while requesting Deduction!',
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
          if (this.credentials.deductionTypeId) data['deductionTypeId'] = Number(this.credentials.deductionTypeId)
          if (this.credentials.employeeId) data['employeeId'] = Number(this.credentials.employeeId)
          if (this.credentials.qty) data['qty'] = Number(this.credentials.qty)
          if (this.credentials.date) data['date'] = moment(this.credentials.date).format('YYYY-MM-DD HH:mm:ss')
          if (this.credentials.description) data['description'] = Number(this.credentials.description)

          try {
            await this.updateDeduction(data);
            selfout.$q.notify({
              type: 'positive',
              message: 'Deduction updated',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
          } catch(err) {
            selfout.$q.notify({
              type: 'negative',
              message: 'Something went wrong while requesting Deduction!',
              color: 'negative',
              position: 'top',
              timeout: '500'
            })
          } finally {            
            this.loading = false
            this.$emit('closeDialogue');
          }
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
      this.deductionTypeLoading = true
      this.getValuesFromApiAsync(this.getDeductionTypes()).then(() => {
        for (let deductionType of this.deductionTypes) {
          this.deductionTypeOptions.push({label: `${deductionType.name} - ${Number(deductionType.rate)} ${deductionType.durationType}`, id: deductionType.id,fund: deductionType.fund,rate: deductionType.rate,durationType: deductionType.durationType})
        }
        this.deductionTypeLoading = false
      })
      this.employeeLoading = true
      this.getValuesFromApiAsync(this.getEmployees()).then(() => {
        for (let employee of this.allEmployees) {
          this.employeeOptions.push({label: employee.name, id: employee.id})
        }
        this.employeeLoading = false
      })
    }
    if (this.actionType === 'Edit') {
      this.id = this.body.id
      this.credentials.description = this.body.description
      this.credentials.date = moment(this.body.date).format("YYYY-MM-DD HH:mm").toString()
      this.credentials.qty = Number(this.body.qty)
      this.totalValue = Number(this.body.total)

      this.deductionTypeLoading = true
      this.getValuesFromApiAsync(this.getDeductionTypes()).then(() => {
        for (let deductionType of this.deductionTypes) {
          this.deductionTypeOptions.push({label: `${deductionType.name} - ${Number(deductionType.rate)} ${deductionType.durationType}`, id: deductionType.id,fund: deductionType.fund,rate: deductionType.rate,durationType: deductionType.durationType})
        }
        if (this.body.deductionType) this.deductionType = { label: `${this.body.deductionType.name} - ${Number(this.body.deductionType.rate)} ${this.body.deductionType.durationType}`, id: this.body.deductionType.id,fund: this.body.deductionType.fund,rate: this.body.deductionType.rate,durationType: this.body.deductionType.durationType };
        this.deductionTypeLoading = false
      })

      this.employeeLoading = true
      this.getValuesFromApiAsync(this.getEmployees()).then(() => {
        for (let employee of this.allEmployees) {
          this.employeeOptions.push({label: employee.name, id: employee.id})
        }
        if (this.body.employee) this.employee = {label: this.body.employee?.name, id: this.body.employee?.id}
        this.employeeLoading = false
      })
    }
    console.log("deductiontpye----",this.employee)
  }
}
</script>