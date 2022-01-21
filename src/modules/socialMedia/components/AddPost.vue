<template>
<q-layout style="width: 80vw !important;">
  <q-card style="max-width: 80vw; min-height:100vh;" flat square>
    <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 72px !important">
      <q-toolbar-title>
        Add Project
      </q-toolbar-title>
      <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="row flex justify-between">
      <div class="col-lg-12 col-md-12 row col-sm-12 col-xs-12">
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 column">
          <q-input
            
            ref="nameRef"
            :rules="[val => (val && val.length > 0) || 'This field is required']"
            v-model="post.name"
            label="Name"
            lazy-rules
          />
        </div>
      </div>
      <q-card class="col-lg-5 col-md-5 col-sm-12 col-xs-12 justify-center flex flex-center q-pa-lg">
        <q-card v-for="(medi) in mediasView" :key="medi" class=" flex bordered column justify-center flex flex-center">
          <q-btn
            clickable
            v-if="medi === 'addNewMediaComponent'"
            @click="addNewMediaComponent()"
            class="bg-grey border col-12 q-ma-md q-pa-md">
            <q-item-label flex-center flex column class="col-12 q-pa-md">
              <q-icon
                name="add_box"
                square
                flex-center
                style="font-size:46px"
                class="text-white"
              ></q-icon>
            </q-item-label>
          </q-btn>

          <q-item v-else class="bg-grey col-12 q-pa-md q-ma-md">
            <q-item-label flex-center flex column>
              <q-item
                icon="add"
                square
                flex-center
                style="font-size:46px"
                class="text-white"
              >+3</q-item>
            </q-item-label>
          </q-item>

        </q-card>
      </q-card>
      <q-card class="col-lg-7 col-md-7 col-sm-12 col-xs-12 flex row items-start inline q-pa-lg ">
        <!-- CLIENTS -->
        <div  class="col-lg-12 col-md-12 col-sm-12 col-xs-12 flex justify-strech row  q-mb-md">
          <q-select
            class="col-lg-8 col-md-6 col-sm-12 col-xs-12"
            v-model="client" 
            emit-value
            map-options
            use-input
            label="Choose client"
            :options="clientOptions"
            :loading="clientIsLoading"
            @filter="clientFilterFn"
            behavior="menu"
            ref="clientRef"
            use-chips
            clearable
          >
            <template v-slot:selected-item="scope">
                <!-- @remove="scope.removeAtIndex(scope.indexOf(scope.opt))" -->
                <!-- removable -->
              <q-chip
                :tabindex="scope.tabindex"
                dense
                color="white"
                text-color="grey"
                class="q-pa-sm q-ma-none"
              >
                <q-avatar v-if="scope.opt.avatar" color="grey" text-color="white"><q-img :src="scope.opt.avatar"/> </q-avatar>
                <q-avatar v-else color="grey" icon="person" text-color="white" />
                {{ scope.opt.label }}
              </q-chip>
            </template>

            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-avatar v-if="scope.opt.avatar" color="grey" text-color="white"><q-img :src="scope.opt.avatar"/> </q-avatar>
                <q-avatar v-else color="grey" icon="person" text-color="white" />
                <q-item-section class="q-mx-sm">
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-checkbox
            :disable="!client?.id"
            :rules="[val => (val !== null) || 'This field is required']"
            use-chips
            class="col-lg-4 col-md-6 col-sm-12 col-xs-12"
            v-model="post.clientApproval"
            label="Need Approval"
          />
        </div>
          <!-- {{client}}
          <br /> -->
          {{usersSelect}}
        <!-- USERS -->
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 flex justify-strech column  q-my-md">
          <q-select
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            emit-value
            map-options
            use-input
            @filter="userFilterFn"
            use-chips
            clearable
            ref="userRef"
            :rules="[val => (val && val.length > 0) || 'This field is required']"
            v-model="usersSelect"
            multiple
            :options="userOptions"
            label="Choose users"
            :loading="UsersIsLoading"
          >
            <template v-slot:selected-item="scope">
              <q-chip
                :tabindex="scope.tabindex"
                dense
                color="white"
                text-color="grey"
                class="q-pa-sm q-ma-none"
              >
                <q-avatar v-if="scope.opt.avatar" color="grey" text-color="white"><q-img :src="scope.opt.avatar"/> </q-avatar>
                <q-avatar v-else color="grey" icon="person" text-color="white" />
                <q-item-label class="q-mx-sm">{{ scope.opt.label }}</q-item-label>
                <q-badge v-if="scope.opt.canEdit" color="success" label="Can Edit"/>
              </q-chip>
            </template>

            <template v-slot:option="scope">
              <q-item :disable="usersSelect.includes(e => {e. id === scope.opt.id})" v-bind="scope.itemProps">
                <q-avatar v-if="scope.opt.avatar" color="grey" text-color="white"><q-img :src="scope.opt.avatar"/> </q-avatar>
                <q-avatar v-else color="grey" icon="person" text-color="white" />
                <q-item-section class="q-mx-sm">
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox
                    :rules="[val => (val !== null) || 'This field is required']"
                    use-chips
                    class="col-lg-4 col-md-6 col-sm-12 col-xs-12"
                    :v-model="scope.opt.canEdit"
                    label="Can Edit"
                  />
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <!-- <q-list class="col-lg-6 col-md-6 col-sm-12 col-xs-12" v-if="post.users.length">
            <q-item  :key="index" v-for="(item,index) in post.users">
              <q-avatar rounded :src="item.avatar"/>
                {{item.label}}
                {{item.avatar}}
                {{item.id}}
              <q-checkbox
                v-if="this.client?.id"
                :rules="[val => (val !== null) || 'This field is required']"
                use-chips
                class="col-12"
                v-model="post.users[index]"
                label="Can Approve"
              />
            </q-item>
          </q-list> -->
        </div>
        <q-card flat class="col-12 row items-start inline">
          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 column">
            <q-select
              ref="priorityRef"
              :rules="[val => (val && val.length > 0) || 'This field is required']"
              
              v-model="post.priority"
              :options="priorityOptions"
              label="Priority"
              :loading="UsersIsLoading"
            />
          </div>
          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 column">
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Planned Start Date</div>
            <q-input showNowButton v-model="post.plannedStartDate" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="post.plannedStartDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 column">
            <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Deadline</div>
            <q-input showNowButton v-model="post.plannedEndDate" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="post.plannedEndDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card>
        <q-card bordered class="col-12">
        <q-editor
          :dense="true"
          :toolbar="[
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
          v-model="post.description"
          max-height="40px"
          class="col-12"
        />
        </q-card>
      </q-card>
    </q-card-section>
  </q-card>
  <q-toolbar class="bg-grey-3" style="position:sticky !important; bottom:0;z-index:5;">
    <q-btn :loading="submitIsLoading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
  </q-toolbar>
</q-layout>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import { date } from 'quasar'
import { ref } from 'vue'
import CreateMedia from './createMedia.vue'
import Datepicker from 'vue3-date-time-picker';
export default {
  components: {
    Datepicker,
    CreateMedia,
  },
  props: ['id', 'submited'],
  data()  {
    return {
      mediasView: ref(['addNewMediaComponent']),
      submitIsLoading: false,
      clientIsLoading: false,
      UsersIsLoading: false,
      // typeOptions: ['1024x990','298x630','300x590','124x390','203x400','other'],
      priorityOptions: ['High','Middle','Low'],
      clientOptions: ref([]),
      client: null,
      usersSelect: ref([]),
      userOptions: ref([]),
      files: null,
      post: {
        name: '',
        plannedStartDate: '',
        plannedEndDate: '',
        schedule: '',
        clientApproval: false,
        mineApproved: false,
        stage: this.stage,
        priority: '',
        description: 'Description...',
        clientId: null,
        users: [
          // sample
          // {id: 1, canEdit: true/false},
        ],
      },
      id:null,
    }
  },
  computed: {
      ...mapState('crmStore', ['allClients']),
      ...mapState('userStore', ['users']),
  },
  methods : {
    ...mapActions('userStore',['getUsers']),
    ...mapActions('crmStore',['getClients']),
    ...mapActions('socialMediaManagementStore',['addProject','editProject', 'getProjects','addFiles']),
    dateConversion(d) {
      let newDt = new Date(d)
      newDt.setHours(newDt.getHours() - 3);
      return date.formatDate(newDt, 'YYYY-MM-DD HH:mm');
    },
    addNewMediaComponent() {
      this.mediasView.push()
    },
    toggleOption (obj) {
      if (obj === false) {
        obj = true
      }
      if (obj === true) {
        obj = false
      }
    },
    clientFilterFn (val, update) {
      if (val === '') {
        update(() => {
          this.clientOptions = []
          for(let i  = 0; i<this.allClients.length; i++) {
            this.clientOptions.push({id: this.allClients[i].id, label: this.allClients[i].name,avatar: this.allClients[i].logo, description: this.allClients[i].email})
          }
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.clientOptions = this.clientOptions
        .filter(v => {
          v.label
          .toLowerCase()
          .split(' ')
          .filter(tr => {
            return tr.indexOf(needle) > -1
          })
          .length > 0
        })
      })
    },
    userFilterFn (val, update) {
      if (val === '') {
        update(() => {
          this.userOptions = []
          for(let i  = 0; i<this.users.length; i++) {
            this.userOptions.push({id: this.users[i].id, label: this.users[i].name,avatar: this.users[i].avatar, canEdit: false, description: this.users[i].username})
          }
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.userOptions = this.userOptions
        .filter(v => {
          v.label
          .toLowerCase()
          .split(' ')
          .find(tr => {
            return tr.indexOf(needle) > -1
          })
          .length > 0
        })
        console.log(this.userOptions)
      })
    },
    async submit() {
      this.$refs.nameRef.validate();
      this.$refs.plannedEndDate.validate();
      this.$refs.clientRef.validate();
      if(
        this.$refs.nameRef.hasError ||
        this.$refs.plannedEndDate.hasError ||
        this.$refs.clientRef.hasError
      )
      return

      for(let i = 0; i<this.users.length; i++) {
        this.post.users.push({userId: Number(this.users[i].id), canEdit: this.users[i].canEdit});
      }
      this.post.mineApproved = this.mineApproved
      this.post.clientApproval = this.clientApproval
      this.post.users = this.usersSelect.map(id,cEdit => { return {userId: id, canEdit: cEdit } })
      this.post.clientId = Number(this.client.id)
      this.post.schedule = date.formatDate(this.post.schedule, 'YYYY-MM-DD HH:mm');
      this.post.plannedStartDate = date.formatDate(this.post.plannedStartDate, 'YYYY-MM-DD HH:mm');
      this.post.plannedEndDate = date.formatDate(this.post.plannedEndDate, 'YYYY-MM-DD HH:mm');
      this.submitIsLoading = true
      await this.create()
      this.submitIsLoading = false;
      this.$emit('closeDialogue')

    },
    async create() {
      await this.addProject({data: this.post, files: this.files});
    },
    async update() {
      await this.editProject({data: {...this.post, id:Number(this.body.id)}}) 
    }
  },
  async mounted() {
    this.clientIsLoading = true;
    this.getClients().then(() => {
      for(let i  = 0; i<this.allClients.length; i++) {
        if(this.allClients[i].clientType !== 'Blacklist')
          this.clientOptions.push({id: this.allClients[i].id, label: this.allClients[i].name,avatar: this.allClients[i].logo, description: this.allClients[i].username})
      }
      this.clientIsLoading = false;
    })
    this.UsersIsLoading = true
    this.getUsers().then(() => {
      for(let i  = 0; i<this.users.length; i++) {
        this.userOptions.push({id: this.users[i].id, label: this.users[i].name,avatar: this.users[i].avatar, canEdit: false, description: this.users[i].username})
      }
      this.UsersIsLoading = false
    })
  this.post.schedule = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm');
  this.post.plannedStartDate = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm');
  this.post.plannedEndDate = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm');
}
  }
</script>
<style  scoped>
.my-card {
  width: 100%;
  max-width: 250px
}

</style>