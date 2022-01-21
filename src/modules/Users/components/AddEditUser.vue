<template>
<q-layout style="width: 550px !important; overflow-y: hidden !important;">
     <q-card style="max-width: 550px; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{action  + ' '}} User
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md scroll">
          <q-input ref="nameRef" :rules="[val => (val && val.length !== 0) || 'This field is required']" outlined v-model="user.name" label="Name" />
          <q-input ref="userNameRef" :rules="[val => (val && val.length !== 0) || 'This field is required']" outlined v-model="user.username" label="Username" />
          <q-input ref="emailRef" type="email" :rules="[val => (val && val.length !== 0) || 'This field is required']" outlined v-model="user.email" label="E-mail" />
          <q-input v-if="action === 'Edit'" ref="passRef" v-model="user.password" type="password" outlined label="Password" :rules="[val => ( !val.length || val.length > 7) || 'Password must be at least 8 characters!']" />
          <q-input v-if="action === 'Add'" ref="passRef" v-model="user.password" type="password" outlined label="Password" :rules="[val => (val && val.length > 7) || 'Password must be at least 8 characters!']" />   
          <q-btn-toggle
                v-model="user.userType"
                class="my-custom-toggle"
                no-caps
                rounded
                toggle-color="primary"
                color="white"
                text-color="primary"
                :options="[
                {label: 'Owner', value: 'owner'},
                {label: 'Admin', value: 'admin'},
                {label: 'Agent', value: 'agent'},
                ]"
            />
            <vue-tel-input required @country-changed="countryChange" class="phone-input q-mt-lg" defaultCountry="iq" :customValidate="false" @on-input="valid" @input="phoneValidate" v-model="phone"></vue-tel-input>
          </q-card-section>
    </q-card>
          <q-toolbar class="bg-grey-3" style="position:sticky !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
</q-layout>
</template>
<script>
import { VueTelInput } from 'vue-tel-input';
import { mapActions } from 'vuex'
import axios from 'axios';
export default {
    props: ['body','action'],
    data() {
        return {
            id: null,
            loading: false,
            phone: '',
            dialCode: '',
            user : {
                name: '',
                username: '',
                password: '',
                email: '',
                userType: 'agent',
                phoneNumber: ''
            }
        }
    },
    components: {
        VueTelInput
    },
    methods: {
       ...mapActions('userStore', ['getUsers']),
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
            this.$refs.nameRef.validate();
            this.$refs.userNameRef.validate();
            this.$refs.emailRef.validate();
            if(
            this.$refs.nameRef.hasError ||
            this.$refs.userNameRef.hasError ||
            this.$refs.emailRef.hasError 
            ){
            return
            }

            if(this.action === 'Add'){
            if(this.user.password.length < 8){
                this.$refs.passRef.validate();
                return
            }
            try{
            this.loading = true;
            let response = await axios.post(process.env.OC_BACKEND_API + 'users/create',
            {...this.user, phoneNumber: this.dialCode+this.phone},
            {headers: {Authorization: localStorage.getItem('accessToken')}}
            );
            console.log(response)
            this.loading = false;
            }catch(e) {
            this.loading = false;
            console.log(e.response)
            }
            }else{
            if(this.user.password !== ''){
                if(this.user.password.length < 8){
                this.$refs.passRef.validate();
                return
                }
            }else{
            this.user.password = ''
            }
            this.loading = true;
            try{
            let response = await axios.post(process.env.OC_BACKEND_API + 'users/update',
            {name: this.user.name, 
            username: this.user.username, 
            email:this.user.email, 
            userType: this.user.userType,
            password: this.user.password === '' ? undefined : this.user.password, 
            phoneNumber: this.dialCode+this.phone,
            id:this.body.id},
            {headers: {Authorization: localStorage.getItem('accessToken')}}
            );
            }catch(e) {
                console.log(e.response);
            }
            }
            this.loading = false
            this.$emit('closeDialogue');
        }
    },
    mounted() {
        if(this.action === 'Edit') {
            this.user.name = this.body.name
            this.user.username = this.body.username
            this.user.email = this.body.email
            this.user.userType = this.body.userType
            this.phone = this.body.phoneNumber
        }
    }
}
</script>