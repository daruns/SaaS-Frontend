<template>
  <div class="relative-position" style="height: 500px !important; z-index:20 !important;">
    <q-btn
      class="absolute-bottom-right"
      v-morph:btn:mygroup:500.resize="morphGroupModel"
      fab
      color="primary"
      size="lg"
      icon="chat"
      @click="nextMorph(); $emit('morph',morphGroupModel)"
      style="z-index:20 !important;"
    />

    <div
      v-morph:card1:mygroup:500.resize="morphGroupModel"
      class="bg-white text-primary absolute-bottom-right"
      style="width: 300px; height: 500px !important;z-index:20 !important;"
    >
    <div  class="q-mt-xl">
      <!-- <q-scroll-area v-if="showList" ref="scrollAreaRef" style="border-bottom-right-radius: 2em;height: 350px !important;"> -->
        <q-list v-if="showList" style="height: 450px !important;overflow-y:scroll !important; overflow-x:hidden !important;">   
        <div v-if="rooms.length === 0" class="q-pa-md text-grey">No rooms to show!</div>
        <div v-else v-for="(room, i) in rooms" :key="i">
          <div :class="'q-pa-xs'"> 
        <q-item style="border-radius: 10px;" :class="room.id === chat.id ? 'bg-blue-1' : ''" 
         @click="getMessages(room, i)" clickable v-ripple>
        <q-item-section>
          <q-item-label>
           <div v-if="room.room_type === 'channel' && !room.name && !room.avatar" class="flex">
              <div  v-for="(u, i) in room.users" :key="u.id">
              <div :style="i === 1 && room.users.length > 1 ? 'transform: translate(-45px,20px) !important;' : `transform: translate(${room.users.length > 1 ? '10' : '0'}px) !important;`" class="text-ellipses" v-if="i < 2">
              <q-avatar  :class="i === 1 && 'q-ml-xs'"  :size="room.users.length > 1 ? '40px' : '50px'">
              <img :src="u.avatar ? u.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
            </q-avatar>
            </div>
            </div>
           <div :class="room.users.length > 1 ? 'q-mt-md' : 'q-mt-sm'" :style=" room.users.length > 1 && 'transform: translateX(-35px) !important;'" class="items-center col">
                        <div class="flex col">
            <div class="flex">
            <div class="flex" v-for="(us, i) in room.users" :key="us.id">
            <p v-if="i < 2" class="q-mr-none text-black q-mt-none q-mb-none q-ml-sm">
              {{us.name}}
              </p>
              <p class="q-ma-none" v-if="i < 1" >,</p>
            </div>
              <p class="q-ma-none" v-if="room.users.length > 2">...</p>
              </div>
            </div>
             <p class="q-mt-xs q-ml-sm text-grey" style="width: 80% !important;">
            {{room.messages.length !== 0 ? room.messages[room.messages.length-1].text.slice(0,30) : 'No messages!'}}
            </p>
            </div>
          </div>
          <div class="flex" v-else-if="!room.avatar && room.name">
            <div  v-for="(u, i) in room.users" :key="u.id">
              <div :style="i === 1 ? 'transform: translate(-45px,20px) !important;' : 'transform: translate(10px) !important;'" class="text-ellipses" v-if="i < 2">
              <q-avatar  :class="i === 1 && 'q-ml-xs'"  size="40px">
              <img :src="u.avatar ? u.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
            </q-avatar>
            </div>
            </div>
           <div style="transform: translateX(-35px) !important;" class="items-center q-mt-md col">
            <p class="q-mr-none q-mt-none q-mb-none q-ml-sm text-black">{{room.name}}</p>
             <p class="q-mt-xs q-ml-sm text-grey" style="width: 80% !important;">
            {{room.messages.length !== 0 ? room.messages[room.messages.length-1].text.slice(0,30) : 'No messages!'}}
            </p>
            </div>
          </div>
          <div class="flex items-center" v-else-if="room.room_type === 'channel' && room.avatar && !room.name">
            <q-avatar size="50px">
              <img :src="room.avatar">
            </q-avatar>
            <div class="flex col">
            <div class="flex q-mt-md">
            <div class="flex" v-for="(us, i) in room.users" :key="us.id">
            <p v-if="i < 2" class="q-mr-none text-black q-mt-none q-mb-none q-ml-sm">
              {{us.name}}
              </p>
              <p class="q-ma-none" v-if="i < 1" >,</p>
            </div>
              <p class="q-ma-none" v-if="room.users.length > 2">...</p>
              </div>
              <div>
               <p class="q-mt-xs q-ml-sm text-grey" style="width: 80% !important;">
                {{room.messages.length !== 0 ? room.messages[room.messages.length-1].text.slice(0,30) : 'No messages!'}}
                </p>
              </div>
            </div>
          </div>
          <div class="flex items-center" v-else-if="room.room_type === 'channel' && room.avatar && room.name">
            <q-avatar size="50px">
              <img :src="room.avatar">
            </q-avatar>
            <div class="items-center q-mt-md col">
            <p class="q-mr-none q-mt-none q-mb-none text-black q-ml-sm">{{room.name}}</p>
             <p class="q-mt-xs q-ml-sm text-grey" style="width: 80% !important;">
            {{room.messages.length !== 0 ? room.messages[room.messages.length-1].text.slice(0,30) : 'No messages!'}}
            </p>
            </div>
          </div>
         <div class="flex" v-else-if="room.users.length === 1">
           <div class="flex items-center">
             <div v-for="u in room.users" :key="u.id">
              <div class="flex">
            <q-avatar size="50px">
              <img :src="u.avatar ? u.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
            </q-avatar>
            <div class="items-center q-mt-sm col">
            <p class="q-mr-none q-mt-none text-black q-mb-none q-ml-sm">{{u.name}}</p>
              <p  class="q-mt-xs q-ml-sm text-grey" style="width: 80% !important;">
                {{room.messages.length !== 0 ? room.messages[room.messages.length-1].text.slice(0,30) : 'No messages!'}}
                </p>
            </div>
             </div>
           </div>
           </div>
          </div>
            <div class="flex" v-else>
           <div class="flex items-center">
             <div v-for="u in room.users" :key="u.id">
              <div class="flex" v-if="user.id !== u.id">
            <q-avatar size="50px">
              <img :src="u.avatar ? u.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
            </q-avatar>
            <div class="items-center q-mt-sm col">
            <p class="q-mr-none q-mt-none text-black q-mb-none q-ml-sm">{{u.name}}</p>
              <p  class="q-mt-xs q-ml-sm text-grey" style="width: 80% !important;">
                {{room.messages.length !== 0 ? room.messages[room.messages.length-1].text.slice(0,30) : 'No messages!'}}
                </p>
            </div>
             </div>
           </div>
           </div>
          </div>
          </q-item-label>
          <!-- <q-item-label v-if="room.room_type === 'channel' && !room.name && !room.avatar" caption lines="1">
            <p class="q-mt-xs">
            {{room.messages.length !== 0 ? room.messages[room.messages.length-1].text : 'No messages!'}}
            </p>
            </q-item-label> -->
        </q-item-section>
        <q-item-section side top>
          <q-item-label caption>{{room.messages.length !== 0 ? format(room.messages[room.messages.length-1].created_at) : ''}}</q-item-label>
        </q-item-section>
         <div class="flex flex-center q-mr-sm absolute-right">
         <q-icon v-if="room.messages[room.messages.length-1] && room.messages[room.messages.length-1].msg_recepeint_status !== 'seen' && room.messages.msg_recepeint_user_id !== user.id" color="primary" rounded name="circle" size="12px" />         
         </div>
        </q-item>
        </div>
        </div>
        <!-- <div v-else v-for="(room, i) in rooms" :key="i">
          <q-item @click="getMessages(room, i)" style="border-radius: 10px;" :class="room.id === chat.id ? 'bg-blue-1' : ''" clickable v-ripple>
            <q-item-section side>
           <div class="flex">
            <div class="text-ellipses" v-for="(u, i) in room.users" :key="u.id">
            <q-avatar :style="i !== 0 ? 'transform: translateX(-20px) !important;' : 'z-index:1 !important;'" :class="i === 1 && 'q-ml-xs'" v-show="i < 2" size="35px">
              <img :src="u.avatar ? u.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
            </q-avatar>
             <q-avatar style='transform: translateX(-20px) !important;' class="q-ml-xs bg-grey-3 text-grey" v-show="i === 2 && room.users.length > 2" size="35px">
               {{`+${room.users.length - 2}`}}
            </q-avatar>
            </div>
          </div>
            </q-item-section>
            <q-item-section>
              <q-item-label class="flex text-ellipses"><p class="q-ma-none" v-for="u in room.users" :key="u.id">{{u.name}},</p></q-item-label>
              <q-item-label caption>{{room.messages.length !== 0 ? room.messages[room.messages.length-1].text : 'No messages!'}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              {{room.messages.length !== 0 ? format(room.messages[room.messages.length-1].created_at) : ''}}
            </q-item-section>
          </q-item>
        </div> -->
    </q-list>
    <!-- </q-scroll-area> -->
    <conversation :sckt="sckt" @hideChat="showList = true" :popup="true" bg="white" hght="height:400px !important;" v-else />
    </div>

        <q-btn color="black" class="absolute-top-right" style="z-index:20 !important;" icon="close" round flat @click="nextMorph();$emit('morph',morphGroupModel)" />
        <q-icon class="absolute-top-left q-ml-sm q-mt-sm" size="md" name="question_answer" color="primary" />
    </div>
  </div>
</template>
<script>
const socket = new WebSocket(process.env.CHAT_END_SOCKET);
import { date } from 'quasar';
import { mapActions, mapState } from 'vuex';
import confirm from '../components/DeleteDialogue.vue';
import conversation from '../modules/chat/pages/Conversation.vue'
import axios from 'axios';
import { ref } from 'vue'
const nextMorphStep = {
  btn: 'card1',
  card1: 'btn',
}
export default {
  setup () {
    const morphGroupModel = ref('btn')
    return {
      morphGroupModel,
      nextMorph () {
        morphGroupModel.value = nextMorphStep[ morphGroupModel.value ]
      }
    }
  },
  data() {
    return {
      isLoggedIn: localStorage.getItem('accessToken'),
      isExpanded: true,
      isExpanded2: true,
      membToDelete: null,
      members: [],
      sckt:ref(socket),
      addMembers: false,
      createRoom: false,
      channelName: '',
      channelPhoto: null,
      changePhoto: false,
      options: [],
      members1: [],
      options1: [],
      onlineUsers: [],
      allUsers: [],
      rooms: [],
      roomInfo: null,
      loading: false,
      isLoading: false,
      drawer: false,
      drawer1: false,
      cnfrm: false,
      changeName: false,
      chatId: null,
      path: '',
      showList: true
    }
  },
  computed : {
    ...mapState('example', ['user']),
    ...mapState('userStore', ['users']),
    ...mapState('chatStore', ['chat']),
    getHeight() {      
      return 'height: 50vh !important;'
    }
  },
  components : {
    confirm,
    conversation
  },
  methods: {
    ...mapActions('userStore',['getUsers']),
    ...mapActions('example', ['getUser']),
    ...mapActions('chatStore', ['getChat', 'clearChat']),
    async changeChannelName() {
      let self = this;
      this.chatId =  Number(self.chat.id);
      socket.send(JSON.stringify({editRoom: {id: Number(self.chat.id), avatar: self.roomInfo.avatar, name:self.channelName}}))
    },
     async changeChannelPhoto() {
      let self = this;
      let file = new FormData();
      file.append('files', this.channelPhoto);
      try{
      let response = await axios.post(process.env.OC_BACKEND_API + 'chats/addFiles', file, {headers: {Authorization: localStorage.getItem('accessToken')}});
      if(response.data.success){
      this.chatId =  Number(self.chat.id);
      socket.send(JSON.stringify({editRoom: {id: Number(self.chat.id), name: self.roomInfo.name, avatar:response.data.data[0].url}}));
      }else{
       this.$q.notify({
          type: 'negative',
          message: 'Something went wrong!'
      })
      }
      }catch(e) {
        console.log(e)
        this.$q.notify({
          type: 'negative',
          message: 'Something went wrong!'
      }) 
      }
    },
    addNewMembers() {
      let self = this;
      let membsToAdd = [];
      for(let i = 0; i<this.members1.length; i++) {
        membsToAdd.push(this.members1[i].id)
      }
      socket.send(JSON.stringify({addRoomUsers: {id: self.chat.id, users: membsToAdd}}));
      membsToAdd = [];
      this.members1 = [];
      this.addMembers = false;
    },
    deleteMemeber() {
      let self = this;
      socket.send(JSON.stringify({deleteRoomUsers: {id: self.chat.id, users: [self.membToDelete]}}));
      this.membToDelete = null;
      this.cnfrm = false;
    },
    checkType (files) {
        return files.filter(file => file.type.includes('image'))
    },
    onRejectedImage() {
        this.$q.notify({
          type: 'negative',
          message: 'Only images are allowed!'
      })
      },
   async getMessages(room, i) {
     localStorage.setItem('roomIndex', i);
     this.roomInfo = room
     socket.send(JSON.stringify({getMessagesByRoomId: {room_id: room.id}}));
     this.showList = false;
    //  await this.getChat(room);
    },
    getMessagesImmediate() {
      let self = this;
      socket.send(JSON.stringify({getMessagesByRoomId: {room_id: Number(self.chat.id)}}));
    },
     format(dt) {
        return date.formatDate(dt, 'HH:mm');
      },
    addMembs() {
      let membsToAdd = [];
      for(let i = 0; i<this.members.length; i++) {
          membsToAdd.push(Number(this.members[i].id));
      }
      socket.send(JSON.stringify({createRoom: {users: membsToAdd } } ) );
      membsToAdd = [];
      this.members = [];
      this.createRoom = false;
    },
    updateScroll() {
      var element = document.getElementById("room-container");
      if(element)
      element.scrollTop = element.scrollHeight;
    },
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tab');
      localStorage.removeItem('isLoggedIn');
      this.$router.push('/login')
    },
    getUserOptions() {
      let optionsB = [];
      this.options = [];
      setTimeout(() => {
      for(let i = 0; i<this.users.length; i++) {
          optionsB.push({id:this.users[i].id, label: this.users[i].name, avatar: this.users[i].avatar});
      }
      }, 100);
      this.options = optionsB;
      this.options1 = optionsB
    },
    //   getMemberOptions() {
    //   let optionsB = [];
    //   let optionsA = [];
    //   this.options1 = [];
    //   console.log(this.chat)
    //   setTimeout(() => {
    //   for(let i = 0; i<this.users.length; i++) {
    //   for(let j = 0; j<this.chat.users.length; j++) {
    //     if(Number(this.chat.users[j].id) === Number(this.users[i].id)){
    //       optionsB.push({id:this.users[i].id, label: this.users[j].name});
    //     }
    //   }
    //       optionsA.push({id:this.users[i].id, label: this.users[i].name, avatar:this.users[i].avatar});
    //   }
    //   }, 400);
      
    //   this.options1 = optionsA.filter(({ id: id1 }) => !optionsB.some(({ id: id2 }) => id2 === id1));
    // },
  },
  mounted() {
        this.path = this.$route.path 
  },
  async beforeMount() {

    this.isLoading = true;
    let self = this
    socket.addEventListener('open', async function (event) {
      socket.send(JSON.stringify({accessToken: localStorage.getItem('accessToken').substring(7, localStorage.getItem('accessToken').length)}));
    });

      socket.addEventListener('message', async function (event) {
      const result = JSON.parse(event.data);
      console.log(result)
      if(result.reqType === 'addRoom') {
        self.getMessages(result.rooms.rooms[result.rooms.rooms.length-1],0)
      }
      if(result.onlineUsers) {
        let i = 1 ;
        self.onlineUsers = result.onlineUsers
        let ofUsers = self.chat.users.filter(({ id: id1 }) => !result.onlineUsers.some(({ id: id2 }) => id2 === id1));
        let onUsers = self.chat.users.filter(({ id: id1 }) => result.onlineUsers.some(({ id: id2 }) => id2 === id1));

        self.allUsers = [];

        for(let i = 0; i<onUsers.length; i++) {
          self.allUsers.push({...onUsers[i], online:true})
        }

        for(let i = 0; i<ofUsers.length; i++) {
          self.allUsers.push({...ofUsers[i], online:false})
        }

      }

      if(result.messagesByRoomId) {
        if(self.roomInfo.id === result.messagesByRoomId.room_id){

          await self.getChat({id: self.roomInfo.id, name: self.roomInfo.name, avatar: self.roomInfo.avatar, room_type: self.roomInfo.room_type, users: self.roomInfo.users, messages : result.messagesByRoomId.roomMessages});
          self.updateScroll();
          socket.send(JSON.stringify({ping: true}));
        }
        // console.log(self.rooms[Number(localStorage.getItem('roomIndex'))].id)
        // if(Number(self.chat.id) === Number(self.rooms[Number(localStorage.getItem('roomIndex'))].id))
      }
      if(result.messagePerRoom) {
        for(let i = 0; i<self.rooms.length; i++) {
          if(self.rooms[i].id === result.messagePerRoom.messfinal.room_id) {
            self.rooms[i].messages.push(result.messagePerRoom.messfinal);
            await self.getMessagesImmediate()
          }
        }
        
      }
      if (result.rooms) {
      // if(result.reqType === 'editRoom') {
      //     for(let i = 0; i<self.rooms.length; i++) {
      //     if(Number(self.chatId) === Number(JSON.parse(event.data).rooms.rooms[i].id)) {
      //       for(let j = 0; j<self.rooms.length; j++) {
      //         if(Number(self.rooms[j].id) === Number(self.chatId))
      //         self.rooms[j].name = JSON.parse(event.data).rooms.rooms[i].name;
      //         self.rooms[j].avatar = JSON.parse(event.data).rooms.rooms[i].avatar;
      //       }
      //     }
      //   }
      //   return
      // }
      self.rooms = [];
      self.rooms = JSON.parse(event.data).rooms.rooms.reverse();
      if(self.rooms.length === 0) {
        await self.clearChat();
        return
      }
      if(self.chat) {
        if(localStorage.getItem('roomIndex') && Number(localStorage.getItem('roomIndex')) >= 0 && (self.rooms.length >= Number(localStorage.getItem('roomIndex')))){
          setTimeout(() => {
            socket.send(JSON.stringify({getMessagesByRoomId: {room_id: self.rooms[Number(localStorage.getItem('roomIndex'))].id}}));
          }, 100);
        self.roomInfo = self.rooms[Number(localStorage.getItem('roomIndex'))];
        // await self.getChat(self.rooms[Number(localStorage.getItem('roomIndex'))]);
        }
        else{
        socket.send(JSON.stringify({getMessagesByRoomId: {room_id: self.rooms[0].id}}));
        self.roomInfo = self.rooms[0];
        // await self.getChat(self.rooms[0]);
        localStorage.setItem('roomIndex', 0)
        }
      }else { 
        socket.send(JSON.stringify({getMessagesByRoomId: {room_id: self.rooms[0].id}}));
        self.roomInfo = self.rooms[0];
        // await self.getChat(self.rooms[0]);
        localStorage.setItem('roomIndex', 0)
      }
      } else if (result.typing) {
      }
      });

    await this.getUser();
    await this.getUsers();
    this.getUserOptions();
    // this.getMemberOptions();
    this.isLoading = false;


    setInterval(() => {
      socket.send(JSON.stringify({ping: true}));
    }, 10000);

  },
}
</script>