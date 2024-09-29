<template>
    <div class="item" :class="{ 'user': isUser, 'desktop': !isUser, 'selected': selected }" v-theming="['border-bottom-color']" v-italic>
        <div class="icon-container" v-if="!noicon">
            <img class="icon" :src="icon" />
        </div>

        <template v-if="isUser">
            User: <span class="username">{{ item.username }}</span>
        </template>
        <template v-else>
            AwesomeWM
        </template>
    </div>
</template>

<script>
    import { avatar, settings } from '@/settings';

    export default {
        name: 'l-select-item',
        props: ['item', 'selected', 'noicon', 'isUser'],

        data() {
            return {
                settings,
            };
        },
        computed: {
            icon() {
                if (this.isUser) {
                    return avatar(this.item.image);
                }
                return require('../assets/images/desktops/awesome.png');
            }
        }
    };
</script>

<style lang="scss" scoped>
    .item {
        font-family: 'Lato', 'Noto Sans', sans-serif;
        border-radius: 5px;
        transition: background-color 125ms ease-in-out;
        min-width: 150px;
    }

    .item.selected {
        border-bottom: solid 2px;
        background: rgba(255, 255, 255, 0.055);
    }

    .item.desktop {
        font-weight: 300;
        font-size: 44px;
        padding: 7px 19px;
        margin-bottom: 20px;
    }

    .item.user {
        font-weight: 300;
        font-size: 42px;
        padding: 3px 18px 8px;
        margin-bottom: 25px;
    }

    .username {
        font-weight: bold;
    }

    .icon-container {
        display: inline-block;
        width: 45px;
        height: 45px;
        margin-right: 6px;
    }

    .item.user .icon-container {
        margin-right: 8px;
    }

    .icon {
        height: 45px;
        margin-bottom: -6px;
    }

    .item.user .icon {
        margin-bottom: -8px;
    }

    @media (max-height: 850px) {
        .item.user {
            font-size: 40px;
        }

        .item.desktop {
            font-size: 41px;
        }

        .icon {
            margin-bottom: -5px;
        }
    }
</style>
