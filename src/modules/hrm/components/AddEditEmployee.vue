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
        :rules="[val => (val && val.length > 0) || 'Please type the company name']"
      />
      <q-input
        ref="emailRef"
        outlined
        v-model="credentials.email"
        label="Email"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the company Email']"
      />
      <q-input
        ref="usernameRef"
        outlined
        v-model="credentials.username"
        label="Username"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the company username']"
      />
      <q-input
        ref="passwordRef"
        outlined
        v-model="credentials.passsword"
        label="Password"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the company password']"
      />
      <q-input
        ref="salaryRef"
        outlined
        v-model.number="credentials.salary"
        label="Salary"
        type="number"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the company salary']"
      />
      <q-input
        ref="leaveBalanceRef"
        outlined
        v-model.number="credentials.leaveBalance"
        label="Leave Balance (in days)"
        type="number"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the company salary']"
      />
      <q-select
        v-model="designation"
        ref="designationRef"
        no-caps
        :loading="designationLoading"
        outlined
        :options="designationOptions"
      />
      <q-select
        v-model="manager"
        no-caps
        :loading="managerLoading"
        outlined
        :options="managerOptions"
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
      credentials : {
        leaveBalance: 0,
        salary: 0,
        managerId: null,
        phoneNumber: null,
        name: null,
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
    ...mapActions('hrmStore', ['getEmployees', 'createDesignation', 'updateDesignation','getDesignations', 'getDepartments', 'getOneDesignation']),
   async submit() {
      this.$refs.nameRef.validate();
      this.$refs.salaryRef.validate();
      this.$refs.leaveBalanceRef.validate();
      this.$refs.usernameRef.validate();
      this.$refs.emailRef.validate();
      this.$refs.designationRef.validate();
      if (
        this.$refs.nameRef.hasError
        ||
        this.$refs.salaryRef.hasError
        ||
        this.$refs.leaveBalanceRef.hasError
        ||
        this.$refs.usernameRef.hasError
        ||
        this.$refs.emailRef.hasError
        ||
        this.$refs.designationRef.hasError
      ) {
        return
      }else{
        this.loading = true
        let data = {
          name: this.credentials.name,
          designationId: Number(this.designation.id),
          username: this.credentials.username
        };
        if (this.manager) {
          data['managerId'] = Number(this.manager.id)
        }
        if (this.designation) {
          data['designationId'] = Number(this.designation.id)
        }
        console.log(this.credentials.name)
        if(this.actionType === 'Add'){
          await this.createDesignation(data);
          this.$q.notify({
            type: 'positive',
            message: 'Designation created',
            color: 'positive',
            position: 'top',
            timeout: '500'
          })
        }else{
          data['id'] = Number(this.id)
          console.log(data);
          await this.updateDesignation(data);
          this.$q.notify({
            type: 'positive',
            message: 'Designation updated',
            color: 'positive',
            position: 'top',
            timeout: '500'
          })
        }
        this.loading = false
        this.$emit('closeDialogue');
      }
    }
  },
  async mounted() {
    this.show = false
    this.designationLoading = true
    await this.getDesignations()
    this.designationLoading = false
    for (let designation of this.designations) {
      this.designationOptions.push({label: designation.name, id: designation.id})
    }
    this.managerLoading = true
    await this.getEmployees()
    this.managerLoading = false
    for (let manager of this.allEmployees) {
      this.managerOptions.push({label: manager.name, id: manager.id})
    }
    if (this.actionType === 'Edit') {
      this.id = this.body.id
      this.credentials.name = this.body.name
      this.credentials.salary = this.body.salary
      this.credentials.leaveBalance = this.body.leaveBalance
      this.credentials.email = this.body.user.email
      this.credentials.username = this.body.user.username
      this.designation = {label: this.body.designation.name, id: this.body.designation.id};
      this.manager = {label: this.body.manager?.name, id: this.body.manager?.id}
    }
  }
}
</script>
<style scoped>

</style>