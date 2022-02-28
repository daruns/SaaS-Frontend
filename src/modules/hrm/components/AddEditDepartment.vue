<template>
<q-layout style="width: 500px !important;">
  <q-card style="max-width: 500px;min-height:100vh;" flat square>
    <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
      <q-toolbar-title>
        {{actionType}} Department
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
      <!-- <q-select
        v-model="credentials.businessType"
        class="my-custom-toggle"
        no-caps
        outlined
        option-label="label"
        option-value="value"
        :options="[
        {label: 'Company', value: 'Company'},
        {label: 'Individual', value: 'Individual'},
        {label: 'NGO', value: 'NGO'},
        {label: 'Organization', value: 'Organization'},
        {label: 'Government', value: 'Government'},
        {label: 'Startup', value: 'Startup'},
        {label: 'Small Business', value: 'SmallBusiness'}
        ]"
      /> -->
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
   data()  { 
   return {
     show: true,
     id: null,
     loading: false,
     credentials : {
      name: '',
     },
    }
},
  computed: {
    // ...mapState('hrmStore', ['allEmployees']),
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    ...mapActions('hrmStore', ['createDepartment', 'updateDepartment','getDepartments', 'getOneDepartment']),
   async submit() {
      this.$refs.nameRef.validate();
      if (
        this.$refs.nameRef.hasError
      ) {
        return
      }else{
        this.loading = true
        let data = {
          name: this.credentials.name
        };
        console.log(this.credentials.name)
        if(this.actionType === 'Add'){
          await this.createDepartment(data);
          this.$q.notify({
            type: 'positive',
            message: 'Department created',
            color: 'positive',
            position: 'top',
            timeout: '500'
          })
        }else{
          data['id'] = Number(this.id)
          console.log(data);
          await this.updateDepartment(data);
          this.getDepartments();
          if(this.$route.params.id){
            await this.getOneDepartment(this.$route.params.id);
          }
          this.$q.notify({
            type: 'positive',
            message: 'Department updated',
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
    if(this.actionType === 'Edit'){
      this.id = this.body.id
      this.credentials.name = this.body.name
    }
  }
}
</script>
<style scoped>

</style>