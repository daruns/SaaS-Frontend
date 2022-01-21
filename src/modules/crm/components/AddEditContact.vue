<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; height:56px;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{actionType  + ' '}}Contact
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-sm scroll">
                <q-input
            ref="nameRef"
            outlined
            v-model="contact.name"
            label="Name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please write the name']"
            />
   <q-editor             
      v-model="contact.description" :dense="$q.screen.lt.md" :toolbar="[
      [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo'],
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }"
    />
        <vue-tel-input required @country-changed="countryChange1" class="phone-input q-mt-lg" defaultCountry="iq" @on-input="valid1" @input="phoneValidate1" v-model="phone1"></vue-tel-input>
        <vue-tel-input required @country-changed="countryChange2" class="phone-input q-mt-lg" defaultCountry="iq" @on-input="valid2" @input="phoneValidate2" v-model="phone2"></vue-tel-input>

        <!-- <phone required defaultCountry="iq" searchText="Search" label="Phone number 2" @input="phoneValidate2" :error="error2" :rules="[val => (val && val.length > 0) || 'Please write your 2nd phone number']" v-model:tel="contact.businessPhoneNumber2" dense outlined /> -->
        
        <q-input
        class="q-mt-lg"
            ref="emailRef"
            outlined
            type="email"
            v-model="contact.email"
            label="E-mail"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type your E-mail']"
        />
        <q-input
            ref="posRef"
            outlined
            v-model="contact.position"
            label="Position"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please write the position']"
            />
         <q-input
            ref="deptRef"
            outlined
            v-model="contact.department"
            label="Department"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please write the department']"
            />
        <q-input
            ref="statusRef"
            outlined
            v-model="contact.status"
            label="Status"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please write status']"
            />
    </q-card-section>
    </q-card>
          <q-toolbar class="bg-grey-3 submitBtnClass" style="position:sticky !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
</q-layout>
</template>
<script>
import axios from 'axios';
import {mapActions} from 'vuex';
import phone from 'vue3-q-tel-input';
import { VueTelInput } from 'vue-tel-input';
export default {
    props: ['ccid', 'clId', 'actionType', 'body'],
   data()  { 
   return {
     error1: false,
     error2: false,
     phone1: '',
     phone2: '',
     dialCode1: '',
     dialCode2: '',
     contact: {
         name: '',
         description: 'description',
         businessPhoneNumber1: '',
         businessPhoneNumber2: '',
         position: '',
         email: '',
         department: '',
         status: '',
     },
     clientId: Number(this.clId),
     id: Number(this.ccid),
     loading: false,
    }
  },
  components : {
    phone,
    VueTelInput
  },
  methods : {
    phoneValidate1(evt) {
      if(isNaN(Number(evt.data))) {
        this.phone1 = this.phone1.substring(0, this.phone1.length-1)
      }
    },
    phoneValidate2(evt) {
      if(isNaN(Number(evt.data))) {
        this.phone2 = this.phone2.substring(0, this.phone2.length-1)
      }
    },
    countryChange1(obj) {
      let i = 0
      this.dialCode1 = '+'+obj.dialCode
      this.phone1 = this.phone1.substring(this.dialCode1.length, this.phone1.length);
      if(i === 0) {
         this.valid1('',{valid: true});
      }
      i = i + 1;
    },
     countryChange2(obj) {
      let i = 0
      this.dialCode2 = '+'+obj.dialCode
      this.phone2 = this.phone2.substring(this.dialCode2.length, this.phone2.length);
      if(i === 0) {
         this.valid2('',{valid: true});
      }
      i = i + 1;
    },
      valid1(input,obj) {
      if(obj.valid) {
        document.querySelectorAll('.vue-tel-input')[0].removeAttribute('style')
        return
      }
        document.querySelectorAll('.vue-tel-input')[0].setAttribute('style','border-color:#cc444b !important;')
    },
      valid2(input,obj) {
      if(obj.valid) {
        document.querySelectorAll('.vue-tel-input')[1].removeAttribute('style')
        return
      }
        document.querySelectorAll('.vue-tel-input')[1].setAttribute('style','border-color:#cc444b !important;')
    },
      ...mapActions('crmStore',['getOneClient']),

    async submit() {
            this.$refs.nameRef.validate();
            this.$refs.emailRef.validate();
            this.$refs.posRef.validate();
            this.$refs.deptRef.validate();
            this.$refs.statusRef.validate();
            if(
            this.$refs.nameRef.hasError ||
            this.$refs.emailRef.hasError ||
            this.$refs.posRef.hasError ||
            this.$refs.deptRef.hasError ||
            this.$refs.statusRef.hasError
            ){
            return
            }
            this.error1 = false
            this.error2 = false
     this.loading = true;
     this.contact.businessPhoneNumber1 = this.dialCode1 + this.phone1
     this.contact.businessPhoneNumber2 = this.dialCode1 + this.phone2
     if(this.actionType === 'Add') {
        await this.create()
      }else{
        await this.update()
      }
      await this.getOneClient(this.clId);
      this.loading = false
      this.$emit('closeDialogue')

    },
    async create() {
      let response = await axios.post(process.env.OC_BACKEND_API + 'clientContacts/create', 
      {...this.contact, clientId: Number(this.clientId)}, 
      {headers: {Authorization: localStorage.getItem('accessToken')}})
      this.loading = false
       await this.$emit('updateForInvoice');
          this.$q.notify({
              type: 'positive',
              message: 'Contact created',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
    },
      async update() {
      let response = await axios.post(process.env.OC_BACKEND_API + 'clientContacts/update', 
      {...this.contact, id: this.id}, 
      {headers: {Authorization: localStorage.getItem('accessToken')}})
      this.loading = false
                this.$q.notify({
              type: 'positive',
              message: 'Contact updated',
              color: 'positive',
              position: 'top',
              timeout: '500'
            })
    }
  },
 async mounted() {
   if(this.actionType === 'Edit'){
    this.contact.name = this.body.name;
    this.contact.description = this.body.description;
    this.phone1 = this.body.businessPhoneNumber1;
    this.phone2 = this.body.businessPhoneNumber2;
    this.contact.position = this.body.position;
    this.contact.email = this.body.email;
    this.contact.department = this.body.department;
    this.contact.status = this.body.status;
   }else {
         this.phone1 = '1';
         this.phone2 = '1';
         this.phone1 = '';
         this.phone2 = '';
   }
  }

}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>