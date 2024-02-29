<template>
  <q-page class="q-pa-md">
    <q-card class="full-width">
      <!-- Chat header -->
      <!-- Chat messages -->
      <q-list bordered>
        <q-expansion-item
          group="Messages"
          icon="perm_identity"
          label="User Engagement Area"
          header-class="text-primary text-center text-bold"
        >
          <q-card-section style="height: 50vh; overflow-y: auto">
            <div style="text-align: center">
              <div id="hexaeight-user-container">
                <!-- User Engagement Area Your Dynamic javascript code or components will be rendered here -->
              </div>
            </div>
          </q-card-section>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item
          group="Messages"
          icon="chat"
          label="Chat Messages"
          default-opened
          header-class="text-primary text-center text-bold"
          class="full-width"
        >
          <q-card-section style="height: 50vh; overflow-y: auto">
            <div id="hexaeight-chat-container">
              <!-- Messages will be displayed here -->
              <div id="message-container" class="scroll">
                <!-- Messages will be displayed here -->
              </div>
            </div>
          </q-card-section>
        </q-expansion-item>
        <q-card-section>
          <q-input
            placeholder="Type your message..."
            dense
            outlined
            type="textarea"
            v-model="messageText"
            rows="2"
            style="resize: none !important; overflow-y: hidden !important"
          >
            <template v-slot:after>
              <button
                class="q-btn q-btn-item q-btn-rounded q-btn-action q-btn-xs"
                id="sendButton"
                style="z-index: 100; font-size: 10px"
                @click="sendMessage"
              >
                <q-icon name="send" />
              </button>
              <button
                class="q-btn q-btn-item q-btn-rounded q-btn-action q-btn-xs"
                id="talkButton"
                style="z-index: 101; font-size: 10px"
              >
                <q-icon name="mic" />
              </button>
            </template>
          </q-input>
          <div class="flex justify-center text-center q-pa-lg">
            <button
              class="q-btn q-btn-item q-btn-rounded q-btn-action"
              id="muteButton"
              style="z-index: 98; font-size: 10px"
            >
              <q-icon name="volume_off" />
            </button>
            <button
              class="q-btn q-btn-item q-btn-rounded q-btn-action"
              id="speakerButton"
              style="z-index: 98; font-size: 10px"
            >
              <q-icon name="volume_up" />
            </button>
            <select id="languageDropdown">
              <!-- Language options will be populated dynamically -->
            </select>
          </div>
        </q-card-section>
      </q-list>
      <!-- Message input -->
    </q-card>
  </q-page>
  <!-- User Engagement Section -->
</template>

<script>
//import { HexaEightChat } from "../auth/hexaeightAIchat.mjs";
import { HexaEightChat } from "hexaeight-sessions/hexaeightAIchat.mjs";
import { ref } from "vue";
import { useQuasar } from "quasar";

export default {
  data() {
    return {
      session: this.$hexaeight.session,
      sessionInitialized: false,
      messageText: "",
      preferredLanguage: "en-US",
      languageOptions: [],
      seamless: ref(true),
      isInputVisible: true,
      push: this.$pushservice,
    };
  },
  methods: {
    handleEnterKey(event) {
      event.preventDefault();
      this.messageText += "\n";
    },

    toggleInputVisibility() {
      // Toggle the visibility of the card
      this.isInputVisible = !this.isInputVisible;
    },
    async initSession() {
      const iresp = await this.session.ready();
      console.log("Session is Ready: " + iresp);
      const response = await this.session.isauthenticated();
      this.sessionInitialized = true;
      const parsedResponse = JSON.parse(response);
      const isAuthenticated = parsedResponse.data === "True";
      HexaEightChat.init({
        chatContainerId: "message-container",
        session: this.session,
        messageCallback: async (request, message) => {
          try {
            const req = await this.session.DecipherMessage(request);
            if (JSON.parse(req).BODY == "RENDER") {
              const codeToExecute = JSON.parse(
                await this.session.DecipherMessage(message)
              ).BODY;
              const asyncFunction = new Function(
                `(async () => { ${codeToExecute} })();`
              );
              asyncFunction();
            }
          } catch {}
          console.log("Received new message:", message);
          console.log("Received new request:", request);
        },
      });

      const languageDropdown = document.getElementById("languageDropdown");
      const talkButtonID = "talkButton";
      const speakButtonID = "speakerButton";
      const muteButtonID = "muteButton";
      HexaEightChat.loadChatMessages();
      this.languageOptions = HexaEightChat.populateLanguageDropdown(
        languageDropdown,
        talkButtonID,
        speakButtonID,
        muteButtonID
      );
      HexaEightChat.setPreferredLanguage(
        this.preferredLanguage,
        languageDropdown
      );
    },
    async sendMessage() {
      if (this.sessionInitialized && this.messageText !== "") {
        let usermessage = this.messageText;
        this.messageText = "";
        await this.session.EngageAI(usermessage);
      }
    },
  },
  created() {
    this.initSession();
  },
  watch: {
    "session.user.loginphase": async function (newVal, oldVal) {
      if (newVal === 6) {
        this.$emit("authenticated", true);
      }
    },
  },
};
</script>
