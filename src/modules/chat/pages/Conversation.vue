<template>
    <q-page class="q-pa-md">
    <q-toolbar class="text-primary bg-white absolute-top" style="height:54px !important;">
      <q-toolbar-title>
           <div v-if="chat" class="flex">
            <div  class="flex q-mt-sm" v-for="(u, i) in chat.users" :key="u.id">
            <q-avatar :class="i === 1 && 'q-ml-xs'" v-show="i < 2" size="35px">
              <img :src="u.avatar ? u.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
            </q-avatar>
            <div class="q-mt-sm q-ml-xs" v-if="chat.users.length === 2 && i === 0">
            </div>
            </div>
            <div class="q-mt-md" v-if="chat.users">
            <p class="text-grey q-ma-none">{{chat.users.length > 2 ? `...+${chat.users.length - 2}` : ''}}</p>
            </div>
          </div>
      </q-toolbar-title>
      <q-btn flat round dense icon="videocam" />
      <q-btn flat round dense icon="call" />
    </q-toolbar>
    <div class="q-mt-xl">
    <q-scroll-area ref="scroll" style="height: 80vh" class="scroll-center" >
    <div v-if="chat" style="width: 100% !important;">
    <div v-for="(m, i) in chat.messages" :key="m.id">
      <div>
      <q-chat-message
        :name="m.user.name"
        :avatar="user.id === m.user_id ? user.avatar : m.user.avatar"
        class="q-pb-sm text-grey"
        :class="user.id !== m.user_id && 'q-ml-xl'"
        :bg-color="user.id !== m.user_id ? 'primary' : 'grey-4'"
        :text-color="user.id === m.user_id ? 'black' : 'white'"
        :sent="user.id === m.user_id"
        style="max-width:90% !important; text-overflow: break !important;"
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
      <div class="q-mb-xl" v-if="i === chat.messages.length-1">
        <div class="q-ma-none flex" :class="user.id !== m.user_id ? 'q-ml-xl' : 'q-mr-xl justify-end'">
          <div v-for="msg in m.messageRecipients" :key="msg.user.id">
          <q-avatar v-if="msg.status === 'seen'" class="q-ml-xs" size="15px">
          <img :src="msg.user.avatar ? msg.user.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'">
        </q-avatar>
          </div>
        </div>
      </div>
      </div>
        <div class="q-mb-xl" v-if="i === chat.messages.length-1 && isTyping && room_id === this.chat.id" >
         <q-spinner-dots size="md" />
        </div>
        </div>
    </div>
    </q-scroll-area>
    </div>
    <div style="margin-bottom:.5px !important;" class="absolute-bottom">
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
        this.$refs.scroll.setScrollPosition('vertical',  10000000000000000000);
      },
      send() {
        if(this.message === '')
        return

        let self = this;
        socket.send(JSON.stringify({createMessage:{room_id: Number(this.chat.id), text: this.message}}));
        self.message = '';
        setTimeout(() => {
          self.setScrollPos();
        }, 100);
      },
      receive() {
        setTimeout(() => {
          self.setScrollPos();
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
         self.setScrollPos();
         }
        }
        else if(JSON.parse(event.data).userTyping) {
          self.room_id = JSON.parse(event.data).userTyping.room_id ;
          self.isTyping = true;
          setTimeout(() => {    
            self.isTyping = false;
          }, 2000);
        }
         self.setScrollPos();
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
