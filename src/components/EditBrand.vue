<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
      <q-toolbar-title>
        Edit Brand
      </q-toolbar-title>
      <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
        <q-card-section class="q-gutter-sm scroll">
          <div class="col-12 flex flex-center q-py-lg tems-center row">
            <q-avatar clickable :color="!credentials.logo ? 'grey' : 'white'" size="120px" @click="show = !show" class="cursor-pointer" style="border: 0.2px solid grey;">
              <q-img round style="border-radius:50% !important" v-if="credentials.logo" :src="credentials.logo"/>
              <q-icon v-else color="white" name="person"/>
              <q-badge floating color="grey" ><q-icon color="white" circle name="edit" size="xs" /></q-badge>
            </q-avatar>
          </div>

          <cropableUpload
            field="logo"
            lang-type="en"
            :url="imgUrl"
            :value.sync="show"
            :params="imgParams"
            :headers="imgHeaders"
            v-model="show"
          />
          <q-input
            outlined
            v-model="credentials.name"
            label="Name"
            lazy-rules
          />
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
            v-model="credentials.email"
            label="Email"
            lazy-rules
          />
         <q-input
            outlined
            model-value="number"
            v-model="credentials.companySize"
            label="Company Size"
          />
         <q-input
            outlined
            v-model="credentials.occupation"
            label="Occupation"
          />
        <vue-tel-input required @country-changed="countryChange" class="phone-input" defaultCountry="iq" :customValidate="false" @on-input="valid" @input="phoneValidate" v-model="credentials.phone"></vue-tel-input>
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
import axios from 'axios';
import myUpload from 'vue-image-crop-upload';
export default {
  components : {
    VueTelInput,
    cropableUpload: myUpload,
  },
  props: ['body'],
   data()  {
   return {
     imgUrl: (process.env.OC_BACKEND_API + 'brands/update'),
     imgHeaders: {Authorization: localStorage.getItem('accessToken')},
     imgDataUrl: null,
     imgParams: {
       id: null
     },
     show: true,
     phone: '',
     dialCode:'',
     loading: false,
      subdomain: null,
     credentials : {
      username: null,
      phone: null,
      name: null,
      email: null,
      companySize: null,
      owner: null,
      address: null,
      occupation: null,
      website: null,
      logo: null
     },
    }
  },
  events: {
    },
  methods: {
    phoneValidate(evt) {
      if(isNaN(Number(evt.data))) {
        this.credentials.phone = this.credentials.phone.substring(0, this.credentials.phone.length-1)
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
      if(this.credentials.phone) {
      this.credentials.phone = this.credentials.phone.substring(this.dialCode.length, this.credentials.phone.length);
      }
      if(i === 0) {
         this.valid('',{valid: true});
      }
      i = i + 1;
    },
   async submit() {
      // this.$refs.nameRef.validate();
      // this.$refs.websiteRef.validate();
      // this.$refs.emailRef.validate();
    //   this.$refs.passRef.validate();
      // this.$refs.deptRef.validate();

          this.loading = true
            let data = new FormData();
            data.append('username', this.credentials.username);
            data.append('phoneNumber', this.dialCode+this.credentials.phone);
            data.append('name', this.credentials.name);
            data.append('email', this.credentials.email);
            data.append('subdomain', this.credentials.subdomain);
            data.append('companySize', this.credentials.companySize);
            data.append('owner', this.credentials.owner);
            data.append('address', this.credentials.address);
            data.append('occupation', this.credentials.occupation);
            data.append('website', this.credentials.website);
         try{
          let res = await axios.post(process.env.OC_BACKEND_API + 'brands/update', data, {headers: {Authorization: localStorage.getItem('accessToken')}});
          }catch(e) {
                console.log(e)
            }
          this.$q.notify({
              type: 'positive',
              message: 'Brand edit successfully',
              color: 'positive',
              position: 'top',
              timeout: '500'
            });
          this.loading = false
          this.$emit('closeDialogue');
    }
  },
 async mounted() {
   this.show = false
   console.log(this.body)
    this.imgParams.id = this.body.id
    this.credentials.username = this.body.username
    this.credentials.phone = this.body.phoneNumber
    this.credentials.name = this.body.name,
    this.credentials.logo = this.body.logo,
    this.credentials.email = this.body.email,
    this.credentials.subdomain = this.body.subdomain
    this.credentials.companySize = this.body.companySize
    this.credentials.owner = this.body.owner
    this.credentials.address = this.body.address
    this.credentials.occupation = this.body.occupation
    this.credentials.website = this.body.website
  }
}
</script>