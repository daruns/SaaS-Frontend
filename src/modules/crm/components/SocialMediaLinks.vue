<template>
  <div>
    <q-table
      :rows="clientSocialLinks"
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
          <q-td key="linkAddress" :props="props">
              {{ props.row.linkAddress }}
          </q-td>
          <q-td key="addressDomain" :props="props">
              {{ props.row.addressDomain }}
          </q-td>
          <q-td key="status" :props="props">
              {{ props.row.status }}
          </q-td>
         <q-td key="actions" :props="props">
          <q-btn dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item @click="deleteSocialLink(props.row.id)" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator />
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
         <q-btn @click="openModal({}, 'Add')" label="Create Record" no-caps color="primary" unelevated rounded />
      </template>
    </q-table>
    <q-dialog seamless position="right" v-model="prompt" persistent>
        <modal @closeDialogue="prompt = false" :body="body" :action="action" />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import modal from '../components/AddEditSocial.vue'
export default {
  data() {
    return {
    prompt: false,
    loading: false,
    action: '',
    body: {},
    columns : [
    { name: 'name', align: 'left', label: 'Name', field: 'name'},
    { name: 'linkAddress', align: 'left', label: 'Link address', field: 'linkAddress'},
    { name: 'addressDomain', label: 'Address domain', align: 'left', field: 'addressDomain' },
    { name: 'status', align: 'left', label: 'Status', field: 'status'},
    { name: 'actions', align: 'left', label: 'Actions', field: 'actions'},
  ]
   }
  },
  components: {
      modal
  },
  computed: {
      ...mapState('crmStore', ['clientSocialLinks'])
  },
  methods: {
    ...mapActions('crmStore',['getOneClient','deleteSocial']),
    openModal(body, action) {
        this.body = body
        this.action = action
        this.prompt = true
    },
    deleteSocialLink(id) {
      this.loading = true
       this.deleteSocial({id: Number(id), clientId: this.$route.params.id})
      this.loading = false
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
        return 'background: #fff;'
      }
  },
 async mounted() {
   this.loading = true
   await this.getOneClient(this.$route.params.id);
   this.loading=false
  }
}
</script>
