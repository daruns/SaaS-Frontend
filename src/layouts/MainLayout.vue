<template>
    <q-layout view="lFr LpR fFf">
      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="miniState"
        :width="245"
        :breakpoint="500"
        class="right-side-bar-custom-z-index-below-dialog full-height bg-lie-dark"
        :style="'transform: translateX(' + ((drawer) ? '245px' : '0px') + ') !important'"
      >
      <div class="col flex items-center justify-between header-height-standard full-width text-white q-pa-xs">
        <q-item-list :class="!miniState ? 'col text-h6 q-pa-xs row flex justify-between' : 'col text-h6 q-ma-xs flex justify-center'">
          <q-item v-if="!miniState">{{subSideBar.title}}</q-item>
          <q-item
            flat
            dense
            text-color="white"
            class="q-pa-none flex items-center justify-center"
            color="white"
          ><q-btn flat @click="openedSideBar();" style="transition:0.2s cease; transform: rotate(90deg);"
            text-color="white" class="q-px-none q-py-md" :icon="miniState ? 'fas fa-window-maximize' : 'fas fa-minus'" />
          </q-item>
        </q-item-list>
      </div>
      <q-separator class="bg-white"/>
        <q-scroll-area
          @mouseover="miniState = fixedState === false ? false : miniState"
          @mouseout="miniState = fixedState === false ? true : miniState"
          class="header-height-standard-remaining"
        >
          <!-- <q-item
            to='/'
            exact
            clickable
            class="text-grey"
            active-class="hovered my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="speed" />
            </q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item> -->
        <q-list :key="mindex" v-for="(mitem,mindex) in subSideBar.itemsArray" v-show="(subSideBar.title === 'Finance')" class="rounded-borders text-black">
          <q-separator
            class="bg-white"
            v-if="mitem.name === 'separator'"
          />
          <q-item
            v-else
            :data-id="mitem"
            :to="mitem.url "
            clickable
            @click="drawer = true"
            class="text-grey"
            active-class="hovered my-menu-link"
          >
            <q-item-section  avatar>
              <q-icon :name="mitem.icon" />
            </q-item-section>
            <q-item-section >{{mitem.name}}</q-item-section>
          </q-item>
        </q-list>
        <q-list v-if="subSideBar.title !== 'Finance'" class="rounded-borders text-black">
          <q-item
            :v-if="subSideBar.title !== ''"
            v-for="(item,index) in subSideBar.itemsArray"
            :key="index"
            :data-id="item"
            :to="item.url "
            clickable
            @click="drawer = true"
            class="text-grey"
            active-class="hovered my-menu-link"
          >
            <q-item-section  avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section >{{item.name}}</q-item-section>
          </q-item>

        </q-list>
        </q-scroll-area>
      </q-drawer>
        <!-- @mouseover="miniState = falseminiState = false" -->
      <q-drawer
        :v-model="true"
        show-if-above
        @mouseover="miniState = fixedState === false ? false : miniState"
        @mouseout="miniState = fixedState === false ? true : miniState"
        :width="245"
        :breakpoint="500"
        style="border-right: 1px solid #ddd;"
        class="items-center bg-lie-dark right-side-bar-custom-z-index-below-dialog"
      >
        <div class="items-center flex full-width text-white bg-white header-height-standard">
          <btn class="color-grey">
            <q-item class="flex bg-white justify-between" avatar>
              <img
                alt="oneconnect logo"
                src="~assets/onelogo.png"
                class="btn"
                style="height: 40px;"
              >
            </q-item>
          </btn>
        </div>
        <div v-if="brandCodeName" class="items-center flex full-width row text-white q-px-md q-my-sm q-mb-none bg-none header-height-standard" style="min-height:48px">
          <q-avatar avatar style="font-size:40px">
            <img v-if="brandLogo" :src="brandLogo" />
            <icon v-else class="bg-grey" name="person" color="grey" />
          </q-avatar>
          <div class="q-px-md">@{{brandCodeName}}</div>
        </div>
        <q-separator class="bg-white"/>
        <q-scroll-area class="header-height-standard-remaining">
        <q-list class="rounded-borders text-black">
        <!-- <q-item
          to='/'
          exact
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="speed" />
          </q-item-section>

          <q-item-section>Dashboard</q-item-section>
        </q-item> -->
        <q-item
          to='/crm'
          clickable
          @click="sendSubSideBardData('crm')"
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>

          <q-item-section>CRM</q-item-section>
        </q-item>
        <q-item
          to="/suppliers"
          @click="sendSubSideBardData('suppliers')"
          exact
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="badge" />
          </q-item-section>

          <q-item-section>Suppliers</q-item-section>
        </q-item>
        <q-item
          :to="$route.path.split('/')[1] === 'finance' && $route.path.split('/')[2] !== 'suppliers' ? $route.path : undefined"
          exact
          @click="sendSubSideBardData('finance')"
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="account_balance" />
          </q-item-section>

          <q-item-section>Finance</q-item-section>
        </q-item>
        <q-item
          :to="$route.path.split('/')[1] === 'hrm' ? $route.path : undefined"
          exact
          @click="sendSubSideBardData('hrm')"
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="people_alt" />
          </q-item-section>

          <q-item-section>HRM</q-item-section>
        </q-item>
        <q-item
          :to="$route.path.split('/')[1] === 'projects' ? $route.path : undefined"
          exact
          @click="sendSubSideBardData('projects')"
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="work" />
          </q-item-section>

          <q-item-section>Projects</q-item-section>
        </q-item>
        <q-item
          :to="$route.path.split('/')[1] === 'social-media-management' ? $route.path : undefined"
          exact
          @click="sendSubSideBardData('social-media-management')"
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="fas fa-project-diagram" />
          </q-item-section>

          <q-item-section>Social Media Management</q-item-section>
        </q-item>
        <q-item
          exact
          @click="openChat"
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>

          <q-item-section>Chat</q-item-section>
        </q-item>
        <q-item
          to='/profile'
          clickable
          @click="sendSubSideBardData('profile')"
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>

          <q-item-section>Profile</q-item-section>
        </q-item>
        <q-item
          to='/users'
          clickable
          @click="sendSubSideBardData('users')"
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section>Users</q-item-section>
        </q-item>
      </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class="bg-silk"
        style="margin: 0px; width: calc(100% - 245px) !important;transform: translateX(245px);"
      >
        <router-view class="full-height" />
      </q-page-container>
      <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
              <chat :props="showChat" @morph="show" />
      </q-page-sticky> -->
      <q-drawer
        :v-model="true"
        show-if-above
        :mini="true"
        :breakpoint="500"
        bordered

        side="right"
        class="bg-white"
      >
        <q-item
          to='/profile'
          clickable
          class="header-height-standard full-width text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <img
              alt="User logo"
              v-if="user.avatar !== null"
              :src="user.avatar"
              style="height: 40px;width: 40px; border-radius:50%;"
            >
            <q-avatar v-else size="40px" font-size="10px" color="grey" text-color="white" icon="person" />
          </q-item-section>
        </q-item>
        <q-scroll-area class="header-height-standard-remaining" style="border-right: 1px solid #ddd;">
        <q-list padding class="rounded-borders text-black">
        <!-- <q-item
          to='/'
          exact
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="speed" />
          </q-item-section>

          <q-item-section>Dashboard</q-item-section>
        </q-item> -->
        <q-item
          to='/chat'
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="mail" />
          </q-item-section>

        </q-item>

          <q-item
          to='/notifications'
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="notifications" />
          </q-item-section>

        </q-item>

        <q-item
          exact
          @click="openChat"
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>

        </q-item>
        <q-item
          v-if="['owner','admin'].includes(user.userType)"
          to='/users'
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="people_alt" />
          </q-item-section>

        </q-item>
        <q-item
          to='/profile'
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

        </q-item>

        <q-item
          to='/login'
          clickable
          class="text-grey"
          active-class="hovered my-menu-link"
        >
          <q-item-section avatar @click="logout">
            <q-icon name="logout" />
          </q-item-section>

        </q-item>

      </q-list>
        </q-scroll-area>
      </q-drawer>

    </q-layout>
</template>

<script>
import { ref } from 'vue';
import { mapActions, mapState } from 'vuex';
import chat from '../components/PopupChat.vue' 
export default {
  data() {
    return {
      brandCodeName: null,
      brandLogo: null,
      isLoggedIn: localStorage.getItem('accessToken'),
      showChat: true,
      statusof: "",
      toggledM: false,
      routePath: this.$router.currentRoute._value.path.split("/")[1],
      subSideBar: {
        itemsArray: [{name:"",icon:"",url:""}],
        title: ""
      },
    }
  },
  computed : {
    ...mapState('example', ['user']),
  },
  methods: {
    openedSideBar() {
      this.toggledM = this.miniState = !this.miniState
      if (this.miniState === false) { this.fixedState = true }
      if (this.miniState === true) { this.fixedState = false }
    },
    drawerState(evnt) {
      if (this.routePath) {
        if(['hrm','finance','projects','social-media-management'].includes(this.routePath)) {
          if (evnt === "mount") {
            this.drawer = true
            this.sendSubSideBardData(this.routePath)
            this.statusof = "mount"
          }
          if (evnt === "mouseover" && this.toggledM) {
            this.statusof = "mouseover"
            this.miniState = false
          }
          if (evnt === "mouseout" && this.toggledM ){
            this.statusof = "mouseout"
            this.miniState = true
          }
        } else {
          this.drawer = false
          this.miniState = false
          this.statusof = evnt
        }
      }
    },
    defaultValueSubSide() {
      let path = this.routePath
      if (path == 'social-media-managemenet') {
        this.sendSubSideBardData("social-media-managemenet")
      }
      if (path == 'finance') {
        this.sendSubSideBardData("finance")
      }
      if (path == 'hrm') {
        this.sendSubSideBardData("hrm")
      }
      if (path == 'projects') {
        this.sendSubSideBardData("projects")
      }
      this.drawerState("mount")
    },
    sendSubSideBardData(payload) {
      if (payload === "social-media-management") {
        this.subSideBar.title = "Social Management"
        this.subSideBar.itemsArray = [
          {name: "Drafts", icon: "mode_edit", url: "/social-media-management/drafts"},
          {name: "Calendar", icon: "far fa-calendar-alt", url: "/social-media-management/calendar"},
          {name: "Posts", icon: "send", url: "/social-media-management/posts"},
          {name: "productions", icon: "precision_manufacturing", url: "/social-media-management/productions"},
          {name: "Reviews", icon: "remove_red_eye", url: "/social-media-management/reviews"},
          {name: "Rejecteds", icon: "youtube_searched_for", url: "/social-media-management/rejecteds"},
          {name: "Completeds", icon: "assignment_turned_in", url: "/social-media-management/completeds"},
          {name: "Connect Profile", icon: "fas fa-plus-square", url: "/social-media-management/accounts"},
        ]
        this.$router.push(this.subSideBar.itemsArray[0].url)
        this.drawer = true
        this.miniState = true
        this.toggledM = true
      } else if (payload === "finance") {
        this.subSideBar.title = "Finance"
        this.subSideBar.itemsArray = [
          {name: "Invoice", icon: "receipt", url: "/finance/invoice"},
          {name: "Quotation", icon: "request_quote", url: "/finance/quotation"},
          {name: "separator", icon: "", url: ""},
          {name: "Expenses", icon: "savings", url: "/finance/expenses"},
          {name: "separator", icon: "", url: ""},
          {name: "Products & Services", icon: "category", url: "/finance/accounting"},
          // {name: "Suppliers", icon: "badge", url: "/finance/suppliers"},
          {name: "Expense categories", icon: "grid_view", url: "/finance/categories"},
          {name: "Payment Types", icon: "fas fa-credit-card", url: "/finance/payment"},
          {name: "Tax Types", icon: "receipt_long", url: "/finance/taxes"},
        ]
        this.$router.push(this.subSideBar.itemsArray[0].url)
        this.drawer = true
        this.miniState = true
        this.toggledM = true
      } else if (payload === "hrm") {
        this.subSideBar.title = "HRM"
        this.subSideBar.itemsArray = [
          {name: "Employees", icon: "person", url: "/hrm/employees"},
          {name: "Leaves", icon: "description", url: "/hrm/leaves"},
          {name: "Attendance", icon: "touch_app", url: "/hrm/attendances"},
          {name: "Leave Types", icon: "category", url: "/hrm/leaveTypes"},
          {name: "Departments", icon: "groups", url: "/hrm/departments"},
          {name: "Designations", icon: "grid_view", url: "/hrm/designations"},
        ]
        this.$router.push(this.subSideBar.itemsArray[0].url)
        this.drawer = true
        this.miniState = true
        this.toggledM = true
      } else if (payload === "projects") {
        this.subSideBar.title = "projects"
        this.subSideBar.itemsArray = [
          {name: "Projects", icon: "work", url: "/projects/dashboard"},
          {name: "Tasks", icon: "task", url: "/projects/tasks"}
        ]
        this.$router.push(this.subSideBar.itemsArray[0].url)
        this.drawer = true
        this.miniState = true
        this.toggledM = true
      } else {
        this.subSideBar = {}
        this.drawer = false
        this.miniState = false
        this.toggledM = false
      }
    },
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
      window.open(process.env.CHAT_PATH)
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
    const fixedState = ref(false)
    const miniState = ref(false)
    const drawer = ref(false)
    return {
      fixedState,
      miniState,
      drawer,
    }
  },
 async mounted() {
   console.log("started: ", this.subSideBar )
    this.defaultValueSubSide()
    console.log("ended: ", this.subSideBar )
    await this.getUser();
   this.brandCodeName = this.user.brand?.name ? this.user.brand?.name : this.user.brand?.brandCodeName
   this.brandLogo = this.user.brand?.logo
  }
}
</script>
<style lang="sass">
.my-menu-link
  color: #308be5 !important
aside.q-drawer.q-drawer--right
  z-index: 1005 !important
.q-editor__toolbar
  width: auto !important
  flex-wrap: wrap !important
.q-editor__toolbar-group
  width: auto !important
.bg-lie-dark
  background-color: #1c1e21 !important
.hovered
  background-color: #2b343e !important
</style>