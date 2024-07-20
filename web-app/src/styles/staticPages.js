import { FONT_FAMILY } from "common/sharedFunctions.js";
import { container, title } from "./material-kit-react.js"

const landingPageStyle = {
  container: {
    zIndex: "12",
    color: "#FFFFFF",
    fontFamily:FONT_FAMILY,
    ...container
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    color: "#383838",
    textDecoration: "none"
  },
  description:{
    color: "#383838",
  },
  subtitle: {
    fontSize: "1.313rem",
    maxWidth: "500px",
    margin: "10px auto 0"
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  rtlDescription:{
    textAlign:"right",
    color: "#383838",
    marginRight:"30px",
    wordBreak: "break-word"
  },
  ltrDescription:{
    textAlign:"left",
    color: "#383838",
    marginRight:"20px",
    wordBreak: "break-word"
  },
};

export default landingPageStyle;
