<template>
  <q-page class="q-py-none q-my-none">
    <div  class="full-width flex justify-between items-center q-px-md header-height-standard" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">CRM</div>
    </div>
    <breadcrmps class="q-pa-md full-width" :map="crumps" />
    <div v-if="!canActivate('subject_crm','read')"><Forbidden /></div>
    <div v-else class="q-px-md">
      <q-card v-if="isloading">
      <q-skeleton class="row items-center q-pa-md">
        <div class="flex items-center col-md-6 col-sm-12 q-pb-md avatar">
          <q-avatar size="120px" font-size="52px" color="grey" text-color="white" icon="person" />
          <div>
            <p class="q-ml-md text-h5 text-weight-medium q-pb-sm q-mt-lg q-ma-none"><q-skeleton class="col"/></p>
            <p class="text-subtitle2 text-grey q-ml-md q-ma-none"><q-skeleton class="col"/></p>
            <q-btn class="q-ml-md q-mt-md" color="primary" no-caps label="Send Message" unelevated />
          </div>
        </div>
        <div class="row client-infos col q-pa-md" >
          <div class="column col-12">
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p class="text-grey flex flex-start full-width"><q-skeleton class="col"/></p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p class="text-grey flex flex-start full-width"><q-skeleton class="col"/></p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p class="text-grey flex flex-start full-width"><q-skeleton class="col"/></p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p class="text-grey flex flex-start full-width"><q-skeleton class="col"/></p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p class="text-grey flex flex-start full-width"><q-skeleton class="col"/></p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
              <p class="text-grey flex flex-start full-width"><q-skeleton class="col"/></p>
            </div>
          </div>
        </div>
      </q-skeleton>
    </q-card>
     <q-card v-else class="row items-center q-pa-md">
       <q-btn v-if="canActivate('subject_crm','update')" @click="dialogue = true" class="absolute-top-right q-mt-xs q-mr-xs" flat text-color="grey" size="sm" round unelevated icon="edit" color="primary" />
       <div class="flex items-center col-md-6 col-sm-12 q-pb-md avatar">
        <q-avatar v-if="currentClient.logo" size="120px">
            <img :src="currentClient.logo" />
        </q-avatar>
        <q-avatar v-else size="120px" font-size="52px" color="grey" text-color="white" icon="person" />
        <div>
        <p class="q-ml-md text-h5 text-weight-medium q-pb-sm q-mt-lg q-ma-none">{{currentClient.name}}</p>
        <p class="text-subtitle2 text-grey q-ml-md q-ma-none">{{currentClient.businessType}}</p>
        <q-btn class="q-ml-md q-mt-md" color="primary" no-caps label="Send Message" unelevated />
        </div>
       </div>
        <div class="row client-infos col-md-6 col-sm-12 q-pa-md" >
          <div class="column col-12">
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Type:</p>
            <p class="text-grey">{{currentClient.clientType}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Phone:</p>
            <p class="text-grey">{{currentClient.phoneNumbers}}</p>
            </div>
             <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>E-mail:</p>
            <p class="text-grey">{{currentClient.email}}</p>
            </div>
            <div v-if="currentClient.address"  class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Address:</p>
            <p class="text-grey">{{currentClient.address}}</p>
            </div>
             <div v-if="currentClient.zipCode"  class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Zipcode:</p>
            <p class="text-grey">{{currentClient.zipCode}}</p>
            </div>
            <div v-if="currentClient.website"  class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
              <p>Website:</p>
              <p class="text-grey">{{currentClient.website}}</p>
            </div>
            <div v-if="currentClient.createdBy"  class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
              <p>Created By:</p>
              <p class="text-grey">{{currentClient.createdBy}}</p>
            </div>
            </div>
        </div>
     </q-card>
      <div class="q-mt-lg">
    <q-tabs
        v-model="tab"    
        class="text-grey bg-white rounded-borders bordered"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        no-caps
      >
        <q-tab v-if="canActivate('subject_crm','read')" name="meetings" @click="updateTab('meetings')" no-caps label="Meetings" />
        <q-tab v-if="canActivate('subject_crm','read')" name="contacts" @click="updateTab('contacts')" no-caps label="Contact Persons" />
        <q-tab v-if="canActivate('subject_crm','read')" name="sociallinks" @click="updateTab('sociallinks')" no-caps label="Social links" />
        <q-tab v-if="canActivate('subject_crm','read')" name="users" @click="updateTab('users')" no-caps label="Users" />
        <q-tab v-if="canActivate('subject_projects','read')" name="projects" @click="updateTab('projects')" no-caps label="Projects" />
        <q-tab v-if="canActivate('subject_finance','read')" name="invoices" @click="updateTab('invoices')" no-caps label="Invoices" />
        <q-tab v-if="canActivate('subject_finance','read')" name="quotes" @click="updateTab('quotes')" no-caps label="Quotes" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="meetings" class="q-pa-none">
            <meetings />
        </q-tab-panel>

        <q-tab-panel name="contacts">
            <contacts />
        </q-tab-panel>

        <q-tab-panel name="sociallinks">
            <sociallinks />
        </q-tab-panel>
        <q-tab-panel name="users">
            <users />
        </q-tab-panel>
        <q-tab-panel name="projects">
            <projects :bodyData="currentClient?.projects" />
        </q-tab-panel>
        <q-tab-panel name="invoices">
            <invoices :bodyData="currentClient?.invoices" />
        </q-tab-panel>
        <q-tab-panel name="quotes">
            <quotes :bodyData="currentClient?.quotes" />
        </q-tab-panel>
      </q-tab-panels>
      <q-dialog :inProfile="true" seamless position="right" v-model="dialogue">
          <modal @closeDialogue="dialogue = false" :body="currentClient" :type="currentClient.clientType" actionType="Edit" :id="$route.params.id" />
      </q-dialog>
    </div>
    </div>

</q-page>
</template>
<script>
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import Forbidden from '../../../components/globalComponents/Forbidden.vue';
import contacts from '../components/Contacts.vue'
import { ref } from 'vue'
import { mapActions, mapState } from 'vuex'
import meetings from '../components/Meetings.vue'
import sociallinks from '../components/SocialMediaLinks.vue';
import users from '../components/UsersTable.vue';
import projects from '../components/ProjectsGrid.vue'
import invoices from '../components/InvoicesGrid.vue'
import quotes from '../components/QuotesGrid.vue'
import AddEditClient from '../components/AddEditClient.vue';
import axios from 'axios'

export default {
  components: {
    meetings,
    breadcrmps: breadcrumps,
    sociallinks,
    contacts,
    modal: AddEditClient,
    users,
    projects,
    invoices,
    quotes,
    Forbidden,
  },
  data() {
    return {
      canActivate: this.$canActivate,
      dialogue: false,
      close: false,
      isloading: ref(false),
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'CRM',icon: 'groups',path: '/crm'},
      ],
      user: {
        name: '',
        username: '',
        password: ''
      },
    }
  },
  computed: {
    ...mapState('crmStore', ['currentClient']), 
  },
  methods: {
    ...mapActions('crmStore', ['getOneClient']),
    updateTab(tab) {
      localStorage.setItem('tab', tab)
    },
    async submit() {
      this.$refs.nameRef.validate();
      this.$refs.userNameRef.validate();
      if(
        this.$refs.nameRef.hasError ||
        this.$refs.userNameRef.hasError
      ){
        return
      }
      this.close = true;
      if(!this.currentClient.user){
        try{
          let response = await axios.post(process.env.OC_BACKEND_API + 'clients/addUser',
            {...this.user, id:this.$route.params.id},
            {headers: {Authorization: localStorage.getItem('accessToken')}}
          );
        }catch(e) {
          console.log(e.response)
        }
      }else{
        let response = await axios.post(process.env.OC_BACKEND_API + 'clients/editUser',
          {...this.user, id:this.$route.params.id},
          {headers: {Authorization: localStorage.getItem('accessToken')}}
        );
        console.log(response);
      }
      await this.getOneClient(this.$route.params.id);
    }
  },
  async mounted() {
    if (!this.canActivate('subject_crm','read')) return
    this.isloading = true
    await this.getOneClient(this.$route.params.id);
    this.isloading = false
    if (this.currentClient.user) {
      this.user.name = this.currentClient.user.name;
      this.user.username = this.currentClient.user.username;
      this.user.password = this.currentClient.user.password;
    }
  },
  setup () {
    return {
      tab: ref(localStorage.getItem('tab') ? localStorage.getItem('tab'): 'meetings'),
    }
  }
}
</script>