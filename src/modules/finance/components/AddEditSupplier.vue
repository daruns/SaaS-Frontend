<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; min-height:100vh; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3 header-height-standard" style="position:sticky !important; top:0;z-index:15;">
      <q-toolbar-title>
        {{actionType}} Supplier
      </q-toolbar-title>
      <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
        <q-card-section class="q-gutter-md scroll">
            <q-input
            ref="companyRef"
            outlined
            v-model="credentials.name"
            label="Company"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type the company name']"
          />
        <q-input
          outlined
          type="email"
          v-model="credentials.email"
          label="E-mail"
        />
        <vue-tel-input required @country-changed="countryChange" class="phone-input q-mt-sm" defaultCountry="iq" :customValidate="false" @input="phoneValidate" v-model="phone"></vue-tel-input>
        <div class="flex items-center">
        <p style="padding:0 !important; font-size:1rem;">Rate: </p>
         <q-rating
            v-model="credentials.rate"
            size="2em"
            class="q-mb-md q-ml-sm"
            :max="5"
            color="primary"
          />
        </div>
       <q-input
            outlined
            v-model="credentials.website"
            label="Website"
          />
          <q-input
            outlined
            v-model="credentials.address"
            label="Address"
          />
         <q-input
            outlined
            v-model="credentials.zipCode"
          />
        </q-card-section>
      </q-card>
      <q-toolbar class="bg-grey-3" style="position:sticky !important; bottom:0;z-index:5;">
        <q-btn :loading="loading" @click="submit" class="full-width" color="primary" label="Submit" no-caps />
    </q-toolbar>
</q-layout>
</template>
<script>
import { mapActions } from 'vuex';
import { VueTelInput } from 'vue-tel-input';
export default {
 props: ['actionType','body'],
   data()  { 
   return {
     phone: '',
     dialCode: '',
     loading: false,
     phoneNumbers: null,
     credentials : {
      name: '',
      email: '',
      website: '',
      address:'',
      zipCode: '',
      logo: null,
      rate: 0,
     },
    }
},
  components : {
    VueTelInput,
  },
  methods: {
    ...mapActions('financeStore', ['createSupplier', 'updateSupplier','getClients', 'getOneClient']),
      phoneValidate(evt) {
      if(isNaN(Number(evt.data))) {
        this.phone = this.phone.substring(0, this.phone.length-1)
      }
    },
    valid(input,obj) {
      if(obj.valid) {
        document.querySelector('.vue-tel-input').removeAttribute('style')
        return
      }
        document.querySelector('.vue-tel-input').setAttribute('style','border-color:#cc444b !important;')
    },
    countryChange(obj) {
      let i = 0
      this.dialCode = '+'+obj.dialCode
      this.phone = this.phone.substring(this.dialCode.length, this.phone.length);
      if(i === 0) {
         this.valid('',{valid: true});
      }
      i = i + 1;
    },
   async submit() {
      this.$refs.companyRef.validate();
      if(
        this.$refs.companyRef.hasError
        ) {
          return
        }else{
          this.loading = true
          if(this.actionType === 'Add'){
         await this.createSupplier({...this.credentials, phoneNumbers: this.dialCode + this.phone});
          this.$q.notify({
              type: 'positive',
              message: 'Supplier created',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
          }else{
          await this.updateSupplier({...this.credentials, phoneNumbers: this.dialCode + this.phone, id:Number(this.body.id)});
          this.$q.notify({
              type: 'positive',
              message: 'Supplier updated',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
          }
          this.loading = false
           this.$emit('closeDialogue')
        }
    }
  },
 async mounted() { 
   if(this.actionType === 'Edit'){
    this.loading = true;
    this.credentials.name = this.body.name
    this.credentials.website = this.body.website
    this.phone = this.body.phoneNumbers
    this.credentials.email = this.body.email,
    this.credentials.website = this.body.website,
    this.credentials.address = this.body.address,
    this.credentials.zipCode = this.body.zipCode,
    this.credentials.rate = this.body.rate
    this.loading = false;

   }
  }
}
</script>
