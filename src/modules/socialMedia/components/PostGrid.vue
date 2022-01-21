<template>
<q-page class="q-mt-md">
    <div class="row row1">
      <div v-for="(project, i) in projects" :key="i" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pr-sm">
    <q-card flat class="q-mt-sm" bordered style="position: relative !important;">
         <q-btn class="absolute-top-right" dense round flat icon="more_vert">
        <q-menu
          transition-show="scale"
          transition-hide="scale"
          
        >
          <q-list style="min-width: 75px">
            <q-item @click="deleteProject({id: project.id})" style="padding 0 !important" clickable v-close-popup>
              <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
            </q-item>
            <q-separator />
            <q-item @click="body = project; dialogue = true" clickable v-close-popup>
              <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
            </q-item>
          </q-list>
        </q-menu>
         </q-btn>
      <q-card-section class="flex justify-start text-overflow">
        <div  style="max-width: 100% !important;" class="flex column justify-start">
        <router-link style="max-width: 100% !important;color:black;" :to="`/projects/${project.id}`">
        <p class="text-h6 q-mr-none" style="min-width:80% !important;white-space: nowrap;overflow:hidden !important;text-overflow: ellipsis !important;">{{project.name}}</p>
        </router-link>

        <p class="text-subtitle2 q-mb-none">Deadline:</p>
        <p class="text-grey">{{project.plannedEndDate.split('T')[0]}}</p>
        <p class="text-subtitle2 q-mb-sm">Project Leader:</p>
        <div class="row q-mb-lg">
          <div class="q-mr-xs q-mt-xs q-mb-xs" v-for="leader in project.leaderUsers.slice(0,2)" :key="leader.id">
            <q-avatar size="30px">
            <q-btn @click="deleteProjectLeader({id:project.id, leaders: [leader.userId]})" round size="5px" icon="close" color="negative" class="absolute-top-right"/>
            <img src="~/assets/one_logo_neat.png">
            <q-tooltip>
                {{leader.name}}
                </q-tooltip>
            </q-avatar>
          </div>
                  <p v-if="project.leaderUsers.length > 2" class="text-subtitle1 q-pt-xs q-ma-none text-grey">....+{{project.leaderUsers.length - 2}}</p>
                  <div class="flex justify-center items-start q-mt-xs" :class="project.leaderUsers.length > 2 && 'q-ml-xs'">
                    <q-btn @click="getLeaderOptions(project)" round size="10px" text-color="black" unelevated color="grey-4" icon="add">
                        <q-popup-edit v-model="leaders" style="min-width: 15rem !important;" :cover="false" :offset="[0, 10]" v-slot="scope">
                        <q-select
                            :rules="[val => (val !== null) || 'This field is required']"
                            bg-color="white"
                            outlined
                            counter
                            multiple
                            use-chips
                            v-model="leaders" 
                            :options="options"
                            label="Choose leaders"
                            :disable="options.length === 0"
                            :hint="options.length === 0 ? 'All users has been added' : ''"
                          >
                            <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section class="avatar-list">
                                <q-avatar class="q-mr-xs" size="30px">
                                   <img src="~/assets/one_logo_neat.png">
                                </q-avatar>
                                <q-item-label>{{ scope.opt.label }}</q-item-label>       
                                </q-item-section>
                            </q-item>
                            </template>
                        </q-select>
                        <q-btn class="q-mt-xs q-mb-xs" @click="addProjectLeaders(project.id)" no-caps flat label="submit" color="primary" :disable="leaders.length === 0" v-close-popup />
                        </q-popup-edit>
                    </q-btn>
            </div>
        </div>
        <p class="text-subtitle2 q-mb-sm">Team:</p>
        <div class="row">
            <q-avatar class="q-mr-xs" v-for="member in project.memberUsers.slice(0,2)" :key="member.id" size="30px">
            <q-btn @click="deleteProjectMember({id:project.id, members: [member.userId]})" round size="5px" icon="close" color="negative" class="absolute-top-right"/>
            <img src="~/assets/one_logo_neat.png">
            <q-tooltip>
                {{member.name}}
                </q-tooltip>
            </q-avatar>
            <p v-if="project.memberUsers.length > 2" class="text-subtitle1 q-pa-none q-ma-none text-grey">....+{{project.memberUsers.length - 2}}</p>
                  <div class="flex justify-center items-start" :class="project.memberUsers.length > 2 && 'q-ml-xs'">
                    <q-btn @click="getUserOptions(project)" round size="10px" text-color="black" unelevated color="grey-4" icon="add">
                        <q-popup-edit v-model="members" style="min-width: 15rem !important;" :cover="false" :offset="[0, 10]" v-slot="scope">
                        <q-select
                            ref="clientRef"
                            :rules="[val => (val !== null) || 'This field is required']"
                            bg-color="white"
                            outlined
                            counter
                            multiple
                            use-chips
                            v-model="members" 
                            :options="options"
                            label="Choose members"
                            :disable="options.length === 0"
                            :hint="options.length === 0 ? 'All users has been added' : ''"
                          >
                            <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section class="avatar-list">
                                <q-avatar class="q-mr-xs" size="30px">
                                   <img src="~/assets/one_logo_neat.png">
                                </q-avatar>
                                <q-item-label>{{ scope.opt.label }}</q-item-label>       
                                </q-item-section>
                            </q-item>
                            </template>
                        </q-select>
                        <q-btn @click="addProjectMembers(project.id)" no-caps flat label="submit" color="primary" :disable="members.length === 0" v-close-popup />
                        </q-popup-edit>
                    </q-btn>
                    </div>
        </div>
        </div>
      </q-card-section>
    </q-card>
      </div>
    </div>
    <q-dialog seamless position="right" v-model="dialogue">
        <modal @closeDialogue="dialogue = false" actionType="Edit" :body="body" />
    </q-dialog>
    </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import modal from './AddPost.vue'
export default {
  computed: {
    ...mapState('projectStore', ['projects']),
    ...mapState('userStore', ['users'])
  },
  components : {
    modal
  },
  data() {
    return {
      loading: false,
      dialogue: false,
      id: '',
      body:{},
      options: [],
      members: [],
      leaders: []
   }
  },
  methods: {
    ...mapActions('projectStore',['getProjects','deleteProject','addProjectMember','deleteProjectMember','addProjectLeader','deleteProjectLeader']),
    ...mapActions('userStore',['getUsers']),
   async addProjectMembers(id) {
      let membersToAdd = []
      for(let i = 0; i<this.members.length; i++) {
        membersToAdd.push(this.members[i].id);
      }
      await this.addProjectMember({id:id, members: membersToAdd});
      this.members = [];
    },
  async addProjectLeaders(id) {
      let leadersToAdd = []
      for(let i = 0; i<this.leaders.length; i++) {
        leadersToAdd.push(this.leaders[i].id);
      }
      await this.addProjectLeader({id:id, leaders: leadersToAdd});
      this.leaders = [];
    },
      getUserOptions(payload) {
      let optionsA = [];
      let optionsB = [];
      this.options = [];
      setTimeout(() => {
      if(!payload) return
      for(let i = 0; i<this.users.length; i++) {
      for(let j = 0; j<payload.memberUsers.length; j++) {
        if(Number(payload.memberUsers[j].userId) === Number(this.users[i].id)){
          optionsB.push({id:this.users[i].id, label: this.users[j].name});
        }
      }
          optionsA.push({id:this.users[i].id, label: this.users[i].name});
      }
      this.options = optionsA.filter(({ id: id1 }) => !optionsB.some(({ id: id2 }) => id2 === id1));
      }, 200);
    },
     getLeaderOptions(payload) {
      let optionsA = [];
      let optionsB = [];
      this.options = [];
      setTimeout(() => {
      if(!payload) return
      for(let i = 0; i<this.users.length; i++) {
      for(let j = 0; j<payload.leaderUsers.length; j++) {
        if(Number(payload.leaderUsers[j].userId) === Number(this.users[i].id)){
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
   this.loading = true
   await this.getProjects();
   await this.getUsers();
   this.loading = false

  }
}
</script>
<style scoped>
@media (max-width: 652px) { 
  .row1 {
    justify-content: center !important;
  }
}

div.q-avatar div.q-avatar__content img {
    border: none !important;
}
</style>
