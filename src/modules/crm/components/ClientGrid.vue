<template>
<q-page class="q-pt-sm">
    <div class="row items-center q-pa-sm" >
    <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" v-for="(client, i) in data" :key="i">
    <q-card flat bordered style="position: relative !important;" class="my-card">
      <q-btn v-if="canActivate('subject_crm','delete') || canActivate('subject_crm','update')" style="z-index:2;" class="absolute-top-right" dense round flat icon="more_vert">
        <q-menu
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list style="min-width: 75px">
            <q-item v-if="canActivate('subject_crm','delete')" @click="deleteClient({id: client.id})" style="padding 0 !important" clickable v-close-popup>
              <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
            </q-item>
            <q-separator v-if="canActivate('subject_crm','update') && canActivate('subject_crm','delete')" />
            <q-item v-if="canActivate('subject_crm','update')" @click="editClient(client)" clickable v-close-popup>
              <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-card-section class="flex flex-center">
        <div class="flex column flex-center">
          <router-link :to="`/client/${client.id}`">
          <q-avatar v-if="client.logo" size="100px" font-size="52px">
            <img :src="client.logo" />
          </q-avatar>
          <q-avatar v-else size="100px" font-size="52px" color="grey" text-color="white" icon="person" />
          </router-link>
          <router-link class="q-py-sm row flex wrapword" style="min-width:80% !important;white-space: nowrap;overflow:hidden !important;text-overflow: ellipsis" :to="`/client/${client.id}`">
            <p class="text-black text-h6 text-center col-12 wrapword" v-html="client.name" style="width: 10vw"></p>
          </router-link>
          <p class="text-span text-grey">{{client.businessType}}</p>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <router-link :to="`/client/${client.id}`"><q-btn color="primary" class="q-mb-md" outline no-caps>View Profile</q-btn></router-link>
      </q-card-actions>
    </q-card>
    </div>
    </div>
    <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" :type="type" :inProfile="false" :body="body" actionType="Edit" :id="id" />
    </q-dialog>
    </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AddEditClient from './AddEditClient.vue'
export default {
  components: {
    modal: AddEditClient
  },
  props: ['type'],
  computed: {
    ...mapState('crmStore', ['clients', 'leads', 'blacklist']),
    data(){
     if(this.type === 'client'){
      return this.clients
    }else if(this.type === 'lead'){
      return this.leads
    }
    else{
      return this.blacklist
    }
    }
  },
  data() {
    return {
      canActivate: this.$canActivate,
      loading: false,
      dialogue: false,
      id: '',
      body: null,
      options: []
   }
  },
  methods: {
    ...mapActions('crmStore',['getClients', 'deleteClient']),
    editClient(client) {
        if(this.dialogue === true){
          this.dialogue = false;
          setTimeout(() => {
             this.body = client
            this.dialogue = true
          }, 200);
          return
        }
         this.body = client
        this.dialogue = true
    },
    getUserOptions(payload) {
      let optionsA = [];
      let optionsB = [];
      this.options = [];
      setTimeout(() => {
      if(!payload) return
      for(let i = 0; i<this.users.length; i++) {
      for(let j = 0; j<payload.members.length; j++) {
        if(Number(payload.members[j].memberId) === Number(this.users[i].id)){
          optionsB.push({id:this.users[i].id, label: this.users[j].name});
        }
      }
          optionsA.push({id:this.users[i].id, label: this.users[i].name});
      }
      this.options = optionsA.filter(({ id: id1 }) => !optionsB.some(({ id: id2 }) => id2 === id1));
      }, 200);
    },
  },
  async mounted() {
    if (!this.canActivate('subject_crm','read')) return
    this.loading = true
    await this.getClients(this.type);
    this.loading = false
  }
}
</script>
<style scoped>
  @media (max-width: 652px) { 
  .row {
    justify-content: center !important;
  }
}
</style>