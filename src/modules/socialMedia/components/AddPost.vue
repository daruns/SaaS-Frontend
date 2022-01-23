<template>
<q-layout style="width: 80vw !important;">
  <q-card style="max-width: 80vw; min-height:100vh;" flat square>
    <q-toolbar class="q-pa-md bg-grey-3" style="position:sticky !important; top:0;z-index:15;height: 72px !important">
      <q-toolbar-title>
        Add {{ stage[0].toUpperCase()+stage.substr(1, stage.length) }}
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
      <q-card class="col-lg-6 col-md-6 col-sm-12 col-xs-12 justify-center flex flex-center q-pa-lg">
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
      <q-card class="bg-secondary col-lg-6 col-md-6 col-sm-12 col-xs-12 flex row items-start inline q-pa-lg ">
        <div  class="col-lg-12 col-md-12 col-sm-12 col-xs-12 flex justify-strech row q-pb-md">
          <q-checkbox
            use-chips
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            v-model="post.mineApproved"
            label="My Approval"
          />
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-py-md column q-pr-md">
            <q-select
              ref="priorityRef"
              v-model="post.priority"
              :options="priorityOptions"
              label="Priority"
              :loading="UsersIsLoading"
            />
          </div>
        </div>
        <!-- CLIENTS -->
        <div  class="col-lg-12 col-md-12 col-sm-12 col-xs-12 flex justify-strech row q-pb-md">
          <q-select
            class="col-lg-8 col-md-6 col-sm-12 col-xs-12"
            v-model="client" 
            emit-value
            :rules="[val => (val !== null) || 'This field is required']"
            map-options
            lazy-rules
            use-input
            label="Choose client"
            :options="clientOptions"
            :loading="clientIsLoading"
            @filter="clientFilterFn"
            behavior="menu"
            ref="clientRef"
            use-chips
          >
            <template v-slot:selected-item="scope">
                <!-- @remove="scope.removeAtIndex(scope.indexOf(scope.opt))" -->
                <!-- removable -->
              <q-chip
                @remove="removeclientFromclients(scope.opt.id)"
                removable
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
            use-chips
            class="col-lg-4 col-md-6 col-sm-12 col-xs-12"
            v-model="post.clientApproval"
            label="Need Approval"
          />
        </div>
        <!-- USERS -->
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 flex justify-strech column  q-py-md">
          <q-select
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            emit-value
            map-options
            use-input
            @filter="userFilterFn"
            use-chips
            clearable
            ref="userRef"
            v-model="usersSelect"
            multiple
            :options="userOptions"
            label="Choose users"
            :loading="UsersIsLoading"
          >
            <template v-slot:selected-item="scope">
              <q-chip
                @remove="removeUserFromUserSelect(scope.opt.id)"
                removable
                :tabindex="scope.tabindex"
                dense
                color="white"
                text-color="grey"
                class="q-pa-sm q-ma-none"
              >
                <q-avatar v-if="scope.opt.avatar" color="grey" text-color="white"><q-img :src="scope.opt.avatar"/> </q-avatar>
                <q-avatar v-else color="grey" icon="person" text-color="white" />
                <q-item-label class="q-mx-sm">{{ scope.opt.label }}</q-item-label>
                <q-item-section side>
                <q-badge class="q-pa-xs" v-if="scope.opt.canEdit" color="success" label="Can Edit"/>
                </q-item-section>
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
                    use-chips
                    v-model="scope.opt.canEdit"
                    dense
                    class="col-lg-4 col-md-6 col-sm-12 col-xs-12"
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
        </div>
        <q-card flat class="col-12 row items-start bg-secondary q-py-md inline">
          <div class="bg-secondary col-lg-6 col-md-6 col-sm-12 col-xs-12 column q-py-md q-px-md">
            <q-input ref="post.plannedStartDate" label="Plan Start At" v-model="post.plannedStartDate" mask="date" :rules="['date']">
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
          <div class="bg-secondary col-lg-6 col-md-6 col-sm-12 col-xs-12 column q-py-md q-px-md">
            <q-input ref="plannedEndDateRef" label="Deadline" v-model="post.plannedEndDate" mask="date" :rules="['date']">
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
        <q-card bordered class="col-12 q-my-md">
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
  <q-toolbar class="bg-grey-3 col q-px-0 q-mx-0" style="position:sticky !important; bottom:0;z-index:5;">
    <div class="row full-width">
      <q-btn :disable="DraftSubmitIsDisabled" :loading="submitDraftIsLoading" @click="submit('Draft')" label="Save As Draft" no-caps type="reset" color="primary" unelevated class="bg-warning text-white col-lg-6 col-md-6 col-sm-12 col-xs-12" />
      <!-- <q-btn :disable="DraftSubmitIsDisabled" :loading="submitProductionIsLoading" @click="submit('Production')" label="To Production" no-caps type="reset" color="primary" unelevated class="bg-danger text-white col-lg-6 col-md-6 col-sm-12 col-xs-12" />
      <q-btn :disable="DraftSubmitIsDisabled" :loading="submitReviewIsLoading" @click="submit('Review')" label="To Review" no-caps type="reset" color="primary" unelevated class="bg-warning text-white col-lg-6 col-md-6 col-sm-12 col-xs-12" /> -->
      <q-btn :disable="DraftSubmitIsDisabled" :loading="submitCompleteIsLoading" @click="submit('Complete')" label="Complete" no-caps type="reset" color="primary" unelevated class="bg-primary text-white col-lg-6 col-md-6 col-sm-12 col-xs-12" />
    </div>
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

  props: ['submited'],
  data()  {
    return {
      DraftSubmitIsDisabled: ref(false),
      ProductionSubmitIsDisabled: ref(false),
      ReviewSubmitIsDisabled: ref(false),
      CompleteSubmitIsDisabled: ref(false),
      mediasView: ref(['addNewMediaComponent']),
      submitDraftIsLoading: ref(false),
      submitProductionIsLoading: ref(false),
      submitReviewIsLoading: ref(false),
      submitCompleteIsLoading: ref(false),
      clientIsLoading: false,
      UsersIsLoading: false,
      // typeOptions: ['1024x990','298x630','300x590','124x390','203x400','other'],
      priorityOptions: ['High','Middle','Low'],
      clientOptions: ref([]),
      client: ref(null),
      usersSelect: ref([]),
      userOptions: ref([]),
      files: null,
      post: {
        name: '',
        plannedStartDate: ref(''),
        plannedEndDate: ref(''),
        clientApproval: false,
        mineApproved: true,
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
    ...mapActions('socialMediaManagementStore',['createPost','getPosts']),
    dateConversion(d) {
      let newDt = new Date(d)
      newDt.setHours(newDt.getHours() - 3);
      return date.formatDate(newDt, 'YYYY-MM-DD HH:mm');
    },
    removeUserFromUserSelect(id) {
      this.usersSelect = this.usersSelect.filter(ee => {return ee.id !== id})
    },
    removeclientFromclients(id) {
      this.client = null
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
        console.log(this.clientOptions[0]);
        this.clientOptions = this.clientOptions
        .filter(v => {
          return (
            v.label
            .toLowerCase()
            .split(' ')
            .find(tr => {
              return tr.indexOf(needle) > -1
            })
          )
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
          return (
            v.label
            .toLowerCase()
            .split(' ')
            .find(tr => {
              return tr.indexOf(needle) > -1
            })
          )
        })
        console.log(this.userOptions)
      })
    },
    async submit(submittedStage) {
      this.$refs.nameRef.validate();
      this.$refs.clientRef.validate();
      this.$refs.plannedEndDateRef.validate();
      if (
        this.$refs.nameRef.hasError ||
        this.$refs.clientRef.hasError ||
        this.$refs.plannedEndDateRef.hasError
      )
      return
      console.log(submittedStage)
      if (submittedStage === "Draft") {
        this.submitDraftIsLoading = true
        this.ProductionSubmitIsDisabled = true
        this.ReviewSubmitIsDisabled = true
        this.CompleteSubmitIsDisabled = true
      } else if (submittedStage === 'Production') {
        this.submitProductionIsLoading = true
        this.DraftSubmitIsDisabled = true
        this.ReviewSubmitIsDisabled = true
        this.CompleteSubmitIsDisabled = true
      } else if (submittedStage === 'Review') {
        this.submitReviewIsLoading = true
        this.DraftSubmitIsDisabled = true
        this.ProductionSubmitIsDisabled = true
        this.CompleteSubmitIsDisabled = true
      } else if (submittedStage === 'Complete') {
        this.submitCompleteIsLoading = true
        this.DraftSubmitIsDisabled = true
        this.ProductionSubmitIsDisabled = true
        this.ReviewSubmitIsDisabled = true
      }

      this.post.mineApproved = this.post.mineApproved
      this.post.clientApproval = this.clientApproval
      if (this.usersSelect.length > 0 ) {
        console.log("useselect: ", this.usersSelect)
        this.post.users = this.usersSelect.map(id,cEdit => { return {userId: id, canEdit: cEdit } })
      }
      this.post.clientId = Number(this.client.id)
      this.post.plannedStartDate = date.formatDate(this.post.plannedStartDate, 'YYYY-MM-DD HH:mm');
      this.post.plannedEndDate = date.formatDate(this.post.plannedEndDate, 'YYYY-MM-DD HH:mm');
      if (submittedStage === "Draft") {
        this.post.stage = "draft"
        await this.create()
        this.submitDraftIsLoading = false
        this.ProductionSubmitIsDisabled = false
        this.ReviewSubmitIsDisabled = false
        this.CompleteSubmitIsDisabled = false
      } else if (submittedStage === 'Production') {
        this.post.stage = "production"
        await this.create()
        this.submitProductionIsLoading = false
        this.DraftSubmitIsDisabled = false
        this.ReviewSubmitIsDisabled = false
        this.CompleteSubmitIsDisabled = false
      } else if (submittedStage === 'Review') {
        this.post.stage = "review"
        await this.create()
        this.submitReviewIsLoading = false
        this.DraftSubmitIsDisabled = false
        this.ProductionSubmitIsDisabled = false
        this.CompleteSubmitIsDisabled = false
      } else if (submittedStage === 'Complete') {
        this.post.stage = "complete"
        await this.create()
        this.submitCompleteIsLoading = false
        this.DraftSubmitIsDisabled = false
        this.ProductionSubmitIsDisabled = false
        this.ReviewSubmitIsDisabled = false
      }
      this.$emit('closeDialogue')
    },
    async create() {
      const finishedCreate = await this.createPost(this.post);
      console.log("Create finished: ",finishedCreate)
    },
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