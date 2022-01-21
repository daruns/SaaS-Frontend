<template>
<q-layout style="width: 550px !important;">
     <q-card style="max-width: 550px; height:56px;" flat square>
     <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
            <q-toolbar-title>
                {{this.actionType+' '}}Meeting
            </q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
    </q-toolbar>
    <q-card-section class="q-gutter-md">
      <div>
        <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Meeting date</div>
        <Datepicker :minDate="new Date()" class="q-mt-sm" v-model="meeting.date" showNowButton placeholder="Meeting date"></Datepicker>
        </div>
        <q-input
            ref="durRef"
            outlined
            type="number"
            v-model="meeting.duration"
            label="Duration (Minutes)"
            lazy-rules
            :rules="[val => (val && val > 0) || 'Please write duration']"
        />
         <q-input
            ref="typeRef"
            outlined
            v-model="meeting.type"
            label="Type (Skype, Face to Face....)"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please write the type']"
        />
            <q-input
            v-model="meeting.serviceRequirements"
            outlined
            label="Requirements"
            type="textarea"
            :rules="[val => (val && val.length > 0) || 'Please write the type']"
            />
        <div>
          <div class="q-ma-none absolute q-ml-sm text-grey-7" style="z-index:10;font-size:12px;line-height:20px;font-weight:400;">Next meeting date</div>
          <Datepicker class="q-mt-sm" v-model="meeting.nextMeetingDate" showNowButton placeholder="Next meeting date"></Datepicker>
          </div>
    <q-editor
      v-model="meeting.details" :dense="$q.screen.lt.md" :toolbar="[
      [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo'],
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }"
    />
    </q-card-section>
    </q-card>
          <q-toolbar class="bg-grey-3 submitBtnClass" style="position:sticky !important; bottom:0;z-index:5;">
            <q-btn :loading="loading" @click="submit" label="Submit" no-caps type="reset" color="primary" unelevated class="full-width" />
    </q-toolbar>
</q-layout>
</template>
<script>
import axios from 'axios';
import {mapActions} from 'vuex'
import { date } from 'quasar'
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'
export default {
  components: { Datepicker },
    props: ['cmid', 'clId', 'actionType'],
   data()  { 
   return {
     date1:false,
     time1:false,
     meeting: {
         date: '',
         duration: 0,
         type: '',
         serviceRequirements: '',
         nextMeetingDate: '',
         details: 'details',
         currentServiceProvider: ''
     },
     clientId: Number(this.cmid),
     id: Number(this.cmid),
     loading: false,
    }
  },
  methods : {
    ...mapActions('crmStore',['getClientMeetings']),
    async submit() {
      this.loading = true
     if(this.actionType === 'Add') {
        await this.create()
      }else{
        await this.update()
      }
     await this.getClientMeetings(this.clId);
     this.loading = false
     this.$emit('closeDialogue')

    },
    async create() {
      this.loading = true
      this.meeting.duration = Number(this.meeting.duration)
      let response = await axios.post(process.env.OC_BACKEND_API + 'meetings/create', 
      {...this.meeting, clientId: this.clientId}, 
      {headers: {Authorization: localStorage.getItem('accessToken')}})
      this.loading = false
    },
      async update() {
      console.log(this.meeting.date)
      this.loading = true
      this.meeting.duration = Number(this.meeting.duration)
      let response = await axios.post(process.env.OC_BACKEND_API + 'meetings/update', 
      {...this.meeting, id: this.id}, 
      {headers: {Authorization: localStorage.getItem('accessToken')}});
      this.loading = false
    }
  },
 async mounted() {
   if(this.actionType === 'Edit'){
    let { data } = await axios.get(process.env.OC_BACKEND_API + `meetings/${this.cmid}`,{headers: {Authorization: localStorage.getItem('accessToken')}});
    let body = data.data
    this.meeting.duration = body.duration
    let dt = new Date(body.date)
    dt.setHours(dt.getHours() - 3);
    let nextDt = new Date(body.nextMeetingDate)
    nextDt.setHours(nextDt.getHours() - 3);
    this.meeting.date = date.formatDate(dt, 'YYYY-MM-DD HH:mm');
    this.meeting.nextMeetingDate = date.formatDate(nextDt, 'YYYY-MM-DD HH:mm');
    this.meeting.details = body.details
    this.meeting.currentServiceProvider = body.currentServiceProvider
    this.meeting.type = body.type
    this.meeting.serviceRequirements = body.serviceRequirements
    return
     }
    this.meeting.date = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
    this.meeting.nextMeetingDate = date.formatDate(new Date, 'YYYY-MM-DD HH:mm');
  }

}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>