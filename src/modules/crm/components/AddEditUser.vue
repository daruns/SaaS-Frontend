<template>
<q-layout style="width: 500px !important;">
     <q-card style="max-width: 500px;min-height:100vh;" flat square>
        <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
            <q-toolbar-title>
                {{action  + ' '}} User
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-sm scroll">
        <q-input ref="nameRef" v-model="user.name" outlined label="Name" :rules="[val => (val && val.length > 0) || 'This field is required!']" />
        <q-input ref="userNameRef" v-model="user.username" outlined label="Username" :rules="[val => (val && val.length > 0) || 'This field is required!']" />
        <q-input
          ref="emailRef"
          outlined
          type="email"
          v-model="user.email"
          label="E-mail"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Please type a valid E-mail']"
        />
      <q-input v-if="action === 'Edit'" ref="passRef" v-model="user.password" type="password" outlined label="Password" :rules="[val => ( !val.length || val.length > 7) || 'Password must be at least 8 characters!']" />
      <q-input v-if="action === 'Add'" ref="passRef" v-model="user.password" type="password" outlined label="Password" :rules="[val => (val && val.length > 7) || 'Password must be at least 8 characters!']" />
    </q-card-section>
    </q-card>
          <q-toolbar class="bg-grey-3 submitBtnClass" style="position:relative !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
</q-layout>
</template>
<script>
import { mapActions } from 'vuex';
import axios from 'axios'
export default {
    props: ['body','action'],
    data() {
        return {
            clientId: Number(this.$route.params.id),
            id: null,
            loading: false,
            user : {
                name: '',
                username: '',
                email: '',
                password: ''
            }
        }
    },
    methods: {
      ...mapActions('crmStore', ['getOneClient']),
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
        let response = await axios.post(process.env.OC_BACKEND_API + 'clients/addUser',
        {...this.user, id:this.$route.params.id},
        {headers: {Authorization: localStorage.getItem('accessToken')}}
         );
          }catch(e) {
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
        let password = this.user.password
        this.loading = true;
        let response = await axios.post(process.env.OC_BACKEND_API + 'clients/editUser',
        {name: this.user.name, 
        username: this.user.username, 
        email:this.user.email, 
        password: this.user.password === '' ? undefined : this.user.password, 
        id:this.$route.params.id},
        {headers: {Authorization: localStorage.getItem('accessToken')}}
         );
        }
        await this.getOneClient(this.$route.params.id);
        this.loading = false;
        this.$emit('closeDialogue');
        }
    },
    mounted() {
        if(this.action === 'Edit') {
            this.user.name = this.body.name;
            this.user.username = this.body.username;
            this.user.email = this.body.email;
            this.user.phoneNumber = this.body.phoneNumber;
        }
    }
}
</script>