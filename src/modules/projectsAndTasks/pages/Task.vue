<template>
    <q-page style="overflow-x: hidden !important;">
    <div class="full-width flex justify-between items-center q-px-md  header-height-standard" style="border-bottom: 1px solid lightgrey;">
      <div class="text-h4">Tasks</div>
      <div class="flex items-center">
        <q-btn v-if="canActivate('subject_projects','create')" @click="this.action = 'Add'; dialogue = true" color="primary" label="Create Board" unelevated rounded no-caps />
      </div>
    </div>
    <div v-if="!canActivate('subject_projects','read')"><Forbidden /></div>
    <q-scroll-area class="q-px-md" v-else-if="!isLoaded" :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 70vh; width: 100% !important;">
      <q-markup-table class="flex q-mt-md tasks-table bg-secondary" flat>
          <thead>
            <tr>
              <th class="paddingRid" v-for="column in columns" :key="column.id"
              >
               <div style='border-radius:6px !important;' :style="`background-color: ${column.boardAttribute.color}`"
               class="q-pa-sm q-ma-none flex items-center justify-between">
                <div class="q-mb-none text-white">{{column.name}}</div>
                <q-btn v-if="canActivate('subject_projects','update') || canActivate('subject_projects','delete')" color="white" dense round flat icon="more_vert">
                  <q-menu
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-list style="min-width: 75px">
                      <q-item v-if="canActivate('subject_projects','delete')" @click="delBoard(column.id)" style="padding 0 !important" clickable v-close-popup>
                        <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                      </q-item>
                      <q-separator v-if="canActivate('subject_projects','update') && canActivate('subject_projects','delete')" />
                      <q-item v-if="canActivate('subject_projects','update')" @click="body = column; action = 'Edit'; dialogue = true;"  clickable v-close-popup>
                        <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
               </div>
              </th>
            </tr>
          </thead>
          <tbody>
          <td v-for="column in columns" :key="column.id" class="bg-grey-4 q-mr-sm" round :style="`width:265px; height:auto `">
            <q-scroll-area :thumb-style="thumbStyle1" :bar-style="barStyle1" style="height: 50vh; width: 265px;">
            <div style="height: auto;">
          <draggable
            style="height: 49vh;"
            tag="div"
            class="q-mt-sm"
            :clone="clone"
            :group="{ name: 'people', pull: pullFunction }"
            @start="start"
            :component-data="{ tag: 'div' }"
            @change="change"
            :list="column.tasks" 
            @clone="clone"
            item-key="id">
            <template #item="{element}">
                <div class="bg-white relative-position q-pa-sm q-mb-xs q-ml-xs q-mr-xs rounded-borders" style="border: 0.25px solid lightgrey;">
                  <div class="flex row items-center justify-between">
                    <p @click="taskBody = element;taskDialogue = true" class="column col-12 q-mb-none cursor-pointer" style="width:50% !important;overflow:hidden !important;text-overflow: ellipsis !important;">
                      {{element.name}}
                      <q-chip square style="height:6px;width:100px" :class="priority(element.priority) + ' q-px-none q-mx-none'" size="xs"></q-chip>
                    </p>
                    <q-btn v-if="canActivate('subject_projects','delete') || canActivate('subject_projects','update')" dense round flat color="grey" icon="edit">
                      <q-menu
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-list style="min-width: 75px">
                          <q-item v-if="canActivate('subject_projects','delete')" @click="delTask({id: element.id})" style="padding 0 !important" clickable v-close-popup>
                            <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
                          </q-item>
                          <q-separator />
                          <q-item v-if="canActivate('subject_projects','update')" @click="openDialogue(element, column.id)" clickable v-close-popup>
                            <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                  <q-item-section  @click="taskBody = element;taskDialogue = true" clickable v-if="element && element.attachments && element.attachments.length > 0" class="col-12 q-my-sm flex flex-center items-center cursor-pointer">
                    <q-img :src="element.attachments[0]?.url" />
                  </q-item-section>
                  <p class="q-mt-none text-grey cursor-pointer" @click="taskBody = element;taskDialogue = true" clickable style="overflow: hidden !important;text-overflow: ellipsis;word-break: break-all !important;width: 229px;display: flex;flex-wrap: wrap;justify-content: space-between;flex-direction: row;max-width:229px!important"><q-icon name="subject" size="sm" /></p>
                  <div class="q-py-md cursor-pointer" @click="taskBody = element;taskDialogue = true" clickable >
                    <q-icon color="grey" size="sm" name="insert_invitation"/>
                    <q-badge color="green" size="xs">{{convertDate(element.plannedEndDate)}}</q-badge>
                  </div>
                  <div class="row flex flex-reverse">
                    <div class="flex">
                      <div class=" flex-end q-mr-xs q-mt-xs q-mb-xs" v-for="(member,i) in element.memberUsers" :key="member.id">
                        <q-avatar  size="40px">
                          <q-btn v-if="canActivate('subject_projects','delete')" round size="5px" @click="delMember({id:element.id,members: [member.userId]})" icon="close" color="negative" class="absolute-top-right"/>
                            <img v-if="member.avatar" :src="member.avatar">
                            <img v-else src="~/assets/one_logo_neat.png">
                          <!-- <q-tooltip>
                            {{member}}
                          </q-tooltip> -->
                        </q-avatar>
                      </div>
                    </div>
                    <div class="flex items-start q-mt-xs q-ml-xs">
                    <q-btn v-if="canActivate('subject_projects','create')" @click="getUserOptions(element)" round size="11px" text-color="black" unelevated color="grey-4" icon="add">
                        <q-popup-edit v-model="members" style="min-width: 15rem !important;" :cover="false" :offset="[0, 10]" v-slot="scope">
                        <q-select
                            :rules="[val => (val !== null) || 'This field is required']"
                            bg-color="white"
                            outlined
                            counter
                            multiple
                            use-chips
                            v-model="members" 
                            :options="options"
                            label="Choose members"
                            :loading="isLoaded"
                            :disable="options.length === 0"
                            :hint="options.length === 0 ? 'All users has been added' : ''"
                          >
                            <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section class="avatar-list">
                                <q-avatar class="q-mr-xs" size="30px">
                                    <img v-if="scope.opt.avatar" :src="scope.opt.avatar">
                                    <img v-else src="~/assets/one_logo_neat.png">
                                </q-avatar>
                                <q-item-label>{{ scope.opt.label }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            </template>
                        </q-select>
                        <q-btn @click="addMembs(element.id)" no-caps flat label="submit" color="primary" :disable="members.length === 0" v-close-popup />
                        </q-popup-edit>
                    </q-btn>
                    </div>
                </div>
                </div>
            </template>
          </draggable>
            </div>
            </q-scroll-area>
          <div class="full-width row flex">
          <q-btn
            icon="add"
            text-color="grey"
            label="Add new task..."
            class="text-left col"
            v-if="canActivate('subject_projects','create')" 
            @click="bId = column.id;allBoards = columns; actiont = 'Add'; dialoguet = true"
            unelevated
            no-caps
          />
          </div>
        </td>
        </tbody>
        </q-markup-table>
    </q-scroll-area>
    <q-page v-else class="flex flex-center"><q-spinner /></q-page>
    <q-dialog seamless position="right" v-model="dialogue">
      <modal @closeDialogue="getAll" :action="action" :body="body" />
    </q-dialog>
    <q-dialog seamless position="right" v-model="dialoguet">
      <modalt @closeDialogue="getAll" :action="actiont" :boardId="bId" :body="bodyt" :allBoards="allBoards" />
    </q-dialog>   
    <q-dialog v-model="taskDialogue">   
      <task :task="taskBody" />
    </q-dialog>
  </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import breadcrmps from '../../../components/globalComponents/BreadCrumps.vue';
import draggable from 'vuedraggable'
import moment from 'moment'
import axios from 'axios';
import modal from '../components/AddEditBoard.vue'
import modalt from '../components/AddEditTask'
import task from '../components/TaskDialogue.vue'
import Forbidden from 'src/components/globalComponents/Forbidden.vue';
export default {
  components : {
    breadcrmps,
    draggable,
    modal,
    modalt,
    task,
    Forbidden
},
  data() {
    return{
      canActivate: this.$canActivate,
      taskBody: null,
      taskDialogue: false,
      loading: false,
      projectsToChoose: [],
      project: null,
      allBoards: null,
      projects: [],
      isLoaded: false,
      members: [],
      options: [],
      columns: [],
      attempt:0,
      dialogue: false,
      dialoguet: false,
      action: 'Add',
      actiont: 'Add',
      boardId: null,
      body:null,
      bodyt:null,
      bId: null,
      thumbStyle: {
        bottom: '2px',
        borderRadius: '7px',
        backgroundColor: '#027be3',
        height: '4px',
        opacity: 0.75
      },
      barStyle: {
        bottom: '-.75px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '100%',
        height: '8px',
        opacity: 0.2
      },
      thumbStyle1: {
        right: '4px',
        borderRadius: '7px',
        backgroundColor: '#027be3',
        width: '4px',
        opacity: 0.75
      },

      barStyle1: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0.2
      },
    }
  },
  computed: {
    ...mapState('userStore', ['users'])
  },
  methods: {
    ...mapActions('projectStore',['getProjects','deleteBoard', 'addMembers', 'deleteTask', 'deleteMember']),
    ...mapActions('userStore',['getUsers']),
    convertDate(datStr) {
      return moment(datStr).format('MMM Do YYYY')
    },
    priority(priority) {
      switch(priority){

      case 'High':
      return 'text-positive bg-green-4'

      case 'Medium':
      return 'text-warning bg-yellow-4'

      case 'Low':
      return 'text-negative bg-red-4'
      }
    },
    clone({ name, description, memberUsers, id, priority, attachments }) {
      return { name, description, memberUsers, id: id, priority,attachments };
    },
    pullFunction() {
      return this.controlOnStart ? "clone" : true;
    },
    start({ originalEvent }) {
      this.controlOnStart = originalEvent.ctrlKey;
    },
    getAccentColor(color) {
      switch(color) {
        case '#308be5':
        return '#a1d2f8' 

        case '#82b865':
        return '#c6dfb9'

        case '#cc444b':
        return '#e4b1ab'

        case '#ffae30':
        return '#ffd899'

        case '#1d1d1d':
        return 'lightgrey'
      }

    },
    openDialogue(payload, bId) {
      let time = 0
      if(this.dialoguet === true) {
        this.dialoguet = false
        time = 200;
      }else{
        time = 0
      }
      setTimeout(() => {
        this.bodyt = payload
        this.allBoards = this.columns
        console.log(this.allBoards)
        this.actiont = 'Edit';
        this.dialoguet = true; 
        this.boardId = bId
      }, time);
    },
    async delTask(payload) {
      await this.deleteTask(payload);
      this.getAll();
    },
    async delMember(payload) {
      await this.deleteMember(payload);
      this.getAll();
    },
    async addMembs(taskId) {
      let membersToAdd = []
      for(let i = 0; i<this.members.length; i++) {
        membersToAdd.push(this.members[i].id);
      }
      await this.addMembers({id:taskId, members: membersToAdd});
      await this.getAll();
      this.members = []
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
              optionsB.push({id:this.users[i].id, label: this.users[j].name, avatar: this.users[j].avatar});
            }
          }
          optionsA.push({id:this.users[i].id, label: this.users[i].name, avatar: this.users[i].avatar});
        }
        this.options = optionsA.filter(({ id: id1 }) => !optionsB.some(({ id: id2 }) => id2 === id1));
      }, 200);
    },
    async change(evt) {
      this.attempt += 1
      if (this.attempt%2 !== 0) {
        for (let i = 0; i<this.columns.length; i++) {
          for (let j = 0; j<this.columns[i].tasks.length; j++) {
            if (Number(this.columns[i].tasks[j].id) === Number(evt.added.element.id)) {
              let response = await axios.post(process.env.OC_BACKEND_API + 'tasks/changeBoard',  
              {id:Number(evt.added.element.id), boardId:Number(this.columns[i].id)  },   
              {headers: {Authorization: localStorage.getItem('accessToken')}})
            }
          }
        }
      }
    },
    async getAll() {
      let res = await axios.get(process.env.OC_BACKEND_API + 'boards', {headers: {Authorization: localStorage.getItem('accessToken')}});
      this.columns = res.data.data;
      for(let i = 0; i<this.columns.length; i++) {
        this.columns[i].boardAttribute = {
          ...this.columns[i].boardAttribute,
          accent: this.getAccentColor(this.columns[i].boardAttribute.color)
        }
      }
      if(this.dialogue === true) this.dialogue = false;
      if(this.dialoguet === true) this.dialoguet = false;
    },
    async delBoard(id) {
      await this.deleteBoard({id: id});
      this.getAll();
    }
  },
  async mounted() {
    this.isLoaded = true
    await this.getAll();
    await this.getUsers();
    await this.getUserOptions();
    this.isLoaded = false;
  },
  setup () {
    return {
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Tasks',icon: 'task',path: '/projects/tasks'}
        ],
    }
  }
}
</script>
<style scoped>
.q-table tbody td{
  width: 16rem !important;
  min-width: 16rem !important;
  margin: 10px !important;
}

.q-table th, .q-table td {
    padding-top: 7px ;
    padding-bottom: 7px ;
    padding-right: 7px ;
    padding-left: 7px ;

}

div.q-avatar div.q-avatar__content img {
    border: none !important;
}

.q-markup-table.q-table__container.q-table__card.q-table--horizontal-separator.q-table--flat.q-table--no-wrap.flex.q-mt-md.tasks-table.bg-secondary {
  border-radius: 0 !important;
}
.paddingRidonly {
  padding: 0px !important;
}
.paddingRid {
  padding: 0px !important;
  background-color: #f2f2f2 !important;
}
</style>