// export const uid = () => crypto.randomUUID();
// npm install uuid
import { v4 as uuidv4 } from "uuid";
export const uid = () => uuidv4();

export const createTopic = () => ({
  id: uid(),
  backendId: null,

  title: "",
  duration: "",
  description: "",

  expanded: true,

  activeTab: "documents",

  documents: [],
  videos: [],
  urls: [],

  isChanged: false,
});

export const createChapter = () => ({
  id: uid(),
  backendId: null,

  title: "",
  description: "",

  expanded: true,

  topics: [],

  isChanged: false,
});