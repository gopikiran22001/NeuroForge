export const ROLE_LABEL = {
  admin: "Administrator",
  pm: "Project Manager",
  developer: "Developer",
  tester: "QA Engineer",
  devops: "DevOps Engineer",
};
const MATRIX = {
  admin: [
    "manage_users",
    "manage_roles",
    "view_audit",
    "create_project",
    "invite_users",
    "start_sprint",
    "cut_release",
    "deploy",
    "run_tests",
    "view_billing",
  ],
  pm: ["create_project", "invite_users", "start_sprint", "cut_release"],
  developer: ["run_tests"],
  tester: ["run_tests"],
  devops: ["cut_release", "deploy"],
};
export function can(role, action) {
  return MATRIX[role].includes(action);
}
