<template>
  <div>
          <!-- :title="type === 'blacklist' ? type[0].toUpperCase()+type.substr(1, type.length): type[0].toUpperCase()+type.substr(1, type.length)+'s'" -->
    <q-table
      :rows="data"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary q-pa-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td key="logo" :props="props">
            <router-link :to="`/client/${props.row.id}`">
            <q-avatar v-if="props.row.logo" size="30px">
            <img :src="props.row.logo">
            </q-avatar>
            <q-avatar v-else size="30px" font-size="20px" color="grey" text-color="white" icon="person" />
            </router-link>
          </q-td>
          <q-td class="flex items-center justify-start" key="name" :props="props">
            <router-link class="text-black" :to="`/client/${props.row.id}`">
            <p style="font-size: 20px;">{{props.row.name}}</p>
            </router-link>
          </q-td>
          <q-td key="phoneNumber1" :props="props">
              {{ props.row.phoneNumber1 }}
          </q-td>
          <q-td key="businessType" :props="props">
              {{ props.row.businessType }}
          </q-td>
          <q-td key="email" :props="props">
              {{ props.row.email }}
          </q-td>
          <q-td key="website" :props="props">
              {{ props.row.website }}
          </q-td>
          <q-td key="address" :props="props">
              {{ props.row.address }}
          </q-td>
            <q-td key="rate" :props="props">
              {{ props.row.rate }}
          </q-td>
          <q-td key="zipCode" :props="props">
              {{ props.row.zipCode }}
            </q-td>
          <q-td class="row flex text-center" key="zipCode" :props="props">
          <q-btn dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
            >
              <q-list style="min-width: 75px">
                <q-item @click="deleteClient({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator />
                <q-item @click="editClient(props.row)" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <router-link :to="`/client/${props.row.id}`">
          <q-btn dense text-color="dark" round flat icon="visibility" />
          </router-link>
          </q-td>
        </q-tr>
      </template>
      <!-- <template v-slot:top>
       <h4>Clients</h4>
        <q-space />
        <q-input rounded label="Search" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template> -->

    </q-table>
    <q-dialog @closeDialogue="dialogue = false" :inProfile="false" seamless position="right" v-model="dialogue">
        <modal :type="type" :body="body" :id="id" actionType="Edit" />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AddEditClient from './AddEditClient.vue';
export default {
  props: ['type'],
  computed: {
    ...mapState('crmStore', ['clients', 'leads', 'blacklist']),
        data(){
     if(this.type === 'client'){
      return this.clients
    }else if(this.type === 'lead'){
      return this.leads
    }
    else{
      return this.blacklist
    }
    }
  },

  data() {
    return {
      body: null,
      id: null,
      dialogue: false,
      loading: false,
      columns : [
    {
    name: 'logo',
    required: true,
    label: '#',
    align: 'center',
    field: row => row.name,
    format: val => `${val}`,
  },
  {
    name: 'name',
    required: true,
    label: 'Company/Individual',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    },
    { name: 'phoneNumber1', align: 'left', label: 'Phone number 1', field: 'phoneNumber1'},
    { name: 'businessType', label: 'Business type', align: 'left', field: 'businessType' },
    { name: 'email', label: 'E-mail', align: 'left', field: 'email' },
    { name: 'website', label: 'Website', align: 'left', field: 'website'},
    { name: 'address', label: 'Address', align: 'left', field: 'address'},
    { name: 'rate', label: 'Rate', align: 'left', field: 'rate'},
    { name: 'zipCode', label: 'Zip code', align: 'left', field: 'zipCode'},
    { name: 'actions', label: 'Actions', align: 'left', field: 'actions'}
  ]
   }
  },
  components: {
      modal: AddEditClient
  },
  methods: {
    ...mapActions('crmStore',['getClients', 'deleteClient']),
    editClient(client) {
        if(this.dialogue === true){
          this.dialogue = false;
          setTimeout(() => {
             this.body = client
            this.dialogue = true
          }, 200);
          return
        }
         this.body = client
        this.dialogue = true
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
        return 'background: #fff;'
      }
  },
 async mounted() {
   this.loading = true
   await this.getClients(this.type);
   this.loading=false
  }
}
</script>