import Component from "../../core/Component.js";
import ChatInput from "../Lobby/ChatInput.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import sendChatHandler from "../../handlers/chat/sendChatHandler.js";
import {
  receiveSingleChatMessageHandler,
  appendDirectMessageToUL,
} from "../../handlers/chat/chatHandler.js";
import { myInfoStore } from "../../store/initialStates.js";

export default class DirectMessageContainer extends Component {
  setEvent() {
    const { userId: opponentId } = this.props;
    this.addEvent("keydown", "#dm-chat-input", (e) =>
      sendChatHandler(e, "single_message", opponentId)
    );
    this.addEvent("click", "#send-icon", () => {
      const $input = this.$target.querySelector("#dm-chat-input");
      sendChatHandler(
        { target: $input, key: "Enter" },
        "single_message",
        opponentId
      );
    });

    receiveSingleChatMessageHandler(
      this.$target,
      this.removeObservers,
      opponentId
    );
  }

  template() {
    return `
      <div class="border-0">
        <div class="d-flex justify-content-center align-items-center">
          <div id="dm-profile-image" data-dismiss="modal"></div>
          <span class="text-muted fw-bold fs-4 mx-2">${this.props.nickname}</span>
        </div>
        <hr>
        <div id="dm-chat-message-container" class="overflow-auto" style="height: 25rem;">
          <ul id="dm-chat-message-ul" class="list-unstyled"></ul>
        </div>
        <div id="dm-chat-input-holder"></div>
      </div>
    `;
  }

  mounted() {
    const profileImage = new ProfileImage(
      this.$target.querySelector("#dm-profile-image"),
      {
        userId: this.props.userId,
        imageSize: "image-xs",
        imageSrc: this.props.profileImage,
        alt: "/asset/default.png",
      }
    );
    const chatInput = new ChatInput(
      this.$target.querySelector("#dm-chat-input-holder"),
      { id: "dm-chat-input", name: "dm-chat-input" }
    );

    profileImage.render();
    chatInput.render();

    this.loadStoredChatMessages();
  }

  loadStoredChatMessages() {
    const { userId: myId } = myInfoStore.getState();
    const { userId: opponentId } = this.props;

    const storedMessages =
      JSON.parse(sessionStorage.getItem("direct_message")) || [];

    const $messageUL = this.$target.querySelector("#dm-chat-message-ul");

    storedMessages.forEach((message) => {
      if (
        (message.sender_id === myId && message.receiver_id === opponentId) ||
        (message.sender_id === opponentId && message.receiver_id === myId)
      ) {
        appendDirectMessageToUL($messageUL, message);
      }
    });
  }
}
