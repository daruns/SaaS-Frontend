<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{action+' '}}Task
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md scroll">
        <q-input
            ref="nameRef"
            :rules="[val => (val && val.length > 0) || 'This field is required']"
            outlined
            v-model="task.name"
            label="Name"
            lazy-rules
        />
        <q-select
            ref="projectRef"
            outlined
            v-model="project"
            :options="projectOptions"
            label="Assign to a project"
            :loading="isLoaded"
            clearable
        >                       
         <template v-slot:option="scope">
              <q-item @click="project !== null && scope.opt.id !== project.id  ? updateProjectOptions(scope) : ''" v-bind="scope.itemProps">
                  <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>       
                  </q-item-section>
              </q-item>
          </template>
        </q-select>
        <q-select
            ref="memberRef"
           :rules="[val => (val && val.length > 0) || 'This field is required']"
            use-chips
            outlined
            v-model="members"
            multiple
            :options="memberOptions"
            counter
            hint="Members"
            label="Choose members"
            :loading="isLoaded"
            clearable
        />
          <div>
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Start date</div>
            <Datepicker v-model="task.plannedStartDate" showNowButton></Datepicker>
            </div>
            <div>
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Task deadline</div>
            <Datepicker class="q-mt-sm" v-model="task.plannedEndDate" showNowButton></Datepicker>
            </div>
        <q-editor             
      v-model="task.description" :dense="true" :toolbar="[
      [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo'],
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }"
    />
        <q-select ref="priorityRef" clearable v-model="task.priority" :options="['High','Medium','Low']" outlined label="Priority" :rules="[val => (val && val.length > 0) || 'This field is required']" />        
    </q-card-section>
    </q-card>
          <q-toolbar class="bg-grey-3" style="position:sticky !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
</q-layout>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import { date } from 'quasar'
import _ from 'underscore'
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css';
export default {
  components: {
    Datepicker
  },
    props: ['action', 'body', 'boardId'],
   data()  { 
   return {
     isLoaded: false,
     loading: false,
     projectOptions: [],
     client: null,
     project: null,
     members: [],
     memberOptions: [],
     task: {
         name: '',
         priority: '',
         description: 'Description',
         plannedStartDate: '',
         plannedEndDate: '',
         members: [],
         boardId: null
     },
     id:null
    }
  },
  computed: {
      ...mapState('userStore', ['users']),
      ...mapState('projectStore', ['projects'])
  },
  methods : {
    ...mapActions('projectStore',['addProject','editProject', 'getProjects']),
    ...mapActions('projectStore',['addTask','editTask']),
    ...mapActions('crmStore',['getClients']),
    ...mapActions('userStore',['getUsers']),
    updateProjectOptions(payload) {
      let membOptions = [];
      let leadOptions = [];

      
      this.memberOptions = [];
      this.members = [];
      for(let i = 0; i<this.projects.length; i++) {
        if(payload.opt.id === this.projects[i].id) {
          for(let j = 0; j<this.projects[i].leaderUsers.length; j++) {
            leadOptions.push({id: this.projects[i].leaderUsers[j].userId , label:this.projects[i].leaderUsers[j].name })
          }
          for(let j = 0; j<this.projects[i].memberUsers.length; j++) {
            membOptions.push({id: this.projects[i].memberUsers[j].userId , label:this.projects[i].memberUsers[j].name })
          }
        }
      }

      var merged = leadOptions.concat(membOptions);
      this.memberOptions = merged.reduce((unique, o) => {
    if(!unique.some(obj => obj.label === o.label && obj.id === o.id)) {
      unique.push(o);
    }
    return unique;
},[]);

    },
    dateConversion(d) {
    let newDt = new Date(d)
    newDt.setHours(newDt.getHours() - 3);
    return date.formatDate(newDt, 'YYYY-MM-DD HH:mm');
    },
    async submit() {
      this.$refs.memberRef.validate();
      this.$refs.nameRef.validate();
      this.$refs.priorityRef.validate();
      if(
      this.$refs.memberRef.hasError ||
      this.$refs.nameRef.hasError ||
      this.$refs.priorityRef.hasError
      )
      return
      for(let i = 0; i<this.members.length; i++) {
        this.task.members.push(Number(this.members[i].id));
      }
      this.task.boardId = Number(this.boardId)
      this.loading = true;
      this.task.plannedStartDate = date.formatDate(this.task.plannedStartDate, 'YYYY-MM-DD HH:mm');
      this.task.plannedEndDate = date.formatDate(this.task.plannedEndDate, 'YYYY-MM-DD HH:mm');
     if(this.action === 'Add') {
        await this.create()
      }else{
        console.log(this.task)
        await this.update()
      }
      this.loading = false;
      this.$emit('closeDialogue');

    },
    async create() {
      await this.addTask(this.task) 
    },
      async update() {
      await this.editTask({...this.task, id:Number(this.body.id)}) 
    }
  },
 async mounted() {
   if(this.action === 'Edit'){
     this.task.name = this.body.name
     this.task.description = this.body.description
     this.task.priority = this.body.priority
     this.task.plannedStartDate =  this.dateConversion(this.body.plannedStartDate)
     this.task.plannedEndDate = this.dateConversion(this.body.plannedEndDate)
     if (this.body.project) {
     this.project = {label: this.body.project.name, id: this.body.project.id};
     }
    for (let i  = 0; i<this.body.memberUsers.length; i++) {
      this.members.push({label: this.body.memberUsers[i].name, id: this.body.memberUsers[i].userId})
    }
   }else{
        this.task.plannedStartDate = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
        this.task.plannedEndDate = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
   }
   this.isLoaded = true;
      await this.getUsers();
      await this.getProjects();
     for(let i  = 0; i<this.users.length; i++) {
            this.memberOptions.push({label: this.users[i].name, id: this.users[i].id})
      }
    for(let i  = 0; i<this.projects.length; i++) {
            this.projectOptions.push({label: this.projects[i].name, id: this.projects[i].id, leaders:this.projects[i].leaderUsers, members:this.projects[i].memberUsers})
      }
   this.isLoaded = false;

  }
  }
</script>
<style  scoped>
.my-card{
  width: 100%;
  max-width: 250px
}

</style>