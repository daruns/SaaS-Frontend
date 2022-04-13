<template>
  <div>
    <q-table
      :rows="usersRows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-mt-lg"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
         <q-td key="avatar" :props="props">
            <q-avatar v-if="props.row.avatar" size="30px">
            <img :src="props.row.avatar">
            </q-avatar>
            <q-avatar v-else size="30px" font-size="20px" color="grey" text-color="white" icon="person" />
          </q-td>
          <q-td key="name" :props="props">
              {{ props.row.name }}
          </q-td>
          <q-td key="username" :props="props">
              {{ props.row.username }}
          </q-td>
          <q-td key="email" :props="props">
              {{ props.row.email }}
          </q-td>
          <q-td key="phoneNumber" :props="props">
              {{ props.row.phoneNumber }}
          </q-td>
          <q-td key="userType" :props="props">
              {{ props.row.userType }}
          </q-td>
         <q-td key="actions" :props="props">
          <q-btn dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item  @click="delItem(props.row.id)" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator />
                <q-item @click="edit(props.row)" clickable v-close-popup>
                 <q-item-section  class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog seamless position="right" v-model="dialogue" persistent>
    <modal :body="body" action="Edit" @closeDialogue="getUsers(); dialogue = false" />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import modal from './AddEditUser.vue';
export default {
  data() {
    return {
    loading: false,
    action: '',
    dialogue: false,
    body: null,
    columns : [
    { name: 'avatar', align: 'center', label: '#', field: 'avatar'},
    { name: 'name', align: 'left', label: 'Name', field: 'name'},
    { name: 'username', label: 'Username', align: 'left', field: 'username' },
    { name: 'email', align: 'left', label: 'E-mail', field: 'email'},
    { name: 'phoneNumber', align: 'left', label: 'Phone number', field: 'phoneNumber'},
    { name: 'userType', align: 'left', label: 'Type', field: 'userType'},
    { name: 'actions', align: 'left', label: 'Actions', field: 'actions'}
  ]
   }
  },
  components: {
    modal
  },
  computed : {
    ...mapState('userStore',['users']),
    usersRows(){
      let finalArr = []
      this.users.forEach(element => {
        finalArr.push(JSON.parse(JSON.stringify(element)))
      })
      return finalArr.sort((a,b) =>b['id'] - a['id'] )
    }
  },
  methods:  {
    ...mapActions('userStore', ['deleteUser','getUsers']),
    async delItem(id) {
      await this.deleteUser({id: id});
    },
    edit(body) {
      this.body = body;
      this.dialogue = true;
    }
  },
 async mounted() {
    await this.getUsers();
  }
}
</script>
<style scoped>
div.q-avatar div.q-avatar__content img {
    border: none !important;
}
</style>