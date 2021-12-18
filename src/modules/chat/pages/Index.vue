<template>
    <q-page class="q-pa-md">
    <div class="flex justify-between items-center">
       <div>
        <p class="text-h4">Chat</p>
        <breadcrmps :map="crumps" />
        </div>
          <q-btn color="primary" label="Create conversation" unelevated rounded no-caps />
    </div>
</q-page>   
</template>
<script>
import breadcrmps from '../../../components/globalComponents/BreadCrumps.vue';
import users from '../components/Users.vue';
import group from '../components/GroupChats.vue';
export default {
    data() {
        return {
            tab: 'group chat'
        }
    },
    components : {
        breadcrmps,
        users,
        group
    },
    setup () {
    return {
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Chat',icon: 'chat',path: '/chat'}
        ],
    }
  }
}
</script>
