<script lang="ts">
    export let kanji: string;
    export let reading: string;
    export let meaning: string;
</script>

<div class="flex felx-col items-center gap-2 p-4 text-center">
    <div class="text-yxl font-bold">{kanji}</div>
    <div class="text-xl text-gray-600">{reading}</div>
    <div class="text-lg text-gray-500">{meaning}</div>
</div>