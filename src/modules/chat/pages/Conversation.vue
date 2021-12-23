<template>
    <q-page style="height:600px !important;">
    <q-toolbar class="text-primary bg-white absolute-top" style="height:54px !important;z-index:5;">
      <q-toolbar-title>
           <div v-if="chat" class="flex">
            <div  class="flex q-mt-sm" v-for="(u, i) in chat.users" :key="u.id">
            <q-avatar :class="i === 1 && 'q-ml-xs'" v-show="i < 2" size="35px">
              <img :src="u.avatar ? u.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
            </q-avatar>
             <q-avatar class="q-ml-xs bg-grey-3 text-grey" v-show="i === 2 && chat.users.length > 2" size="35px">
               {{`+${chat.users.length - 2}`}}
            </q-avatar>
            </div>
          </div>
      </q-toolbar-title>
      <q-btn flat round dense icon="videocam" />
      <q-btn flat round dense icon="call" />
    </q-toolbar>
    <div>
    <!-- <q-scroll-area ref="scroll" style="height: 80vh" class="scroll-center" > -->
    <div v-if="chat" id="room-container" style="width: 100% !important; height:100vh; overflow-y: scroll !important;padding-top: 54px !important;">
    <div  v-for="(m, i) in chat.messages" :key="m.id">
      <div class="q-pr-xl q-pl-xl">
      <q-chat-message
        :name="m.user.name"
        :avatar="user.id === m.user_id ? user.avatar : m.user.avatar"
        size="35"
        :class="i !== chat.messages.length-1 && 'q-pb-md'"
        class="text-grey"
        :bg-color="user.id !== m.user_id ? 'primary' : 'grey-4'"
        :text-color="user.id === m.user_id ? 'black' : 'white'"
        :sent="user.id === m.user_id"
        style="max-width:100% !important; text-overflow: break !important;"
        :stamp="format(m.created_at)"
      >
       <div @click="m.attachments[0] && download(m.attachments[0])" :class="m.attachments[0] && 'text-grey'" class="flex flex-center column">
         {{m.attachments.length === 0 ? m.text : ''}}
         <div v-if="m.attachments[0]" >
          <img v-if="m.attachments[0].content_type.includes('image')"  class="q-mt-sm" height="150" width="150" :src="m.attachments[0].url">
          <q-avatar v-else square size="100px"> 
            <q-icon  color="grey" name="attach_file" />
          </q-avatar>
         </div>
        </div>
      </q-chat-message>
      <div class="q-mb-xl" :style="i === chat.messages.length-1 && 'padding-bottom:60px;'" v-if="i === chat.messages.length-1">
        <div class="q-ma-none flex" :class="user.id !== m.user_id ? 'q-ml-xl' : 'q-mr-xl justify-end'">
          <div v-for="msg in m.messageRecipients" :key="msg.user.id">
          <q-avatar v-if="msg.status === 'seen' && msg.user_id !== user.id && m.user.id !== msg.user_id" class="q-ml-xs" size="15px">
          <img :src="msg.user.avatar ? msg.user.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
        </q-avatar>
          </div>
        </div>
          <div class="q-pb-xl" v-if="i === chat.messages.length-1 && isTyping && room_id === this.chat.id">
          <q-avatar size="22px">
            <img :src="avatar ? avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" />
          </q-avatar>
          <q-spinner-dots class="q-ml-sm" size="xs" />
          </div>
        </div>
      </div>       

      </div>

    </div>
    <!-- </q-scroll-area> -->
    </div>
    <div class="absolute-bottom">
        <q-input @input.capture="typing" @keydown.enter="send" outlined square bg-color="white" v-model="message" label="Message">
        <template v-slot:append>
          <q-btn color="primary" @click="send" v-show="message !== ''" round dense flat icon="send" />
        </template>
        <template v-slot:prepend>
          <q-btn color="primary" round dense flat icon="attachment">
            <q-popup-proxy>
                <q-banner>
                  <q-file clearable label="File" outlined v-model="file">
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                  <q-btn v-close-popup label="Send" @click="addMsgFile" no-caps :disable="!file" flat color="primary" class="q-mt-sm" size="md" />
                </q-banner>
            </q-popup-proxy>
          </q-btn>
        </template>
      </q-input>
    </div>
    </q-page>
</template>
<script>
import breadcrmps from '../../../components/globalComponents/BreadCrumps.vue';
import { date } from 'quasar'
const socket = new WebSocket('wss://oneconnect.it:4000');
import { mapState, mapActions } from 'vuex';
import axios from 'axios';
export default {
    data() {
        return {
            init: 1,
            message: '',
            file: null,
            isTyping: false,
            avatar: null,
            room_id: null,
            sender:[
              {
              type: 'sender',
              message:'hey, how are you?'
              },
             {
              type: 'receiver',
              message:'doing fine, how r you?'
              }
              ],
        }
    },
    components : {
        breadcrmps,
    },
    computed: {
      ...mapState('chatStore', ['chat']),
      ...mapState('example', ['user']),
    },
    methods : {
      ...mapActions('example', ['getUser',]),
      ...mapActions('chatStore', ['getChat','getMessage']),
      format(dt) {
        return date.formatDate(dt, 'HH:mm');
      },
      typing() {
        socket.send(JSON.stringify({typing:{room_id: Number(this.chat.id)}}));
      },
      download(file) {
        window.open(file.url);
      },
     async addMsgFile() {
       let data = new FormData();
        data.append('files', this.file)
        let res = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/chats/addFiles/',data , {headers: {Authorization: localStorage.getItem('accessToken')}});
        if(res.data.success) {
          socket.send(JSON.stringify({createMessage:{room_id: Number(this.chat.id), text: this.file.name, files: [res.data.data[0].id]}}));
        }
      },
      setScrollPos() {
        // this.$refs.scroll.setScrollPosition('vertical',  10000000000000000000);
      },
      updateScroll(){
          var element = document.getElementById("room-container");
          element.scrollTop = element.scrollHeight;
      },
      send() {
        if(this.message === '')
        return

        let self = this;
        socket.send(JSON.stringify({createMessage:{room_id: Number(this.chat.id), text: this.message}}));
        self.message = '';
        setTimeout(() => {
          self.updateScroll();;
        }, 100);
      },
      receive() {
        setTimeout(() => {
          self.updateScroll();
        }, 100);
      }
    },
   async mounted() {
      await this.getUser();
    },
   async mounted() {
      let i = 1
      let self = this
      socket.addEventListener('open', async function (event) {
      socket.send(JSON.stringify({accessToken: localStorage.getItem('accessToken').substring(7, localStorage.getItem('accessToken').length)}));
      });
      socket.addEventListener('message', async function (event) {
        if(self.init === 1){
          self.init = 2;
        }
        else if(JSON.parse(event.data).messagePerRoom){
         if(JSON.parse(event.data).messagePerRoom.messfinal.room_id === Number(self.chat.id)){
         await self.getMessage(JSON.parse(event.data).messagePerRoom.messfinal);
         self.updateScroll();
         }
        }
        else if(JSON.parse(event.data).userTyping) {
          self.room_id = JSON.parse(event.data).userTyping.room_id ;
          self.isTyping = JSON.parse(event.data).userTyping;
          self.avatar = JSON.parse(event.data).userTyping.avatar;
          setTimeout(() => {    
          self.isTyping = false;
          self.avatar = null;
          }, 2000);
        }
        
        if(JSON.parse(event.data).onlineUsers) {
          return
        }else{
          self.updateScroll();
        }
      });
    },
    setup () {
    return {
      crumps: [
        {id:1,name:'OneConnect',icon: 'home',path: '/'},
        {id:2,name:'Chat',icon: 'chat',path: '/chat'}
        ],
    }
  }
}
</script>
