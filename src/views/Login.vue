<template>
  <div class="login" :class="{ 'compact': isCompact }">
    <!-- Video Background -->
    <video autoplay loop muted playsinline class="video-background">
      <source :src="videoBackground" type="video/webm">
      Your browser does not support the video tag.
    </video>

    <div id="top-container" v-if="isCompact">
      <!-- Placeholder for compact mode top container content -->
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

        <div v-if="!immutable" class="power-buttons">
          <div class="power-button-wrapper">
            <transition name="power-fade">
              <div id="power-list" v-if="powerList">
                <l-power-button v-if="canHibernate" id="hibernate" type="hibernate"></l-power-button>
                <l-power-button v-if="canSuspend" id="suspend" type="suspend"></l-power-button>
                <l-power-button id="reboot" type="restart"></l-power-button>
              </div>
            </transition>
            <div class="main-power-button" @click="powerList = !powerList">
              <l-power-button id="shutdown" type="shutdown" :disabled="!powerList"></l-power-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LPowerButton from '@/components/PowerButton.vue';
import LSelectItem from '@/components/SelectItem';
import { settings } from '@/settings';
import { videoBackground, updateVideoBG, hook } from '@/themer';

export default {
  name: 'l-login',
  components: { LSelectItem, LPowerButton },
  props: ['immutable', 'compact', 'preview'],

  data() {
    return {
      canHibernate: lightdm.can_hibernate,
      canSuspend: lightdm.can_suspend,
      passwordLabel: 'Password',
      isCompact: this.immutable ? this.compact : settings.mode === 'compact',
      settings,
      powerList: false,
      logging: false,
      error: false,
      info: '',
      message: '',
      loginInSession: false,
      password: '',
      videoBackground
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
        this.info = 'Caps Lock is on';
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

      setTimeout(() => {
        lightdm_login(this.settings.user.username, this.password, !this.loginInSession);
      }, 150);
    },
    changeVideoBackground(newVideo) {
      updateVideoBG(newVideo);
      this.videoBackground = newVideo;
    }
  },
  directives: {
    theming: {
      bind(el, binding) {
        hook(el, binding.value);
      }
    },
    italic: {
      bind(el, binding) {
        if (binding.modifiers.custom) {
          el.classList.add('italic');
        }
      }
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
    position: relative;
    overflow: hidden;
  }

  .video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    z-index: 1;
  }

  #login-content {
    width: 460px;
    margin: 0 auto;
    position: relative;
  }

  .dark-background-card {
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
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

  .power-buttons {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  .power-button-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

  .main-power-button {
    z-index: 2;
  }

  #power-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 10px;
  }

  #hibernate, #suspend, #reboot {
    margin-right: 10px;
  }

  @media (max-height: 850px) {
    #password {
      height: 49px;
      font-size: 22px;
    }
  }

  .power-fade-enter-active, .power-fade-leave-active {
    transition: all .3s ease;
  }

  .power-fade-enter, .power-fade-leave-to {
    opacity: 0;
    transform: translateX(10px);
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