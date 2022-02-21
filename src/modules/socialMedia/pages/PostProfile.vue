<template>
   <q-page v-if="!loading" class="q-pa-md">
     <div class="flex justify-between items-center">
       <div>
        <p class="text-h4">{{post.name}}</p>
        <breadcrmps :map="crumps" />
        </div>
        <q-btn @click="dialogue = true" color="grey-5" flat icon="edit" round/>
        </div>
        <div class="q-mt-md ">
          <q-card class="row q-pa-md">
            <div class="col-12 flex row">
              <div class="q-my-md col-12 text-grey" v-html="post.description"></div>
              <div class="q-my-md col-6 text-overline text-grey-9">
                <div class="text-h6">Creator
                  <q-chip>
                    <q-avatar>
                      <img v-if="post.creator?.avatar" :src="post.creator?.avatar">
                      <img v-else src="~/assets/one_logo_neat.png">
                    </q-avatar>
                    {{post.creator?.name}}
                    <q-badge class="bg-green q-pa-sm q-mx-md" v-if="(post.socialMediaStudioUsers?.find(eeee => { return eeee.user.id === user.id })?.approved)" color="green">Approved</q-badge>
                  </q-chip>
                </div>
              </div>
              <div class="q-my-md col-6 text-overline text-grey-9">
                <div class="text-h6">Client 
                  <q-chip v-if="post.client">
                    <q-avatar>
                      <img v-if="post.client?.logo" :src="post.client?.logo">
                      <img v-else src="~/assets/one_logo_neat.png">
                    </q-avatar>{{post.client?.name}}</q-chip>-<q-chip class="bg-primary q-pa-sm" v-if="(!post.clientApproval)" color="green">Approval Needed</q-chip>
                  <q-chip v-else>Not exist</q-chip>
                </div>
              </div>
              <div class="q-my-md col-6 text-overline text-grey-9">
                <div class="text-h6">Priority
                  <q-chip>
                    {{post.priority}}
                  </q-chip>
                </div>
              </div>
              <div v-if="post.plannedEndDate" class="q-my-md col-6 text-overline text-grey-9">
                <div class="text-h6">Deadline
                  <q-chip>
                    {{post.plannedEndDate?.split('T')[0]}}
                  </q-chip>
                </div>
              </div>
              <div v-if="post.plannedStartDate" class="q-my-md col-6 text-overline text-grey-9">
                <div class="text-h6">Start At
                  <q-chip>
                    {{post.plannedStartDate?.split('T')[0]}}
                  </q-chip>
                </div>
              </div>
              <div v-if="post.actualdEndDate" class="q-my-md col-6 text-overline text-grey-9">
                <div class="text-h6">Completed At
                  <q-chip>
                    {{post.actualdEndDate?.split('T')[0]}}
                  </q-chip>
                </div>
              </div>
            </div>
            <hr>
            <q-card class="q-my-md col-12 q-py-md q-my-lg">
              <p v-if="post?.socialMediaStudioUsers?.length !== 0" class="text-h6">Assigned users</p>
              <p v-if="post?.socialMediaStudioUsers?.length === 0" class="text-subtitle1 text-grey-5">No users assigned.</p>
              <q-btn @click="getUserOptions(post)" class="absolute-bottom-right q-mr-sm q-mb-sm" size="10px" color="primary" round icon="add" unelevated rounded no-caps>
                <q-popup-edit v-model="userMembers" style="min-width: 15rem !important;" :cover="false" :offset="[0, 10]" v-slot="scope">
                  <q-select
                    ref="clientRef"
                    :rules="[val => (val !== null) || 'This field is required']"
                    bg-color="white"
                    outlined
                    counter
                    multiple
                    use-chips
                    v-model="userMembers" 
                    :options="options"
                    label="Choose users"
                  >
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                          <q-item-section class="avatar-list">
                          <q-avatar clickable :to="'/users/'+scope.opt.id" class="q-mr-xs" size="30px">
                              <q-icon name="person" class="text-grey"/>
                          </q-avatar>
                          <q-item-label>{{ scope.opt.label }}</q-item-label>       
                          </q-item-section>
                      </q-item>
                      </template>
                  </q-select>
                  <q-btn @click="addUsersToPosts(post?.id)" no-caps flat label="submit" color="primary" :disable="users.length === 0" v-close-popup />
                </q-popup-edit>
              </q-btn>
                <div v-if="post?.socialMediaStudioUsers?.length !== 0" class="row">
                    <q-chip v-for="(member, i) in post.socialMediaStudioUsers" :key="member.user"
                      @remove="(user.id === post.creator?.id) ? (memberId = member.user.id) : false ; deleteUserConfirm = true;"
                      :removable="(user.id === post.creator?.id) ?  true : false"
                    >
                    <q-avatar v-if="member.user">
                      <img round v-if="member.user.avatar" :src="member.user.avatar" icon="person" color="grey"/>
                      <img round v-else src="~/assets/one_logo_neat.png" color="grey"/>
                    </q-avatar>
                    {{member.user?.name}}
                    <q-badge class="q-pa-sm q-mx-md" v-if="member.approved" color="green">Approved</q-badge>
                    <q-badge class="q-pa-sm q-mx-md bg-orange" v-if="!member.canEdit" >view-only</q-badge>
                  </q-chip>
                </div>
            </q-card>
        </q-card>
        </div>
          <q-dialog v-model="deleteUserConfirm" persistent>
            <confirm @confirm="deleteUser({id: post.id, users: [memberId]})" />
          </q-dialog>
    </q-page>
    <q-page v-else class="flex flex-center text-h4"><q-spinner /></q-page>
</template>
<script>
import breadcrmps from '../../../components/globalComponents/BreadCrumps.vue';
import confirm from '../../../components/DeleteDialogue.vue'
import { mapActions, mapState } from 'vuex';
import { ref } from 'vue'
export default {
  components :{
    breadcrmps,
    confirm
  },
  data() {
    return {
      post: {
        socialMediaStudioUsers: [],
      },
      userMembers: [],
      options: [],
      confirm: false,
      deleteUserConfirm: false,
      dialogue: false,
      loading: false,
      memberId: ref(null),
      images: [],
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Post',icon: 'send',path: '/posts'}
      ],
      image: null
    }
  },
  computed: {
    ...mapState('socialMediaManagementStore',['currentPost']),
    ...mapState('userStore', ['users']),
    ...mapState('example', ['user'])
  },
  methods: {
    ...mapActions('example', ['getUser']),
    ...mapActions('socialMediaManagementStore',['addFiles','addUsersToPost','removeUserFromPost','getOnePost']),
    ...mapActions('userStore',['getUsers']),
    async addUsersToPosts(id) {
      let usersToAdd = []
      for(let i = 0; i<this.userMembers.length; i++) {
        usersToAdd.push(this.userMembers[i].id);
      }
      await this.addUsersToPost({id:id, users: usersToAdd});
      this.userMembers = [];
      await this.getPost();
    },
    async deleteUser(payload) {
      console.log(payload);
      await this.removeUserFromPost(payload);
      await this.getPost();
    },
    getUserOptions(payload) {
      let optionsA = [];
      let optionsB = [];
      this.options = [];
      setTimeout(() => {
      if(!payload) return
      for(let i = 0; i<this.users.length; i++) {
        for(let j = 0; j<payload.socialMediaStudioUsers.length; j++) {
          if(Number(payload.socialMediaStudioUsers[j].userId) === Number(this.users[i].id)){
            optionsB.push({id:this.users[i].id, label: this.users[j].name});
          }
        }
        optionsA.push({id:this.users[i].id, label: this.users[i].name});
      }
      this.options = optionsA.filter(({ id: id1 }) => !optionsB.some(({ id: id2 }) => id2 === id1));
      }, 200);
    },
    async getPost() {
      await this.getOnePost(this.$route.params.id)
      this.post = this.currentPost
      this.crumps[1].name = this.post?.name;
    },
  },
  async mounted() {
    this.loading = true;
    await this.getPost();
    await this.getUsers();
    await this.getUser();
    console.log("currentPost", this.currentPost);
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
