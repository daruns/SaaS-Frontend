<template>
     <q-card style="width:300px;">
        <q-card-section>
        <div class="text-h6">Are you sure?</div>
        </q-card-section>

        <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn flat label="Delete" @click="$emit('confirm')" color="primary" v-close-popup />
        </q-card-actions>
     </q-card>
</template>
