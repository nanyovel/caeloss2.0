// import "./styles.css";
// import EmojiPicker, {
//   EmojiStyle,
//   SkinTones,
//   Theme,
//   Categories,
// //   EmojiClickData,
//   Emoji,
//   SuggestionMode,
//   SkinTonePickerLocation
// } from "emoji-picker-react";
// import { useState } from "react";

// export default function App({ramona}) {
//   const [selectedEmoji, setSelectedEmoji] = useState("1f60a");
//   const [isShowEmoji, setIsShowEmoji]=useState(true)

//   function onClick(emojiData, event) {
//     // console.log(emojiData.emoji)
//     ramona(emojiData.emoji)
//     setSelectedEmoji(emojiData.unified);
//   }

//   return (
//     <div className="App">
//       {/* <div className="show-emoji"> */}
//         {/* <h3>Emoji selecionado:</h3> */}
//         {/* {selectedEmoji ? <Emoji unified={selectedEmoji} size={40} /> : null} */}
//       {/* </div> */}
//     {
//         isShowEmoji?

   
//       <EmojiPicker
//         onEmojiClick={(e)=>onClick(e)}
//         autoFocusSearch={false}
//         />
//         :
//         ''
//     }
//     </div>
//   );
// }
