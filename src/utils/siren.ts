const sirenAudio = new Audio("siren.mp3");

sirenAudio.loop = true;

sirenAudio.volume = 1;

export const playSiren = async () => {

  try {

    if (!sirenAudio.paused) return;

    await sirenAudio.play();

    console.log("SIREN PLAYING");

  } catch (error) {

    console.error("PLAY ERROR:", error);
  }
};

export const stopSiren = () => {

  sirenAudio.pause();

  sirenAudio.currentTime = 0;

  console.log("SIREN STOPPED");
};