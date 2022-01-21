<template>
		<q-layout view="lHr LpR lfr">
      <q-drawer
				bordered
        :v-model="true"
        show-if-above
        :mini="miniState"
        :width="356"
        :breakpoint="500"
        class="bg-light"
        :style="'height: 100%;'"
      >
        <div
          class="full-width text-white flex row justify-between q-py-sm bg-primary"
          style="height: 73px"
					@mouseover="miniState = miniState"
					@mouseout="miniState = miniState"
        >
          <q-item class="text-h6 col-12 row flex justify-between">
            <div
							@mouseover="miniState = miniState"
							@mouseout="miniState = miniState"
							class="q-pa-xs"
						>
						{{!miniState ? 'Social Management' : ''}}
						</div>
						<q-btn
							class="text-h6 q-pa-xs text-right"
							@click="miniState = !miniState"
							flat
							clickable
							dense
							:icon="'las la-angle-' + (miniState == true ? 'right' : 'left' )"
						/>
					</q-item>
        </div>

        <q-scroll-area
					@mouseover="miniState = false"
					@mouseout="miniState = true"
					style="height: calc(100% - 73px);"
        >
        <q-list class="rounded-borders text-black">
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
            :v-if="subSideBar.title !== ''"
            v-for="(item,index) in subSideBar.itemsArray"
            :key="index"
            :data-id="item"
            :to="item.url "
            clickable
            @click="drawer = true"
            class="text-grey"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{item.name}}</q-item-section>
          </q-item>
        </q-list>
        </q-scroll-area>
      </q-drawer>
    <q-page-container class="q-py-none q-my-none">
				<div class="full-width flex justify-between items-center q-px-md q-py-md" style="border-bottom: 1px solid lightgrey;">
					<div class="text-h4">Drafts</div>
					<div class="flex items-center">
						<q-btn @click="dialogue = true" color="primary" :label="'Add '+tab[0].toUpperCase()+tab.substr(1, tab.length)" unelevated rounded no-caps />
					</div>
				</div>
				<breadcrmps class="q-pa-md full-width" :map="crumps" />
				<grid class="q-my-none qpy-none" stage="draft" style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);"/>
				<q-dialog seamless position="right" v-model="dialogue">
						<modal @closeDialogue="dialogue = false" :stage="tab" actionType="Add" :id="{}" />
				</q-dialog>
		</q-page-container>
    </q-layout>
</template>
<script>
import breadcrumps from '../../../components/globalComponents/BreadCrumps.vue';
import { ref } from 'vue';
import grid from '../components/Grid.vue'
import AddPost from '../components/AddPost.vue'
export default {
    components: {
			breadcrmps: breadcrumps,
			grid,
			modal: AddPost
    },
    data() {
			return {
			miniState: true,
			table: false,
			subSideBar: {
				title: "Social Management",
				itemsArray: [
					{name: "Drafts", icon: "mode_edit", url: "/social-media-management/drafts"},
					{name: "Calendar", icon: "far fa-calendar-alt", url: "/social-media-management/calendar"},
					{name: "Posts", icon: "send", url: "/social-media-management/posts"},
					{name: "productions", icon: "productions", url: "/social-media-management/productions"},
					{name: "Reviews", icon: "reviews", url: "/social-media-management/reviews"},
					{name: "Rejecteds", icon: "retrieve", url: "/social-media-management/rejecteds"},
					{name: "Completeds", icon: "completeds", url: "/social-media-management/completeds"},
					{name: "Connect Profile", icon: "fas fa-plus-square", url: "/social-media-management/accounts"},
				]
			},
			crumps: [
				{id:1,name:'Social Media Management',icon: 'home',path: '/social-media-management'},
				{id:2,name:'Drafts',icon: 'mode_edit',path: '/social-media-management/drafts'}
			],
			dialogue: false
			}
    },
    setup() {
			return {
				tab: ref('draft'),
			}
    }
}
</script>

<style scoped>

</style>