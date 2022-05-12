<template>
<q-layout style="width: 500px !important;">
  <q-card style="max-width: 500px;min-height:100vh;" flat square>
    <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
      <q-toolbar-title>
        {{actionType}} Earning Type
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
        :rules="[val => (val && val > 0) || 'Please type the Salary']"
      />
      <div>Duration Type:</div>
      <div class="q-gutter-sm">
        <q-radio v-model="credentials.durationType" val="days" label="Days" />
        <q-radio v-model="credentials.durationType" val="weeks" label="Weeks" />
        <q-radio v-model="credentials.durationType" val="months" label="Months" />
      </div>
      <q-input
        ref="rateRef"
        outlined
        v-model.number="credentials.rate"
        :label="credentials.durationType"
        type="number"
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
      rate: 0,
      durationType: 'days',
     },
    }
},
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    ...mapActions('payrollStore', ['createEarningType', 'updateEarningType']),
   async submit() {
      this.$refs.nameRef.validate();
      this.$refs.fundRef.validate();
      if (
        this.$refs.nameRef.hasError
        ||
        this.$refs.fundRef.hasError
      ) {
        return
      }else{
        this.loading = true
        try {
          let data = {}
          if(this.actionType === 'Add'){
            data = {
              name: this.credentials.name,
              fund: Number(this.credentials.fund),
              rate: Number(this.credentials.rate),
              durationType: this.credentials.durationType,
            }
            await this.createEarningType(data)
            this.$q.notify({
              type: 'positive',
              message: 'Department created',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
          }else{
            data['id'] = Number(this.id)
            if (this.credentials.name) data['name'] = this.credentials.name
            if (this.credentials.fund) data['fund'] = Number(this.credentials.fund)
            if (this.credentials.rate) data['rate'] = Number(this.credentials.rate)
            if (this.credentials.durationType) data['durationType'] = this.credentials.durationType
            await this.updateEarningType(data);
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
      this.credentials.rate = Number(this.body.rate)
      this.credentials.durationType = this.body.durationType
    }
  }
}
</script>
<style scoped>

</style>