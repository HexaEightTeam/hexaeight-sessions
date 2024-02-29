import React, { useState, useEffect } from 'react';
import { HexaEightChat } from 'hexaeight-sessions/hexaeightAIchat.mjs';
import useHexaEight from './useHexaEightSession'; // Assuming the hook file is in the same directory
import { BiSend, BiMicrophone, BiVolumeMute, BiVolumeFull } from 'react-icons/bi';

const AccordionSection = ({ title, children, isOpen, toggleAccordion }) => {
  return (
    <div className="accordion">
      <div className="accordion-title" onClick={toggleAccordion}>
        {title}
      </div>
      {isOpen && (
        <div className="accordion-content">
          <div className="accordion-section">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};


const HexaEightSessionComponent = () => {
  const { session, sessionInitialized } = useHexaEight();
  const [messageText, setMessageText] = useState("");
  const [preferredLanguage] = useState("en-US");
  // eslint-disable-next-line no-unused-vars
  const [languageOptions, setLanguageOptions] = useState([]);
  const [userEngagementOpen, setUserEngagementOpen] = useState(true); // State for User Engagement Area accordion
  const [chatMessagesOpen, setChatMessagesOpen] = useState(false); // State for Chat Messages accordion


  useEffect(() => {
    const initSession = async () => {
      const iresp = await session.ready();
      console.log("Session is Ready: " + iresp);
      const response = await session.isauthenticated();
      const parsedResponse = JSON.parse(response);
      // eslint-disable-next-line no-unused-vars
      const isAuthenticated = parsedResponse.data === "True";
      
      HexaEightChat.init({
        chatContainerId: "message-container",
        session: session,
        messageCallback: async (request, message) => {
          try {
            const req = await session.DecipherMessage(request);
            if (JSON.parse(req).BODY === "RENDER") {
              const codeToExecute = JSON.parse(
                await session.DecipherMessage(message)
              ).BODY;
              // eslint-disable-next-line no-new-func
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
      setLanguageOptions(HexaEightChat.populateLanguageDropdown(
        languageDropdown,
        talkButtonID,
        speakButtonID,
        muteButtonID
      ));
      
      HexaEightChat.setPreferredLanguage(
        preferredLanguage,
        languageDropdown
      );
    };

    if (sessionInitialized) {
      initSession();
    }
  }, [session, sessionInitialized, preferredLanguage]);

  const sendMessage = async () => {
    if (sessionInitialized && messageText !== "") {
      let usermessage = messageText;
      setMessageText("");
      await session.EngageAI(usermessage);
    }
  };

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  const toggleUserEngagementAccordion = () => {
    setUserEngagementOpen(!userEngagementOpen);
    setChatMessagesOpen(false); // Close Chat Messages accordion
  };

  const toggleChatMessagesAccordion = () => {
    setChatMessagesOpen(!chatMessagesOpen);
    setUserEngagementOpen(false); // Close User Engagement Area accordion
  };

  return (
    <div className="q-page q-pa-md">
      <div className="full-width q-card">
        <div className="q-list bordered">
          <AccordionSection
            title="User Engagement Area"
            isOpen={userEngagementOpen}
            toggleAccordion={toggleUserEngagementAccordion}
          >
            <div style={{ height: '55vh', overflowY: 'auto' }}>
              <div id="hexaeight-user-container">
                {/* User Engagement Area Your Dynamic javascript code or components will be rendered here */}
              </div>
            </div>
          </AccordionSection>
          <AccordionSection
            title="Chat Messages"
            isOpen={chatMessagesOpen}
            toggleAccordion={toggleChatMessagesAccordion}
          >
            <div style={{ height: '55vh', overflowY: 'auto' }}>
              <div id="hexaeight-chat-container">
                {/* Messages will be displayed here */}
                <div id="message-container" className="scroll">
                  {/* Messages will be displayed here */}
                </div>
              </div>
            </div>
          </AccordionSection>
          {/* Message input */}

          <div className="chat-container">
  <div className="textarea-container">
    <div className="button-container">
    <textarea
      className="textarea"
      placeholder="Type your message..."
      value={messageText}
      onChange={(e) => setMessageText(e.target.value)}
      onKeyPress={handleEnterKey}
      rows="3"
      style={{ resize: 'none', overflowY: 'hidden', flex: '1', marginBottom: '10px' }}
    />

      <button
        className="btn btn-primary"
        id="sendButton"
        onClick={sendMessage}
        style={{ marginBottom: '10px' }}
      >
        <BiSend />
        {/* Icon for send button */}
      </button>
      <button
        className="btn btn-primary"
        id="talkButton"
        style={{ marginBottom: '10px' }}
      >
        <BiMicrophone />
        {/* Icon for talk button */}
      </button>
    </div>
  </div>
  <div className="control-container">
  <div className="button-container">
  <button
      className="q-btn q-btn-item q-btn-rounded q-btn-action"
      id="muteButton"
      style={{ marginLeft: '10px' }}
    >
      <BiVolumeMute />
    </button>
    <button
      className="q-btn q-btn-item q-btn-rounded q-btn-action"
      id="speakerButton"
      style={{ marginLeft: '10px' }}
    >
      <BiVolumeFull />
    </button>
    <select id="languageDropdown" style={{ marginLeft: '10px' }}>
      {/* Language options */}
    </select>
  
   </div>
  </div>
</div>


      </div>
      </div>

    </div>
  );

 

 };

export default HexaEightSessionComponent;
