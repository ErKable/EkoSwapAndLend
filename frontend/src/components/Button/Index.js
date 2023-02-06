import React from 'react'
import "./Styles.css"

const Index = (props) => {
    return (
      <button
        className={`basic-button bg-primary  ${props.className || "#525298"}`}
        onClick={props.onClick}
        type={props.type}
      >
       {props.name || "button"}

      </button>
    );
  };
  export default Index;