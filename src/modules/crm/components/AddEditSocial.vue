<template>
<q-layout style="width: 500px !important;">
     <q-card style="max-width: 500px;min-height:100vh;" flat square>
        <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 63px !important;">
            <q-toolbar-title>
                {{action  + ' '}} Social Link
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md">
          <q-input ref="nameRef" :rules="[val => (val && val.length === 0) || 'This field is required']" outlined v-model="socialMediaLink.name" label="Name" />
          <q-input ref="socialARef" :rules="[val => (val && val.length === 0) || 'This field is required']" outlined v-model="socialMediaLink.addressDomain" label="Domain" />
          <q-input ref="socialLRef" :rules="[val => (val && val.length === 0) || 'This field is required']" outlined v-model="socialMediaLink.linkAddress" label="Link address" />
    </q-card-section>

    </q-card>
          <q-toolbar class="bg-grey-3 submitBtnClass" style="position:sticky !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
</q-layout>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    props: ['body','action'],
    data() {
        return {
            clientId: Number(this.$route.params.id),
            id: null,
            loading: false,
            socialMediaLink : {
                name: '',
                addressDomain: '',
                linkAddress: '',
            }
        }
    },
    methods: {
        ...mapActions('crmStore',['addSocial', 'editSocial']),
       async submit() {
            this.$refs.nameRef.validate();
            this.$refs.socialARef.validate();
            this.$refs.socialLRef.validate();
            if(
            this.$refs.nameRef.hasError ||
            this.$refs.socialARef.hasError ||
            this.$refs.socialLRef.hasError
            )
            return
            this.loading = true
            if(this.action === 'Add') {
               await this.addSocial({...this.socialMediaLink, clientId: this.clientId})
            }else if(this.action === 'Edit'){
              await this.editSocial({data: {...this.socialMediaLink, id: this.id}, clientId: this.clientId})
            }
            this.loading = false
            this.$emit('closeDialogue');
        }
    },
    mounted() {
        if(this.action === 'Edit') {
            this.socialMediaLink.name = this.body.name
            this.socialMediaLink.addressDomain = this.body.addressDomain
            this.socialMediaLink.linkAddress = this.body.linkAddress
            this.id = this.body.id
        }
    }
}
</script>