<template>
  <div>
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
          <q-td class="items-center justify-start" key="name" :props="props">
            <p style="font-size: 20px;">{{props.row.name}}</p>
          </q-td>
          <q-td class="items-center justify-start" key="department" :props="props">
            <p style="font-size: 20px;">{{props.row.department?.name}}</p>
          </q-td>
          <q-td class="text-right" key="department" :props="props">
            <q-btn dense round flat icon="more_vert">
              <q-menu
                transition-show="scale"
                transition-hide="scale"
              >
                <q-list style="min-width: 75px">
                  <q-item @click="deleteDesignation({id: props.row.id})" style="padding 0 !important" clickable v-close-popup>
                    <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item @click="editDesignation(props.row)" clickable v-close-popup>
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
import AddEditDesignation from './AddEditDesignation.vue';
export default {
  computed: {
    ...mapState('hrmStore', ['designations']),
    data(){
      return this.designations
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
        { name: 'department', label: 'Department', align: 'left', field: 'department' },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions'}
      ]
    }
  },
  components: {
    modal: AddEditDesignation
  },
  methods: {
    ...mapActions('hrmStore',['getDesignations', 'deleteDesignation']),
    editDesignation(department) {
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
   await this.getDesignations();
   this.loading=false
  }
}
</script>