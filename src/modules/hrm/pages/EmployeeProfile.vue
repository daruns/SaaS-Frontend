<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center q-px-md header-height-standard" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">CRM</div>
    </div>
    <div class="q-px-md">
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
       <q-btn @click="dialogue = true" class="absolute-top-right q-mt-xs q-mr-xs" flat text-color="grey" size="sm" round unelevated icon="edit" color="primary" />
       <div class="flex items-center col-md-6 col-sm-12 q-pb-md avatar">
        <q-avatar v-if="currentEmployee.user?.avatar" size="120px">
            <img :src="currentEmployee.user?.avatar" />
        </q-avatar>
        <q-avatar v-else size="120px" font-size="52px" color="grey" text-color="white" icon="person" />
        <div>
        <p class="q-ml-md text-h5 text-weight-medium q-pb-sm q-mt-lg q-ma-none">{{currentEmployee.name}}</p>
        <p class="text-subtitle2 text-grey q-ml-md q-ma-none">@{{currentEmployee.user?.username}}</p>
        <q-btn class="q-ml-md q-mt-md" color="primary" no-caps label="Send Message" unelevated />
        </div>
       </div>
        <div class="row client-infos col-md-6 col-sm-12 q-pa-md" >
          <div class="column col-12">
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Department:</p>
            <p class="text-grey">{{currentEmployee.designation?.department?.name}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Role:</p>
            <p class="text-grey">{{currentEmployee.designation?.name}}</p>
            </div>
             <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>E-mail:</p>
            <p class="text-grey">{{currentEmployee.user?.email}}</p>
            </div>
            <div v-if="currentEmployee.user"  class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Uername:</p>
            <p class="text-grey">{{currentEmployee.user?.username}}</p>
            </div>
             <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Salary:</p>
            <p class="text-grey">{{currentEmployee.salary}}</p>
            </div>
            <div class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Leave Balance (in days):</p>
            <p class="text-grey">{{currentEmployee.leaveBalance}}</p>
            </div>
            <div v-if="currentEmployee.manager"  class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>Manager:</p>
            <p class="text-grey">{{currentEmployee.manager?.user?.name}}</p>
            </div>
            <div v-if="currentEmployee.hrMember"  class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
            <p>HR Member: <q-icon name="done" size="sm" color="primary" /></p>
            </div>
            <div v-if="currentEmployee.createdBy"  class="text-body1 text-weight-medium text-left full-width client-info flex q-gutter-sm">
              <p>Created By:</p>
              <p class="text-grey">{{currentEmployee.createdBy}}</p>
            </div>
            </div>
        </div>
     </q-card>
      <div class="q-mt-lg">
        <!-- <q-tabs
          v-model="tab"    
          class="text-grey bg-white rounded-borders bordered"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          no-caps
        >
          <q-tab name="meetings" @click="updateTab('meetings')" no-caps label="Meetings" />
          <q-tab name="contacts" @click="updateTab('contacts')" no-caps label="Contact Persons" />
          <q-tab name="sociallinks" @click="updateTab('sociallinks')" no-caps label="Social links" />
          <q-tab name="users" @click="updateTab('users')" no-caps label="Users" />
          <q-tab name="projects" @click="updateTab('projects')" no-caps label="Projects" />
          <q-tab name="invoices" @click="updateTab('invoices')" no-caps label="Invoices" />
          <q-tab name="quotes" @click="updateTab('quotes')" no-caps label="Quotes" />
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
              <projects :bodyData="currentEmployee?.projects" />
          </q-tab-panel>
          <q-tab-panel name="invoices">
              <invoices :bodyData="currentEmployee?.invoices" />
          </q-tab-panel>
          <q-tab-panel name="quotes">
            <quotes :bodyData="currentEmployee?.quotes" />
          </q-tab-panel>
        </q-tab-panels> -->
      </div>
    </div>
    <q-dialog :inProfile="true" seamless position="right" v-model="dialogue">
      <modal @closeDialogue="dialogue = false" :body="currentEmployee" :type="currentEmployee.clientType" actionType="Edit" :id="$route.params.id" />
    </q-dialog>

  </q-page>
</template>
<script>
// import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
// import contacts from '../components/Contacts.vue'
import { ref } from 'vue'
import { mapActions, mapState } from 'vuex'
// import leaves from '../components/Leave.vue';
// import meetings from '../components/Meetings.vue'
// import sociallinks from '../components/SocialMediaLinks.vue';
// import projects from '../components/ProjectsGrid.vue'
// import invoices from '../components/InvoicesGrid.vue'
// import quotes from '../components/QuotesGrid.vue'
import AddEditEmployee from '../components/AddEditEmployee.vue';
import axios from 'axios'
export default {
  components: {
    modal: AddEditEmployee,
    // leaves,
  },
  data() {
    return {
      dialogue: false,
      close: false,
      isloading: ref(false),
      user: {
        name: '',
        username: '',
      }
    }
  },
  computed: {
    ...mapState('hrmStore', ['currentEmployee']), 
  },
  methods: {
    ...mapActions('hrmStore', ['getOneEmployee']),
    // updateTab(tab) {
    //   localStorage.setItem('tab', tab)
    // },
  },
  async mounted() {
    this.isloading = true
    await this.getOneEmployee(this.$route.params.id);
    this.isloading = false
    if(this.currentEmployee.user) {
      this.user.name = this.currentEmployee.user.name;
      this.user.username = this.currentEmployee.user.username;
    }
  },
  setup () {
    return {
      tab: ref(localStorage.getItem('tab') ? localStorage.getItem('tab'): 'meetings'),
    }
  }
}
</script>