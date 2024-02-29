//Add this file to Quasar Bootsection and enable loading this file in quasar Configuration file


import { boot } from "quasar/wrappers";
import { reactive } from "vue";
//import HexaEight from "../auth/hexaeightsession.mjs";
import HexaEight from "hexaeight-sessions/hexaeightsession.mjs";
import { Loading, QSpinnerDots } from "quasar";

export default boot(async ({ app }) => {
  Loading.show({
    message: "Loading Application... Please wait..",
    spinner: QSpinnerDots, // Import the desired spinner component
    spinnerColor: "orange",
    spinnerSize: 50,
  });

  const session = reactive(new HexaEight());
  app.config.globalProperties.$hexaeight = {
    session,
    sessionInitialized: false,
    loading: true,
    async initSession() {
      console.log("Initializing session...");

      // Install HexaEight Token Server in your Environment
      // Create a Client Application and obtain the Client ID
      // Start the Token server and use the tokenserverurl 

      const clientid = "YOURCLIENTID";
      const tokenserverurl = "YOURTOKENSERVERURL";
      this.loading = true;
      try {
        await session.init(
          clientid,
          tokenserverurl,
          "hexaeight-user-container"
        );
        const iresp = await session.ready();
        console.log("Session is initialized: " + iresp);
        this.sessionInitialized = true;
      } catch (error) {
        console.error("Error initializing session:", error);
      } finally {
        // Set loading to false after initialization (success or failure)
        this.loading = false;
        Loading.hide();
      }
    },
  };

  // Call initSession using Vue instance
  await app.config.globalProperties.$hexaeight.initSession();
});

