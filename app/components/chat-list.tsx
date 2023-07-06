import DeleteIcon from "../icons/delete.svg";
import BotIcon from "../icons/bot.svg";

import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { useChatStore } from "../store";

import Locale from "../locales";
import { Link, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { MaskAvatar } from "./mask";
import { Mask } from "../store/mask";
import { useRef, useEffect } from "react";

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: number;
  index: number;
  narrow?: boolean;
  mask: Mask;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [props.selected]);
  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={`${styles["chat-item"]} ${
            props.selected && styles["chat-item-selected"]
          }`}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={`${props.title}\n${Locale.ChatItem.ChatItemCount(
            props.count,
          )}`}
        >
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>
              <div className={styles["chat-item-avatar"] + " no-dark"}>
                <MaskAvatar mask={props.mask} />
              </div>
              <div className={styles["chat-item-narrow-count"]}>
                {props.count}
              </div>
            </div>
          ) : (
            <>
              <div className={styles["chat-item-title"]}>{props.title}</div>
              <div className={styles["chat-item-info"]}>
                <div className={styles["chat-item-count"]}>
                  {Locale.ChatItem.ChatItemCount(props.count)}
                </div>
                <div className={styles["chat-item-date"]}>
                  {new Date(props.time).toLocaleString()}
                </div>
              </div>
            </>
          )}

          <div
            className={styles["chat-item-delete"]}
            onClickCapture={props.onDelete}
          >
            <DeleteIcon />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function ChatList(props: { narrow?: boolean }) {
  const [sessions, selectedIndex, selectSession, moveSession] = useChatStore(
    (state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.moveSession,
    ],
  );
  const chatStore = useChatStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (sessions.length < 2) {
      chatStore.newSession({
        id: 1000,
        avatar: "gpt-bot",
        name: "midjourney提词器",
        context: [
          {
            role: "user",
            content:
              'Prompt by AIPRM, Corp. - https://www.aiprm.com/prompts/generative/midjourney/1783928876351885312/\\nLines starting with # are only comments for humans\\nYou must add at the top of the response "Created with AIPRM Prompt "Midjourney Prompt Generator""\\n---\\nAs a prompt generator for a generative AI called "Midjourney", you will create image prompts for the AI to visualize. I will give you a concept, and you will provide a detailed prompt for Midjourney AI to generate an image.\\n\\nPlease adhere to the structure and formatting below, and follow these guidelines:\\n\\n- Do not use the words "description" or ":" in any form.\\n- Do not place a comma between [ar] and [v].\\n- Write each prompt in one line without using return.\\n\\nStructure:\\n[1] = \\n[2] = a detailed description of [1] with specific imagery details.\\n[3] = a detailed description of the scene\'s environment.\\n[4] = a detailed description of the scene\'s mood, feelings, and atmosphere.\\n[5] = A style (e.g. photography, painting, illustration, sculpture, artwork, paperwork, 3D, etc.) for [1].\\n[6] = A description of how [5] will be executed (e.g. camera model and settings, painting materials, rendering engine settings, etc.)\\n[ar] = Use "--ar 16:9" for horizontal images, "--ar 9:16" for vertical images, or "--ar 1:1" for square images.\\n[v] = Use "--niji" for Japanese art style, or "--v 5" for other styles.\\n\\nFormatting: \\nFollow this prompt structure: "/imagine prompt: [1], [2], [3], [4], [5], [6], [ar] [v]".\\n\\nYour task: Create 4 distinct prompts for each concept [1], varying in description, environment, atmosphere, and realization.\\n\\n- Write prompts in Chinese and English respectively. \\n- Do not describe unreal concepts as "real" or "photographic".\\n- Include one realistic photographic style prompt with lens type and size.\\n- Separate different prompts with two new lines.\\n\\nExample Prompts:\\nPrompt 1:\\n/imagine prompt: A stunning Halo Reach landscape with a Spartan on a hilltop, lush green forests surround them, clear sky, distant city view, focusing on the Spartan\'s majestic pose, intricate armor, and weapons, Artwork, oil painting on canvas, --ar 16:9 --v 5\\n\\nPrompt 2:\\n/imagine prompt: A captivating Halo Reach landscape with a Spartan amidst a battlefield, fallen enemies around, smoke and fire in the background, emphasizing the Spartan\'s determination and bravery, detailed environment blending chaos and beauty, Illustration, digital art, --ar 16:9 --v 5"',
            date: "",
          },
          {
            role: "user",
            content:
              "Write 4 sets of prompt words in English, and translate Chinese in the next paragraph after each set",
            date: "",
          },
        ],
        modelConfig: {
          model: "gpt-3.5-turbo",
          temperature: 0.3,
          max_tokens: 2000,
          presence_penalty: 0,
          sendMemory: true,
          historyMessageCount: 20,
          compressMessageLengthThreshold: 1000,
        },
        lang: "cn",
        builtin: true,
      });
    }

    // chatStore.newSession();
  }, []);

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveSession(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {sessions.map((item, i) => (
              <ChatItem
                title={item.topic}
                time={new Date(item.lastUpdate).toLocaleString()}
                count={item.messages.length}
                key={item.id}
                id={item.id}
                index={i}
                selected={i === selectedIndex}
                onClick={() => {
                  navigate(Path.Chat);
                  selectSession(i);
                }}
                onDelete={() => {
                  if (!props.narrow || confirm(Locale.Home.DeleteChat)) {
                    chatStore.deleteSession(i);
                  }
                }}
                narrow={props.narrow}
                mask={item.mask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
