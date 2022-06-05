<template>
<q-page class="q-pt-sm">
    <div class="row items-center q-pa-sm" >
      <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" v-for="(employee, i) in data" :key="i">
      <q-card flat bordered style="position: relative !important;" class="my-card">
        <q-btn  v-if="canActivate('subject_hrm','delete') || canActivate('subject_hrm','update')" style="z-index:2;" class="absolute-top-right" dense round flat icon="more_vert">
          <q-menu
            transition-show="scale"
            transition-hide="scale"
          >
            <q-list style="min-width: 75px">
              <q-item  v-if="canActivate('subject_hrm','delete')"  @click="deleteEmployee({id: employee.id})" style="padding 0 !important" clickable v-close-popup>
                <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
              </q-item>
              <q-separator  v-if="canActivate('subject_hrm','delete') && canActivate('subject_hrm','update')"  />
              <q-item  v-if="canActivate('subject_hrm','update')"  @click="editEmployee(employee)" clickable v-close-popup>
                <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-card-section class="flex flex-center">
          <div class="flex justify-between column flex-center">
            <router-link class="q-pb-md" :to="`/hrm/employee/${employee.id}`">
            <q-avatar v-if="employee.user?.avatar" size="100px" font-size="52px">
              <img :src="employee.user?.avatar" />
            </q-avatar>
            <q-avatar v-else size="100px" font-size="52px" color="grey" text-color="white" icon="person" />
            </router-link>
            <p class="text-span text-center text-black text-bold">{{employee.name}}</p>
            <p class="text-span text-center text-grey">{{employee.designation?.name}}</p>
            <p class="text-span text-center text-grey">{{employee.designation?.department?.name}}</p>
          </div>
        </q-card-section>
        <q-card-actions align="center">
        <router-link :to="`/hrm/employee/${employee.id}`"><q-btn color="primary" class="q-mb-md" outline no-caps>View Profile</q-btn></router-link>
        </q-card-actions>
      </q-card>
      </div>
      <div class="flex flex-center col-12 q-pa-sm" v-if="data.length === 0">
        No data found
      </div>
    </div>
    <q-dialog seamless position="right" v-model="dialogue">
      <modal @closeDialogue="dialogue = false" :type="type" :inProfile="false" :body="body" actionType="Edit" :id="id" />
    </q-dialog>
  </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AddEditEmployee from './AddEditEmployee.vue'
export default {
  components: {
    modal: AddEditEmployee
  },
  props: [],
  computed: {
    ...mapState('hrmStore', ['allEmployees']),
    data(){
      return this.allEmployees
    }
  },
  data() {
    return {
        canActivate: this.$canActivate,
      loading: false,
      dialogue: false,
      id: '',
      body: null,
      options: []
    }
  },
  methods: {
    ...mapActions('hrmStore',['getEmployees', 'deleteEmployee']),
    editEmployee(employee) {
      if(this.dialogue === true){
        this.dialogue = false;
        setTimeout(() => {
          this.body = employee
          this.dialogue = true
        }, 200);
        return
      }
      this.body = employee
      this.dialogue = true
    },
    getUserOptions(payload) {
      let optionsA = [];
      let optionsB = [];
      this.options = [];
      setTimeout(() => {
        if(!payload) return
        for(let i = 0; i<this.users.length; i++) {
          for(let j = 0; j<payload.members.length; j++) {
            if(Number(payload.members[j].memberId) === Number(this.users[i].id)){
              optionsB.push({id:this.users[i].id, label: this.users[j].name});
            }
          }
          optionsA.push({id:this.users[i].id, label: this.users[i].name});
        }
        this.options = optionsA.filter(({ id: id1 }) => !optionsB.some(({ id: id2 }) => id2 === id1));
      }, 200);
    },
  },
  async mounted() {
    if (!this.canActivate('subject_hrm','read') ) return
    this.loading = true
    await this.getEmployees();
    this.loading = false
  }
}
</script>
<style scoped>
@media (max-width: 652px) { 
  .row {
    justify-content: center !important;
  }
}
</style>