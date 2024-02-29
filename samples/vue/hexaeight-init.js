// hexaeight-init.js
import { reactive, onMounted } from "vue";
import { HexaEight } from "hexaeight-sessions";

const initSession = async () => {
  const session = reactive(new HexaEight());
  console.log("Initializing session...");
  // Install HexaEight Token Server in your Environment
  // Create a Client Application and obtain the Client ID
  // Start the Token server and use the tokenserverurl 

  const clientid = "A7D9A0......";
  const tokenserverurl = "http(s)://tokenseverurl:port";
  try {
    // Show loading indicator
    // Replace this with your own loading indicator logic
    console.log("Loading Application... Please wait..");

    await session.init(clientid, tokenserverurl, "hexaeight-user-container");
    const iresp = await session.ready();
    console.log("Session is initialized: " + iresp);
  } catch (error) {
    console.error("Error initializing session:", error);
  } finally {
    // Hide loading indicator
    // Replace this with your own loading indicator logic
    console.log("Application loaded.");
  }
};

export default initSession;
