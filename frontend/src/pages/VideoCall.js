import Video from "twilio-video";

const startCall = async () => {
  const res = await api.get("/video/token");
  await Video.connect(res.data.token, { room: "consultation-room" });
};