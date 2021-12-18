<template>
  <div>
    <q-table
      :rows="clientMeetings"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      class="bg-secondary"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td  key="type" :props="props">
            <p style="font-size: 20px;margin:0 !important;">{{props.row.type}}</p>
          </q-td>
          <q-td key="duration" :props="props">
              {{ props.row.duration }}
          </q-td>
          <q-td key="serviceRequirements" v-html="props.row.serviceRequirements" :props="props">
          </q-td>
          <q-td key="date" :props="props">
              {{ dateConversion(props.row.date) }}
          </q-td>
          <q-td key="currentServiceProvider" :props="props">
              {{ props.row.currentServiceProvider }}
          </q-td>
          <q-td key="nextMeetingDate" :props="props">
              {{ dateConversion(props.row.nextMeetingDate) }}
          </q-td>
         <q-td key="actions" :props="props">
          <q-btn style="z-index:10;" dense round flat icon="more_vert">
            <q-menu
              transition-show="scale"
              transition-hide="scale"
              
            >
              <q-list style="min-width: 75px">
                <q-item @click="deleteMeeting({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                  <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup>
                  <q-item-section @click="openModal(props.row.id, 'Edit')" class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
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
      <modal @closeDialogue="dialogue = false" :cmid="id" :clId="$route.params.id" :actionType="actionType" />
    </q-dialog>
  </div>
</template>

<script>
import AddEditMeeting from './AddEditMeeting.vue'
import { mapActions, mapState } from 'vuex'
import { date } from 'quasar'
export default {
  data() {
    return {
      id: null,
      dialogue: false,
      loading: false,
      actionType: '',
      columns : [
  {
    name: 'type',
    required: true,
    label: 'Type',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    },
    { name: 'duration', align: 'left', label: 'Duration', field: 'duration'},
    { name: 'serviceRequirements', align: 'left', label: 'Requirements', field: 'serviceRequirements'},
    { name: 'date', align: 'left', label: 'Date', field: 'date'},
    { name: 'currentServiceProvider', label: 'Service provider', align: 'left', field: 'currentServiceProvider' },
    { name: 'nextMeetingDate', label: 'Next meeting date', align: 'left', field: 'nextMeetingDate' },
    { name: 'actions', label: 'Actions', align: 'left', field: 'actions'},
  ]
   }
  },
  components: {
    modal: AddEditMeeting
  },
  computed: {
      ...mapState('crmStore', ['clientMeetings'])
  },
  methods: {
    ...mapActions('crmStore',['getClientMeetings', 'removeMeeting']),
    dateConversion(dt) {
      let dtObj = new Date(dt);
      dtObj.setHours(dtObj.getHours() - 3)
       return date.formatDate(dtObj, 'YYYY-MM-DD HH:mm');
    },
   async deleteMeeting(payload) {
         this.loading = true
        await this.removeMeeting({...payload, clientId: this.$route.params.id})
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
   await this.getClientMeetings(this.$route.params.id);
   this.loading=false
  }
}
</script>
