<template>
<q-layout style="width: 500px !important;">
  <q-card style="max-width: 500px;min-height:100vh;" flat square>
    <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
      <q-toolbar-title>
        {{actionType}} Employee
      </q-toolbar-title>
      <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-sm scroll">
      <q-input
        ref="nameRef"
        outlined
        v-model="credentials.name"
        label="Name"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the name']"
      />
      <q-input
        ref="emailRef"
        outlined
        v-model="credentials.email"
        label="Email"
        v-if="actionType === 'Add'"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the Email']"
      />
      <q-select
        v-model="user"
        ref="userRef"
        no-caps
        label="Connect with User"
        :loading="userLoading"
        outlined
        :options="userOptions"
      />
      <q-input
        ref="salaryRef"
        outlined
        v-model.number="credentials.salary"
        label="Salary"
        type="number"
        lazy-rules
        :rules="[val => (val && val > 0) || 'Please type the salary']"
      />
      <q-input
        ref="leaveBalanceRef"
        outlined
        v-model.number="credentials.leaveBalance"
        label="Leave Balance (in days)"
        type="number"
        lazy-rules
        :rules="[val => (val && val > 0 || val === 0 ) || 'Please type the leave balance']"
      />
      <q-input
        ref="overtimeBalanceRef"
        outlined
        v-model.number="credentials.overtimeBalance"
        label="Overtime Balance (in hours)"
        type="number"
        lazy-rules
        :rules="[val => (val && val >= 0) || 'Please type the overtime balance']"
      />
      <q-input
        ref="workingHoursRef"
        outlined
        v-model.number="credentials.workingHours"
        label="Working Hours (in hours - max 24)"
        type="number"
        lazy-rules
        :rules="[val => (val && val >= 1) || 'Please type the working hours from 1 to 24 hours']"
      />
      <q-select
        v-model="designation"
        ref="designationRef"
        no-caps
        label="Designation (position)"
        :loading="designationLoading"
        outlined
        :options="designationOptions"
        :rules="[val => (val) || 'Please select a designation']"
      />
      <q-select
        v-model="manager"
        no-caps
        clearable
        label="Reports to (manager)"
        :loading="managerLoading"
        outlined
        :options="managerOptions"
      />
      <q-checkbox
        ref="hrMemberRef"
        outlined
        v-model="credentials.hrMember"
        label="HR Member"
      />
      <q-checkbox
        ref="isManagerRef"
        outlined
        v-model="credentials.isManager"
        label="Manager"
      />
      </q-card-section>
    </q-card>
    <q-toolbar class="bg-grey-3 submitBtnClass" style="position:sticky !important; bottom:0;z-index:5;">
      <q-btn :loading="loading" @click="submit" class="full-width" color="primary" label="Submit" no-caps />
    </q-toolbar>
  </q-layout>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { VueTelInput } from 'vue-tel-input';
export default {
  components : {
    VueTelInput,
  },
  props: ['actionType','body'],
  data() { 
    return {
      show: true,
      id: null,
      loading: false,
      userLoading: false,
      manager: null,
      user: null,
      designation: null,
      managerOptions: [],
      designationOptions: [],
      userOptions: [],
      designationLoading: false,
      managerLoading: false,
      passwordMatch: null,
      credentials : {
        leaveBalance: 0,
        overtimeBalance: 0,
        workingHours: 8,
        salary: 0,
        managerId: null,
        name: null,
        hrMember: false,
        isManager: false,
        userId: null,
        designationId: null,
      },
    }
},
  computed: {
    ...mapState('hrmStore', ['designations', 'allEmployees','allUsers']),
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    ...mapActions('hrmStore', ['getEmployees', 'getUsers', 'createEmployee', 'updateEmployee','getDesignations']),
   async submit() {
      this.$refs.nameRef.validate();
      this.$refs.salaryRef.validate();
      this.$refs.leaveBalanceRef.validate();
      this.$refs.workingHoursRef.validate();
      this.$refs.overtimeBalanceRef.validate();
      this.$refs.designationRef.validate();
      if (
        this.$refs.nameRef.hasError
        ||
        this.$refs.salaryRef.hasError
        ||
        this.$refs.leaveBalanceRef.hasError
        ||
        this.$refs.workingHoursRef.hasError
        ||
        this.$refs.overtimeBalanceRef.hasError
        ||
        this.$refs.designationRef.hasError
      ) {
        return
      }else{
        this.loading = true
        let data = {
          name: this.credentials.name,
          leaveBalance: this.credentials.leaveBalance,
          overtimeBalance: this.credentials.overtimeBalance / 8,
          workingHours: this.credentials.workingHours / 8,
          salary: this.credentials.salary,
          managerId: this.credentials.managerId,
          hrMember: this.credentials.hrMember,
        };
        if (this.designation) {
          data['designationId'] = Number(this.designation?.id)
        }
        if (this.actionType === "Add") {
          data["isManager"] = this.credentials.isManager
        }
        if (this.manager) {
          data['managerId'] = Number(this.manager.id)
        }
        if (this.user) {
          data['userId'] = this.user.id
        }
        if (this.designation) {
          data['designationId'] = Number(this.designation.id)
        }
        if(this.actionType === 'Add'){
          await this.createEmployee(data).catch(() => {
            this.$q.notify({
              type: 'negative',
              message: 'something went wrong! creating employee failed',
              color: 'negative',
              position: 'top',
              timeout: '500'
            })
            this.$emit('closeDialogue')
            this.loading = false
          })
          this.$q.notify({
            type: 'positive',
            message: 'Employee created',
            color: 'positive',
            position: 'top',
            timeout: '500'
          })
        }else{
          data['id'] = Number(this.id)
          console.log(data);
          await this.updateEmployee(data).catch(() => {
            this.$q.notify({
              type: 'negative',
              message: 'something went wrong! updating employee failed',
              color: 'negative',
              position: 'top',
              timeout: '500'
            })
            this.$emit('closeDialogue')
            this.loading = false
          })
          this.$q.notify({
            type: 'positive',
            message: 'Employee updated',
            color: 'positive',
            position: 'top',
            timeout: '500'
          })
        }
        this.loading = false
        this.$emit('closeDialogue');
      }
    },
    getValuesFromApiAsync(apiAct) {
      return new Promise(async resolve => {
        resolve(await apiAct)
      });
    }
  },
  async mounted() {
    this.show = false
    this.designationLoading = true
    this.getValuesFromApiAsync(this.getDesignations()).then((res) => {
      for (let designation of this.designations) {
        this.designationOptions.push({label: `${designation?.department.name} - ${designation.name}`, id: designation.id})
      }
      if (this.actionType === 'Edit') {
        this.designation = {label: `${this.body.designation?.department.name} - ${this.body.designation.name}` , id: this.body.designation.id};
      }
      this.designationLoading = false
    })
    this.userLoading = true
    this.getValuesFromApiAsync(this.getUsers()).then((res) => {
      for (let user of this.allUsers) {
        if (!user.myEmployeeProfile) this.userOptions.push({label: `${user?.name} - ${user.name}`, id: user.id})
      }
      if (this.actionType === 'Edit') {
        if (this.body.user) this.user = {label: this.body.user?.name , id: this.body.user?.id};
      }
      this.userLoading = false
    })

    this.managerLoading = true
    this.getValuesFromApiAsync(this.getEmployees()).then((res) => {
      for (let manager of this.allEmployees) {
        this.managerOptions.push({label: manager.name, id: manager.id})
      }
      if (this.actionType === 'Edit') {
        this.manager = {label: this.body.manager?.name, id: this.body.manager?.id}
      }
      this.managerLoading = false
    })
    if (this.actionType === 'Edit') {
      this.credentials.isManager = (this.body.user && this.body.user?.userType === 'admin')
      this.id = this.body.id
      this.credentials.name = this.body.name
      this.credentials.hrMember = this.body.hrMember === 1 || false
      this.credentials.salary = this.body.salary
      this.credentials.leaveBalance = this.body.leaveBalance
      this.credentials.overtimeBalance = this.body.overtimeBalance
      this.credentials.workingHours = this.body.workingHours
      this.credentials.email = this.body.user.email
      this.credentials.username = this.body.user.username
    }
  }
}
</script>
<style scoped>

</style>