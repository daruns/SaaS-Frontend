<template>
  <div>
    <q-table
      :rows="users"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td key="name" :props="props">
            <p style="font-size: 15px;margin:0 !important;">{{props.row.name}}</p>
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
         <q-td key="actions" :props="props">
          <q-btn dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item  @click="openModal(props.row, 'Edit')" clickable v-close-popup>
                 <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-right>
         <q-btn :disable="currentClient.user !== null" @click="openModal({}, 'Add')" label="Create Record" no-caps color="primary" unelevated rounded />
      </template>
    </q-table>
    <q-dialog seamless position="right" v-model="prompt" persistent>
        <modal @closeDialogue="getClient(); prompt = false;" :body="body" :action="action" />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import modal from '../components/AddEditUser.vue'
export default {
  data() {
    return {
    prompt: false,
    loading: false,
    users: [],
    action: '',
    body: {},
    columns : [
    { name: 'name', align: 'left', label: 'Name', field: 'name'},
    { name: 'username', align: 'left', label: 'Username', field: 'username'},
    { name: 'email', align: 'left', label: 'E-mail', field: 'email'},
    { name: 'phoneNumber', label: 'Phone number', align: 'left', field: 'phoneNumber' },
    { name: 'actions', align: 'left', label: 'Actions', field: 'actions'},
  ]
   }
  },
  components: {
      modal
  },
  computed: {
      ...mapState('crmStore', ['currentClient'])
  },
  methods: {
      ...mapActions('crmStore', ['getOneClient']),
    openModal(body, action) {
        this.body = body
        this.action = action
        this.prompt = true
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
        return 'background: #fff;'
      },
    async getClient() {
        await this.getOneClient(this.$route.params.id);

        if(this.currentClient.user){
        this.users = []
        this.users.push(this.currentClient.user);
        }

      }
  },
 async mounted() {
   this.loading = true
   await this.getClient();
   this.loading=false
  }
}
</script>
