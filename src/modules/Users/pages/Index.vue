<template>
    <q-page class="q-pa-md">
    <div class="flex justify-between items-center">
        <div>
        <p class="text-h4">Users</p>
        <breadcrumps :map="crumps" />
        </div>
        <q-btn @click="dialogue = true" color="primary" label="Create Record" unelevated rounded no-caps />
    </div>
    <tbl />
    <q-dialog seamless position="right" v-model="dialogue" persistent>
        <modal @closeDialogue="getUsers(); dialogue = false" action="Add" />
     </q-dialog>
    </q-page>
</template>
<script>
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import tbl from '../components/tbl.vue';
import modal from '../components/AddEditUser.vue';
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      dialogue : false
    }
  },
  components : {
      breadcrumps,
      tbl,
      modal
  },
  methods : {
       ...mapActions('userStore', ['getUsers']),
  },
    setup () {
      return {
        crumps: [
          {id:1,name:'OneConnect',icon: 'home',path: '/'},
          {id:2,name:'Users',icon: 'person',path: '/users'}
          ],
      }
    }
}
</script>
