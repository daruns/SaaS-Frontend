<template>
   <q-page v-if="!loading" class="q-pa-md">
     <div class="flex justify-between items-center">
       <div>
        <p class="text-h4">{{project.name}}</p>
        <breadcrmps :map="crumps" />
        </div>
        <q-btn @click="dialogue = true" color="grey-5" flat icon="edit" round/>
        </div>
        <div class="q-mt-md ">
        <q-card class="q-pa-md">
          <p class="text-h6">{{project.name}}</p>
           <p class="text-subtitle2 q-mb-none">Deadline</p>
           <p class="text-grey">{{project.plannedEndDate && project.plannedEndDate.split('T')[0]}}</p>
          <p class="text-grey desc" v-html="project.description"></p>
        </q-card>
        </div>
        <div>
        </div>
       <p v-show="images.length !== 0" class="text-h6 text-grey q-mt-lg">Uploaded images</p>
        <q-card class="q-pa-md q-mt-md">
        <p v-show="images.length === 0" class="text-subtitle1 text-grey-5">No images has been uploaded.</p>
        <div v-show="images.length !== 0"  class="row q-pb-xl">
          <div v-for="(file, i) in images" :key="file.id" >
            <div class="flex column flex-center q-pr-md q-pt-md">
          <q-avatar square size="100px">
            <q-badge style="background: transparent !important;" transparent floating>
              <q-btn @click="fileId = file.id, confirm = true" round size="7.5px" icon="delete" color="negative" class="absolute-top-right"/>
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
            <q-btn label="Upload images" icon="backup" color="grey" no-caps push flat unelevated class="absolute-bottom-right q-mr-sm q-mb-sm">
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
       <p v-show="files.length !== 0" class="text-h6 text-grey q-mt-lg">Uploaded files</p>
        <q-card class="q-pa-md q-mt-md">
        <p v-show="files.length === 0" class="text-subtitle1 text-grey-5">No files has been uploaded.</p>
        <div v-show="files.length !== 0" class="row q-pb-xl">
          <div v-for="(file, i) in files" :key="file.id">
          <div  class="flex column flex-center q-pr-md q-pt-md">
          <q-avatar square size="100px"> 
           <q-badge style="background: transparent !important;" transparent floating>
              <q-btn @click="fileId = file.id, confirm = true" round size="7.5px" icon="delete" color="negative" class="absolute-top-right"/>
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
          <q-btn label="Upload files" icon="backup" color="grey" no-caps push flat unelevated class="absolute-bottom-right q-mr-sm q-mb-sm">
              <q-popup-proxy>
                    <q-banner>
                      <q-file :filter="checkFileType" @rejected="onRejectedFile" clearable label="File" outlined v-model="file">
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                      <q-btn v-close-popup label="Upload" @click="addProjectFile('file'); file = null" no-caps :disable="!file" flat color="primary" class="q-mt-sm" size="md" />
                    </q-banner>
                  </q-popup-proxy>
          </q-btn>
        </q-card>
                <q-card class="q-pa-md q-mt-lg">
                  <p v-if="project.leaderUsers.length !== 0" class="text-h6">Assigned leaders</p>
                  <p v-if="project.leaderUsers.length === 0" class="text-subtitle1 text-grey-5">No leaders assigned.</p>
                  <q-btn @click="getLeaderOptions(project)" class="absolute-bottom-right q-mr-sm q-mb-sm" size="10px" color="primary" round icon="add" unelevated rounded no-caps>
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
                        <q-btn @click="addProjectLeaders(project.id)" no-caps flat label="submit" color="primary" :disable="leaders.length === 0" v-close-popup />
                        </q-popup-edit>
                  </q-btn>
                 <div v-if="project.leaderUsers.length !== 0" class="row" >
                   <q-chip @remove="leaderId = leader.userId; deleteLeaderConfirm = true" v-for="(leader,i) in project.leaderUsers" :key="leader.userId" removable>
                    <q-avatar>
                      <img src="~/assets/one_logo_neat.png">
                    </q-avatar>
                    {{leader.name}}
                  </q-chip>
            </div>
        </q-card>
         <q-card class="q-pa-md q-mt-lg">
          <p v-if="project.memberUsers.length !== 0" class="text-h6">Assigned members</p>
          <p v-if="project.memberUsers.length === 0" class="text-subtitle1 text-grey-5">No members assigned.</p>
          <q-btn @click="getUserOptions(project)" class="absolute-bottom-right q-mr-sm q-mb-sm" size="10px" color="primary" round icon="add" unelevated rounded no-caps>
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
            <div v-if="project.memberUsers.length !== 0" class="row">
                    <q-chip @remove="memberId = member.userId; deleteMemberConfirm = true;" v-for="(member,i) in project.memberUsers" :key="member.userId" removable>
                    <q-avatar>
                      <img src="~/assets/one_logo_neat.png">
                    </q-avatar>
                    {{member.name}}
                  </q-chip>
            </div>
        </q-card>
        <q-dialog v-model="confirm" persistent>
            <confirm @confirm="deleteProjectFile" />
          </q-dialog>
          <q-dialog v-model="deleteLeaderConfirm" persistent>
            <confirm @confirm="deleteLeader({id: project.id, leaders: [leaderId]})" />
          </q-dialog>
          <q-dialog v-model="deleteMemberConfirm" persistent>
            <confirm @confirm="deleteMember({id: project.id, members: [memberId]})" />
          </q-dialog>
          <q-dialog seamless position="right" v-model="dialogue">
              <modal @closeDialogue="getProject(); dialogue = false" actionType="Edit" :body="project" />
          </q-dialog>
           <!-- <p class="text-caption text-grey-7 q-ma-none" v-show="project.leaderUsers.length !== 0">Assigned Leaders:</p> -->
    </q-page>
    <q-page v-else class="flex flex-center"><q-spinner /></q-page>
</template>
<script>
import axios from 'axios';
import breadcrmps from '../../../components/globalComponents/BreadCrumps.vue';
import modal from '../components/AddEditProject.vue';
import confirm from '../../../components/DeleteDialogue.vue'
import { mapActions, mapState } from 'vuex';
export default {
components :{
    breadcrmps,
    modal,
    confirm
 },
 data() {
   return {
     project: {
       leaderUsers: [],
       memberUsers: [],
     },
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
   ...mapState('userStore', ['users'])
 },
 methods: {
   ...mapActions('projectStore',['addFiles','addProjectMember','deleteProjectMember','addProjectLeader','deleteProjectLeader']),
   ...mapActions('userStore',['getUsers']),
   async deleteProjectFile() {
    let response = await axios.post(process.env.OC_BACKEND_API + 'projects/removeFile',
     {id: this.project.id, attachId:this.fileId}, 
     {headers: {Authorization: localStorage.getItem('accessToken')}});
     this.getProject();
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
      await this.getProject();
    },
    async deleteMember(payload) {
      console.log(payload);
      await this.deleteProjectMember(payload);
      await this.getProject();
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
    async addProjectLeaders(id) {
      let leadersToAdd = []
      for(let i = 0; i<this.leaders.length; i++) {
        leadersToAdd.push(this.leaders[i].id);
      }
      await this.addProjectLeader({id:id, leaders: leadersToAdd});
      this.leaders = [];
      await this.getProject();

    },
    async deleteLeader(payload) {
      await this.deleteProjectLeader(payload);
      await this.getProject();
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
   async addProjectFile(type) {
     let data = new FormData();
     data.append('id', this.project.id);
     if(type === 'file')
     data.append('files', this.file);
     else
     data.append('files', this.image);

     await this.addFiles(data);
     this.getProject();
   },
   async getProject() {
      let response = await axios.get(process.env.OC_BACKEND_API + `projects/${this.$route.params.id}`, {headers: {Authorization: localStorage.getItem('accessToken')}});
      this.project = response.data.data;
      this.crumps[1].name = response.data.data.name;
      this.fileAndImages()

   },
   fileAndImages() {
     this.files = [];
     this.images = [];
     for(let i = 0; i<this.project.attachments.length; i++) {
       if(this.project.attachments[i].contentType.includes('image'))
       this.images.push(this.project.attachments[i]);
       else
       this.files.push(this.project.attachments[i]);
     }
   }
 },
 async mounted() {
      this.loading = true;
      await this.getProject();
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
