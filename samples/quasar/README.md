// Enable the bootfile present in the boot directory in quasar.config.js

// Add the below code to your layout\MainLayout.vue and remove the routerview (handle routing programatically)

  <q-page-container>
      <HexaEightAuth @authenticated="printConsoleMessage" />
    </q-page-container>

// Add this to the script section
import HexaEightAuth from "components/HexaEightSession.vue";


//Ensure the components section has HexaEightAuth
 components: {
    EssentialLink,
    HexaEightAuth,
  },

// Integrate the css code provided in css\app.css or define your own styles