<template>
<q-page v-if="!loading" class="full-width justify-stretch column inline">
  <q-scroll-area
    class="col-12 items-start flex column"
  >
    <div v-for="(post, i) in data" :key="i" class="fit col-12 flex row justify-center" >
      <div class="row flex col-8 bg-white my-card q-my-md" flat bordered>
          <!-- medias -->
        <q-item
          clickable
          :to="'/social-media-management/post/' + post.id"
        >
          <q-card-section class="row flex justify-between col-6">
            <q-card flat bordered class="col-6">
              <q-item>
                <q-item-section avatar>
                  <q-skeleton type="QAvatar" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton type="text" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" width="80%" />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar />

                <q-item-section class="q-pl-sm">
                  <q-skeleton height="150px" class="q-mb-sm" />

                  <div class="row items-center justify-between no-wrap">
                    <div class="row items-center">
                      <q-icon name="chat_bubble_outline" color="grey-4" class="q-mr-sm" size="18px" />
                      <q-skeleton type="text" width="30px" />
                    </div>

                    <div class="row items-center">
                      <q-icon name="repeat" color="grey-4" class="q-mr-sm" size="18px" />
                      <q-skeleton type="text" width="30px" />
                    </div>

                    <div class="row items-center">
                      <q-icon name="favorite_border" color="grey-4" class="q-mr-sm" size="18px" />
                      <q-skeleton type="text" width="30px" />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-card>

            <q-card flat bordered class="col-6">
              <q-item>
                <q-item-section avatar>
                  <q-skeleton type="QAvatar" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton type="text" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" width="80%" />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar />

                <q-item-section class="q-pl-sm">
                  <q-skeleton height="150px" class="q-mb-sm" />

                  <div class="row items-center justify-between no-wrap">
                    <div class="row items-center">
                      <q-icon name="chat_bubble_outline" color="grey-4" class="q-mr-sm" size="18px" />
                      <q-skeleton type="text" width="30px" />
                    </div>

                    <div class="row items-center">
                      <q-icon name="repeat" color="grey-4" class="q-mr-sm" size="18px" />
                      <q-skeleton type="text" width="30px" />
                    </div>

                    <div class="row items-center">
                      <q-icon name="favorite_border" color="grey-4" class="q-mr-sm" size="18px" />
                      <q-skeleton type="text" width="30px" />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-card>

            <q-card flat bordered class="col-6">
              <q-item>
                <q-item-section avatar>
                  <q-skeleton type="QAvatar" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton type="text" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" width="80%" />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar />

                <q-item-section class="q-pl-sm">
                  <q-skeleton height="150px" class="q-mb-sm" />

                  <div class="row items-center justify-between no-wrap">
                    <div class="row items-center">
                      <q-icon name="chat_bubble_outline" color="grey-4" class="q-mr-sm" size="18px" />
                      <q-skeleton type="text" width="30px" />
                    </div>

                    <div class="row items-center">
                      <q-icon name="repeat" color="grey-4" class="q-mr-sm" size="18px" />
                      <q-skeleton type="text" width="30px" />
                    </div>

                    <div class="row items-center">
                      <q-icon name="favorite_border" color="grey-4" class="q-mr-sm" size="18px" />
                      <q-skeleton type="text" width="30px" />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-card>

            <q-card flat bordered  class="flex row flex-center q-pa-md col-6">
                <q-item class="bg-grey ">
                  <q-item-label flex-center flex row>
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

          </q-card-section>

          <q-card-section class="col-6" flex row>
            <div class="col-12 flex row">
              <div class="col-12 text-h5 q-mt-sm q-mb-xs">{{post.name}}</div>
              <div class="col-12 text-h5 q-mt-sm q-mb-xs">{{post.title}}</div>
              <div class="col-12 text-caption text-grey col-12" v-html="post.description"></div>
              <div class="col-6 text-overline text-orange-9">
                <b>Author</b> 
                    <q-chip>
                    <q-avatar>
                      <img v-if="post.creator?.avatar" :src="post.creator?.avatar">
                      <img v-else src="~/assets/one_logo_neat.png">
                    </q-avatar>
                    {{post.creator?.name}}
                  </q-chip>
              </div>
              <div class="col-6 text-overline text-orange-9">
                <b>Client</b> 
                    <q-chip>
                    <q-avatar>
                      <img v-if="post.client?.logo" :src="post.client?.logo">
                      <img v-else src="~/assets/one_logo_neat.png">
                    </q-avatar>
                    {{post.client?.name}}
                  </q-chip>
              </div>
            </div>
            <hr>
            <q-card class="col-12 q-pa-md q-my-lg">
              <p v-if="post.socialMediaStudioUsers.length !== 0" class="text-h6">Assigned users</p>
              <p v-if="post.socialMediaStudioUsers.length === 0" class="text-subtitle1 text-grey-5">No users assigned.</p>
                <div v-if="post.socialMediaStudioUsers.length !== 0" class="row">
                    <q-chip @remove="memberId = member.userId; deleteMemberConfirm = true;" v-for="(member,i) in post.socialMediaStudioUsers" :key="member.userId">
                    <q-avatar>
                      <img round v-if="member.user.avatar" :src="member?.user?.avatar" icon="person" color="grey"/>
                      <img round v-else src="~/assets/one_logo_neat.png" color="grey"/>
                    </q-avatar>
                    <q-badge class="q-mr-sm" v-if="member.approved" color="green">Approved</q-badge>
                    <q-badge class="q-mr-sm" v-else color="red"> busy</q-badge>
                    <q-badge class="q-mr-sm" v-if="!member.canEdit" disabled color="warning">view-only</q-badge>
                    {{member?.user?.name}}
                  </q-chip>
                </div>
            </q-card>
            <div class="col-lg-6 row flex">
              <div v-if="post.plannedEndDate" class="col-md-6 col-md-6 text-overline text-red-9">
                <b>Deadline</b> <q-badge square color="red" :label="post.plannedEndDate?.split('T')[0]" />
              </div>
              <div v-if="post.plannedStartDate" class="col-md-6 col-md-6 text-overline text-yellow-9">
                <b>Start At</b> <q-badge square color="orange" :label="post.plannedStartDate?.split('T')[0]" />
              </div>
              <div v-if="post.actualdEndDate" class="col-md-6 col-md-6 text-overline text-dark-9">
                <b>Finished</b> <q-badge square color="dark" :label="post.actualdEndDate?.split('T')[0]" />
              </div>
              <div v-if="post.actualStartDate" class="col-md-6 col-md-6 text-overline text-green-9">
                <b>Started</b> <q-badge square color="green" :label="post.actualStartDate?.split('T')[0]" />
              </div>
              <div class="col-md-6 col-md-6 text-overline text-grey-9">clientApproval {{post.clientApproval ? 'Needs approval' : 'No need for approval'}}</div>
              <div class="col-md-6 col-md-6 text-overline text-grey-9">priority {{post.priority}}</div>
              <div class="col-md-6 col-md-6 text-overline text-grey-9">createdBy {{post.createdBy}}</div>
            </div>
          </q-card-section>
        </q-item>

          <q-card-actions class="col-12 justify-start">
            <q-btn flat color="primary" label="Move to Production" />
            <q-btn flat color="warning" label="Edit" />
            <q-btn flat color="red" label="Delete" />

            <q-space />

          </q-card-actions>
      </div>
    </div>
  </q-scroll-area>
  <!-- <div class="row items-center q-pa-sm" >
    <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-sm" v-for="(post, i) in data" :key="i">
    <q-card flat bordered style="position: relative !important;" class="my-card">
      <q-btn style="z-index:2;" class="absolute-top-right" dense round flat icon="more_vert">
        <q-menu
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list style="min-width: 75px">
            <q-item style="padding 0 !important" clickable v-close-popup>
              <q-item-section class="flex flex-center"><q-icon name="delete" color="negative" size="xs"></q-icon></q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section class="flex flex-center"><q-icon name="edit" color="warning" size="xs"></q-icon></q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <router-link :to="`/post/${post.id}`">
      <q-card-section class="full-width row flex flex-center" style="flex:row !important">
        <q-item col-6>
        <q-item-section
        col-3
        >
        <q-avatar class="col-md-12" square color="grey" text-color="white">
          <q-icon name="image"/>
        </q-avatar>

        </q-item-section>
        </q-item>
        <q-item-section
        class="full-width flex row flex-center"
        >
        <q-icon class="col-12" color="grey" name="image"/>
        <q-icon class="col-12" color="grey" name="image"/>
        <q-icon class="col-4" color="grey" name="image"/>
        </q-item-section>
        <q-item-section
          style="width:200px !important;min-width:90% !important;white-space: nowrap;overflow:hidden !important;text-overflow: ellipsis"
          class="row flex text-center q-mt-sm text-grey q-mb-none"
        >
          <span class="col-md-3 text-grey">Name: {{post.name}}</span>
        </q-item-section>
      </q-card-section>
        </router-link>
    </q-card>
    </div>
    </div>
    -->
    <!-- <q-dialog seamless position="right" v-model="dialogue">
      <modal @closeDialogue="dialogue = false" :stage="stage" :inProfile="false" :body="body" />
    </q-dialog> -->
</q-page>
<q-page v-else class="flex flex-center text-h4"><q-spinner /></q-page>
</template>
<script>
import { ref } from 'vue'
import { mapActions, mapState } from 'vuex'
// import AddEditClient from './AddEditClient.vue'
export default {
  data() {
    return {
      loading: ref(false),
      dialogue: false,
      id: '',
      stageUpCase: this.stage[0].toUpperCase()+this.stage.substr(1, this.stage.length),
      body: null,
      options: [],
      data: []
   }
  },
  components: {
      // modal: AddEditClient
  },
  props: ['stage'],
  computed: {
    ...mapState('socialMediaManagementStore', ['allPosts','drafts','productions','reviews','completeds','rejecteds']),
    ...mapState('userStore', ['users']),
  },
  methods: {
    ...mapActions('socialMediaManagementStore',['getPosts','getDrafts','getProductions','getReviews','getCompleteds','getRejecteds', 'deletePost']),
    ...mapActions('userStore',['getUsers']),
    initiateData(dat) {
      this.data = dat
    }
  },
  async mounted() {
    let stageName = this.stage
    this.loading = true
      await this.getPosts();
      await this.initiateData(this.allPosts)
      this.loading =false
    return 
    console.log("stagename: ",stageName)
    if(stageName === 'allPosts') {
      await this.getPosts();
      await this.initiateData(this.allPosts)
      console.log("state fetched from posts:", this.posts)
      }
    if(stageName === 'drafts') {
      await this.getDrafts();
      await this.initiateData(this.drafts)
      console.log("state fetched from drafts:", this.drafts)
      }
    if(stageName === 'productions') {
      await this.getProductions();
      await this.initiateData(this.productions)
      console.log("state fetched from productions:", this.productions)
      }
    if(stageName === 'reviews') {
      await this.getReviews();
      await this.initiateData(this.reviews)
      console.log("state fetched from reviews:", this.reviews)
      }
    if(stageName === 'completeds') {
      await this.getCompleteds();
      await this.initiateData(this.completeds)
      console.log("state fetched from completeds:", this.completeds)
      }
    if(stageName === 'rejecteds') {
      await this.getRejecteds();
      await this.initiateData(this.rejecteds)
      console.log("state fetched from rejecteds:", this.rejecteds)
    }

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