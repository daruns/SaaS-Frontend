<template>
  <q-layout style="width: 550px !important;">
    <q-card style="max-width: 550px; min-height:100vh;" flat square>
      <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
        <q-toolbar-title>
          {{action  + ' '}} User
        </q-toolbar-title>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-toolbar>
      <q-card-section class="q-gutter-md scroll">
        <q-input outlined v-model="user.name" label="Name" />
        <q-input ref="userNameRef" :rules="[val => (val && val.length !== 0) || 'This field is required']" outlined v-model="user.username" label="Username" />
        <q-input ref="emailRef" type="email" :rules="[val => (val && val.length !== 0) || 'This field is required']" outlined v-model="user.email" label="E-mail" />
        <q-select
          v-model="employee"
          no-caps
          clearable
          label="Connect to an Employee"
          :loading="employeeLoading"
          outlined
          :options="employeeOptions"
        />
        <q-input v-if="action === 'Edit'" ref="passRef" v-model="user.password" type="password" outlined label="Password" :rules="[val => ( !val.length || val.length > 7) || 'Password must be at least 8 characters!']" />
        <q-input v-if="action === 'Add'" ref="passRef" v-model="user.password" type="password" outlined label="Password" :rules="[val => (val && val.length > 7) || 'Password must be at least 8 characters!']" />   
        <vue-tel-input required @country-changed="countryChange" class="phone-input q-mt-lg" defaultCountry="iq" :customValidate="false" @on-input="valid" @input="phoneValidate" v-model="phone"></vue-tel-input>
        <q-checkbox
          label="Owner"
          v-model="owner"
        />
        <q-item-label>Permission on Modules: </q-item-label>
        <table class="col-12">
          <tr>
            <th class="text-left">Modules</th>
            <th class="q-px-md">All</th>
            <th class="q-px-md">Read</th>
            <th class="q-px-md">Create</th>
            <th class="q-px-md">Update</th>
            <th class="q-px-md">Delete</th>
          </tr>
          <tr :key="subjectInd" v-for="(subject,subjectInd) in user.permissions">
            <td>{{subject?.name}}</td>
            <td class="q-px-md"><q-checkbox class="col-3" :disable="owner" v-model="user.permissions[subjectInd].all" /></td>
            <td class="q-px-md"><q-checkbox class="col-3" :disable="owner" v-model="user.permissions[subjectInd].read" /></td>
            <td class="q-px-md"><q-checkbox class="col-3" :disable="owner" v-model="user.permissions[subjectInd].create" /></td>
            <td class="q-px-md"><q-checkbox class="col-3" :disable="owner" v-model="user.permissions[subjectInd].update" /></td>
            <td class="q-px-md"><q-checkbox class="col-3" :disable="owner" v-model="user.permissions[subjectInd].delete" /></td>
          </tr>
        </table>

      </q-card-section>
    </q-card>
    <q-toolbar class="bg-grey-3" style="position:sticky !important; bottom:0;z-index:5;">
      <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
  </q-layout>
</template>
<script>
import { VueTelInput } from 'vue-tel-input';
import { mapActions, mapState } from 'vuex'
import axios from 'axios';
export default {
  props: ['body','action'],
  data() {
    return {
      id: null,
      loading: false,
      phone: '',
      employee: null,
      employeeOptions: [],
      employeeLoading: false,
      dialCode: '',
      owner: false,
      user : {
        name: '',
        username: '',
        password: '',
        email: '',
        userType: 'agent',
        phoneNumber: '',
        permissions: [
          {all: false, read: false, create: false, update: false, delete: false, name: 'CRM', attrkey: 'crm', subjects: [
            'subject_crm',
            'subject_crm_client_contacts',
            'subject_crm_social_medias',
            'subject_crm_users',
            'subject_crm_meetings',
          ]},
          {all: false, read: false, create: false, update: false, delete: false, name: 'Suppliers', attrkey: 'suppliers', subjects: [
            'subject_suppliers',
          ]},
          {all: false, read: false, create: false, update: false, delete: false, name: 'Finance', attrkey: 'finance', subjects: [
            'subject_finance_invoices',
            'subject_finance_quotes',
            'subject_finance_expenses',
            'subject_finance_expense_categories',
            'subject_finance_joined_items',
            'subject_finance_non_inventory_items',
            'subject_finance_service_items',
            'subject_finance_joined_expense_categories',
            'subject_finance_expense_category_childs',
            'subject_finance_payment_methods',
            'subject_finance_sub_service_items',
            'subject_finance_taxes',
          ]},
          {all: false, read: false, create: false, update: false, delete: false, name: 'HRM', attrkey: 'hrm', subjects: [
            'subject_hrm_overtimes',
            'subject_hrm_overtime_types',
            'subject_hrm_leave_types',
            'subject_hrm_leaves',
            'subject_hrm_attendances',
            'subject_hrm_employees',
            'subject_hrm_departments',
            'subject_hrm_designations',
          ]},
          {all: false, read: false, create: false, update: false, delete: false, name: 'Payroll', attrkey: 'payroll', subjects: [
            'subject_payroll_payslips',
            'subject_payroll_deduction_types',
            'subject_payroll_deductions',
            'subject_payroll_earnings',
            'subject_payroll_earning_types',
          ]},
          {all: false, read: false, create: false, update: false, delete: false, name: 'Projects & Tasks', attrkey: 'projects', subjects: [
            'subject_projects',
            'subject_projects_tasks',
          ]},
          {all: false, read: false, create: false, update: false, delete: false, name: 'Social Media', attrkey: 'social_media', subjects: [
            'subject_social_media_studios',
          ]},
        ]
      },
    }
  },
  components: {
    VueTelInput,
  },
  computed: {
    ...mapState('hrmStore', ['allEmployees']),
  },
  methods: {
    ...mapActions('userStore', ['getUsers']),
    ...mapActions('hrmStore', ['getEmployees', 'updateEmployee']),
    phoneValidate(evt) {
      if (isNaN(Number(evt.data))) {
        this.phone = this.phone.substring(0, this.phone.length-1)
      }
    },
    valid(input,obj) {
    if (obj.valid) {
      document.querySelector('.vue-tel-input').removeAttribute('style')
      return
    }
      document.querySelector('.vue-tel-input').setAttribute('style','border-color:#cc444b !important;')
    },
    countryChange(obj) {
      let i = 0
      this.dialCode = '+'+obj.dialCode
      this.phone = this.phone.substring(this.dialCode.length, this.phone.length);
      if (i === 0) {
        this.valid('',{valid: true});
      }
      i = i + 1;
    },
    async submit() {
      this.$refs.userNameRef.validate();
      this.$refs.emailRef.validate();
      if (
        this.$refs.userNameRef.hasError ||
        this.$refs.emailRef.hasError 
      ) return
      if (this.action === 'Add') {
        if (this.user.password.length < 8) {
          this.$refs.passRef.validate();
          return
        }
        try {
          if (this.owner) {
            this.user.userType = 'owner'
            this.user.permissions = []
          }
          this.loading = true;
          let response = await axios.post(process.env.OC_BACKEND_API + 'users/create',
            {...this.user, phoneNumber: this.dialCode+this.phone.replace(this.dialCode , '')},
            {headers: {Authorization: localStorage.getItem('accessToken')}}
          );
          console.log("response of user adding: ",response)
          if (response.data.success) {
            if (this.employee && response.data?.success) {
              const updateEmployee = await this.updateEmployee({id: this.employee.id,userId: response.data?.data?.id})
            }
          }
          this.loading = false;
        } catch(e) {
          this.loading = false;
        }
      } else {
        if (this.user.password !== '') {
          if (this.user.password.length < 8) {
            this.$refs.passRef.validate();
            return
          }
        } else this.user.password = '';
        if (this.owner) {
          this.user.userType = 'owner'
          this.user.permissions = []
        }
        this.loading = true;
        try {
          let response = await axios.post(process.env.OC_BACKEND_API + 'users/update',
            {
              name: this.user.name, 
              username: this.user.username, 
              email:this.user.email, 
              userType: this.user.userType,
              password: this.user.password === '' ? undefined : this.user.password, 
              phoneNumber: this.dialCode+this.phone,
              id:this.body.id,
              permissions: this.user.permissions,
            },
            {headers: {Authorization: localStorage.getItem('accessToken')}}
          );
          console.log("response of user editing: ",response)
          if (response.data.success) {
            if (this.employee && response.data?.success) {
              const updateEmployee = await this.updateEmployee({id: this.employee.id, userId: this.body.id})
            }
          }
        } catch(e) {
          console.log(e.response);
        }
      }
      this.loading = false
      this.$emit('closeDialogue');
    },
    getValuesFromApiAsync(apiAct) {
      return new Promise(async resolve => {
        resolve(await apiAct)
      });
    }
  },
  async mounted() {
    this.employeeLoading = true
    this.getValuesFromApiAsync(this.getEmployees()).then((res) => {
      for (let employee of this.allEmployees) {
        if (!employee.userId) this.employeeOptions.push({label: employee.name, id: employee.id})
      }
      if (this.action === 'Edit') {
        if (this.body.myEmployeeProfile) this.employee = {label: this.body.myEmployeeProfile?.name, id: this.body.myEmployeeProfile?.id}
        console.log("body: ",this.employee)
      }
      this.employeeLoading = false
    })

    if(this.action === 'Edit') {
      this.user.name = this.body.name
      this.user.username = this.body.username
      this.user.email = this.body.email
      this.user.userType = this.body.userType
      this.phone = this.body.phoneNumber
      for (let item of this.body?.permissions) {
        var position
        if (item.subject.includes('crm')) {
          position = 0
        }
        if (item.subject.includes('suppliers')) {
          position = 1
        }
        if (item.subject.includes('finance')) {
          position = 2
        }
        if (item.subject.includes('hrm')) {
          position = 3
        }
        if (item.subject.includes('payroll')) {
          position = 4
        }
        if (item.subject.includes('projects')) {
          position = 5
        }
        if (item.subject.includes('social_media_studios')) {
          position = 6
        }
        this.user.permissions[position].all = item.action === 'all'
        this.user.permissions[position].read = item.action === 'read'
        this.user.permissions[position].create = item.action === 'create'
        this.user.permissions[position].update = item.action === 'update'
        this.user.permissions[position].delete = item.action === 'delete'
      }
    }
  }
}
</script>