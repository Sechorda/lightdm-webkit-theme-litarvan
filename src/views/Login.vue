<template>
    <div class="login" :class="{ 'compact': isCompact }">
        <div id="top-container" v-if="isCompact">
            <!-- Removed l-clock and l-additions components -->
        </div>

        <div class="login-wrapper">
            <div id="login-content" class="dark-background-card">
                <div id="login-form">
                    <l-select-item :item="settings.user" :noicon="true" :isUser="true" />

                    <form v-if="!immutable" @submit.prevent="submit">
                        <input id="password" type="password" v-model="password" :placeholder="passwordLabel" :readonly="logging" :class="{'error': error}" v-theming="['border-bottom-color']" v-italic.custom />
                    </form>
                    <div v-else id="password" class="immutable"></div>
                    <div id="info" v-italic>
                        {{ info }}
                    </div>

                    <div v-if="!isCompact" class="error-msg">
                        {{ message }}
                    </div>
                </div>
                <div v-if="isCompact" class="error-msg">
                    {{ message }}
                </div>
            </div>
        </div>

        <div v-if="!immutable">
            <transition name="power-fade">
                <div id="power-list" v-if="powerList">
                    <l-power-button v-if="canHibernate" id="hibernate" type="hibernate"></l-power-button>
                    <l-power-button v-if="canSuspend" id="suspend" type="suspend"></l-power-button>
                    <l-power-button id="reboot" type="restart"></l-power-button>
                </div>
            </transition>

            <div @click="powerList = !powerList">
                <l-power-button id="shutdown" type="shutdown" :disabled="!powerList"></l-power-button>
            </div>
        </div>
    </div>
</template>

<script>
import LPowerButton from '@/components/PowerButton.vue';
import LSelectItem from '@/components/SelectItem';

import { settings } from '@/settings';

export default {
    name: 'l-login',
    components: { LSelectItem, LPowerButton },
    props: ['immutable', 'compact', 'preview'],

    data() {
        return {
            canHibernate: lightdm.can_hibernate,
            canSuspend: lightdm.can_suspend,
            passwordLabel: 'Password', // Changed from trans('password')
            isCompact: this.immutable ? this.compact : settings.mode === 'compact',
            settings,
            powerList: false,
            logging: false,
            error: false,
            info: '',
            message: '',
            loginInSession: false,

            password: ''
        }
    },
    mounted() {
        window.addEventListener('keyup', this.keyup);
        
        if (!this.preview) {
            this.cancel(); // cancel any old sessions
            this.begin(); // begin a new login session to get any messages
        }

        setTimeout(() => {
            let p = document.querySelector('#password');
            p && p.focus();
        }, 650);
    },
    beforeDestroy() {
        window.removeEventListener('keyup', this.keyup);
    },
    methods: {
        keyup(event) {
            if (event.getModifierState("CapsLock")) {
                this.info = 'Caps Lock is on'; // Changed from trans('capsLock')
            } else {
                this.info = '';
            }
        },
        begin() {
            this.loginInSession = true;
            lightdm_begin_login(this.settings.user.username, () => {
                setTimeout(() => lightdm_start('awesome'), 400);
                this.$router.push(settings.disableFade ? '/base' : '/intro/login');
            }, () => {
                this.error = true;
                this.password = '';
                this.logging = false;
                this.begin();
            }, (msg) => {
                this.error = true;
                this.password = '';
                this.logging = false;
                // If we receive a message then the login session has already failed
                // so wait for the user to submit another password before starting
                // a new session to avoid an infinite loop
                this.cancel();
                if (this.message === '') {
                    this.message = msg;
                } else {
                    this.message = `${this.message} ${msg}`;
                }
            });
        },
        cancel() {
            this.loginInSession = false;
            lightdm_cancel_login(); 
        },
        submit() {
            this.logging = true;
            this.error = false;
            this.message = '';

            // Workaround for a form submit bug reloading the route
            setTimeout(() => {
                lightdm_login(this.settings.user.username, this.password, !this.loginInSession);
            }, 150);
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../theme';

    .login {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .login-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    #login-content {
        width: 460px; // Adjusted to accommodate the password input width and padding
        margin: 0 auto;
    }

    .dark-background-card {
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    #login-form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .item.user {
        margin-bottom: 13px;
    }

    #password {
        font-weight: 300;
        margin-top: 4.5vh;
        font-family: 'Lato', 'Noto Sans', sans-serif;
        background: $password-field-background;
        caret-color: $password-field-caret;
        color: $secondary-color;
        padding-left: 15px;
        padding-right: 15px;
        font-size: 24px;
        width: 400px;
        height: 54px;
        border: none;
        border-bottom: solid 3px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        &:focus {
            outline: none;
        }

        &::placeholder {
            color: rgba($secondary-color, 0.55);
            opacity: 1;
        }

        &.italic::placeholder {
            font-style: italic;
        }

        &.error {
            border-bottom-color: $error-color !important;
        }

        &.immutable {
            display: inline-block;
            background: $password-field-background-setup;
            border-bottom-width: 6px;
        }
    }

    #info {
        color: rgba(255, 255, 255, 0.875);
        font-family: 'Lato', 'Noto Sans', sans-serif;
        font-size: 22px;
        font-weight: 300;
        text-align: center;
        margin-top: 15px;
        height: 31px;
    }
        
    .error-msg {
        color: $error-color;
        font-family: 'Lato', 'Noto Sans', sans-serif;        
        font-size: 22px;
        text-align: center;
        margin-top: 15px;
        height: 31px;
    }

    #hibernate {
        position: absolute;
        bottom: 245px;
        right: 20px;
    }

    #suspend {
        position: absolute;
        bottom: 170px;
        right: 20px;
    }

    #reboot {
        position: absolute;
        bottom: 95px;
        right: 20px;
    }

    #shutdown {
        position: absolute;
        bottom: 20px;
        right: 20px;
    }

    @media (max-height: 850px) {
        #password {
            height: 49px;
            font-size: 22px;
        }
    }

    .power-fade-enter-active {
        transition: all .3s ease;
    }

    .power-fade-enter {
        opacity: 0;
    }

    // Compact mode styles
    .login.compact {
        #login-content {
            margin-top: 0;
        }

        #login-form {
            text-align: left;
            margin-left: 0;
            margin-top: 0;
        }

        .item.user {
            margin-bottom: 0;
            margin-top: 0;
        }

        #password {
            margin-top: 2.5vh;
        }

        #info, .error-msg {
            font-size: 17px;
            height: 26px;
            margin-top: 5px;
        }
    }
</style>
