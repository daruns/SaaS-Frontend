<template>
<q-layout style="width: 500px !important;">
  <q-card style="max-width: 500px;min-height:100vh;" flat square>
    <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
      <q-toolbar-title>
        {{actionType}} {{type[0].toUpperCase()+type.substr(1, type.length)}}
      </q-toolbar-title>
      <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-sm scroll">
      <q-input
        ref="companyRef"
        outlined
        v-model="credentials.name"
        label="Company"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the company name']"
      />
      <q-file
        v-model="credentials.logo"
        clearable 
        outlined
        label="Client logo"
        filled
        class="q-pb-md"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" accept=".jpg, image/*" />
        </template> 
      </q-file>
      <q-btn-toggle
        v-model="credentials.businessType"
        class="my-custom-toggle"
        no-caps
        rounded
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
        {label: 'Company', value: 'Company'},
        {label: 'Individual', value: 'Individual'}
        ]"
      />
      <q-btn-toggle
        v-if="actionType === 'Edit'"
        v-model="credentials.clientType"
        class="my-custom-toggle"
        no-caps
        rounded
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
        {label: 'Client', value: 'client'},
        {label: 'Lead', value: 'lead'},
        {label: 'Blacklist', value: 'blacklist'},
        ]"
      />
      <vue-tel-input required @country-changed="countryChange" class="phone-input q-mt-lg" defaultCountry="iq" :customValidate="false" @on-input="valid" @input="phoneValidate" v-model="phone"></vue-tel-input>
      <q-input
        class="q-mt-lg"
        ref="emailRef"
        outlined
        type="email"
        v-model="credentials.email"
        label="E-mail"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type a valid E-mail']"
      />
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
          lazy-rules
        />
        <q-input
          outlined
          v-model="credentials.address"
          label="Address"
          lazy-rules
        />
        <q-input
          outlined
          v-model="credentials.zipCode"
          label="Zipcode"
          lazy-rules
        />
      </q-card-section>
    </q-card>
    <q-toolbar class="bg-grey-3 submitBtnClass" style="position:sticky !important; bottom:0;z-index:5;">
      <q-btn :loading="loading" @click="submit" class="full-width" color="primary" label="Submit" no-caps />
    </q-toolbar>
  </q-layout>
</template>
<script>
import { mapActions } from 'vuex'
import { VueTelInput } from 'vue-tel-input';
export default {
  components : {
    VueTelInput,
  },
 props: ['actionType', 'type', 'inProfile','body'],
   data()  { 
   return {
     id: null,
     phone: '',
     loading: false,
     credentials : {
      name: '',
      avatar: null,
      businessType: 'Company',
      email: '',
      website: '',
      address:'',
      zipCode: '',
      logo: null,
      rate: 0,
      clientType: ''
     },
    }
},
  methods: {
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
    ...mapActions('crmStore', ['createClient', 'updateClient','getClients', 'getOneClient']),
   async submit() {
      this.$refs.companyRef.validate();
      this.$refs.emailRef.validate();

      if(
        this.$refs.companyRef.hasError ||
        this.$refs.emailRef.hasError 
        ) {
          return
        }else{
          this.loading = true
          let data = new FormData();
          data.append('name', this.credentials.name);
          data.append('logo', this.credentials.logo);
          data.append('businessType', this.credentials.businessType);
          data.append('email', this.credentials.email);
          data.append('website', this.credentials.website);
          data.append('address', this.credentials.address);
          data.append('zipCode', this.credentials.zipCode);
          data.append('rate', this.credentials.rate);
          if(this.actionType === 'Add') {
              data.append('clientType', this.type);
          }else{
          data.append('clientType', this.credentials.clientType);
          }
         data.append('phoneNumbers', this.dialCode+this.phone);
          if(this.actionType === 'Add'){
         await this.createClient(data);
         await this.$emit('updateForInvoice');
          this.$q.notify({
              type: 'positive',
              message: 'Client created',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
          }else{
          data.append('id', Number(this.id));
          console.log(data);
          await this.updateClient(data);
          this.getClients('Client');
          if(this.$route.params.id){
          await this.getOneClient(this.$route.params.id);
          }
          this.$q.notify({
              type: 'positive',
              message: 'Client updated',
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
   if(this.actionType === 'Edit'){
    this.id = this.body.id
    this.credentials.name = this.body.name
    this.credentials.website = this.body.website
    this.credentials.businessType = this.body.businessType,
    this.phone = this.body.phoneNumbers
    this.credentials.email = this.body.email,
    this.credentials.website = this.body.website,
    this.credentials.address = this.body.address,
    this.credentials.zipCode = this.body.zipCode,
    this.credentials.logo = this.body.logo
    this.credentials.rate = this.body.rate
    this.credentials.clientType = this.body.clientType
   }
  }
}
</script>
<style scoped>

</style>