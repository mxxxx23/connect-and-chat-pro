import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { airportCheckInScenario, Checkpoint } from "@/data/airportScenario";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import CameraFeed from "@/components/CameraFeed";
import MascotAvatar from "@/components/MascotAvatar";
import { ArrowLeft, Mic, MicOff, Lightbulb, RotateCcw, Star, MessageSquareText, Undo2 } from "lucide-react";

interface AirportCheckInProps {
  onBack: () => void;
  mode?: "voice" | "aac";
}

const AirportCheckIn = ({ onBack, mode = "voice" }: AirportCheckInProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mascotMessage, setMascotMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintTimer, setHintTimer] = useState<NodeJS.Timeout | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [aacStrip, setAacStrip] = useState<string[]>([]);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [isAdvancing, setIsAdvancing] = useState(false);

  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } =
    useSpeechRecognition();
  const { speak, isSpeaking, stop: stopSpeaking } = useSpeechSynthesis();

  const safeSpeak = useCallback(
    async (text: string) => {
      // Never let blocked/slow TTS freeze scenario progression.
      await Promise.race([
        speak(text),
        new Promise<void>((resolve) => setTimeout(resolve, 1800)),
      ]);
    },
    [speak]
  );

  const lastCheckpointIndex = airportCheckInScenario.length - 1;
  const safeIndex = Math.min(Math.max(currentIndex, 0), lastCheckpointIndex);
  const checkpoint = airportCheckInScenario[safeIndex];
  const isLastCheckpoint = safeIndex === lastCheckpointIndex;
  const progress = (safeIndex / lastCheckpointIndex) * 100;
  const availableCards = checkpoint?.aacPictureCards.filter(Boolean) ?? [];

  const getCardById = useCallback(
    (cardId: string) => availableCards.find((card) => card.id === cardId),
    [availableCards]
  );

  const isValidAacSelection = useCallback(
    (selectedIds: string[]) => {
      if (!checkpoint?.validAacCombinations?.length) return false;
      const normalized = [...selectedIds].sort();
      return checkpoint.validAacCombinations.some((combo) => {
        const sortedCombo = [...combo].sort();
        if (sortedCombo.length !== normalized.length) return false;
        return sortedCombo.every((id, idx) => id === normalized[idx]);
      });
    },
    [checkpoint]
  );

  // Speak mascot prompt on checkpoint change
  useEffect(() => {
    if (!checkpoint) return;
    stopSpeaking();
    setMascotMessage(checkpoint.mascotPrompt);
    setShowHint(false);
    setWaitingForResponse(false);
    setAacStrip([]);
    resetTranscript();

    const speakAndWait = async () => {
      if (!isLastCheckpoint) {
        setWaitingForResponse(true);
        setIsAdvancing(false);
      } else {
        // Final checkpoint - scenario complete
        setTimeout(() => setIsComplete(true), 2000);
      }
      void safeSpeak(checkpoint.mascotPrompt);
    };
    speakAndWait();

    return () => {
      if (hintTimer) clearTimeout(hintTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Start hint timer when waiting for response
  useEffect(() => {
    if (!waitingForResponse || isLastCheckpoint) return;
    const timer = setTimeout(() => setShowHint(true), 10000);
    setHintTimer(timer);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitingForResponse]);

  // Process user response
  const processResponse = useCallback(
    async (userSpeech: string) => {
      if (!checkpoint || isLastCheckpoint || isAdvancing) return;
      const lower = userSpeech.toLowerCase();

      const isAccepted =
        mode === "voice" && checkpoint.id === "greeting"
          ? lower.trim().length > 2
          : checkpoint.keywords.some((kw) => lower.includes(kw));

      if (isAccepted) {
        setIsAdvancing(true);
        setShowHint(false);
        // Keep AAC board visible while we transition to avoid a blank left panel.
        if (mode === "voice") {
          setWaitingForResponse(false);
        }
        setMascotMessage(checkpoint.successResponse);
        await safeSpeak(checkpoint.successResponse);
        setTimeout(() => {
          setCurrentIndex((prev) => Math.min(prev + 1, lastCheckpointIndex));
        }, 800);
      } else {
        setMascotMessage(checkpoint.hintPrompt);
        await safeSpeak(checkpoint.hintPrompt);
        setWaitingForResponse(true);
      }
    },
    [checkpoint, isLastCheckpoint, isAdvancing, lastCheckpointIndex, mode, safeSpeak]
  );

  // When user stops speaking, process
  useEffect(() => {
    if (mode === "voice" && !isListening && transcript && waitingForResponse) {
      processResponse(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, mode]);

  const handleMicToggle = () => {
    if (mode !== "voice") return;
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleAacCardSelect = (cardId: string) => {
    if (!waitingForResponse || isSpeaking) return;
    setAacStrip((prev) => {
      if (prev.includes(cardId)) return prev;
      return [...prev, cardId].slice(-6);
    });
  };

  const handleAacUndo = () => {
    setAacStrip((prev) => prev.slice(0, -1));
  };

  const handleAacSend = () => {
    if (!checkpoint || !waitingForResponse || aacStrip.length === 0 || isAdvancing) return;
    if (isValidAacSelection(aacStrip)) {
      const selectedMessage = aacStrip
        .map((cardId) => getCardById(cardId)?.label || "")
        .filter(Boolean)
        .join(" ");
      processResponse(selectedMessage);
      return;
    }

    setMascotMessage(checkpoint.hintPrompt);
    void safeSpeak(checkpoint.hintPrompt);
    setWaitingForResponse(true);
  };

  const handleRestart = () => {
    stopListening();
    stopSpeaking();
    setCurrentIndex(0);
    setIsComplete(false);
    setAacStrip([]);
    resetTranscript();
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-8xl mb-6"
        >
          ✈️
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-3">
          Check-in Complete!
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {mode === "aac"
            ? "You completed the airport check-in using AAC responses. Great communication skills!"
            : "You successfully completed the airport check-in! Great communication skills!"}
        </p>
        <div className="flex items-center justify-center gap-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
            >
              <Star className="w-8 h-8 fill-accent text-accent" />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="accent" size="lg" onClick={handleRestart}>
            <RotateCcw className="w-5 h-5" /> Try Again
          </Button>
          <Button variant="outline" size="lg" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" /> Back
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!checkpoint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground mb-4">Something went wrong with this step. Please restart.</p>
        <Button variant="accent" onClick={handleRestart}>
          <RotateCcw className="w-4 h-4" /> Restart Scenario
        </Button>
      </div>
    );
  }

  return (
    <div className={`${mode === "aac" ? "max-w-6xl" : "max-w-4xl"} mx-auto px-4 py-6`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-foreground">
            ✈️ Airport Check-in {mode === "aac" ? "(AAC)" : ""}
          </h2>
          <p className="text-sm text-muted-foreground">
            Step {currentIndex + 1} of {airportCheckInScenario.length}
          </p>
        </div>
      </div>

      <Progress value={progress} className="mb-6 h-3" />

      <div className={`${mode === "aac" ? "grid lg:grid-cols-[1.7fr_1fr] gap-6" : "grid md:grid-cols-2 gap-6"}`}>
        {/* Left: Camera + Mic */}
        <div className="space-y-4">
          {mode === "voice" && <CameraFeed />}

          {/* Voice mode controls */}
          {waitingForResponse && mode === "voice" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button
                size="xl"
                variant={isListening ? "destructive" : "accent"}
                className="w-full"
                onClick={handleMicToggle}
                disabled={!isSupported || isSpeaking}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-6 h-6" /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6" /> Tap to Speak
                  </>
                )}
              </Button>
              {!isSupported && (
                <p className="text-sm text-destructive text-center mt-2">
                  Speech recognition is not supported in this browser.
                </p>
              )}
            </motion.div>
          )}

          {/* Voice transcript */}
          {mode === "voice" && transcript && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border-2 border-border rounded-xl p-4"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">You said:</p>
              <p className="text-foreground text-lg">"{transcript}"</p>
            </motion.div>
          )}

          {/* AAC mode controls */}
          {mode === "aac" && !isLastCheckpoint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-2 border-border rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-base font-semibold text-muted-foreground uppercase">
                <MessageSquareText className="w-4 h-4" />
                PECS / Communication Board
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold uppercase text-muted-foreground mb-2">Sentence strip</p>
                <div className="min-h-12 flex flex-wrap gap-2">
                  {aacStrip.length > 0 ? (
                    aacStrip.map((cardId) => (
                      <span
                        key={cardId}
                        className="inline-flex items-center rounded-md bg-background border border-border px-3 py-1.5 text-base"
                      >
                        {getCardById(cardId)?.label || cardId}
                      </span>
                    ))
                  ) : (
                    <span className="text-base text-muted-foreground">
                      {isAdvancing ? "Processing your answer..." : "Tap picture cards to build your response."}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {availableCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className={`rounded-xl border-2 p-2.5 min-h-[108px] text-center transition-colors disabled:opacity-50 ${
                      aacStrip.includes(card.id)
                        ? "border-accent bg-accent/15"
                        : "border-border bg-background hover:border-accent hover:bg-accent/10"
                    }`}
                    onClick={() => handleAacCardSelect(card.id)}
                    disabled={isSpeaking || !waitingForResponse || isAdvancing}
                  >
                    {card.imageSrc && !brokenImages[card.id] ? (
                      <img
                        src={card.imageSrc}
                        alt={card.label}
                        className="w-full h-16 object-cover rounded-md mb-1.5"
                        onError={() =>
                          setBrokenImages((prev) => ({
                            ...prev,
                            [card.id]: true,
                          }))
                        }
                      />
                    ) : (
                      <div className="text-3xl leading-none mb-1.5" aria-hidden="true">
                        {card.emoji}
                      </div>
                    )}
                    <div className="text-[13px] font-semibold text-foreground leading-tight">{card.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleAacUndo}
                  disabled={isSpeaking || aacStrip.length === 0 || !waitingForResponse || isAdvancing}
                >
                  <Undo2 className="w-4 h-4" /> Undo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAacStrip([])}
                  disabled={isSpeaking || aacStrip.length === 0 || !waitingForResponse || isAdvancing}
                >
                  Clear
                </Button>
                <Button
                  className="ml-auto"
                  variant="accent"
                  onClick={handleAacSend}
                  disabled={isSpeaking || aacStrip.length === 0 || isAdvancing || !waitingForResponse}
                >
                  Submit Response
                </Button>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase">Visual Reference Boards</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <img
                    src="/aac-source/core-word-board.png"
                    alt="Core word AAC communication board"
                    className="w-full rounded-lg border border-border bg-background p-2"
                  />
                  <img
                    src="/aac-source/quick-communication-boards.png"
                    alt="Quick communication AAC board"
                    className="w-full rounded-lg border border-border bg-background p-2"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Mascot */}
        <div className="flex flex-col items-center justify-center gap-6">
          <MascotAvatar isSpeaking={isSpeaking} message={mascotMessage} />

          <AnimatePresence>
            {showHint && checkpoint?.hintPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-accent/10 border-2 border-accent/20 rounded-xl p-4 flex items-start gap-3 max-w-sm"
              >
                <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{checkpoint.hintPrompt}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AirportCheckIn;
