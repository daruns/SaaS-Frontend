<template>
  <q-page class="q-py-none q-my-none">
      <div class="full-width flex justify-between items-center q-px-md q-py-md" style="border-bottom: 1px solid lightgrey;">
        <div class="text-h4">Rejected</div>
      </div>
      <breadcrmps class="q-pa-md full-width" :map="crumps" />
      <grid class="q-my-none qpy-none" stage="rejecteds" style="max-height:auto !important;min-height:auto !important;height: calc(100vh - 131px);"/>
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
        {id:2,name: "Rejected", icon: "youtube_searched_for", path: "/social-media-management/rejecteds"},
      ],
      dialogue: false
    }
  },
  setup() {
    return {
      tab: ref('rejected'),
    }
  },
}
</script>

<style scoped>

</style>