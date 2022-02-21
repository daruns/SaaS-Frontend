<template>
<q-layout style="width: 550px !important;">
    <q-card style="max-width: 550px; height: 100vh !important;" flat square>
      <q-toolbar class="bg-grey-3" style="position:sticky !important; top:0;z-index:15;">
        <q-toolbar-title>
          Choose A Category
        </q-toolbar-title>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-toolbar>
      <q-card-section class="col-12 justify-center scroll" >
        <div class="flex row fit">
          <div
            class="q-pa-md col-lg-4 col-xl-4 col-md-4 col-sm-12 col-xs-12"
            style="height:15vh"
          >
            <q-btn
              class="rounded bg-primary fit"
              color="prymary"
              text-color="white"
              @click="tab = 'Inventory Item'; dialogueit = true"
              :loading="dialogueit"
              v-close-popup="!dialogueit"
              filled
              icon="fas fa-warehouse"
              label="Inventory Item"
            />
          </div>
          <div
            class="q-pa-md col-lg-4 col-xl-4 col-md-4 col-sm-12 col-xs-12"
            style="height:15vh"
          >
            <q-btn
              class="rounded bg-primary fit"
              color="prymary"
              text-color="white"
              @click="tab = 'Non Inventory Item'; dialoguenit = true"
              :loading="dialoguenit"
              v-close-popup="!dialoguenit"
              filled
              icon="fas fa-handshake"
              label="Non Inventory Item"
            />
          </div>
          <div
            class="q-pa-md col-lg-4 col-xl-4 col-md-4 col-sm-12 col-xs-12"
            style="height:15vh"
          >
            <q-btn
              class="rounded bg-primary fit"
              color="prymary"
              text-color="white"
              @click="tab = 'Service'; dialogueser = true"
              :loading="dialogueser"
              v-close-popup="!dialogueser"
              filled
              icon="fas fa-briefcase"
              label="Service"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>    
    <q-dialog seamless position="right" v-model="dialogueit" persistent>
      <modalit @closeDialogue="dialogueit = false; close = true" action="Add" :type="tab" />
    </q-dialog>
    <q-dialog eamless position="right" v-model="dialoguenit" persistent>
      <modalnit @closeDialogue="dialoguenit = false; close = true" action="Add" :type="tab" />
    </q-dialog>
    <q-dialog eamless position="right" v-model="dialogueser" persistent>
      <modalser @closeDialogue="dialogueser = false; close = true" action="Add" :type="tab" />
    </q-dialog>
  </q-layout>
</template>
<script>
import modalit from "./AddEditItem.vue";
import modalnit from './AddEditNItems.vue';
import modalser from './AddEditSItems.vue';
import {ref} from 'vue'
export default {
  components: {
    modalit,
    modalnit,
    modalser,
  },
  data() {
    return {
      close: ref(false),
      dialogueit: false,
      dialoguenit: false,
      dialogueser: false,
      tab: null,
    }
  },
  methods: {
    openModal() {
      if(this.tab === 'inventory item')
      this.dialogueit = true
      if(this.tab === 'non-inventory item')
      this.dialoguenit = true
      if(this.tab === 'service')
      this.dialogueser = true
    }
  },
}
</script>