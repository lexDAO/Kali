import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

export default function StepProgressBar(props) {
  const visible = props.visible;
  const steps = props.steps;
  const array = [];
  for(let i=0; i < steps; i++) {
    array.push(i);
  }

  return (
    <>
      <div style={{ margin: 50 }}>
        <ProgressBar
          width={750}
          percent={100 * (visible / (steps - 1))}
          filledBackground="white"
        >
          {array.map((step, index) => {
            let cursor;
            if(index <= visible) {
              cursor = "pointer";
            } else {
              cursor = "default";
            }
            return (
              <Step
                position={100 * (index / steps)}
                transition="scale"
                children={({ accomplished }) => (
                  <div
                    onClick={() => props.handleBack(index)}
                    style={{
                      display: "flex",
                      cursor: cursor,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      color: "white",
                      backgroundColor: accomplished ? "white" : "gray"
                    }}
                  >
                    👁️
                  </div>
                )}
              />
            );
          })}
        </ProgressBar>
      </div>
    </>
  );
}
