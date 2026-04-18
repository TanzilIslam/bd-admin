<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CountryTab from '@/components/settings/locations/CountryTab.vue'
import DivisionTab from '@/components/settings/locations/DivisionTab.vue'
import DistrictTab from '@/components/settings/locations/DistrictTab.vue'
import UpazilaTab from '@/components/settings/locations/UpazilaTab.vue'
</script>

<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold">Locations</h2>
      <p class="text-sm text-muted-foreground">
        Manage the geographic hierarchy used across the directory.
      </p>
    </div>

    <Tabs default-value="countries">
      <TabsList>
        <TabsTrigger value="countries">Countries</TabsTrigger>
        <TabsTrigger value="divisions">Divisions</TabsTrigger>
        <TabsTrigger value="districts">Districts</TabsTrigger>
        <TabsTrigger value="upazilas">Upazilas</TabsTrigger>
      </TabsList>

      <TabsContent value="countries" class="mt-4">
        <CountryTab />
      </TabsContent>
      <TabsContent value="divisions" class="mt-4">
        <DivisionTab />
      </TabsContent>
      <TabsContent value="districts" class="mt-4">
        <DistrictTab />
      </TabsContent>
      <TabsContent value="upazilas" class="mt-4">
        <UpazilaTab />
      </TabsContent>
    </Tabs>
  </div>
</template>
