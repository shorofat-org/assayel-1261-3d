import "@/styles/globals.css";
import "@photo-sphere-viewer/core/index.css";
import localFont from "next/font/local";
import type { AppProps } from "next/app";
import { AppProvider } from "@/contexts/AppContexts";
import { TourProvider } from "@reactour/tour";
import { getSteps } from "@/src/utils";

const daxRegularFont = localFont({
  src: "./fonts/dax-regular.ttf",
  variable: "--font-dax-regular",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TourProvider
      steps={getSteps()}
      onClickHighlighted={(e, props) => {
        const currentStep = props.currentStep;
        const totalLength = (props.steps ?? []).length;
        if (currentStep < totalLength) {
          props.setCurrentStep(currentStep + 1);
        }
      }}
      styles={{
        badge: (base) => ({
          ...base,
          width: "2rem",
          borderRadius: "0px",
          backgroundColor: "#4A4640",
        }),
        dot: (base) => ({
          ...base,
        }),
        popover: (base) => ({
          ...base,
          padding: "3rem 3rem 2rem 3rem",
        }),
      }}
    >
      <main className={daxRegularFont.variable}>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </main>
    </TourProvider>
  );
}
