<template>
<div class="flex flex-center full-height">
    <q-card style="min-width: 320px; max-width: 400px;" flat bordered class="my-card bg-grey-1">
      <q-card-section>
        <div class="row items-center text-center">
          <div class="col">
            <div class="text-h6"><img height="100" width="100" src="~/assets/one_logo_neat.png" /></div>
            <div class="text-subtitle2">Log in to access your dashboard</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md">
      <q-input
        ref="usernameRef"
        outlined
        v-model="credentials.username"
        label="Username"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type your username']"
      />
      <q-input
        ref="emailRef"
        outlined
        type="email"
        v-model="credentials.email"
        label="E-mail"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type your E-mail']"
      />

      <q-input
        ref="nameRef"
        outlined
        v-model="credentials.subdomain"
        label="Sub domain"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type company name']"
      />
      <q-input
        ref="passRef"
        outlined
        type="password"
        v-model="credentials.password"
        label="Password"
        lazy-rules
        :rules="[val => (val.length > 7) || 'Please type your password']"
      />

      <div>
        <q-btn :loading="loading" @click="signup" label="Sign up" no-caps type="reset" color="primary" unelevated class="q-ml-sm full-width" />
      </div>
    </div>
      </q-card-section>
      <p class="text-center">Already have an account?<router-link to="/login" style="color: #1976D2;"> Log in</router-link></p>
    </q-card>
</div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
   data()  { 
   return {
     credentials : {
      username: '',
      password: '',
      subdomain: '',
      email:''
     },
     loading: false
    }
  },
  methods : {
    ...mapActions('example', ['signUp']),
    async signup() {
      this.$refs.usernameRef.validate();
      this.$refs.passRef.validate();
      this.$refs.emailRef.validate();
      this.$refs.nameRef.validate();

      if(this.$refs.usernameRef.hasError || this.$refs.passRef.hasError || this.$refs.emailRef.hasError || this.$refs.nameRef.hasError)
      return
      this.loading = true;
      let res = await this.signUp(this.credentials);
      if(res){
      this.$q.notify({
        type: 'positive',
        message: 'Signed up successfully',
        color: 'positive',
        position: 'top',
        timeout: '500'
      })
      this.$router.push('/login');
      }else{
      this.$q.notify({
        type: 'negative',
        message: 'User already exists',
        color: 'negative',
        position: 'top',
        timeout: '500'
      })
      }
      this.loading = false;
    }
  },
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>