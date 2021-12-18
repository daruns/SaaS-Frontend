<template>
  <div>
    <q-table
      :rows="clientContacts"
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
          <q-td key="position" :props="props">
              {{ props.row.position }}
          </q-td>
          <q-td key="businessPhoneNumber1" :props="props">
              {{ props.row.businessPhoneNumber1 }}
          </q-td>
          <q-td key="businessPhoneNumber2" :props="props">
              {{ props.row.businessPhoneNumber2 }}
          </q-td>
          <q-td key="email" :props="props">
              {{ props.row.email }}
          </q-td>
          <q-td key="description" v-html="props.row.description" :props="props">
          </q-td>
          <q-td key="department" :props="props">
              {{ props.row.department }}
          </q-td>
          <q-td key="status" :props="props">
              {{ props.row.status }}
          </q-td>
         <q-td key="actions" :props="props">
          <q-btn style="z-index:10;" dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item @click="deleteClientContact({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator />
                <q-item @click="openModal(props.row, 'Edit')" clickable v-close-popup>
                 <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-right>
         <q-btn @click="openModal($route.params.id, 'Add')" label="Create Record" no-caps color="primary" unelevated rounded />
      </template>
    </q-table>
    <q-dialog seamless position="right" v-model="dialogue">
      <modal :body="body" @closeDialogue="dialogue = false" :ccid="id" :clId="$route.params.id" :actionType="actionType" />
    </q-dialog>
  </div>
</template>

<script>
import AddEditContact from './AddEditContact.vue'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      body: null,
      id: null,
      dialogue: false,
      loading: false,
      actionType: '',
      columns : [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    },
    { name: 'position', align: 'left', label: 'Position', field: 'position'},
    { name: 'businessPhoneNumber1', align: 'left', label: 'Phone number 1', field: 'businessPhoneNumber1'},
    { name: 'businessPhoneNumber2', align: 'left', label: 'Phone number 2', field: 'businessPhoneNumber2'},
    { name: 'email', label: 'E-Mail', align: 'left', field: 'email' },
    { name: 'description', label: 'Description', align: 'left', field: 'description' },
    { name: 'department', label: 'Department', align: 'left', field: 'department'},
    { name: 'status', label: 'Status', align: 'left', field: 'status'},
    { name: 'actions', label: 'Actions', align: 'left', field: 'actions'},
  ]
   }
  },
  computed: {
      ...mapState('crmStore', ['clientContacts'])
  },
  components: {
    modal: AddEditContact
  },
  methods: {
    ...mapActions('crmStore',['getOneClient','deleteContact']),
    deleteClientContact(payload) {
      this.loading = true
        this.deleteContact({...payload, clientId: this.$route.params.id})
        this.loading = false
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
        return 'background: #fff;'
      },
      openModal(row, type) {
        this.id = row.id
        this.body = row
        this.actionType = type
        this.dialogue = true
      }
  },
 async mounted() {
   this.loading = true
   await this.getOneClient(this.$route.params.id);
   this.loading=false
  }
}
</script>
