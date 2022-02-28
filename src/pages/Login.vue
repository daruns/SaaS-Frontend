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
        autofocus
        ref="nameRef"
        outlined
        v-model="credentials.username"
        label="Username"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type your username']"
        @keyup.enter="login"
      />

      <q-input
        ref="passRef"
        outlined
        type="password"
        v-model="credentials.password"
        label="Password"
        lazy-rules
        :rules="[val => (val.length > 7) || 'Please type your password']"
        @keyup.enter="login"
      />

      <div>
        <q-btn :loading="loading" @click="login" label="Log in" no-caps type="reset" color="primary" unelevated class="q-ml-sm full-width" />
      </div>
    </div>
      </q-card-section>
      <p class="text-center">You don`t have an account?<router-link to="/signup" style="color: #1976D2;"> Sign up</router-link></p>
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
      password: ''
     },
     loading: false,
    }
  },
  methods : {
    ...mapActions('example', ['logIn']),
    async login() {
      this.$refs.nameRef.validate();
      this.$refs.passRef.validate();

      if(this.$refs.nameRef.hasError || this.$refs.passRef.hasError)
      return
      this.loading = true;
      let res = await this.logIn(this.credentials);
      if(res){
        this.$q.notify({
        type: 'positive',
        message: 'Logged in successfully',
        color: 'positive',
        position: 'top',
        timeout: '500'
      })
      this.$router.push('/');
      }else{
      this.$q.notify({
        type: 'negative',
        message: 'Wrong Credentials!',
        color: 'negative',
        position: 'top',
        timeout: '500'
      })
      }
      this.loading=false
    }
  },
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>