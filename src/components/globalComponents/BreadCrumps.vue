<template>
    <q-breadcrumbs separator="- - -">
      <q-breadcrumbs-el :to="item.path" exact v-for="(item, index) in map" :key="item.id" :label="item.name" :icon="item.icon" />
    </q-breadcrumbs>
</template>
<script>
export default {
    props:['map']
}
</script>
