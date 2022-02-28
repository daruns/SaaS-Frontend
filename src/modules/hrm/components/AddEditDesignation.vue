<template>
<q-layout style="width: 500px !important;">
  <q-card style="max-width: 500px;min-height:100vh;" flat square>
    <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
      <q-toolbar-title>
        {{actionType}} Designation
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
      <q-select
        v-model="department"
        ref="departmentIdRef"
        no-caps
        :loading="departmentLoading"
        outlined
        :options="departmentOptions"
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
      departmentLoading: true,
      id: null,
      loading: false,
      department: null,
      departmentOptions: [],
      credentials : {
        name: '',
        departmentId: null,
      },
    }
},
  computed: {
    ...mapState('hrmStore', ['departments']),
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    ...mapActions('hrmStore', ['createDesignation', 'updateDesignation','getDesignations', 'getDepartments', 'getOneDesignation']),
   async submit() {
      this.$refs.nameRef.validate();
      this.$refs.departmentIdRef.validate();
      if (
        this.$refs.nameRef.hasError
        ||
        this.$refs.departmentIdRef.hasError
      ) {
        return
      }else{
        this.loading = true
        let data = {
          name: this.credentials.name,
          departmentId: Number(this.department.id)
        };
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
    this.departmentLoading = true
    await this.getDepartments()
    this.departmentLoading = false
    for (let department of this.departments) {
      this.departmentOptions.push({label: department.name, id: department.id})
    }
    if (this.actionType === 'Edit') {
      this.id = this.body.id
      this.credentials.name = this.body.name
      this.department = {label: this.body.department.name, id: this.body.department.id};
    }
  }
}
</script>
<style scoped>

</style>