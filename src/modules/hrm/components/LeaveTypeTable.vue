<template>
  <div>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :rows-per-page-options="[20,50,100,0]"
      flat
      class="bg-secondary q-pa-md"
    >
      <template v-slot:body="props">
        <q-tr :class="props.rowIndex%2 !== 0 && 'bg-white'" :props="props">
          <q-td class="items-center justify-start" key="name" :props="props">
            <p style="font-size: 20px;">{{props.row.name}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="fund" :props="props">
            <p style="font-size: 20px;">{{props.row.fund}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="duration" :props="props">
            <p v-if="props.row.durationType === 'days'" style="font-size: 20px;">{{props.row.days}} Days</p>
            <p v-if="props.row.durationType === 'hours'" style="font-size: 20px;">{{props.row.hours}} Hours</p>
          </q-td>
          <q-td class="items-center justify-start" key="urgent" :props="props">
            <p v-if="props.row.urgent" style="font-size: 20px;"><q-icon name="done" /></p>
          </q-td>
          <q-td class="text-right" key="urgent" :props="props">
            <q-btn v-if="canActivate('subject_hrm','update') || canActivate('subject_hrm','delete')" dense round flat icon="more_vert">
              <q-menu
                transition-show="scale"
                transition-hide="scale"
              >
                <q-list style="min-width: 75px">
                  <q-item v-if="canActivate('subject_hrm','delete')"  @click="deleteLeaveType({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                    <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item  v-if="canActivate('subject_hrm','update')" @click="editLeaveType(props.row)" clickable v-close-popup>
                    <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog @closeDialogue="dialogue = false" :inProfile="false" seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" :body="body" :id="id" actionType="Edit" />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AddEditLeaveType from './AddEditLeaveType.vue';
export default {
  computed: {
    ...mapState('hrmStore', ['leaveTypes']),
    data(){
      return this.leaveTypes
    }
  },

  data() {
    return {
      canActivate: this.$canActivate,
      body: null,
      id: null,
      dialogue: false,
      loading: false,
      columns : [
        { name: 'name', label: 'Name', align: 'left', field: 'name' },
        { name: 'fund', label: 'Salary Deduction', align: 'left', field: 'fund' },
        { name: 'duration', label: 'Duration Limit', align: 'left', field: 'duration' },
        { name: 'urgent', label: 'Is Urgent', align: 'left', field: 'name' },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions'}
      ]
    }
  },
  components: {
    modal: AddEditLeaveType
  },
  methods: {
    ...mapActions('hrmStore',['getDesignations', 'getLeaveTypes','deleteLeaveType']),
    editLeaveType(department) {
        if(this.dialogue === true){
          this.dialogue = false;
          setTimeout(() => {
             this.body = department
            this.dialogue = true
          }, 200);
          return
        }
         this.body = department
        this.dialogue = true
    },
     rowColor(props) {
        if(props.rowIndex%2 !== 0 || props.rowIndex !== 0  )
        return 'background: #fff;'
      }
  },
 async mounted() {
   this.loading = true
   await this.getLeaveTypes();
   this.loading=false
  }
}
</script>