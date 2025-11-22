<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { createDefaultImportMeta } from "vite/module-runner";
    const dispatch = createEventDispatcher();

    function grade(q: number) {
        dispatch('grade', q);
    }
</script>

<div class="flex gap-2 justify-center mt-4">
    <button class="bg-red-300 px-3 py-1 rounded" on:click={() => grade(2)}>Again</button>
    <button class="bg-yellow-300 px-3 py-1 rounded" on:click={() => grade(3)}>Hard</button>
    <button class="bg-green-300 px-3 py-1 rounded" on:click={() => grade(4)}>Good</button>
    <button class="bg-blue-300 px-3 py-1 rounded" on:click={() => grade(5)}>Easy</button>
</div>