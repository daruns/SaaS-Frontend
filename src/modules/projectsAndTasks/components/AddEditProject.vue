<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; min-height:100vh;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{this.actionType+' '}}Project
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md scroll">
       <q-select
        bg-color="white"
        outlined
        ref="clientRef"
        :rules="[val => (val !== null) || 'This field is required']"
        v-model="client" 
        :options="clientOptions"
            label="Choose client"
            :loading="isLoaded"
        />
        <q-select
            ref="leaderRef"
           :rules="[val => (val && val.length > 0) || 'This field is required']"
            use-chips
            outlined
            v-model="leaders"
            multiple
            :options="leaderOptions"
            counter
            hint="Leaders"
            label="Choose leaders"
            :loading="isLoaded"

        />
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

        />

            <q-file
              v-model="files"
              label="Pick file"
              filled
              append
              v-show="actionType !== 'Edit'"
              
              use-chips
              clearable
            > 
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          <div>
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Projects date</div>
            <Datepicker v-model="project.plannedStartDate" showNowButton></Datepicker>
            </div>
            <div>
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Project deadline</div>
            <Datepicker class="q-mt-sm" v-model="project.plannedEndDate" showNowButton></Datepicker>
            </div>
        <q-input
            ref="nameRef"
            :rules="[val => (val && val.length > 0) || 'This field is required']"
            outlined
            v-model="project.name"
            label="Name"
            lazy-rules
        />
        <q-editor             
      v-model="project.description" :dense="$q.screen.lt.md" :toolbar="[
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
        <q-input
            ref="priorityRef"
            :rules="[val => (val && val.length > 0) || 'This field is required']"
            outlined
            v-model="project.priority"
            label="Priority"
        />
        <div class="flex items-center">
        <p style="padding:0 !important; font-size:1rem;">Rate: </p>
        <q-rating
            v-model="project.rate"
            size="2em"
            class="q-mb-md q-ml-sm"
            :max="5"
            color="primary"
         />
        </div>
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
import Datepicker from 'vue3-date-time-picker';
export default {
  components: {
    Datepicker,
  },
    props: ['actionType', 'body'],
   data()  { 
   return {
     isLoaded: false,
     loading: false,
     clientOptions: [],
     client: null,
     leaders: [],
     leaderOptions: [],
     members: [],
     memberOptions: [],
     files: null,
     project: {
         name: '',
         rate: 0,
         priority: '',
         description: 'Description',
         plannedStartDate: '',
         plannedEndDate: '',
         clientId: null,
         leaders: [],
         members: []
     },
     id:null
    }
  },
  computed: {
      ...mapState('crmStore', ['allClients']),
      ...mapState('userStore', ['users']),

  },
  methods : {
    ...mapActions('projectStore',['addProject','editProject', 'getProjects','addFiles']),
    ...mapActions('crmStore',['getClients']),
    ...mapActions('userStore',['getUsers']),
    dateConversion(d) {
    let newDt = new Date(d)
    newDt.setHours(newDt.getHours() - 3);
    return date.formatDate(newDt, 'YYYY-MM-DD HH:mm');
    },
    async submit() {
      this.$refs.leaderRef.validate();
      this.$refs.memberRef.validate();
      this.$refs.nameRef.validate();
      this.$refs.priorityRef.validate();
      this.$refs.clientRef.validate();
      if(
      this.$refs.leaderRef.hasError ||
      this.$refs.memberRef.hasError ||
      this.$refs.nameRef.hasError ||
      this.$refs.priorityRef.hasError ||
      this.$refs.clientRef.hasError
      )
      return

     for(let i = 0; i<this.leaders.length; i++) {
        this.project.leaders.push(Number(this.leaders[i].id));
      }
      for(let i = 0; i<this.members.length; i++) {
        this.project.members.push(Number(this.members[i].id));
      }
      this.project.clientId = Number(this.client.id)
      this.project.plannedStartDate = date.formatDate(this.project.plannedStartDate, 'YYYY-MM-DD HH:mm');
      this.project.plannedEndDate = date.formatDate(this.project.plannedEndDate, 'YYYY-MM-DD HH:mm');
      this.loading = true
     if(this.actionType === 'Add') {
        await this.create()
      }else{
        await this.update()
      }
      this.loading = false;
      this.$emit('closeDialogue')

    },
    async create() {
      await this.addProject({data: this.project, files: this.files});
    },
      async update() {
      await this.editProject({data: {...this.project, id:Number(this.body.id)}}) 
    }
  },
 async mounted() {
      this.isLoaded = true;
      await this.getClients();
      await this.getUsers();
      for(let i  = 0; i<this.allClients.length; i++) {
            if(this.allClients[i].clientType !== 'Blacklist')
            this.clientOptions.push({label: this.allClients[i].name, id: this.allClients[i].id})
      }
     for(let i  = 0; i<this.users.length; i++) {
            this.memberOptions.push({label: this.users[i].name, id: this.users[i].id})
            this.leaderOptions.push({label: this.users[i].name, id: this.users[i].id})

      }
   this.isLoaded = false;
   if(this.actionType === 'Edit'){
     this.project.name = this.body.name
     this.project.description = this.body.description
     this.project.priority = this.body.priority
     this.project.rate = this.body.rate
     this.project.plannedStartDate = this.dateConversion(this.body.plannedStartDate)
     this.project.plannedEndDate = this.dateConversion(this.body.plannedEndDate)
     this.client = {label: this.body.client.name, id: this.body.client.id};
     for(let i  = 0; i<this.body.memberUsers.length; i++) {
            this.members.push({label: this.body.memberUsers[i].name, id: this.body.memberUsers[i].userId})
      }
      for(let i  = 0; i<this.body.leaderUsers.length; i++) {
            this.leaders.push({label: this.body.leaderUsers[i].name, id: this.body.leaderUsers[i].userId})
      }
   }else{
     this.project.plannedStartDate = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm');
     this.project.plannedEndDate = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm');
   }
  }
  }
</script>
<style  scoped>
.my-card {
  width: 100%;
  max-width: 250px
}

</style>