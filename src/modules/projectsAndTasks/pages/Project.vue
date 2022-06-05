<template>
  <q-page class="q-py-none q-my-none">
    <div class="full-width flex justify-between items-center q-px-md header-height-standard" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Project</div>
      <div class="flex items-center">
        <q-btn v-if="canActivate('subject_projects','update')" @click="dialogue = true" color="grey-5" flat icon="edit" round/>
        <q-separator color="grey-5"/>
        <q-btn v-if="canActivate('subject_projects','update')" @click="allowQuickEdit = !allowQuickEdit" :color="allowQuickEdit ? 'primary' : 'grey-5'" flat label="Quick Edit" />
      </div>
    </div>
    <div v-if="!canActivate('subject_projects','read')"><Forbidden /></div>
    <q-scroll-area v-else-if="!loading" style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);" class="q-px-md">
      <div class="col-12 row flex q-my-sm">
        <div class="q-mb-sm row flex col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div class="col-lg-12 flex row col-md-6 col-sm-6 col-xs-12 q-pr-md q-py-md">
            <q-card class="col-6 q-pa-md">
              <div class="text-h4">Title: {{project?.name}}</div>
            </q-card>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pr-sm">
            <q-card class="q-pa-md">
              <p v-if="project.leaderUsers?.length !== 0" class="text-h6">Assigned Team Leaders</p>
              <p v-if="project.leaderUsers?.length === 0" class="text-subtitle1 text-grey-5">No leaders assigned.</p>
            <q-btn v-if="canActivate('subject_projects','update')" :disable="!allowQuickEdit" @click="getLeaderOptions(project)" class="absolute-bottom-right q-mr-sm q-mb-sm" size="10px" color="primary" round icon="add" unelevated rounded no-caps>
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
                        <q-avatar class="q-mr-xs" size="40px">
                            <img v-if="scope.opt.avatar" :src="scope.opt.avatar">
                            <img v-else src="~/assets/one_logo_neat.png">
                        </q-avatar>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    </template>
                </q-select>
                <q-btn @click="addProjectLeaders(project.id)" no-caps flat label="submit" color="primary" :disable="leaders.length === 0 || !allowQuickEdit" v-close-popup />
              </q-popup-edit>
            </q-btn>
            <div v-if="project.leaderUsers.length !== 0" class="row" >
              <q-chip @remove="leaderId = leader.userId; deleteLeaderConfirm = true" v-for="(leader,i) in project.leaderUsers" :key="leader.userId"  :removable="allowQuickEdit">
                <q-avatar>
                  <img v-if="leader.avatar" :src="leader.avatar">
                  <img v-else src="~/assets/one_logo_neat.png">
                </q-avatar>
                {{leader.name}}
              </q-chip>
            </div>
            </q-card>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pl-sm">
            <q-card class="q-pa-md">
            <p v-if="project.memberUsers.length !== 0" class="text-h6">Assigned Team Members</p>
            <p v-if="project.memberUsers.length === 0" class="text-subtitle1 text-grey-5">No members assigned.</p>
            <q-btn v-if="canActivate('subject_projects','update')" :disable="!allowQuickEdit" @click="getUserOptions(project)" class="absolute-bottom-right q-mr-sm q-mb-sm" size="10px" color="primary" round icon="add" unelevated rounded no-caps>
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
                      <q-avatar class="q-mr-xs" size="40px">
                        <img v-if="scope.opt.avatar" :src="scope.opt.avatar">
                        <img v-else src="~/assets/one_logo_neat.png">
                      </q-avatar>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                  </q-item>
                  </template>
                </q-select>
                <q-btn @click="addProjectMembers(project.id)" no-caps flat label="submit" color="primary" :disable="members.length === 0 || !allowQuickEdit" v-close-popup />
              </q-popup-edit>
            </q-btn>
            <div v-if="project.memberUsers.length !== 0" class="row">
              <q-chip @remove="memberId = member.userId; deleteMemberConfirm = true;" v-for="(member,i) in project.memberUsers" :key="member.userId" :removable="allowQuickEdit && canActivate('subject_projects','delete')">
              <q-avatar>
                <img v-if="member.avatar" :src="member.avatar">
                <img v-else src="~/assets/one_logo_neat.png">
              </q-avatar>
                {{member.name}}
              </q-chip>
            </div>
            </q-card>
          </div>
        </div>
        <div class="q-my-sm col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-card class="flex items-center row q-pa-md">
            <div class="text-h6">Deadline:</div>
            <div class="text-subtitle1 q-px-md">{{project.plannedEndDate && project.plannedEndDate.split('T')[0]}}</div>
            <div class="text-h6">Priority:</div>
            <div class="text-subtitle1 q-px-md">{{project.priority}}</div>
            <div class="text-grey col-12 wrapword" v-html="project.description"></div>
          </q-card>
        </div>
      </div>
      <div class="col-12 row flex q-my-sm">
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pr-sm">
          <q-card class="q-pa-md q-mt-md">
            <p v-show="images.length !== 0" class="text-h6 text-grey q-mt-lg">Uploaded images</p>
            <p v-show="images.length === 0" class="text-subtitle1 text-grey-5">No images has been uploaded.</p>
            <div v-show="images.length !== 0"  class="row q-pb-xl">
              <div v-for="(file) in images" :key="file.attachId" >
                <div class="flex column flex-center q-pr-md q-pt-md">
                  <q-avatar square size="100px">
                    <q-badge v-if="canActivate('subject_projects','delete')" style="background: transparent !important;" transparent floating>
                      <q-btn  :disabled="!allowQuickEdit" @click="fileId = file.attachId; confirm = true" round size="7.5px" icon="delete" color="negative" class="absolute-top-right"/>
                    </q-badge>
                    <img :src="file.url" />
                  </q-avatar>
                  <p class="text-center text-caption text-black" style="max-width: 100px;">{{file.name}}</p>
                  <a :href="file.url" target="_blank">
                    <q-btn class="text-primary bg-blue-1" unelevated label="Download" no-caps/>
                  </a>
                </div>
              </div>
            </div>
            <q-btn v-if="canActivate('subject_projects','update')" :disable="!allowQuickEdit" label="Upload images" icon="backup" color="grey" no-caps push flat unelevated class="absolute-bottom-right q-mr-sm q-mb-sm">
              <q-popup-proxy>
                <q-banner>
                  <q-file :filter="checkType" @rejected="onRejectedImage" clearable label="Image" outlined v-model="image">
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                  <q-btn v-close-popup label="Upload" @click="addProjectFile('image'); image = null" :disable="!image" no-caps flat color="primary" class="q-mt-sm" size="md" />
                </q-banner>
              </q-popup-proxy>
            </q-btn>
          </q-card>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pl-sm">
          <q-card class="q-pa-md q-mt-md">
            <p v-show="files.length !== 0" class="text-h6 text-grey q-mt-lg">Uploaded files</p>
            <p v-show="files.length === 0" class="text-subtitle1 text-grey-5">No files has been uploaded.</p>
            <div v-show="files.length !== 0" class="row q-pb-xl">
              <div v-for="(file) in files" :key="file.attachId">
                <div  class="flex column flex-center q-pr-md q-pt-md">
                  <q-avatar square size="100px"> 
                    <q-badge  v-if="canActivate('subject_projects','delete')" style="background: transparent !important;" transparent floating>
                      <q-btn :disable="!allowQuickEdit" @click="fileId = file.attachId; confirm = true" round size="7.5px" icon="delete" color="negative" class="absolute-top-right"/>
                    </q-badge>
                    <q-icon  color="grey" name="attach_file" />
                  </q-avatar>
                  <p class="text-center text-caption text-black" style="max-width: 100px;">{{file.name}}</p>
                  <a :href="file.url" target="_blank">
                    <q-btn class="text-primary bg-blue-1" unelevated label="Download" no-caps/>
                  </a>
                </div>
              </div>
            </div>
            <q-btn v-if="canActivate('subject_projects','update')" :disable="!allowQuickEdit" label="Upload files" icon="backup" color="grey" no-caps push flat unelevated class="absolute-bottom-right q-mr-sm q-mb-sm">
              <q-popup-proxy>
                <q-banner>
                  <q-file :filter="checkFileType" @rejected="onRejectedFile" clearable label="File" outlined v-model="file">
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                  <q-btn v-if="canActivate('subject_projects','update')" v-close-popup label="Upload" @click="addProjectFile('file'); file = null" no-caps :disable="!file" flat color="primary" class="q-mt-sm" size="md" />
                </q-banner>
              </q-popup-proxy>
            </q-btn>
          </q-card>
        </div>
      </div>
    </q-scroll-area>
    <div v-else style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);" class="q-px-md flex items-center justify-between row flex-center">
      <div class="q-pa-sm col-6"> <q-skeleton style="height:30vh"/></div>
      <div class="q-pa-sm col-6"> <q-skeleton style="height:30vh"/></div>
      <div class="q-pa-sm col-12"> <q-skeleton style="height:30vh"/></div>
      <div class="q-pa-sm col-6"> <q-skeleton style="height:30vh"/></div>
      <div class="q-pa-sm col-6"> <q-skeleton style="height:30vh"/></div>

    </div>
    <q-dialog v-model="confirm" persistent>
      <confirm @confirm="deleteProjectFileFun" />
    </q-dialog>
    <q-dialog v-model="deleteLeaderConfirm" persistent>
      <confirm @confirm="deleteLeader({id: project.id, leaders: [leaderId]})" />
    </q-dialog>
    <q-dialog v-model="deleteMemberConfirm" persistent>
      <confirm @confirm="deleteMember({id: project.id, members: [memberId]})" />
    </q-dialog>
    <q-dialog seamless position="right" v-model="dialogue">
      <modal @closeDialogue="getProjectRefresh(); dialogue = false" actionType="Edit" :body="project" />
    </q-dialog>
    <!-- <p class="text-caption text-grey-7 q-ma-none" v-show="project.leaderUsers.length !== 0">Assigned Leaders:</p> -->
  </q-page>
</template>
<script>
import axios from 'axios';
import breadcrmps from '../../../components/globalComponents/BreadCrumps.vue';
import modal from '../components/AddEditProject.vue';
import confirm from '../../../components/DeleteDialogue.vue'
import { mapActions, mapState } from 'vuex';
import Forbidden from 'src/components/globalComponents/Forbidden.vue';
export default {
components :{
    breadcrmps,
    modal,
    confirm,
    Forbidden
},
 data() {
   return {
    canActivate: this.$canActivate,
    allowQuickEdit: false,
    members: [],
    leaders: [],
    options: [],
    confirm: false,
    deleteMemberConfirm: false,
    deleteLeaderConfirm: false,
    dialogue: false,
    loading: false,
    memberId: null,
    leaderId: null,
    files: [],
    images: [],
    fileId: null,
    crumps: [
      {id:1,name:'OneConnect',icon: 'home',path: '/'},
      {id:2,name:'Project',icon: undefined,path: '/projects'}
    ],
    file: null,
    image: null
   }
 },
  computed: {
    ...mapState('userStore', ['users']),
    ...mapState('projectStore', ['project'])
  },
  methods: {
    ...mapActions('projectStore',['addFiles','addProjectMember','deleteProjectMember','addProjectLeader','deleteProjectLeader','getProject','deleteProjectFile']),
    ...mapActions('userStore',['getUsers']),
    async deleteProjectFileFun() {
      await this.deleteProjectFile({id: this.project.id, attachId:this.fileId})
      await this.getProjectRefresh();
    },
    checkType (files) {
      return files.filter(file => file.type.includes('image'))
    },
    checkFileType (files) {
      return files.filter(file => !file.type.includes('image'))
    },
    onRejectedImage() {
      this.$q.notify({
        type: 'negative',
        message: 'Only images are allowed!'
      })
    },
    onRejectedFile() {
      this.$q.notify({
        type: 'negative',
        message: 'Only files are allowed!'
      })
    },
    async addProjectMembers(id) {
      let membersToAdd = []
      for(let i = 0; i<this.members.length; i++) {
        membersToAdd.push(this.members[i].id);
      }
      await this.addProjectMember({id:id, members: membersToAdd});
      this.members = [];
      await this.getProjectRefresh();
    },
    async deleteMember(payload) {
      await this.deleteProjectMember(payload);
      await this.getProjectRefresh();
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
          optionsB.push({id:this.users[i].id,avatar: this.users[j].avatar , label: this.users[j].name});
        }
      }
          optionsA.push({id:this.users[i].id,avatar: this.users[i].avatar , label: this.users[i].name});
      }
      this.options = optionsA.filter(({ id: id1 }) => !optionsB.some(({ id: id2 }) => id2 === id1));
      }, 200);
    },
    async addProjectLeaders(id) {
      let leadersToAdd = []
      for(let i = 0; i<this.leaders.length; i++) {
        leadersToAdd.push(this.leaders[i].id);
      }
      await this.addProjectLeader({id:id, leaders: leadersToAdd});
      this.leaders = [];
      await this.getProjectRefresh();

    },
    async deleteLeader(payload) {
      await this.deleteProjectLeader(payload);
      await this.getProjectRefresh();
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
          optionsB.push({id:this.users[i].id,avatar: this.users[j].avatar , label: this.users[j].name});
        }
      }
          optionsA.push({id:this.users[i].id,avatar: this.users[i].avatar , label: this.users[i].name});
      }
      this.options = optionsA.filter(({ id: id1 }) => !optionsB.some(({ id: id2 }) => id2 === id1));
      }, 200);
    },
    async addProjectFile(type) {
      let data = new FormData();
      data.append('id', this.project.id);
      if(type === 'file')
      data.append('files', this.file);
      else
      data.append('files', this.image);

      await this.addFiles(data);
      await this.getProjectRefresh();
    },
    async getProjectRefresh() {
      await this.getProject(this.$route.params.id)
      this.crumps[1].name = this.project?.name;
      this.fileAndImages()
    },
    fileAndImages() {
      this.files = [];
      this.images = [];
      for(let i = 0; i<this.project.attachments?.length; i++) {
        if(this.project.attachments[i].contentType?.includes('image'))
        this.images.push(this.project.attachments[i]);
        else
        this.files.push(this.project.attachments[i]);
      }
    }
  },
  async mounted() {
    await this.getProject(this.$route.params.id)
    if (!this.canActivate('subject_projects','read')) return
    this.loading = true;
    await this.getProjectRefresh();
    await this.getUsers();
    this.loading = false;
  }
}
</script>
<style scoped>
div.q-avatar div.q-avatar__content img {
    border: none !important;
}

p.desc {
  white-space: normal !important;
}

@media (max-width: 1023px) {
.member-leader {
  margin-left: 0 !important;
}
}
</style>
