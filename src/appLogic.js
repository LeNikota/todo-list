import { Project } from "./Classes";
import { PubSub } from "./PubSub";

export default function initialize() {
  PubSub.subscribe('Add project', createProject)
}

function createProject({project_name}) {
  const project = new Project(project_name);
}