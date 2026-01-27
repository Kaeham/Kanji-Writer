<script lang="ts">
    import { goto } from "$app/navigation";
</script>

<div class="mainContent">
    <div class="descText">
        <h1 class="heading">Kanji Writer</h1>
        <p class="headingSubtitle"> Practice your kanji writing here</p>
    </div>
        <div class="appFeatures">
            <button class="navButton" onclick={() => goto('/deck')}> Decks </button>
            <button class="navButton" onclick={() => goto('/review')}> Review </button>
            <button class="navButton"> Filler </button>
        </div>
</div>

<style>
    .mainContent {
        background: gray;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .descText {
        display: flex;
        flex-direction: column;
    }

    .appFeatures {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 30%;
    }

    .navButton {
        border-radius: 10px;
        border: none;
        margin-top: 2px;
        margin-bottom: 2px;
        padding: 5px 0 5px 0;

        transition: 
            tranform 2s ease,
            box-shadow 0.5s ease,
            background-color 0.5s ease;

    }

    .navButton:hover {
        background: rgba(200, 200, 200, 1);
        transform: translateY(-4px);
        box-shadow: 0 10px 25px rgba(0, 0, 0 0.3)
    }
</style>