<template>
  <q-page class="q-py-none q-my-none">
      <div class="full-width flex justify-between items-center q-px-md q-py-md" style="border-bottom: 1px solid lightgrey;">
        <div class="text-h4">In Review</div>
        <!-- <div class="flex items-center">
          <q-btn @click="dialogue = true" color="primary" :label="'Add '+tab[0].toUpperCase()+tab.substr(1, tab.length)" unelevated rounded no-caps />
        </div> -->
      </div>
      <breadcrmps class="q-pa-md full-width" :map="crumps" />
      <grid class="q-my-none qpy-none" stage="draft" style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);"/>
      <!-- <q-dialog seamless position="right" v-model="dialogue">
          <modal @closeDialogue="dialogue = false" :stage="tab" actionType="Add" :id="{}" />
      </q-dialog> -->
  </q-page>
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
      table: false,
      crumps: [
        {id:1,name:'Social Media Management',icon: 'home',path: '/social-media-management'},
        {id:2,name: "In Review", icon: "remove_red_eye", path: "/social-media-management/reviews"},
      ],
      dialogue: false
    }
  },
  setup() {
    return {
      tab: ref('review'),
    }
  },
}
</script>

<style scoped>

</style>