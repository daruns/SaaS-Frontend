<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center header-height-standard q-px-md" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Overtimes</div>
      <div class="flex items-center">
        <q-btn @click="dialogue = true" color="primary" :label="'Add '+tab[0].toUpperCase()+tab.substr(1, tab.length)" unelevated rounded no-caps />
      </div>
    </div>
    <q-scroll-area style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);" class="q-px-md">
      <overtimesTable :currentUser="user" v-if="overtimesView" />
      <overtimeApprovalsTable :currentUser="user" v-if="overtimeApprovalsView" />
      <myOvertimesTable :currentUser="user" v-if="myOvertimesView"/>
      <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" :type="tab" :currentUser="user"  actionType="Add" :id="{}" />
      </q-dialog>
    </q-scroll-area>
  </q-page>
</template>
<script>
import overtimesTable from '../components/OvertimeTable.vue';
import overtimeApprovalsTable from '../components/OvertimeApprovalsTable.vue';
import myOvertimesTable from '../components/MyOvertimesTable.vue';
import { ref } from 'vue';
import AddEditOvertime from '../components/AddEditOvertime.vue'
import { mapActions, mapState } from 'vuex';
export default {
  components: {
    modal: AddEditOvertime,
    overtimesTable,
    overtimeApprovalsTable,
    myOvertimesTable,
  },
  computed: {
    ...mapState('example', ['user'])
  },
  data() {
    return {
      myOvertimesView: false,
      overtimeApprovalsView: false,
      overtimesView: false,
      dialogue: false,
      hrMember: false,
    }
  },
  methods: {
    ...mapActions('example', ['getUser']),
  },
  setup() {
    return {
      tab: ref('overtime'),
    }
  },
  async mounted() {
    await this.getUser()
    console.log("user permission: ", this.user.userType,this.user.myEmployeeProfile)
    if (this.user?.userType === "owner") {
      this.overtimeApprovalsView = true
      this.overtimesView = true
    }
    if (this.user?.userType === "admin") {
      if (this.user?.myEmployeeProfile && this.user?.myEmployeeProfile.hrMember === 1) {
        console.log("hrmanager")
        this.overtimeApprovalsView = true
        this.overtimesView = true
      }
      if (this.user?.myEmployeeProfile && this.user?.myEmployeeProfile.hrMember === 0) {
        this.myOvertimesView = true
        this.overtimeApprovalsView = true
      }
    }
    if (this.user?.userType === "agent") {
      console.log("employee")
      if (this.user?.myEmployeeProfile) {
        this.myOvertimesView = true
      }
    }
    console.log("manager",this.myOvertimesView, this.overtimeApprovalsView,this.overtimesView)
  },
}
</script>

<style scoped>

</style>