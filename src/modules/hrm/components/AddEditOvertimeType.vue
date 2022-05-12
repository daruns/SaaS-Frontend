<template>
<q-layout style="width: 500px !important;">
  <q-card style="max-width: 500px;min-height:100vh;" flat square>
    <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
      <q-toolbar-title>
        {{actionType}} Overtime Type
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
        ref="fundRef"
        outlined
        v-model.number="credentials.fund"
        label="Salary to be Reduced"
        type="number"
      />
      <q-input
        ref="hoursRef"
        outlined
        v-model.number="credentials.hours"
        label="Hours"
        type="number"
        lazy-rules
        :rules="[val => (val && val > 0) || 'Please type the hours']"
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
import { ref } from 'vue'
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
      name: null,
      fund: 0,
      days: 0,
      hours: 0,
      durationType: 'hours',
      urgent: false,
     },
    }
},
  computed: {
    // ...mapState('hrmStore', ['overtimeTypes']),
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    ...mapActions('hrmStore', ['createOvertimeType', 'updateOvertimeType','getOvertimeTypes']),
   async submit() {
      this.$refs.nameRef.validate();
      if (this.credentials.durationType === "hours") this.$refs.hoursRef.validate();
      if (this.credentials.durationType === "days") this.$refs.daysRef.validate();
      if (
        this.$refs.nameRef.hasError
        ||
        (this.credentials.durationType === "hours" && this.$refs.hoursRef.hasError)
        ||
        (this.credentials.durationType === "days" && this.$refs.daysRef.hasError)
      ) {
        return
      }else{
        this.loading = true
        let data = {
          name: this.credentials.name,
          fund: Number(this.credentials.fund),
          days: Number(this.credentials.days),
          hours: Number(this.credentials.hours),
          durationType: this.credentials.durationType,
          urgent: this.credentials.urgent,
        };
        try {
          if(this.actionType === 'Add'){
              await this.createOvertimeType(data)
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
            await this.updateOvertimeType(data);
            this.getOvertimeTypes();
            this.$q.notify({
              type: 'positive',
              message: 'Department updated',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
          }
        } catch(err) {
          this.$q.notify({
            type: 'negative',
            message: 'Something went wrong while Department creating',
            color: 'negative',
            position: 'top',
            timeout: '500'
          })
          this.loading = true
          this.$emit('closeDialogue');
          return null
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
      this.credentials.fund = Number(this.body.fund)
      this.credentials.days = Number(this.body.days)
      this.credentials.hours = Number(this.body.hours)
      this.credentials.durationType = this.body.durationType
      this.credentials.urgent = this.body.urgent === 1 || false
    }
  }
}
</script>
<style scoped>

</style>