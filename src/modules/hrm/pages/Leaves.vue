<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center header-height-standard q-px-md" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Leaves</div>
      <div class="flex items-center">
        <q-btn @click="dialogue = true" color="primary" :label="'Add '+tab[0].toUpperCase()+tab.substr(1, tab.length)" unelevated rounded no-caps />
      </div>
    </div>
    <q-scroll-area style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);" class="q-px-md">
      <leavesTable :currentUser="user" v-if="leavesView" />
      <leaveApprovalsTable :currentUser="user" v-if="leaveApprovalsView" />
      <myLeavesTable :currentUser="user" v-if="myLeavesView"/>
      <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" :type="tab" :currentUser="user"  actionType="Add" :id="{}" />
      </q-dialog>
    </q-scroll-area>
  </q-page>
</template>
<script>
import leavesTable from '../components/LeaveTable.vue';
import leaveApprovalsTable from '../components/LeaveApprovalsTable.vue';
import myLeavesTable from '../components/MyLeavesTable.vue';
import { ref } from 'vue';
import AddEditLeave from '../components/AddEditLeave.vue'
import { mapActions, mapState } from 'vuex';
export default {
  components: {
    modal: AddEditLeave,
    leavesTable,
    leaveApprovalsTable,
    myLeavesTable,
  },
  computed: {
    ...mapState('example', ['user'])
  },
  data() {
    return {
      myLeavesView: false,
      leaveApprovalsView: false,
      leavesView: false,
      dialogue: false,
      hrMember: false,
    }
  },
  methods: {
    ...mapActions('example', ['getUser']),
  },
  setup() {
    return {
      tab: ref('leave'),
    }
  },
  async mounted() {
    await this.getUser()
    console.log("user permission: ", this.user.userType,this.user.myEmployeeProfile)
    if (this.user?.userType === "owner") {
      this.leaveApprovalsView = true
      this.leavesView = true
    }
    if (this.user?.userType === "admin") {
      if (this.user?.myEmployeeProfile && this.user?.myEmployeeProfile.hrMember === 1) {
        console.log("hrmanager")
        this.leaveApprovalsView = true
        this.leavesView = true
      }
      if (this.user?.myEmployeeProfile && this.user?.myEmployeeProfile.hrMember === 0) {
        this.myLeavesView = true
        this.leaveApprovalsView = true
      }
    }
    if (this.user?.userType === "agent") {
      console.log("employee")
      if (this.user?.myEmployeeProfile) {
        this.myLeavesView = true
      }
    }
    console.log("manager",this.myLeavesView, this.leaveApprovalsView,this.leavesView)
  },
}
</script>

<style scoped>

</style>