<template>
    <div class="item" :class="{ 'selected': selected }" v-theming="['border-bottom-color']" v-italic>
        <span class="username">{{ item.username }}</span>
    </div>
</template>

<script>
import { settings } from '@/settings';

export default {
    name: 'l-select-item',
    props: ['item', 'selected'],

    data() {
        return {
            settings,
        };
    }
};
</script>

<style lang="scss" scoped>
.item {
    font-family: 'Lato', 'Noto Sans', sans-serif;
    border-radius: 5px;
    transition: background-color 125ms ease-in-out;
    min-width: 150px;
    font-weight: 300;
    font-size: 42px;
    padding: 10px 18px;
    margin-bottom: 15px;
}

.item.selected {
    border-bottom: solid 2px;
    background: rgba(255, 255, 255, 0.055);
}

.username {
    font-weight: bold;
}

@media (max-height: 850px) {
    .item {
        font-size: 38px;
        padding: 8px 16px;
    }
}
</style>