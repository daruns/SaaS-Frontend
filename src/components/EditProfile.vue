<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
      <q-toolbar-title>
        Edit Profile
      </q-toolbar-title>
      <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
        <q-card-section class="q-gutter-sm scroll">
          <div class="col-12 flex flex-center q-py-lg tems-center row">
            <q-avatar clickable :color="!credentials.avatar ? 'grey' : 'white'" size="120px" @click="show = !show" class="cursor-pointer" style="border: 0.2px solid grey;">
              <q-img round style="border-radius:50% !important" v-if="credentials.avatar" :src="credentials.avatar"/>
              <q-icon v-else color="white" name="person"/>
              <q-badge floating color="grey" ><q-icon color="white" circle name="edit" size="xs" /></q-badge>
            </q-avatar>
          </div>

          <cropableUpload
            field="avatar"
            lang-type="en"
            :params="imgParams"
            :url="imgUrl"
            :value.sync="show"
            :headers="imgHeaders"
            v-model="show"
          />
            <q-input
            ref="nameRef"
            outlined
            v-model="credentials.name"
            label="Name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type the name']"
          />
         <!-- <q-input
            ref="userNameRef"
            outlined
            v-model="credentials.username"
            label="Username"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type the user name']"
          /> -->
        <vue-tel-input required @country-changed="countryChange" class="phone-input" defaultCountry="iq" :customValidate="false" @on-input="valid" @input="phoneValidate" v-model="phone"></vue-tel-input>
        <!-- <q-input
        class="q-mt-lg"
          ref="emailRef"
          outlined
          type="email"
          v-model="credentials.email"
          label="E-mail"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Please type a valid E-mail']"
        /> -->
        <q-input
            ref="passRef"
            outlined
            v-model="credentials.password"
            label="Password"
            type="password"
            lazy-rules
            class="q-mt-lg profile-photo-uploader"
          />
        <!-- <q-input
        class="q-mt-lg"
            ref="deptRef"
            outlined
            v-model="credentials.department"
            label="Department"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type user department']"
          /> -->

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
     show: true,
     imgUrl: (process.env.OC_BACKEND_API + 'auth/editProfile'),
     imgHeaders: {Authorization: localStorage.getItem('accessToken')},
     imgDataUrl: null,
     imgParams: {
       id: null
     },
     phone: '',
     dialCode:'',
     loading: false,
     credentials : {
      name: '',
      username: '',
      email: '',
      password: '',
      department: '',
      avatar: null
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
      if(this.phone) {
      this.phone = this.phone.substring(this.dialCode.length, this.phone.length);
      }
      if(i === 0) {
         this.valid('',{valid: true});
      }
      i = i + 1;
    },
    ...mapActions('example', ['editProfile']),
   async submit() {
      this.$refs.nameRef.validate();
      // this.$refs.userNameRef.validate();
      // this.$refs.emailRef.validate();
    //   this.$refs.passRef.validate();
      // this.$refs.deptRef.validate();

      if(
        this.$refs.nameRef.hasError 
        // this.$refs.userNameRef.hasError ||
        // this.$refs.emailRef.hasError ||
        // this.$refs.passRef.hasError ||
        // this.$refs.deptRef.hasError 
        ) {
          return
        }else{
          this.loading = true
            let data = new FormData();
            data.append('name', this.credentials.name);
            data.append('password', this.credentials.password);
            data.append('avatar', this.credentials.avatar);
            data.append('phoneNumber', this.dialCode+this.phone);
         try{
          let res = await axios.post(process.env.OC_BACKEND_API + 'auth/editProfile', data, {headers: {Authorization: localStorage.getItem('accessToken')}});
          }catch(e) {
                console.log(e)
            }
          this.$q.notify({
              type: 'positive',
              message: 'User edit successfully',
              color: 'positive',
              position: 'top',
              timeout: '500'
            });
          this.loading = false
          this.$emit('closeDialogue');
        }
    }
  },
 async mounted() {
   this.show = false
    // this.imgParams.id = this.body.id
    this.credentials.username = this.body.username
    this.phone = this.body.phoneNumber
    this.credentials.name = this.body.name,
    this.credentials.email = this.body.email,
    this.credentials.department = this.body.department
    // this.credentials.password = this.body.password

  }
}
</script>