<template>
      <q-card class="fit"  style="max-width:700px;  !important;min-width:300px !important">
        <q-card-section class="col-12">
          <q-card-actions class="col flex row justify-between" align="right">
          <q-item class="text-h6 q-pb-sm">{{task.name}}</q-item>
            <q-btn color="negative" flat label="Close" v-close-popup />
          </q-card-actions>
          <q-separator />
          <q-card-section class="q-py-md row wrap flex col-6">
            <div class="row flex q-py-sm col-6">
              <q-chip class="q-px-md" text-color="white" color="green">Start date: {{dateConversion(task.plannedEndDate)}}</q-chip>
            </div>
            <div class="row flex q-py-sm col-6">
              <q-chip class="q-px-md" text-color="white" color="red">Deadline: {{dateConversion(task.plannedStartDate)}}</q-chip>
            </div>
            <div class="col-6">Priority: <q-chip :class="priority(task.priority)" class="q-ma-none" no-caps :color="priority(task.priority)">{{task.priority}}</q-chip></div>
             <p class="text-caption text-grey-7 q-ma-none" v-show="task.memberUsers.length !== 0">Assigned users:</p>
             <div class="flex">
              <div v-for="(member,i) in task.memberUsers" :key="member.id">
                <q-chip>
                      <q-avatar size="md" avatar>
                        <img v-if="member.avatar" :src="member.avatar">
                        <img v-else src="~/assets/one_logo_neat.png">
                      </q-avatar>
                      {{member.name}}
                    </q-chip>
                </div>
             </div>
              <p class="text-caption text-grey-7" v-show="task.memberUsers.length === 0">No one has been assigned to this task!</p>
        </q-card-section>
        <q-separator />
        <q-item
          style="word-break: break-all;" v-html="task.description"
          class="row flex col-12 q-pt-md" />
        </q-card-section>
        <q-separator />
        <q-carousel
          swipeable
          animated
          arrows
          v-model="slide"
          thumbnails
          infinite
        >
          <q-carousel-slide :name="id" :key="id" v-for="(imgs, id) in task.attachments" :img-src="imgs.url"/>
        </q-carousel>

        <q-carousel >
          <q-item class="col-12 row flex">
            <div class="row flex col-12">
              <q-card class="row flex flex-center items-center col-4">
                <q-btn icon="plus" flat text-color="grey" />
              </q-card>
            </div>
          </q-item>
        </q-carousel>
      </q-card>
</template>
<script>
import moment from 'moment'
import { date } from 'quasar';
import {ref} from 'vue'
export default {
  props: ['task'],
    data() {
      return {
        slide: ref(1),
      }
    },
    methods: {
    dateConversion(dt) {
      return moment(dt).format('MMM Do YYYY')
    },
    priority(priority) {
      switch(priority){

      case 'High':
      return 'text-positive bg-green-1'

      case 'Medium':
      return 'text-warning bg-yellow-2'

      case 'Low':
      return 'text-negative bg-red-1'
      }
    }
    }
}
</script>
<style scoped>
div.q-avatar div.q-avatar__content img {
    border: none !important;
}
</style>