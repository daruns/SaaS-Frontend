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
      <q-input
        ref="usernameRef"
        outlined
        v-model="credentials.username"
        v-if="actionType === 'Add'"
        label="Username"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the username']"
      />
      <q-input
        ref="passwordRef"
        outlined
        v-model="credentials.password"
        v-if="actionType === 'Add'"
        label="Password"
        type="password"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the password']"
      />
      <q-input
        ref="passwordMatchRef"
        outlined
        v-if="actionType === 'Add'"
        v-model="passwordMatch"
        label="Repeat Password"
        type="password"
        lazy-rules
        :rules="[val => (val && val.length > 0 && passwordMatch === credentials.password) || 'Password Mismatch!']"
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
        :rules="[val => (val && val > 0) || 'Please type the leave balance']"
      />
      <q-select
        v-model="designation"
        ref="designationRef"
        no-caps
        label="Designation (position)"
        :loading="designationLoading"
        outlined
        :options="designationOptions"
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
      manager: null,
      designation: null,
      managerOptions: [],
      designationOptions: [],
      designationLoading: false,
      managerLoading: false,
      passwordMatch: null,
      credentials : {
        leaveBalance: 0,
        salary: 0,
        managerId: null,
        name: null,
        hrMember: false,
        isManager: false,
        username: null,
        email: null,
        password: null,
        designationId: null,
      },
    }
},
  computed: {
    ...mapState('hrmStore', ['designations', 'allEmployees']),
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    ...mapActions('hrmStore', ['getEmployees', 'createEmployee', 'updateEmployee','getDesignations']),
   async submit() {
      this.$refs.nameRef.validate();
      this.$refs.salaryRef.validate();
      this.$refs.leaveBalanceRef.validate();
      this.$refs.designationRef.validate();
      if (this.actionType === 'Add') {
        this.$refs.emailRef.validate();
        this.$refs.usernameRef.validate();
        this.$refs.passwordMatchRef.validate();
        if (
          this.$refs.usernameRef.hasError
          ||
          this.$refs.emailRef.hasError
          ||
          this.$refs.passwordMatchRef.hasError
        ) {
          return
        }
      }
      if (
        this.$refs.nameRef.hasError
        ||
        this.$refs.salaryRef.hasError
        ||
        this.$refs.leaveBalanceRef.hasError
        ||
        this.$refs.designationRef.hasError
      ) {
        return
      }else{
        this.loading = true
        let data = {
          name: this.credentials.name,
          designationId: Number(this.designation.id),
          leaveBalance: this.credentials.leaveBalance,
          salary: this.credentials.salary,
          managerId: this.credentials.managerId,
          hrMember: this.credentials.hrMember,
        };
        if (this.actionType === "Add") {
          data["isManager"] = this.credentials.isManager
          data['username'] = this.credentials.username
          data["email"] = this.credentials.email
          data["password"] = this.credentials.password
        }
        if (this.manager) {
          data['managerId'] = Number(this.manager.id)
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
      console.log("body:    ",this.body)
      this.credentials.isManager = (this.body.user && this.body.user?.userType === 'admin')
      this.id = this.body.id
      this.credentials.name = this.body.name
      this.credentials.hrMember = this.body.hrMember === 1 || false
      this.credentials.salary = this.body.salary
      this.credentials.leaveBalance = this.body.leaveBalance
      this.credentials.email = this.body.user.email
      this.credentials.username = this.body.user.username
    }
  }
}
</script>
<style scoped>

</style>