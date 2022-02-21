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
      <div class="col-12 flex flex-center q-py-lg tems-center row">
        <q-avatar
          v-show="actionType === 'Edit'"
          clickable :color="!credentials.logo ? 'grey' : 'white'" size="120px" @click="toggleShow" class="cursor-pointer" style="border: 0.2px solid grey;">
          <q-img round style="border-radius:50% !important" v-if="credentials.logo" :src="credentials.logo"/>
          <q-icon v-else color="white" name="person"/>
          <q-badge floating color="grey" ><q-icon color="white" circle name="edit" size="xs" /></q-badge>
        </q-avatar>
      </div>

      <cropableUpload
        field="logo"
        v-show="actionType === 'Edit'"
        lang-type="en"
        :url="imgUrl"
        :params="imgParams"
        :headers="imgHeaders"
        :value.sync="show"
        v-model="show"
      />

      <q-input
        ref="companyRef"
        outlined
        v-model="credentials.name"
        label="Name"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type the company name']"
      />
      <div v-show="actionType === 'Add'" class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12">
        <q-uploader
          max-files="1"
          max-file-size="1048576"
          class="q-pb-sm fit"
          max-total-size="1048576"
          label="Client logo"
          @removed="files => {credentials.logo = files[0]}"
          hide-upload-btn
          v-show="actionType === 'Add'"
          @added="files => {credentials.logo = files[0]}"
          :multiple="false"
        />
      </div>
      <q-select
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
        :rules="[val => {
          
          if (val && !(val.length > 0) ) {
            return 'Please type a valid E-mail'
          }
          if (val && checkEmailExistence('email',val) === true ) {
            return 'This E-mail already exist'
          }
          return true
        }]"
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
import { mapActions, mapState } from 'vuex'
import { VueTelInput } from 'vue-tel-input';
import myUpload from 'vue-image-crop-upload';
export default {
  components : {
    VueTelInput,
    cropableUpload: myUpload,
  },
 props: ['actionType', 'type', 'inProfile','body'],
   data()  { 
   return {
     imgUrl: (process.env.OC_BACKEND_API + 'brands/update'),
     imgHeaders: {Authorization: localStorage.getItem('accessToken')},
     imgDataUrl: null,
     imgParams: {
       id: null
     },
     show: true,
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
  computed: {
    ...mapState('userStore', ['users']),
    ...mapState('crmStore', ['clients']),
  },
  methods: {
			toggleShow() {
				this.show = !this.show;
			},
    checkEmailExistence(key,value) {
      var userFnd = false;

      if (key === "email"){
        let emailfnd = this.users?.find(e => {e.email === value})
        let emailclfnd = this.clients?.find(e => {e.email === value})
        if (emailclfnd || emailfnd) {
          userFnd = true
        }
        console.log("keyvalue: ",key,value,emailfnd)
      } else if (key === "username"){
        let usernamefnd = this.clients?.find(e => {e.username === value})
        let usernameclfnd = this.clients?.find(e => {e.username === value})
        if (usernamefnd || usernameclfnd) {
          userFnd = true
        }
      }
      return userFnd ? true : false
    },
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
    ...mapActions('userStore', ['getUsers']),
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
          data.append('businessType', this.credentials.businessType?.value);
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
   this.show = false
   await this.getUsers()
   if(this.actionType === 'Edit'){
    this.imgParams.id = this.body.id
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