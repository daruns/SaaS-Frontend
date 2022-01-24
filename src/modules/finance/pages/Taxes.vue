<template>
  <q-page class="q-py-none q-my-none">
  <div class="full-width flex justify-between items-center q-px-md header-height-standard" style="border-bottom: 1px solid lightgrey;">
    <div class="text-h4">Tax Types</div>
    <div class="flex items-center">
      <q-btn @click="actionType = 'Add';dialogue = true" color="primary" label="Create Record" unelevated rounded no-caps />
    </div>
  </div>
  <breadcrumps class="q-pa-md" :map="crumps" />
  <div class="q-px-md">
    <q-table
      :rows="taxes"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pt-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td key="name" :props="props">
            <p style="font-size: 15px;margin:0 !important;">{{props.row.name}}</p>
          </q-td>
          <q-td key="type" :props="props">
              {{ props.row.type }}
          </q-td>
          <q-td key="rate" :props="props">
              {{ props.row.rate }}
          </q-td>
          <q-td key="description" v-html="props.row.description" :props="props">
          </q-td>
         <q-td key="actions" :props="props">
          <q-btn dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item @click="delTax(props.row.id)" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator />
                <q-item @click="body = props.row;actionType = 'Edit';dialogue = true" clickable v-close-popup>
                 <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
    <q-dialog seamless position="right" v-model="dialogue" persistent>
          <modal @closeDialogue="dialogue = false; getTaxes();" :actionType="actionType" :body="body" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import modal from '../components/AddEditTax.vue'
export default {
  data() {
    return {
      id: null,
      dialogue: false,
      loading: false,
      actionType: '',
      body: null,
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Tax',icon: 'receipt_long',path: '/finance/taxes'}
      ],
      columns : [
        {
            name: 'name',
            required: true,
            label: 'Name',
            align: 'left',
            field: row => row.name,
            format: val => `${val}`,
            },
            { name: 'type', align: 'left', label: 'Type', field: 'type'},
            { name: 'rate', align: 'left', label: 'Rate%', field: 'rate'},
            { name: 'description', label: 'Description', align: 'left', field: 'description' },
            { name: 'actions', label: 'Actions', align: 'left', field: 'actions'},
        ]
        }
  },
  computed: {
      ...mapState('financeStore', ['taxes'])
  },
  components: {
      breadcrumps,
      modal
  },
  methods: {
    ...mapActions('financeStore',['getTaxes','deleteTax']),
   async delTax(id) {
      await this.deleteTax({id: id})
    },
    deleteClientContact(payload) {
      this.loading = true
        this.deleteContact({...payload, clientId: this.$route.params.id})
        this.loading = false
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
        return 'background: #fff;'
      },
      openModal(id, type) {
        this.id = id
        this.actionType = type
        this.dialogue = true
      }
  },
 async mounted() {
   this.loading = true
   await this.getTaxes();
   this.loading=false
  }
}
</script>
