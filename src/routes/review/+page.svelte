<!-- Main review screen (card + drawing pag) -->

<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from '$lib/db';
    import { sm2, type ReviewResult } from '$lib/srs/sm2';
    import { type Card } from '$lib/types';
    import Flashcard from '../../components/Flashcard.svelte';
    import DrawingPad from '../../components/DrawingPad.svelte';
    import GradingButtons from '../../components/GradingButtons.svelte';

    let currentCard: Card | null = null;
    let loading = true;

    async function loadNextCard() {
        const dueCards = await db.cards.where('nextReview').below(Date.now()).toArray(); // Get cards earlier than todays date
        currentCard = dueCards[0] ?? null;
        loading = false; // ??
    }

    async function handleGrade(event: CustomEvent<number>) {
        if (!currentCard) return;
        let res: ReviewResult = {
            interval: currentCard.interval,
            easeFactor: currentCard.easeFactor,
            repetitions: currentCard.repetitions,
            nextReview: currentCard.nextReview,
        };
        const updated = sm2(event.detail, res);
        // await db.cards.put(updated);
        await loadNextCard();
    }

    onMount(() => {
        loadNextCard();
    });
</script>

{#if loading}
    <p>Loading...</p>
{:else if !currentCard}
    <p>No cards due right now 🎉</p>
{:else}
    <Flashcard
        kanji={currentCard.kanji}
        reading={currentCard.reading}
        meaning={currentCard.meaning}
    />
    <DrawingPad />
    <GradingButtons on:grade={handleGrade} />
{/if}