<template>
  <div>
    <q-layout view="hHh lpR fFf" container style="height: 100vh" class="shadow-2">
      <q-header class="primary">
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title class="flex">   
            <q-btn flat round icon="menu" @click="drawer = !drawer"/>
             <q-btn flat round icon="chevron_left" to="/" />
            <q-btn flat round>
              <img
                  alt="oneconnect logo"
                  src="~assets/one_logo_neat.png"
                  style="height:30px; width:30px;"
                >
            </q-btn>
        <q-space />
        <div class="flex flex-center q-mr-sm">
            <q-btn flat color="white" round icon="email" size="sm">
              <q-badge color="red" rounded floating>4</q-badge>
            </q-btn>
            <q-btn flat color="white" round icon="notifications" size="sm">
              <q-badge rounded color="red" floating>2</q-badge>
            </q-btn>
        </div>
            <q-btn flat round icon="menu_open" @click="drawer1 = !drawer1"/>
            <q-btn flat round>
                 <img
                  alt="User logo"
                  v-if="user.avatar !== null"
                  :src="user.avatar"
                  style="height:30px; width:30px; border-radius:50%;"
                >
                <q-avatar v-else size="30px" font-size="10px" color="grey" text-color="white" icon="person" />    
                
            <q-menu>
              <q-list>
                <q-item to="/profile" v-close-popup clickable>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section @click="logout">Log out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
      </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="300"
        :breakpoint="1185"
      >
        <q-btn round icon="add" class="absolute-bottom-right q-mr-sm q-mb-sm" color="primary" style="z-index:10 !important; ">
              <q-popup-edit v-model="members" style="min-width: 15rem !important;" :cover="false" :offset="[0, 10]" v-slot="scope">
                <q-select
                      ref="clientRef"
                      :rules="[val => (val !== null) || 'This field is required']"
                      bg-color="white"
                      outlined
                      counter
                      multiple
                      use-chips
                      :loading="isLoading"
                      v-model="members" 
                      :options="options"
                      label="Choose members"
                    >
                    <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                        <q-item-section class="avatar-list">
                        <q-avatar class="q-mr-xs" size="30px">
                            <img :src="scope.opt.avatar ? scope.opt.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
                        </q-avatar>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>       
                        </q-item-section>
                    </q-item>
                    </template>
                </q-select>
                  <q-btn @click="addMembs" no-caps flat label="submit" color="primary" :disable="members.length === 0" v-close-popup />
              </q-popup-edit>
        </q-btn>
        <q-scroll-area ref="scrollAreaRef" style="height: 100%; border-right: 1px solid #ddd">
        <q-list>   
        <q-item style="position: sticky;top:0;z-index:5;background-color: white;">
          <q-input class="full-width" outlined label="Search">
          <template v-slot:prepend>
            <q-icon name="search" class="q-ml-sm" />
          </template>
          </q-input>
        </q-item>
        <div v-if="rooms.length === 0" class="q-pa-md text-grey">No rooms to show!</div>
        <div v-else v-for="(room, i) in rooms" :key="i">
        <q-item :class="room.id === chat.id ? 'bg-blue-1' : ''" 
        :style="room.id === chat.id ? 'border: .5px solid skyblue' : ''" @click="getMessages(room, i)" clickable v-ripple>
        <q-item-section>
          <q-item-label>
           <div class="flex">
            <div class="text-ellipses" v-for="(u, i) in room.users" :key="u.id">
            <q-avatar :class="i === 1 && 'q-ml-xs'" v-show="i < 2" size="25px">
              <img :src="u.avatar ? u.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
            </q-avatar>
            </div><p class="q-mt-sm text-grey">{{room.users.length > 2 ? `...+${room.users.length - 2}` : ''}}</p>
          </div>
          </q-item-label>
          <q-item-label :class="room.users.length < 2 || room.users.length === 2  ? 'q-pt-md' : ''" caption lines="1">{{room.messages.length !== 0 ? room.messages[room.messages.length-1].text : 'No messages!'}}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{room.messages.length !== 0 ? format(room.messages[room.messages.length-1].created_at) : ''}}</q-item-label>
        </q-item-section>
        </q-item>
        <q-separator />
        </div>

    </q-list>
    </q-scroll-area>

      </q-drawer>
          <q-drawer
           show-if-above 
           side="right" 
           bordered
           v-model="drawer1"
          :width="350"
          :breakpoint="1185"
          class="bg-grey-1"
          style="overflow-y: hidden !important;"
           >
           <div v-if="chat" class="fit flex items-center q-pl-md justify-start column  bg-grey-1">
             <div class="row full-width">
               <div v-for="u in allUsers" :key="u.id" class="flex column flex-center q-ma-sm">
                <q-avatar size="75px">
                <q-badge rounded :color="u.online ? 'green' : 'grey-5'" class="absolute-bottom-right q-mr-sm"/>
                <q-btn v-if="roomInfo && user.id === roomInfo.creator_id || u.id === user.id" round size="5px" @click="membToDelete = u.id; cnfrm=true;" icon="close" color="negative" class="absolute-top-right"/>
                <img :src="u.avatar ? u.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
                </q-avatar>
                <p class="text-h6 q-ma-none text-grey">{{u.name}}</p>
               </div>
             </div>
                <!-- <p class="text-caption text-grey q-ma-none">Web developer</p> -->
                <!-- <div class="q-mt-xl flex column" style="width:50% !important;">
                    <div class="flex justify-between">
                        <p class="text-body1 text-weight-medium">Username:</p>
                        <p class="text-body1 text-grey text-weight-medium">jane</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="text-body1 text-weight-medium">DOB:</p>
                        <p class="text-body1 text-grey text-weight-medium">24 July</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="text-body1 text-weight-medium">Email:</p>
                        <p class="text-body1 text-grey text-weight-medium">jane@gmail.com</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="text-body1 text-weight-medium">Phone:</p>
                        <p class="text-body1 text-grey text-weight-medium">9647508363828</p>
                    </div>
                </div> -->
           </div>
             <q-btn round icon="add" class="absolute-bottom-left q-ml-sm q-mb-sm" color="primary" style="z-index:10 !important; ">
              <q-popup-edit v-model="members" style="min-width: 15rem !important;" :cover="false" :offset="[0, 10]" v-slot="scope">
                <q-select
                      ref="clientRef"
                      :rules="[val => (val !== null) || 'This field is required']"
                      bg-color="white"
                      outlined
                      counter
                      multiple
                      use-chips
                      :loading="isLoading"
                      v-model="members1" 
                      :options="options1"
                      label="Choose members"
                    >
                    <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                        <q-item-section class="avatar-list">
                        <q-avatar class="q-mr-xs" size="30px">
                            <img :src="scope.opt.avatar ? scope.opt.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
                        </q-avatar>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>       
                        </q-item-section>
                    </q-item>
                    </template>
                </q-select>
               <q-btn @click="addNewMembers" no-caps flat label="submit" color="primary" :disable="members1.length === 0" v-close-popup />
              </q-popup-edit>
        </q-btn>
          </q-drawer>

      <q-page-container>
          <router-view  />
      </q-page-container>
    </q-layout>
    <q-dialog v-model="cnfrm">
    <confirm @confirm="deleteMemeber" />
    </q-dialog>
  </div>
</template>

<script>
const socket = new WebSocket('wss://oneconnect.it:4000');
import { date } from 'quasar';
import { mapActions, mapState } from 'vuex';
import confirm from '../components/DeleteDialogue.vue';
export default {
  data() {
    return {
      isLoggedIn: localStorage.getItem('accessToken'),
      isExpanded: true,
      isExpanded2: true,
      membToDelete: null,
      members: [],
      options: [],
      members1: [],
      options1: [],
      onlineUsers: [],
      allUsers: [],
      rooms: [],
      roomInfo: null,
      isLoading: false,
      drawer: false,
      drawer1: false,
      cnfrm: false
    }
  },
  computed : {
    ...mapState('example', ['user']),
    ...mapState('userStore', ['users']),
    ...mapState('chatStore', ['chat']),
  },
  components : {
    confirm
  },
  methods: {
    ...mapActions('userStore',['getUsers']),
    ...mapActions('example', ['getUser']),
    ...mapActions('chatStore', ['getChat', 'clearChat']),
    addNewMembers() {
      let self = this;
      let membsToAdd = [];
      for(let i = 0; i<this.members1.length; i++) {
        membsToAdd.push(this.members1[i].id)
      }
      socket.send(JSON.stringify({addRoomUsers: {id: self.chat.id, users: membsToAdd}}));
      membsToAdd = [];
      this.members1 = []
    },
    deleteMemeber() {
      let self = this;
      socket.send(JSON.stringify({deleteRoomUsers: {id: self.chat.id, users: [self.membToDelete]}}));
      this.membToDelete = null;
      this.cnfrm = false;
    },
   async getMessages(room, i) {
     if(document.body.offsetWidth <= 1185) this.drawer = false;
     localStorage.setItem('roomIndex', i);
     this.roomInfo = room
     socket.send(JSON.stringify({getMessagesByRoomId: {room_id: room.id}}));
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
  async beforeMount() {
    this.isLoading = true;
    let self = this
    socket.addEventListener('open', async function (event) {
      socket.send(JSON.stringify({accessToken: localStorage.getItem('accessToken').substring(7, localStorage.getItem('accessToken').length)}));
    });

      socket.addEventListener('message', async function (event) {
      const result = JSON.parse(event.data);

      if(result.onlineUsers) {
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
          await self.getChat({id: self.roomInfo.id, users: self.roomInfo.users, messages : result.messagesByRoomId.roomMessages});
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
      self.rooms = [];
      self.rooms = JSON.parse(event.data).rooms.rooms;
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

    socket.send(JSON.stringify({ping: true}));

    setInterval(() => {
      socket.send(JSON.stringify({ping: true}));
    }, 10000);

  }
}
</script>