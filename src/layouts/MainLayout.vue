<template>
    <q-layout view="hHh LpR fFf">
      <q-header class="bg-primary glossy">
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title class="flex">    
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
        :width="200"
        :breakpoint="500"
        class="bg-white"
      >

              <!-- :mini="miniState"
        @mouseover="drawerState"
        @mouseout="drawerState" -->
        <q-scroll-area style="height: 100%;">
        <q-list padding class="rounded-borders text-black">
        <!-- <q-item
          to='/'
          exact
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="speed" />
          </q-item-section>

          <q-item-section>Dashboard</q-item-section>
        </q-item> -->
        <q-item
          to='/crm'
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>

          <q-item-section>CRM</q-item-section>
        </q-item>
          <q-expansion-item
            icon="account_balance"
            label="Finance"
            class="text-grey"
            :to="$route.path.split('/')[1] === 'finance' ? $route.path : undefined "
            active-class="my-menu-link"
            @click="isExpanded = !isExpanded"
            :model-value="isExpanded"
          >
          <q-item
          to="/finance/invoice"
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section class="q-ml-md" avatar>
            <q-icon name="receipt" />
          </q-item-section>

          <q-item-section>Invoice</q-item-section>
        </q-item>
          <q-item
          to="/finance/quotation"
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section class="q-ml-md" avatar>
            <q-icon name="request_quote" />
          </q-item-section>

          <q-item-section>Quotation</q-item-section>
        </q-item>
        <q-item
          to='/finance/taxes'
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section class="q-ml-md" avatar>
            <q-icon name="receipt_long" />
          </q-item-section>

          <q-item-section>Tax</q-item-section>
        </q-item>
                <q-item
          to='/finance/categories'
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section class="q-ml-md" avatar>
            <q-icon name="category" />
          </q-item-section>

          <q-item-section>Expense categories</q-item-section>
        </q-item>
        <q-item
          to='/finance/suppliers'
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section class="q-ml-md" avatar>
            <q-icon name="badge" />
          </q-item-section>

          <q-item-section>Suppliers</q-item-section>
          </q-item>
          <q-item
          to='/finance/payment'
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section class="q-ml-md" avatar>
            <q-icon name="payment" />
          </q-item-section>
          <q-item-section>Payment</q-item-section>
          </q-item>
                    <q-item
          to='/finance/expenses'
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section class="q-ml-md" avatar>
            <q-icon name="attach_money" />
          </q-item-section>
          <q-item-section>Expenses</q-item-section>
          </q-item>
          </q-expansion-item>
          <q-item
          to='/accounting'
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="calculate" />
          </q-item-section>

          <q-item-section>Accounting</q-item-section>
        </q-item>
          <q-expansion-item
            icon="work"
            label="Projects"
            class="text-grey"
            :to="$route.path.split('/')[1] === 'projects' || $route.path.split('/')[1] === 'tasks' ? $route.path : undefined"
            active-class="my-menu-link"
            @click="isExpanded2 = !isExpanded2"
            :model-value="isExpanded2"
          >
        <q-item
          to='/projects'
          exact
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section class="q-ml-md" avatar>
            <q-icon name="work" />
          </q-item-section>

          <q-item-section>Projects</q-item-section>
        </q-item>
        <q-item
          to='/projects/tasks'
          exact
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section class="q-ml-md" avatar>
            <q-icon name="task" />
          </q-item-section>

          <q-item-section>Tasks</q-item-section>
        </q-item>
          </q-expansion-item>
       <q-item
          exact
          @click="openChat"
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>

          <q-item-section>Chat</q-item-section>
        </q-item>
        <q-item
          to='/profile'
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>

          <q-item-section>Profile</q-item-section>
        </q-item>
        <q-item
          to='/users'
          clickable
          class="text-grey"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section>Users</q-item-section>
        </q-item>

      </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class="bg-silk">
         <router-view />
      </q-page-container>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
                  <chat :props="showChat" @morph="show" />
          </q-page-sticky>
    </q-layout>
</template>

<script>
import { ref } from 'vue';
import { mapActions, mapState } from 'vuex';
import chat from '../components/PopupChat.vue' 
export default {
  data() {
    return {
      isLoggedIn: localStorage.getItem('accessToken'),
      isExpanded: true,
      isExpanded2: true,
      showChat: false
    }
  },
  computed : {
    ...mapState('example', ['user']),
  },
  methods: {
    show(payload) {
      if(payload === 'card1') {
        setTimeout(() => {
          this.updateScroll();
        }, 600);
      }
    },
    ...mapActions('example', ['getUser']),
      updateScroll() {
      var element = document.getElementById("room-container");
      if(element)
      element.scrollTop = element.scrollHeight;
    },
    openChat() {
      window.open('https://www.oneconnect.it/oc_front_end/dist/spa/#/chat')
    },
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tab');
      localStorage.removeItem('isLoggedIn');
      this.$router.push('/login')
    }
  },
  components : {
    chat
  },
  setup () {
    const miniState = ref(false)
    const drawer = ref(false)
    const num = ref(0)
    return {
      drawer,
      miniState,
      num,
    //  drawerState(evt) {
    //    if(evt.type === 'click') {
    //      num.value = 1;
    //      miniState.value = !miniState.value
    //      miniState.value === true ? num.value = 2 : num.value = 1;
    //      if(drawer.value === false){
    //        drawer.value = true ;
    //      }
    //    }
    //    if(evt.type === 'mouseover' || evt.type === 'mouseout'){
    //      if(num.value === 1 && !miniState.value){
    //        return
    //      }else{
    //        miniState.value = !miniState.value
    //      }
         
    //    }
    //   }
    }
  },
 async mounted() {
    await this.getUser();
  }
}
</script>
<style lang="sass">
.my-menu-link
  color: #308be5 !important
</style>